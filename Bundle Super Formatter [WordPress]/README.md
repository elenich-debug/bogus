# Bundle Super Formatter

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)![Version](https://img.shields.io/badge/version-8.0-blue)![Platform](https://img.shields.io/badge/platform-WordPress%20Classic%20Editor-lightgrey)

A powerful Tampermonkey userscript designed to automate and streamline the process of creating posts in the WordPress Classic Editor. It's perfect for users who frequently publish similar types of content (e.g., product bundles, asset requests, collections) and want to reduce manual, repetitive tasks to just a few clicks.

## Preview

<!-- TODO: Замените эту ссылку на скриншот вашего скрипта в действии! -->


## Features

-   **One-Click Post Templating**: A single button pastes text from your clipboard, wraps it in a `<blockquote>`, and adds a predefined shortcode template, all at once.
-   **Full Post Cleanup**: Automatically performs the following actions on click:
    -   **Disables All Categories** and enables a single, predefined category (e.g., "Bundle").
    -   **Removes All Tags** from the post.
    -   **Clears the Value** of a specific custom field (e.g., "price").
-   **Smart ID Insertion**:
    -   Provides a series of "ID" buttons to sequentially populate a `[display-posts]` shortcode with IDs from your clipboard.
    -   Includes a **duplicate-check** to prevent adding the same ID twice.
-   **Final Shortcode Cleanup**: A dedicated button removes all unused ID placeholders (e.g., ", 00") from the shortcode, making it clean and ready for publishing.

## Requirements

-   A modern web browser that supports userscripts (e.g., Chrome, Firefox, Edge, Opera).
-   The [**Tampermonkey**](https://www.tampermonkey.net/) browser extension.

## Installation

1.  Make sure you have the [Tampermonkey](https://www.tampermonkey.net/) extension installed in your browser.
2.  Navigate to the script file in this repository: [`wordpress-super-formatter.user.js`](https://github.com/your-username/your-repo/blob/main/wordpress-super-formatter.user.js).
3.  Click the **"Raw"** button at the top right of the file view.
4.  Tampermonkey will automatically open a new tab and prompt you to install the script.
5.  Click **"Install"**. The script is now ready to use.

## How to Use

The script adds a new set of buttons to your WordPress Classic Editor toolbar. Here is the recommended workflow:

1.  Open a new or existing post (`/wp-admin/post-new.php` or `/wp-admin/post.php`).
2.  Copy the main descriptive text for your post to the clipboard.
3.  Click the **"Вставить и форматировать"** button. This will:
    -   Replace all content in the editor with your formatted template.
    -   Set the post category to "Bundle".
    -   Remove all tags.
    -   Clear the "price" custom field.
4.  Copy the first post ID you want to include in your list.
5.  Click the **"ID 1"** button. The first `00` placeholder in the shortcode will be replaced with the ID from your clipboard.
6.  Repeat this process for **"ID 2"**, **"ID 3"**, and so on for all the posts you want to list.
7.  Once all your IDs are in place, click the **"Очистить ID"** button. This will remove any leftover `00` placeholders and trailing commas, cleaning up the shortcode.
8.  Your post is now perfectly formatted. You can save or publish it.

## Customization

While the script works out-of-the-box with hardcoded values (like the category "Bundle" and custom field "price"), you can easily customize it by editing the script file.

Open the script in the Tampermonkey editor and look for the following functions to change the target values:

-   `setBundleCategory()`: Change `if (labelText === 'Bundle')` to your desired category name.
-   `clearPriceCustomField()`: Change `if (keyInput && keyInput.value.trim() === 'price')` to the name of your custom field.
-   `pasteAndFormatButton.addEventListener('click', ...)`: Modify the `additionalCode` variable to change the template that gets inserted.

## Contributing

Contributions are welcome! If you have ideas for new features, find a bug, or want to improve the code, please feel free to open an issue or submit a pull request.
