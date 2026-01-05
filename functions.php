<?php

$includes = [
    'includes/assets.php',
    'includes/custom-image-controls.php',
    'includes/block-helpers.php',
    'includes/post-types/social-links.php',
];

foreach ($includes as $file) {
    $filepath = get_stylesheet_directory() . '/' . $file;
    if (file_exists($filepath)) {
        require_once $filepath;
    } else {
        var_dump('File not found: ' . $filepath);
        error_log("File not found: " . $filepath);
    }
}

/**
 * Register ACF blocks from the theme.
 */
add_action('init', function () {
    $blocks = [
        'acf-faq',
        'acf-gallery-block',
        'acf-youtube-block',
    ];

    foreach ($blocks as $block) {
        $block_path = get_stylesheet_directory() . '/blocks/' . $block;
        if (file_exists($block_path . '/block.json')) {
            register_block_type($block_path);
        }
    }
});

/**
 * ACF JSON save path - save to theme's acf-json folder.
 */
add_filter('acf/settings/save_json', function ($path) {
    return get_stylesheet_directory() . '/acf-json';
});

/**
 * ACF JSON load paths - include theme's acf-json folder.
 */
add_filter('acf/settings/load_json', function ($paths) {
    $paths[] = get_stylesheet_directory() . '/acf-json';
    return $paths;
});