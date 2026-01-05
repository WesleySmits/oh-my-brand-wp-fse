<?php

/**
 * Helper functions for the ACF YouTube Block.
 */

/**
 * Extracts the YouTube video ID from a URL or iframe HTML.
 *
 * @param string $input The YouTube URL or iframe HTML.
 * @return string|null The video ID or null if not found.
 */
function omb_acf_youtube_get_video_id(string $input): ?string
{
    // Try to extract from iframe src first
    if (preg_match('/src="https?:\\/\\/www.youtube.com\\/embed\\/([a-zA-Z0-9_-]{11})/', $input, $matches)) {
        return $matches[1];
    }
    // Try to extract from URL
    if (preg_match('/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\s]{11})/i', $input, $matches)) {
        return $matches[1];
    }
    return null;
}

/**
 * Builds the YouTube iframe HTML.
 *
 * @param string $video_id The YouTube video ID.
 * @param array $args Optional. Additional iframe attributes.
 * @return string The iframe HTML.
 */
function omb_acf_youtube_get_iframe(string $video_id, array $args = array()): string
{
    $defaults = array(
        'width' => 560,
        'height' => 315,
        'allowfullscreen' => true,
        'lazy' => true,
        'title' => __('YouTube video', 'oh-my-brand'),
        'aria_label' => __('Embedded YouTube video', 'oh-my-brand'),
    );
    $args = wp_parse_args($args, $defaults);

    $src = esc_url("https://www.youtube.com/embed/{$video_id}");
    $iframe = sprintf(
        '<iframe width="%d" height="%d" src="%s" title="%s" aria-label="%s" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" %s %s style="max-width: 100%%; height: auto; aspect-ratio: 16 / 9;"></iframe>',
        intval($args['width']),
        intval($args['height']),
        $src,
        esc_attr($args['title']),
        esc_attr($args['aria_label']),
        $args['allowfullscreen'] ? 'allowfullscreen' : '',
        $args['lazy'] ? 'loading="lazy"' : ''
    );
    return $iframe;
}

/**
 * Builds the CSS class name string for the YouTube block.
 *
 * @param array $block The block settings array.
 * @return string The CSS class name string.
 */
function omb_acf_youtube_get_class_name(array $block): string
{
    $class_name = 'acf-youtube-embed';
    if (!empty($block['className'])) {
        $class_name .= ' ' . esc_attr($block['className']);
    }
    if (!empty($block['align'])) {
        $class_name .= ' align' . esc_attr($block['align']);
    }
    return $class_name;
}

/**
 * Builds the YouTube iframe HTML from a URL or iframe HTML.
 * Only allows valid YouTube URLs.
 *
 * @param string $youtube_url_or_iframe The YouTube URL or iframe HTML.
 * @param array $args Optional. Additional iframe attributes.
 * @return string The iframe HTML or an error message if not a valid YouTube URL.
 */
function omb_acf_youtube_build_iframe(string $youtube_url_or_iframe, array $args = array()): string
{
    $youtube_video_id = omb_acf_youtube_get_video_id($youtube_url_or_iframe);
    if ($youtube_video_id) {
        return omb_acf_youtube_get_iframe($youtube_video_id, $args);
    }
    return '<div class="acf-youtube-embed__error">' . esc_html__('Could not extract a YouTube video ID from the URL.', 'oh-my-brand') . '</div>';
}

/**
 * Fetches the YouTube URL or iframe from the block's ACF fields first, then from the post if not found.
 *
 * @param array|null $block Optional. The block settings array.
 * @return string|null The YouTube URL or iframe HTML, or null if not set.
 */
function omb_acf_youtube_get_url_or_iframe(?array $block = null): ?string
{
    // Try to get from block context (ACF block fields)
    if ($block && isset($block['id'])) {
        $block_field = get_field('youtube_video');
        if ($block_field) {
            return $block_field;
        }
    }

    // Fallback: try to get from post
    $post_field = get_field('youtube_video', get_the_ID());
    if ($post_field) {
        return $post_field;
    }
    return null;
}
