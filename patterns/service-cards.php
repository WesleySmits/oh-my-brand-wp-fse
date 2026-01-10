<?php
/**
 * Title: Service Cards Grid
 * Slug: oh-my-brand/service-cards
 * Categories: services, query
 * Description: A section highlighting services with a heading and a 3-column card grid.
 * Keywords: services, cards, grid, features
 * Block Types: core/group, core/heading, theme-oh-my-brand/cards
 *
 * @package theme-oh-my-brand
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large)">
	<!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"lineHeight":"1.2"}},"fontSize":"xx-large"} -->
	<h2 class="wp-block-heading has-text-align-center has-xx-large-font-size" style="line-height:1.2">Our Premium Services</h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|large"}}}} -->
	<p class="has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--large)">Everything you need to take your brand to the next level.</p>
	<!-- /wp:paragraph -->

	<!-- wp:theme-oh-my-brand/cards {"columns":3,"cardStyle":"elevated","showIcons":true,"imagePosition":"top","align":"wide"} /-->
</div>
<!-- /wp:group -->
