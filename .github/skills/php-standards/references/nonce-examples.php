<?php
/**
 * Security Examples - Nonce Verification
 *
 * Demonstrates proper nonce creation and verification.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

// ==========================================================================
// Creating Nonces
// ==========================================================================

/**
 * In a form - adds hidden field with nonce.
 */
function omb_render_gallery_form(): void {
	?>
	<form method="post" action="">
		<?php wp_nonce_field( 'omb_gallery_action', 'omb_gallery_nonce' ); ?>
		<input type="text" name="title" />
		<button type="submit">Save</button>
	</form>
	<?php
}

/**
 * In a URL - adds nonce as query parameter.
 */
function omb_get_delete_url( int $gallery_id ): string {
	$url = admin_url( 'admin.php?action=delete_gallery&id=' . $gallery_id );
	return wp_nonce_url( $url, 'omb_delete_action_' . $gallery_id );
}

/**
 * For AJAX - create nonce to pass to JavaScript.
 */
function omb_enqueue_gallery_scripts(): void {
	wp_enqueue_script( 'omb-gallery', get_template_directory_uri() . '/assets/js/gallery.js' );
	wp_localize_script(
		'omb-gallery',
		'ombGallery',
		[
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'omb_ajax_action' ),
		]
	);
}

// ==========================================================================
// Verifying Nonces
// ==========================================================================

/**
 * Verify form submission nonce.
 */
function omb_handle_gallery_form(): void {
	// Check nonce
	if ( ! isset( $_POST['omb_gallery_nonce'] ) ||
		! wp_verify_nonce( $_POST['omb_gallery_nonce'], 'omb_gallery_action' )
	) {
		wp_die(
			esc_html__( 'Security check failed', 'theme-oh-my-brand' ),
			esc_html__( 'Error', 'theme-oh-my-brand' ),
			[ 'response' => 403 ]
		);
	}

	// Check user capability
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die(
			esc_html__( 'You do not have permission to perform this action.', 'theme-oh-my-brand' ),
			esc_html__( 'Error', 'theme-oh-my-brand' ),
			[ 'response' => 403 ]
		);
	}

	// Process form...
}

/**
 * Verify AJAX request nonce.
 */
function omb_ajax_save_gallery(): void {
	// check_ajax_referer dies on failure by default
	// Pass false as third parameter to return false instead
	if ( ! check_ajax_referer( 'omb_ajax_action', 'nonce', false ) ) {
		wp_send_json_error(
			[
				'message' => __( 'Invalid security token. Please refresh the page.', 'theme-oh-my-brand' ),
			],
			403
		);
	}

	// Check capability
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_send_json_error(
			[
				'message' => __( 'Permission denied.', 'theme-oh-my-brand' ),
			],
			403
		);
	}

	// Process AJAX request...
	$data = [
		'title' => sanitize_text_field( $_POST['title'] ?? '' ),
	];

	wp_send_json_success(
		[
			'message' => __( 'Gallery saved successfully.', 'theme-oh-my-brand' ),
			'data'    => $data,
		]
	);
}
add_action( 'wp_ajax_omb_save_gallery', 'omb_ajax_save_gallery' );

/**
 * Verify URL nonce (for action links).
 */
function omb_handle_delete_gallery(): void {
	$gallery_id = absint( $_GET['id'] ?? 0 );

	// Verify nonce with specific action
	if ( ! isset( $_GET['_wpnonce'] ) ||
		! wp_verify_nonce( $_GET['_wpnonce'], 'omb_delete_action_' . $gallery_id )
	) {
		wp_die(
			esc_html__( 'Invalid or expired link.', 'theme-oh-my-brand' ),
			esc_html__( 'Error', 'theme-oh-my-brand' ),
			[ 'response' => 403 ]
		);
	}

	// Delete gallery...
}
