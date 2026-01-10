<?php
/**
 * Title: Video Gallery Section
 * Slug: oh-my-brand/video-gallery
 * Categories: media, gallery
 * Description: A grid of YouTube videos to showcase specific content.
 * Keywords: video, youtube, gallery, grid
 * Block Types: core/group, core/columns, theme-oh-my-brand/youtube
 *
 * @package theme-oh-my-brand
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--large);padding-bottom:var(--wp--preset--spacing--large)">
	<!-- wp:heading {"textAlign":"center","className":"is-style-default"} -->
	<h2 class="wp-block-heading has-text-align-center is-style-default">Featured Videos</h2>
	<!-- /wp:heading -->

	<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|medium","left":"var:preset|spacing|medium"}}}} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:theme-oh-my-brand/youtube {"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:theme-oh-my-brand/youtube {"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:theme-oh-my-brand/youtube {"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"} /-->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
