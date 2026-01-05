<?php

/**
 * Register custom post type with REST support.
 */
add_action('init', function () {
    register_post_type('omb_social_link', [
        'label'               => 'Social Links',
        'public'              => true,
        'show_ui'             => false,
        'show_in_menu'        => false,
        'exclude_from_search' => true,
        'publicly_queryable'  => true,
        'has_archive'         => false,
        'rewrite'             => false,
        'supports'            => ['title'],
        'show_in_rest'        => true,
    ]);
});
