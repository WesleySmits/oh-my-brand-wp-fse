<?php

function ollie_child_enqueue_styles(): void
{
    wp_enqueue_style('ollie-child-style', get_stylesheet_uri(), array('ollie'), wp_get_theme()->get('Version'));
    wp_enqueue_style(
        'ollie-child-theme',
        get_stylesheet_directory_uri() . '/assets/css/theme.css',
        ['ollie-child-style'],
        filemtime(get_stylesheet_directory() . '/assets/css/theme.css')
    );
}
add_action('wp_enqueue_scripts', 'ollie_child_enqueue_styles');

function disable_wp_emojis()
{
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');

    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');

    add_filter('tiny_mce_plugins', function ($plugins) {
        return is_array($plugins) ? array_diff($plugins, ['wpemoji']) : [];
    });

    add_filter('wp_resource_hints', function ($urls, $relation_type) {
        if ('dns-prefetch' === $relation_type) {
            $emoji_url = 'https://s.w.org/images/core/emoji/';
            $urls = array_filter($urls, function ($url) use ($emoji_url) {
                return strpos($url, $emoji_url) === false;
            });
        }
        return $urls;
    }, 10, 2);
}
add_action('init', 'disable_wp_emojis');
