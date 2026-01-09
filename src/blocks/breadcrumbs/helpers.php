<?php
/**
 * Breadcrumbs block helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

/**
 * Get the breadcrumb trail for the current context.
 *
 * @param array<string, mixed> $attributes Block attributes.
 * @return array<int, array<string, mixed>> Array of breadcrumb items.
 */
function omb_breadcrumbs_get_trail( array $attributes ): array {
	$items = [];

	// Add home item if enabled.
	if ( $attributes['showHome'] ?? true ) {
		$home_url   = $attributes['homeUrl'] ?? '';
		$home_label = $attributes['homeLabel'] ?? __( 'Home', 'oh-my-brand' );

		$items[] = [
			'label' => $home_label,
			'url'   => ! empty( $home_url ) ? $home_url : home_url( '/' ),
		];
	}

	// Determine context and build trail.
	if ( is_front_page() ) {
		// Front page - only show home (already added).
		return $items;
	}

	if ( is_home() ) {
		// Blog page.
		$items[] = [
			'label' => __( 'Blog', 'oh-my-brand' ),
			'url'   => get_permalink( get_option( 'page_for_posts' ) ),
		];
		return $items;
	}

	if ( is_404() ) {
		$items[] = [
			'label' => __( 'Page Not Found', 'oh-my-brand' ),
			'url'   => '',
		];
		return $items;
	}

	if ( is_search() ) {
		$items[] = [
			/* translators: %s: search query */
			'label' => sprintf( __( 'Search Results for: %s', 'oh-my-brand' ), get_search_query() ),
			'url'   => '',
		];
		return $items;
	}

	if ( is_category() || is_tag() || is_tax() ) {
		$items = array_merge( $items, omb_breadcrumbs_get_taxonomy_trail( get_queried_object() ) );
		return $items;
	}

	if ( is_post_type_archive() ) {
		$post_type = get_queried_object();
		if ( $post_type ) {
			$items[] = [
				'label' => $post_type->label,
				'url'   => '',
			];
		}
		return $items;
	}

	if ( is_author() ) {
		$items[] = [
			'label' => get_the_author(),
			'url'   => '',
		];
		return $items;
	}

	if ( is_date() ) {
		$items = array_merge( $items, omb_breadcrumbs_get_date_trail() );
		return $items;
	}

	if ( is_singular() ) {
		$post = get_queried_object();
		if ( $post instanceof WP_Post ) {
			$items = array_merge( $items, omb_breadcrumbs_get_singular_trail( $post, $attributes ) );
		}
		return $items;
	}

	return $items;
}

/**
 * Get breadcrumb trail for singular posts/pages.
 *
 * @param WP_Post              $post       The post object.
 * @param array<string, mixed> $attributes Block attributes.
 * @return array<int, array<string, mixed>> Breadcrumb items.
 */
function omb_breadcrumbs_get_singular_trail( WP_Post $post, array $attributes ): array {
	$items     = [];
	$post_type = get_post_type( $post );

	// Handle hierarchical post types (pages).
	if ( is_post_type_hierarchical( $post_type ) ) {
		$items = omb_breadcrumbs_get_page_ancestors( $post );
	} else {
		// Handle non-hierarchical post types (posts, CPTs).
		$items = omb_breadcrumbs_get_post_taxonomy_trail( $post, $attributes );
	}

	// Add current item if enabled.
	if ( $attributes['showCurrent'] ?? true ) {
		$current_url = ( $attributes['linkCurrent'] ?? false ) ? get_permalink( $post ) : '';

		$items[] = [
			'label'   => get_the_title( $post ),
			'url'     => $current_url,
			'current' => true,
		];
	}

	return $items;
}

/**
 * Get page ancestors as breadcrumb items.
 *
 * @param WP_Post $post The page post object.
 * @return array<int, array<string, mixed>> Breadcrumb items.
 */
function omb_breadcrumbs_get_page_ancestors( WP_Post $post ): array {
	$items     = [];
	$ancestors = get_post_ancestors( $post );

	// Ancestors are returned from immediate parent to root, so reverse.
	$ancestors = array_reverse( $ancestors );

	foreach ( $ancestors as $ancestor_id ) {
		$ancestor = get_post( $ancestor_id );
		if ( $ancestor ) {
			$items[] = [
				'label' => get_the_title( $ancestor ),
				'url'   => get_permalink( $ancestor ),
			];
		}
	}

	return $items;
}

/**
 * Get taxonomy-based breadcrumb trail for posts.
 *
 * @param WP_Post              $post       The post object.
 * @param array<string, mixed> $attributes Block attributes.
 * @return array<int, array<string, mixed>> Breadcrumb items.
 */
