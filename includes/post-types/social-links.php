<?php
/**
 * Social Links custom post type registration.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

add_action( 'init', 'omb_register_social_links_cpt' );

/**
 * Register the Social Links custom post type.
 *
 * @since 1.0.0
 *
 * @return void
 */
function omb_register_social_links_cpt(): void {
	$labels = [
		'name'               => __( 'Social Links', 'oh-my-brand' ),
		'singular_name'      => __( 'Social Link', 'oh-my-brand' ),
		'add_new'            => __( 'Add New', 'oh-my-brand' ),
		'add_new_item'       => __( 'Add New Social Link', 'oh-my-brand' ),
		'edit_item'          => __( 'Edit Social Link', 'oh-my-brand' ),
		'new_item'           => __( 'New Social Link', 'oh-my-brand' ),
		'view_item'          => __( 'View Social Link', 'oh-my-brand' ),
		'search_items'       => __( 'Search Social Links', 'oh-my-brand' ),
		'not_found'          => __( 'No social links found', 'oh-my-brand' ),
		'not_found_in_trash' => __( 'No social links found in trash', 'oh-my-brand' ),
	];

	$args = [
		'labels'              => $labels,
		'description'         => __( 'Social media links for the site.', 'oh-my-brand' ),
		'public'              => false,
		'show_ui'             => false,
		'show_in_menu'        => false,
		'exclude_from_search' => true,
		'publicly_queryable'  => false,
		'has_archive'         => false,
		'rewrite'             => false,
		'supports'            => [ 'title' ],
		'show_in_rest'        => true,
	];

	register_post_type( 'omb_social_link', $args );
}
