<?php
/**
 * Security Examples - Output Escaping
 *
 * Demonstrates proper output escaping for different contexts.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

// ==========================================================================
// Escaping Functions Reference
// ==========================================================================

/**
 * | Function         | Use Case                | Example                                    |
 * |------------------|-------------------------|-------------------------------------------|
 * | esc_html()       | Text content            | esc_html($title)                          |
 * | esc_attr()       | HTML attributes         | esc_attr($class)                          |
 * | esc_url()        | URLs                    | esc_url($link)                            |
 * | wp_kses_post()   | Rich HTML content       | wp_kses_post($content)                    |
 * | wp_json_encode() | JavaScript values       | wp_json_encode($config)                   |
 * | esc_html__()     | Translated text         | esc_html__('Gallery', 'theme-oh-my-brand')|
 * | esc_attr__()     | Translated attributes   | esc_attr__('Close', 'theme-oh-my-brand')  |
 */

// ==========================================================================
// HTML Content
// ==========================================================================

$title = 'User Input <script>alert("xss")</script>';
echo esc_html( $title );
// Output: User Input &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;

// ==========================================================================
// HTML Attributes
// ==========================================================================

$class = 'gallery" onclick="alert(1)';
echo '<div class="' . esc_attr( $class ) . '">';
// Output: <div class="gallery&quot; onclick=&quot;alert(1)">

// ==========================================================================
// URLs
// ==========================================================================

$link = 'https://example.com/page?id=1&name=test';
echo '<a href="' . esc_url( $link ) . '">';
// Output: <a href="https://example.com/page?id=1&amp;name=test">

// ==========================================================================
// JavaScript Values
// ==========================================================================

$config = [
	'gallery_id' => 123,
	'autoplay'   => true,
];
echo '<script>var config = ' . wp_json_encode( $config ) . ';</script>';
// Output: <script>var config = {"gallery_id":123,"autoplay":true};</script>

// ==========================================================================
// Rich HTML (Post Content)
// ==========================================================================

$content = '<p>Safe content</p><script>alert("xss")</script>';
echo wp_kses_post( $content );
// Output: <p>Safe content</p> (script removed)

// ==========================================================================
// Translated Strings
// ==========================================================================

echo esc_html__( 'Previous image', 'theme-oh-my-brand' );
echo '<button aria-label="' . esc_attr__( 'Close dialog', 'theme-oh-my-brand' ) . '">';

// ==========================================================================
// Common Mistakes
// ==========================================================================

// ❌ WRONG - Never do this
// echo $user_input;
// echo "<div class=\"{$class}\">";

// ✅ CORRECT - Always escape
echo esc_html( $user_input );
echo '<div class="' . esc_attr( $class ) . '">';