function omb_breadcrumbs_get_post_taxonomy_trail( WP_Post $post, array $attributes ): array {
	$items     = [];
	$post_type = get_post_type( $post );

	// Add post type archive link for CPTs.
	if ( 'post' !== $post_type ) {
		$post_type_obj = get_post_type_object( $post_type );
		if ( $post_type_obj && $post_type_obj->has_archive ) {
			$items[] = [
				'label' => $post_type_obj->labels->name,
				'url'   => get_post_type_archive_link( $post_type ),
			];
		}
	}

	// Get taxonomy trail.
	$taxonomy_priority = $attributes['taxonomyPriority'] ?? [ 'category', 'post_tag' ];

	foreach ( $taxonomy_priority as $taxonomy ) {
		// Check if this taxonomy is associated with the post type.
		$taxonomies = get_object_taxonomies( $post_type, 'names' );
		if ( ! in_array( $taxonomy, $taxonomies, true ) ) {
			continue;
		}

		// Try to get primary term first (Yoast/RankMath).
		$primary_term = omb_breadcrumbs_get_primary_term( $post->ID, $taxonomy );

		if ( ! $primary_term ) {
			// Fall back to first term.
			$terms = get_the_terms( $post, $taxonomy );
			if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
				$primary_term = $terms[0];
			}
		}

		if ( $primary_term ) {
			// Add term ancestors.
			$term_trail = omb_breadcrumbs_get_term_ancestors( $primary_term );
			$items      = array_merge( $items, $term_trail );

			// Add the primary term itself.
			$items[] = [
				'label' => $primary_term->name,
				'url'   => get_term_link( $primary_term ),
			];

			break; // Use first matching taxonomy.
		}
	}

	return $items;
}

/**
 * Get term ancestors as breadcrumb items.
 *
 * @param WP_Term $term The term object.
 * @return array<int, array<string, mixed>> Breadcrumb items.
 */
function omb_breadcrumbs_get_term_ancestors( WP_Term $term ): array {
	$items     = [];
	$ancestors = get_ancestors( $term->term_id, $term->taxonomy, 'taxonomy' );

	// Ancestors are returned from immediate parent to root, so reverse.
	$ancestors = array_reverse( $ancestors );

	foreach ( $ancestors as $ancestor_id ) {
		$ancestor = get_term( $ancestor_id, $term->taxonomy );
		if ( $ancestor && ! is_wp_error( $ancestor ) ) {
			$items[] = [
				'label' => $ancestor->name,
				'url'   => get_term_link( $ancestor ),
			];
		}
	}

	return $items;
}

/**
 * Get breadcrumb trail for taxonomy archives.
 *
 * @param WP_Term $term The current term.
 * @return array<int, array<string, mixed>> Breadcrumb items.
 */
function omb_breadcrumbs_get_taxonomy_trail( WP_Term $term ): array {
	$items = [];

	// Get term ancestors.
	$items = omb_breadcrumbs_get_term_ancestors( $term );

	// Add current term.
	$items[] = [
		'label'   => $term->name,
		'url'     => '',
		'current' => true,
	];

	return $items;
}

/**
 * Get breadcrumb trail for date archives.
 *
 * @return array<int, array<string, mixed>> Breadcrumb items.
 */
function omb_breadcrumbs_get_date_trail(): array {
	$items = [];

	$year  = get_query_var( 'year' );
	$month = get_query_var( 'monthnum' );
	$day   = get_query_var( 'day' );

	if ( $year ) {
		$items[] = [
			'label' => $year,
			'url'   => ( $month || $day ) ? get_year_link( $year ) : '',
		];
	}

	if ( $month ) {
		$items[] = [
			'label' => gmdate( 'F', mktime( 0, 0, 0, $month, 1 ) ),
			'url'   => $day ? get_month_link( $year, $month ) : '',
		];
	}

	if ( $day ) {
		$items[] = [
			'label' => $day,
			'url'   => '',
		];
	}

	return $items;
}

/**
 * Get the primary term for a post from a taxonomy.
 *
 * Checks Yoast SEO and RankMath for primary term settings.
 *
 * @param int    $post_id  Post ID.
 * @param string $taxonomy Taxonomy name.
 * @return WP_Term|null Primary term or null if not found.
 */
function omb_breadcrumbs_get_primary_term( int $post_id, string $taxonomy ): ?WP_Term {
	// Check Yoast SEO.
	$yoast_primary = get_post_meta( $post_id, '_yoast_wpseo_primary_' . $taxonomy, true );
	if ( $yoast_primary ) {
		$term = get_term( (int) $yoast_primary, $taxonomy );
		if ( $term && ! is_wp_error( $term ) ) {
			return $term;
		}
	}

	// Check RankMath.
	$rankmath_primary = get_post_meta( $post_id, 'rank_math_primary_' . $taxonomy, true );
	if ( $rankmath_primary ) {
		$term = get_term( (int) $rankmath_primary, $taxonomy );
		if ( $term && ! is_wp_error( $term ) ) {
			return $term;
		}
	}

	return null;
}

