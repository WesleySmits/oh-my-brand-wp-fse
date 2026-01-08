<?php
/**
 * REST API endpoints for Logo Grid block.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

/**
 * Register Logo Grid REST API endpoints.
 */
function omb_logo_grid_register_rest_routes(): void {
	register_rest_route(
		'theme-oh-my-brand/v1',
		'/meta-fields/(?P<post_type>[a-zA-Z0-9_-]+)',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'omb_logo_grid_get_meta_fields',
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => array(
				'post_type' => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_key',
				),
			),
		)
	);

	register_rest_route(
		'theme-oh-my-brand/v1',
		'/logo-grid-preview',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'omb_logo_grid_get_preview',
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => array(
				'post_type'    => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_key',
				),
				'image_source' => array(
					'type'              => 'string',
					'default'           => 'featured_image',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'link_source'  => array(
					'type'              => 'string',
					'default'           => 'permalink',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'alt_source'   => array(
					'type'              => 'string',
					'default'           => 'title',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'max_logos'    => array(
					'type'              => 'integer',
					'default'           => 12,
					'sanitize_callback' => 'absint',
				),
				'orderby'      => array(
					'type'              => 'string',
					'default'           => 'menu_order',
					'sanitize_callback' => 'sanitize_key',
				),
				'order'        => array(
					'type'              => 'string',
					'default'           => 'ASC',
					'sanitize_callback' => 'sanitize_key',
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'omb_logo_grid_register_rest_routes' );

/**
 * Get available meta fields for a post type.
 *
 * @param WP_REST_Request $request The REST request.
 * @return WP_REST_Response|WP_Error Response with meta fields or error.
 */
function omb_logo_grid_get_meta_fields( WP_REST_Request $request ): WP_REST_Response|WP_Error {
	$post_type = $request->get_param( 'post_type' );

	if ( ! post_type_exists( $post_type ) ) {
		return new WP_Error(
			'invalid_post_type',
			__( 'Invalid post type.', 'oh-my-brand' ),
			array( 'status' => 400 )
		);
	}

	$fields = array();

	// Get ACF field groups for this post type.
	if ( function_exists( 'acf_get_field_groups' ) ) {
		$field_groups = acf_get_field_groups( array( 'post_type' => $post_type ) );

		foreach ( $field_groups as $group ) {
			$group_fields = acf_get_fields( $group['key'] );

			if ( $group_fields ) {
				foreach ( $group_fields as $field ) {
					$field_type = omb_logo_grid_map_acf_field_type( $field['type'] );

					if ( $field_type ) {
						$fields[] = array(
							'key'   => $field['name'],
							'label' => $field['label'],
							'type'  => $field_type,
						);
					}
				}
			}
		}
	}

	// Get registered meta fields for this post type.
	$registered_meta = get_registered_meta_keys( 'post', $post_type );

	foreach ( $registered_meta as $meta_key => $meta_args ) {
		// Skip private meta fields.
		if ( strpos( $meta_key, '_' ) === 0 ) {
			continue;
		}

		// Try to determine field type from meta args.
		$field_type = 'text';
		if ( isset( $meta_args['type'] ) ) {
			if ( 'integer' === $meta_args['type'] ) {
				$field_type = 'image'; // Assume integer meta could be attachment ID.
			} elseif ( 'string' === $meta_args['type'] ) {
				// Check if it looks like a URL field.
				if ( strpos( $meta_key, 'url' ) !== false || strpos( $meta_key, 'link' ) !== false ) {
					$field_type = 'url';
				}
			}
		}

		// Don't add duplicates from ACF.
		$exists = array_filter( $fields, fn( $f ) => $f['key'] === $meta_key );
		if ( empty( $exists ) ) {
			$fields[] = array(
				'key'   => $meta_key,
				'label' => ucwords( str_replace( array( '_', '-' ), ' ', $meta_key ) ),
				'type'  => $field_type,
			);
		}
	}

	return rest_ensure_response( $fields );
}

/**
 * Map ACF field type to our simplified types.
 *
 * @param string $acf_type The ACF field type.
 * @return string|null Our simplified type or null if not supported.
 */
function omb_logo_grid_map_acf_field_type( string $acf_type ): ?string {
	$image_types = array( 'image', 'gallery' );
	$url_types   = array( 'url', 'link', 'page_link', 'post_object' );
	$text_types  = array( 'text', 'textarea', 'wysiwyg', 'email' );

	if ( in_array( $acf_type, $image_types, true ) ) {
		return 'image';
	}

	if ( in_array( $acf_type, $url_types, true ) ) {
		return 'url';
	}

	if ( in_array( $acf_type, $text_types, true ) ) {
		return 'text';
	}

	return null;
}

/**
 * Get logo preview data for the editor.
 *
 * @param WP_REST_Request $request The REST request.
 * @return WP_REST_Response|WP_Error Response with logo data or error.
 */
function omb_logo_grid_get_preview( WP_REST_Request $request ): WP_REST_Response|WP_Error {
	$post_type    = $request->get_param( 'post_type' );
	$image_source = $request->get_param( 'image_source' );
	$link_source  = $request->get_param( 'link_source' );
	$alt_source   = $request->get_param( 'alt_source' );
	$max_logos    = $request->get_param( 'max_logos' );
	$orderby      = $request->get_param( 'orderby' );
	$order        = $request->get_param( 'order' );

	if ( ! post_type_exists( $post_type ) ) {
		return new WP_Error(
			'invalid_post_type',
			__( 'Invalid post type.', 'oh-my-brand' ),
			array( 'status' => 400 )
		);
	}

	// Load the helpers if not already loaded.
	$helpers_path = get_stylesheet_directory() . '/src/blocks/logo-grid/helpers.php';
	if ( file_exists( $helpers_path ) ) {
		require_once $helpers_path;
	}

	// Check if the function exists after loading helpers.
	if ( ! function_exists( 'omb_logo_grid_get_dynamic_logos' ) ) {
		return new WP_Error(
			'missing_function',
			__( 'Helper function not available.', 'oh-my-brand' ),
			array( 'status' => 500 )
		);
	}

	$logos = omb_logo_grid_get_dynamic_logos(
		$post_type,
		$image_source,
		$link_source,
		$alt_source,
		$max_logos,
		$orderby,
		$order
	);

	return rest_ensure_response( $logos );
}
