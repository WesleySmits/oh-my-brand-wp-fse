<?php
/**
 * Logo Grid block helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

/**
 * Render a single logo image.
 *
 * @param array $image Image data containing id, url, alt, and optional link.
 * @return string HTML output for the logo.
 */
function omb_logo_grid_render_image( array $image ): string {
	$url  = $image['url'] ?? '';
	$alt  = $image['alt'] ?? '';
	$link = $image['link'] ?? '';

	if ( empty( $url ) ) {
		return '';
	}

	$img_html = sprintf(
		'<img src="%s" alt="%s" class="wp-block-theme-oh-my-brand-logo-grid__image" loading="lazy" decoding="async">',
		esc_url( $url ),
		esc_attr( $alt )
	);

	// Wrap in link if provided.
	if ( ! empty( $link ) ) {
		return sprintf(
			'<a href="%s" class="wp-block-theme-oh-my-brand-logo-grid__link" target="_blank" rel="noopener noreferrer">%s</a>',
			esc_url( $link ),
			$img_html
		);
	}

	return $img_html;
}

/**
 * Get logos dynamically from a post type.
 *
 * @param string $post_type    The post type to query.
 * @param string $image_source Source for the logo image (featured_image or meta:field_name).
 * @param string $link_source  Source for the logo link (permalink, none, or meta:field_name).
 * @param string $alt_source   Source for the alt text (title or meta:field_name).
 * @param int    $max_logos    Maximum number of logos to retrieve.
 * @param string $order_by     Field to order by.
 * @param string $order        Order direction (ASC or DESC).
 * @return array Array of logo data.
 */
function omb_logo_grid_get_dynamic_logos(
	string $post_type,
	string $image_source,
	string $link_source,
	string $alt_source,
	int $max_logos,
	string $order_by,
	string $order
): array {
	// Validate post type exists.
	if ( ! post_type_exists( $post_type ) ) {
		return array();
	}

	// Build query args.
	$args = array(
		'post_type'      => $post_type,
		'posts_per_page' => $max_logos,
		'post_status'    => 'publish',
		'orderby'        => $order_by,
		'order'          => $order,
	);

	$query = new WP_Query( $args );
	$logos = array();

	if ( $query->have_posts() ) {
		while ( $query->have_posts() ) {
			$query->the_post();
			$post_id = get_the_ID();

			$logo_data = omb_logo_grid_build_logo_data(
				$post_id,
				$image_source,
				$link_source,
				$alt_source
			);

			if ( ! empty( $logo_data['url'] ) ) {
				$logos[] = $logo_data;
			}
		}
		wp_reset_postdata();
	}

	return $logos;
}

/**
 * Build logo data from a post.
 *
 * @param int    $post_id      The post ID.
 * @param string $image_source Source for the logo image.
 * @param string $link_source  Source for the logo link.
 * @param string $alt_source   Source for the alt text.
 * @return array Logo data array.
 */
function omb_logo_grid_build_logo_data(
	int $post_id,
	string $image_source,
	string $link_source,
	string $alt_source
): array {
	$logo_data = array(
		'id'   => $post_id,
		'url'  => '',
		'alt'  => '',
		'link' => '',
	);

	// Get image URL.
	if ( 'featured_image' === $image_source ) {
		$thumbnail_id = get_post_thumbnail_id( $post_id );
		if ( $thumbnail_id ) {
			$image_data = wp_get_attachment_image_src( $thumbnail_id, 'medium' );
			if ( $image_data ) {
				$logo_data['url'] = $image_data[0];
			}
		}
	} else {
		$image_url = omb_logo_grid_get_field_value( $post_id, $image_source, 'image' );
		if ( $image_url ) {
			$logo_data['url'] = $image_url;
		}
	}

	// Get link.
	if ( 'permalink' === $link_source ) {
		$logo_data['link'] = get_permalink( $post_id );
	} elseif ( 'none' !== $link_source ) {
		$link = omb_logo_grid_get_field_value( $post_id, $link_source, 'url' );
		if ( $link ) {
			$logo_data['link'] = $link;
		}
	}

	// Get alt text.
	if ( 'title' === $alt_source ) {
		$logo_data['alt'] = get_the_title( $post_id );
	} else {
		$alt = omb_logo_grid_get_field_value( $post_id, $alt_source, 'text' );
		if ( $alt ) {
			$logo_data['alt'] = $alt;
		}
	}

	return $logo_data;
}

/**
 * Get a field value from a post, supporting both standard meta and ACF fields.
 *
 * @param int    $post_id    The post ID.
 * @param string $source     The field source (format: "meta:field_name").
 * @param string $field_type Expected field type (image, url, text).
 * @return string|null The field value or null if not found.
 */
function omb_logo_grid_get_field_value( int $post_id, string $source, string $field_type ): ?string {
	// Parse the source to get the field name.
	if ( strpos( $source, 'meta:' ) !== 0 ) {
		return null;
	}

	$field_name = substr( $source, 5 ); // Remove 'meta:' prefix.

	// Try ACF first if available.
	if ( function_exists( 'get_field' ) ) {
		$acf_value = get_field( $field_name, $post_id );

		if ( $acf_value ) {
			// Handle different ACF field return formats.
			if ( 'image' === $field_type ) {
				// ACF image fields can return ID, URL, or array.
				if ( is_array( $acf_value ) && isset( $acf_value['url'] ) ) {
					return $acf_value['url'];
				} elseif ( is_numeric( $acf_value ) ) {
					$image_data = wp_get_attachment_image_src( (int) $acf_value, 'medium' );
					return $image_data ? $image_data[0] : null;
				} elseif ( is_string( $acf_value ) ) {
					return $acf_value;
				}
			} else {
				// For URL and text fields.
				return is_string( $acf_value ) ? $acf_value : null;
			}
		}
	}

	// Fall back to standard WordPress meta.
	$meta_value = get_post_meta( $post_id, $field_name, true );

	if ( empty( $meta_value ) ) {
		return null;
	}

	// Handle image fields stored as attachment ID.
	if ( 'image' === $field_type && is_numeric( $meta_value ) ) {
		$image_data = wp_get_attachment_image_src( (int) $meta_value, 'medium' );
		return $image_data ? $image_data[0] : null;
	}

	return is_string( $meta_value ) ? $meta_value : null;
}