/**
 * Render a single breadcrumb item HTML.
 *
 * @param array<string, mixed> $item       Breadcrumb item data.
 * @param int                  $position   Position in the list (1-based).
 * @param bool                 $is_last    Whether this is the last item.
 * @param array<string, mixed> $attributes Block attributes.
 * @return string HTML output.
 */
function omb_breadcrumbs_render_item( array $item, int $position, bool $is_last, array $attributes ): string {
	$separator  = $attributes['separator'] ?? '›';
	$is_current = $item['current'] ?? false;

	$item_classes = [ 'wp-block-theme-oh-my-brand-breadcrumbs__item' ];
	if ( $is_current ) {
		$item_classes[] = 'wp-block-theme-oh-my-brand-breadcrumbs__item--current';
	}

	$aria_current = $is_current ? ' aria-current="page"' : '';

	ob_start();
	?>
	<li class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"<?php echo $aria_current; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php if ( ! empty( $item['url'] ) ) : ?>
			<a href="<?php echo esc_url( $item['url'] ); ?>" class="wp-block-theme-oh-my-brand-breadcrumbs__link" itemprop="item">
				<span itemprop="name"><?php echo esc_html( $item['label'] ); ?></span>
			</a>
		<?php else : ?>
			<span class="wp-block-theme-oh-my-brand-breadcrumbs__current" itemprop="name"><?php echo esc_html( $item['label'] ); ?></span>
		<?php endif; ?>
		<meta itemprop="position" content="<?php echo esc_attr( (string) $position ); ?>">
		<?php if ( ! $is_last ) : ?>
			<span class="wp-block-theme-oh-my-brand-breadcrumbs__separator" aria-hidden="true"><?php echo esc_html( $separator ); ?></span>
		<?php endif; ?>
	</li>
	<?php
	return ob_get_clean();
}

/**
 * Render truncated breadcrumb items with ellipsis for mobile.
 *
 * @param array<int, array<string, mixed>> $items      All breadcrumb items.
 * @param array<string, mixed>             $attributes Block attributes.
 * @return string HTML output.
 */
function omb_breadcrumbs_render_items( array $items, array $attributes ): string {
	$truncate        = $attributes['truncateOnMobile'] ?? true;
	$max_visible     = $attributes['maxVisibleItems'] ?? 3;
	$total           = count( $items );
	$should_truncate = $truncate && $total > $max_visible;

	$output   = '';
	$position = 1;

	foreach ( $items as $index => $item ) {
		$is_last = $index === $total - 1;

		// Determine if this item should be hidden on mobile.
		$is_hidden = false;
		if ( $should_truncate ) {
			// Keep first item and last (maxVisibleItems - 1) items visible.
			$visible_from_end = $max_visible - 1;
			$is_hidden        = $index > 0 && $index < ( $total - $visible_from_end );
		}

		// Add ellipsis before the first hidden item.
		if ( $should_truncate && 1 === $index ) {
			$separator = $attributes['separator'] ?? '›';
			$output   .= '<li class="wp-block-theme-oh-my-brand-breadcrumbs__item wp-block-theme-oh-my-brand-breadcrumbs__item--ellipsis" aria-hidden="true">';
			$output   .= '<button type="button" class="wp-block-theme-oh-my-brand-breadcrumbs__ellipsis" aria-label="' . esc_attr__( 'Show full breadcrumb path', 'oh-my-brand' ) . '" aria-expanded="false">';
			$output   .= '<span>…</span>';
			$output   .= '</button>';
			$output   .= '<span class="wp-block-theme-oh-my-brand-breadcrumbs__separator" aria-hidden="true">' . esc_html( $separator ) . '</span>';
			$output   .= '</li>';
		}

		// Render the item with hidden class if needed.
		$item_html = omb_breadcrumbs_render_item( $item, $position, $is_last, $attributes );

		if ( $is_hidden ) {
			$item_html = str_replace(
				'wp-block-theme-oh-my-brand-breadcrumbs__item',
				'wp-block-theme-oh-my-brand-breadcrumbs__item wp-block-theme-oh-my-brand-breadcrumbs__item--hidden',
				$item_html
			);
		}

		$output .= $item_html;
		++$position;
	}

	return $output;
}

/**
 * Generate JSON-LD structured data for breadcrumbs.
 *
 * @param array<int, array<string, mixed>> $items Breadcrumb items.
 * @return string JSON-LD script tag.
 */
function omb_breadcrumbs_get_schema( array $items ): string {
	$list_items = [];
	$position   = 1;

	foreach ( $items as $item ) {
		$list_item = [
			'@type'    => 'ListItem',
			'position' => $position,
			'name'     => $item['label'],
		];

		if ( ! empty( $item['url'] ) ) {
			$list_item['item'] = $item['url'];
		}

		$list_items[] = $list_item;
		++$position;
	}

	$schema = [
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => $list_items,
	];

	return '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>';
}
