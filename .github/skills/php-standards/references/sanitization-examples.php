<?php
/**
 * Security Examples - Input Sanitization
 *
 * Demonstrates proper input sanitization functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

// ==========================================================================
// Sanitization Functions Reference
// ==========================================================================

/**
 * | Function                  | Use Case                | Input Example              |
 * |---------------------------|-------------------------|----------------------------|
 * | sanitize_text_field()     | Single-line text        | Title, name fields         |
 * | sanitize_textarea_field() | Multi-line text         | Description, bio           |
 * | sanitize_email()          | Email addresses         | User email                 |
 * | absint()                  | Positive integers       | IDs, counts                |
 * | esc_url_raw()             | URLs for database       | Links, redirects           |
 * | sanitize_file_name()      | File names              | Upload filenames           |
 * | sanitize_html_class()     | CSS class names         | Dynamic classes            |
 * | sanitize_key()            | Keys/slugs              | Option names, meta keys    |
 */

// ==========================================================================
// Text Input
// ==========================================================================

// Single-line text (strips tags, removes line breaks)
$title = sanitize_text_field( $_POST['title'] ?? '' );

// Multi-line text (preserves line breaks)
$description = sanitize_textarea_field( $_POST['description'] ?? '' );

// ==========================================================================
// Email
// ==========================================================================

$email = sanitize_email( $_POST['email'] ?? '' );
// 'user@example.com' → 'user@example.com'
// 'invalid email' → ''

// ==========================================================================
// Numbers
// ==========================================================================

// Positive integer (absolute integer)
$count = absint( $_GET['count'] ?? 0 );
// '42' → 42
// '-5' → 5
// 'abc' → 0

// Regular integer
$page = intval( $_GET['page'] ?? 1 );

// ==========================================================================
// URLs
// ==========================================================================

// For database storage (no HTML encoding)
$link = esc_url_raw( $_POST['link'] ?? '' );

// ==========================================================================
// File Names
// ==========================================================================

$filename = sanitize_file_name( $_POST['filename'] ?? '' );
// 'My File (1).pdf' → 'My-File-1.pdf'
// '../../../etc/passwd' → 'etc-passwd'

// ==========================================================================
// CSS Classes
// ==========================================================================

$class = sanitize_html_class( $_POST['class'] ?? '' );
// 'valid-class' → 'valid-class'
// 'invalid class!' → 'invalidclass'

// ==========================================================================
// Keys and Slugs
// ==========================================================================

$key = sanitize_key( $_POST['option_name'] ?? '' );
// 'my_option' → 'my_option'
// 'My Option!' → 'my_option'

// ==========================================================================
// Arrays
// ==========================================================================

// Sanitize array of integers
$ids = array_map( 'absint', $_POST['ids'] ?? [] );

// Sanitize array of strings
$tags = array_map( 'sanitize_text_field', $_POST['tags'] ?? [] );

// ==========================================================================
// Complete Form Processing Example
// ==========================================================================

/**
 * Process gallery form submission.
 *
 * @return array<string, mixed> Sanitized form data.
 */
function omb_process_gallery_form(): array {
	return [
		'title'       => sanitize_text_field( $_POST['title'] ?? '' ),
		'description' => sanitize_textarea_field( $_POST['description'] ?? '' ),
		'image_ids'   => array_map( 'absint', $_POST['image_ids'] ?? [] ),
		'columns'     => absint( $_POST['columns'] ?? 3 ),
		'lightbox'    => isset( $_POST['lightbox'] ),
		'link_url'    => esc_url_raw( $_POST['link_url'] ?? '' ),
	];
}
