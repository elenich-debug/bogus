// ==UserScript==
// @name         Bundle Super Formatter [WordPress]
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Automates post creation in WordPress Classic Editor: templates content, manages categories, tags, custom fields, and populates a shortcode with IDs.
// @author       Bogus
// @license      MIT
// @match        */wp-admin/post.php*
// @match        */wp-admin/post-new.php*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/elenich-debug/bogus/main/Bundle%20Super%20Formatter%20%5BWordPress%5D/Bundle%20Super%20Formatter.js
// @downloadURL  https://raw.githubusercontent.com/elenich-debug/bogus/main/Bundle%20Super%20Formatter%20%5BWordPress%5D/Bundle%20Super%20Formatter.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Функция для замены ID в шорткоде с проверкой на дубликаты ---
    const replaceIdFromClipboard = async (index) => {
        try {
            const editorTextarea = document.getElementById('content');
            if (!editorTextarea) return;
            let content = editorTextarea.value;
            const clipboardText = await navigator.clipboard.readText();

            if (!/^\d+$/.test(clipboardText)) {
                alert('Ошибка: Буфер обмена должен содержать только цифры для ID поста.');
                return;
            }

            const shortcodeRegex = /(\[display-posts.*?id=")(.*?)(".*\])/;
            const match = content.match(shortcodeRegex);

            if (match) {
                const idString = match[2];
                if (idString.split(',').map(id => id.trim()).includes(clipboardText)) {
                    alert(`Ошибка: ID "${clipboardText}" уже присутствует в шорткоде!`);
                    return;
                }

                const newContent = content.replace(shortcodeRegex, (match, prefix, idString, suffix) => {
                    const currentIds = idString.split(',').map(id => id.trim());
                    if (index < currentIds.length) currentIds[index] = clipboardText;
                    return prefix + currentIds.join(', ') + suffix;
                });
                editorTextarea.value = newContent;
            } else {
                alert('Шорткод [display-posts] с атрибутом id не найден в редакторе.');
            }
        } catch (err) {
            console.error('Не удалось обработать буфер обмена: ', err);
            alert('Не удалось получить доступ к буферу обмена.');
        }
    };

    // --- Функция для удаления всех тегов ---
    const disableAllTags = () => {
        const tagList = document.querySelector('#tagsdiv-post_tag ul.tagchecklist');
        if (tagList) {
            const deleteButtons = tagList.querySelectorAll('button.ntdelbutton');
            deleteButtons.forEach(button => button.click());
        }
    };

    // --- Функция для очистки кастомного поля "price" ---
    const clearPriceCustomField = () => {
        const customFieldRows = document.querySelectorAll('#the-list tr');
        customFieldRows.forEach(row => {
            const keyInput = row.querySelector('td.left input[type="text"]');
            if (keyInput && keyInput.value.trim() === 'price') {
                const valueTextarea = row.querySelector('textarea');
                if (valueTextarea) valueTextarea.value = '';
            }
        });
    };

    // --- Функция: Установка категории "Bundle" ---
    const setBundleCategory = () => {
        const categoryChecklist = document.getElementById('categorychecklist');
        if (!categoryChecklist) return;

        const allCategoryCheckboxes = categoryChecklist.querySelectorAll('input[type="checkbox"]');
        allCategoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        allCategoryCheckboxes.forEach(checkbox => {
            const labelText = checkbox.parentElement.textContent.trim();
            if (labelText === 'Bundle') {
                checkbox.checked = true;
            }
        });
    };

    // --- Основная логика, выполняемая при загрузке страницы ---
    window.addEventListener('load', () => {
        const editorTools = document.getElementById('wp-content-editor-tools');
        if (!editorTools) return;

        const pasteAndFormatButton = document.createElement('button');
        pasteAndFormatButton.type = 'button';
        pasteAndFormatButton.className = 'button button-primary';
        pasteAndFormatButton.innerText = 'Вставить и форматировать';
        pasteAndFormatButton.style.marginLeft = '5px';

        pasteAndFormatButton.addEventListener('click', async () => {
            try {
                const clipboardText = await navigator.clipboard.readText();
                const blockquotedText = `<blockquote>${clipboardText}</blockquote>`;
                const additionalCode = `
<div class="custom-divider orange"></div>
[display-posts post_type="post, request" id="00, 00, 00, 00, 00, 00, 00" include_content="true" posts_per_page="-1" ignore_sticky_posts="true"]`;
                const finalContent = blockquotedText + additionalCode;
                document.getElementById('content').value = finalContent;

                disableAllTags();
                clearPriceCustomField();
                setBundleCategory();

            } catch (err) {
                console.error('Не удалось прочитать содержимое буфера обмена: ', err);
                alert('Не удалось получить доступ к буферу обмена.');
            }
        });

        const addFormButton = Array.from(editorTools.querySelectorAll('button, input[type="button"]'))
            .find(btn => btn.value === 'Add Form' || btn.innerText === 'Add Form');
        let anchorElement = addFormButton || editorTools.lastElementChild;
        anchorElement.after(pasteAndFormatButton);
        anchorElement = pasteAndFormatButton;

        for (let i = 0; i < 7; i++) {
            const idButton = document.createElement('button');
            idButton.type = 'button';
            idButton.className = 'button button-small';
            idButton.innerText = `ID ${i + 1}`;
            idButton.style.marginLeft = '3px';
            idButton.style.minWidth = '50px';
            idButton.addEventListener('click', () => replaceIdFromClipboard(i));
            anchorElement.after(idButton);
            anchorElement = idButton;
        }

        const cleanupButton = document.createElement('button');
        cleanupButton.type = 'button';
        cleanupButton.className = 'button button-primary';
        cleanupButton.innerText = 'Очистить ID';
        cleanupButton.style.marginLeft = '10px';
        cleanupButton.addEventListener('click', () => {
            const editorTextarea = document.getElementById('content');
            const shortcodeRegex = /(\[display-posts.*?id=")(.*?)(".*\])/;
            if (editorTextarea && shortcodeRegex.test(editorTextarea.value)) {
                const newContent = editorTextarea.value.replace(shortcodeRegex, (match, prefix, idString, suffix) => {
                    const cleanedIds = idString.split(',').map(id => id.trim()).filter(id => id !== '00' && id !== '');
                    return prefix + cleanedIds.join(', ') + suffix;
                });
                editorTextarea.value = newContent;
            }
        });
        anchorElement.after(cleanupButton);
    });
})();
