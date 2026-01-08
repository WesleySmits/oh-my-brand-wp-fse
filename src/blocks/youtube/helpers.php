<?php
/**
 * YouTube Block - Helper functions.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

if ( ! function_exists( 'omb_youtube_get_video_id' ) ) {
	/**
	 * Extracts the YouTube video ID from a URL or iframe HTML.
	 *
	 * @param string $input The YouTube URL or iframe HTML.
	 * @return string|null The video ID or null if not found.
	 */
	function omb_youtube_get_video_id( string $input ): ?string {
		// Try to extract from iframe src first.
		if ( preg_match( '/src="https?:\\/\\/www.youtube.com\\/embed\\/([a-zA-Z0-9_-]{11})/', $input, $matches ) ) {
			return $matches[1];
		}

		// Try to extract from URL.
		if ( preg_match( '/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\s]{11})/i', $input, $matches ) ) {
			return $matches[1];
		}

		return null;
	}
}

if ( ! function_exists( 'omb_youtube_get_embed_url' ) ) {
	/**
	 * Get the YouTube embed URL for a video ID.
	 * Uses privacy-enhanced mode (youtube-nocookie.com) for GDPR compliance.
	 *
	 * @param string $video_id The YouTube video ID.
	 * @return string The embed URL.
	 */
	function omb_youtube_get_embed_url( string $video_id ): string {
		return 'https://www.youtube-nocookie.com/embed/' . esc_attr( $video_id );
	}
}

if ( ! function_exists( 'omb_youtube_get_thumbnail_url' ) ) {
	/**
	 * Get the YouTube video thumbnail URL.
	 *
	 * @param string $video_id The YouTube video ID.
	 * @param string $quality  Thumbnail quality: 'default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault'.
	 * @return string The thumbnail URL.
	 */
	function omb_youtube_get_thumbnail_url( string $video_id, string $quality = 'maxresdefault' ): string {
		return sprintf( 'https://img.youtube.com/vi/%s/%s.jpg', esc_attr( $video_id ), esc_attr( $quality ) );
	}
}

if ( ! function_exists( 'omb_youtube_add_resource_hints' ) ) {
	/**
	 * Add preconnect hints for YouTube domains when video blocks are present.
	 *
	 * @param array  $urls          URLs to hint.
	 * @param string $relation_type Relation type.
	 * @return array Modified URLs array.
	 */
	function omb_youtube_add_resource_hints( array $urls, string $relation_type ): array {
		if ( 'preconnect' === $relation_type ) {
			$urls[] = [
				'href'        => 'https://www.youtube-nocookie.com',
				'crossorigin' => 'anonymous',
			];
			$urls[] = [
				'href'        => 'https://img.youtube.com',
				'crossorigin' => 'anonymous',
			];
		}
		return $urls;
	}
}
