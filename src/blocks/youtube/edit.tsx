/**
 * YouTube Block - Edit Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	TextControl,
	Placeholder,
	PanelBody,
	ToggleControl,
	Spinner,
	Notice,
} from '@wordpress/components';
import { video } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Block attributes interface.
 */
interface YouTubeAttributes {
	url: string;
	videoTitle: string;
	width: number;
	height: number;
	lazyLoad: boolean;
}

/**
 * oEmbed response interface.
 */
interface OEmbedResponse {
	title?: string;
	thumbnail_url?: string;
	provider_name?: string;
}

/**
 * Extract YouTube video ID from URL or iframe.
 * @param input
 */
function getVideoId( input: string ): string | null {
	if ( ! input ) {
		return null;
	}

	// Try to extract from iframe src first.
	const iframeMatch = input.match(
		/src="https?:\/\/www.youtube.com\/embed\/([a-zA-Z0-9_-]{11})/
	);
	if ( iframeMatch ) {
		return iframeMatch[ 1 ];
	}

	// Try to extract from URL.
	const urlMatch = input.match(
		/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
	);
	if ( urlMatch ) {
		return urlMatch[ 1 ];
	}

	return null;
}

/**
 * Get YouTube thumbnail URL.
 * @param videoId
 */
function getThumbnailUrl( videoId: string ): string {
	return `https://img.youtube.com/vi/${ videoId }/maxresdefault.jpg`;
}

/**
 * Edit component for the YouTube block.
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 */
export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< YouTubeAttributes > ): JSX.Element {
	const { url, videoTitle, lazyLoad } = attributes;
	const [ isFetchingTitle, setIsFetchingTitle ] = useState( false );
	const [ fetchError, setFetchError ] = useState< string | null >( null );

	const blockProps = useBlockProps( {
		className: 'wp-block-theme-oh-my-brand-youtube',
	} );

	const videoId = getVideoId( url );
	const hasVideo = !! videoId;

	// Lazy fetch video title via oEmbed API
	useEffect( () => {
		if ( ! url || ! hasVideo || videoTitle ) {
			return;
		}

		// Normalize URL for oEmbed
		const normalizedUrl =
			url.includes( 'youtube.com' ) || url.includes( 'youtu.be' )
				? url
				: null;

		if ( ! normalizedUrl ) {
			return;
		}

		setIsFetchingTitle( true );
		setFetchError( null );

		// Use WordPress oEmbed proxy endpoint - non-blocking async fetch
		apiFetch< OEmbedResponse >( {
			path: `/oembed/1.0/proxy?url=${ encodeURIComponent(
				normalizedUrl
			) }`,
		} )
			.then( ( response ) => {
				if ( response?.title ) {
					setAttributes( { videoTitle: response.title } );
				}
			} )
			.catch( ( error: Error ) => {
				// Silent failure - video title is optional enhancement
				// eslint-disable-next-line no-console
				console.warn( 'Could not fetch video title:', error.message );
				setFetchError(
					__( 'Could not fetch video title', 'theme-oh-my-brand' )
				);
			} )
			.finally( () => {
				setIsFetchingTitle( false );
			} );
	}, [ url, hasVideo, videoTitle, setAttributes ] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Video Settings', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'YouTube URL', 'theme-oh-my-brand' ) }
						help={ __(
							'Paste a YouTube video URL or embed code.',
							'theme-oh-my-brand'
						) }
						value={ url }
						onChange={ ( value: string ) => {
							setAttributes( { url: value, videoTitle: '' } );
						} }
					/>

					{ hasVideo && (
						<div className="wp-block-theme-oh-my-brand-youtube__title-field">
							<TextControl
								label={ __(
									'Video Title',
									'theme-oh-my-brand'
								) }
								help={
									isFetchingTitle
										? __(
												'Fetching title…',
												'theme-oh-my-brand'
										  )
										: __(
												'Used for accessibility and SEO. Auto-fetched from YouTube.',
												'theme-oh-my-brand'
										  )
								}
								value={ videoTitle }
								onChange={ ( value: string ) =>
									setAttributes( { videoTitle: value } )
								}
								disabled={ isFetchingTitle }
							/>
							{ isFetchingTitle && <Spinner /> }
							{ fetchError && (
								<p
									className="components-base-control__help"
									style={ { color: '#cc1818' } }
								>
									{ fetchError }
								</p>
							) }
						</div>
					) }

					<ToggleControl
						label={ __( 'Lazy Load', 'theme-oh-my-brand' ) }
						help={ __(
							'Show thumbnail until user clicks to play (recommended for performance).',
							'theme-oh-my-brand'
						) }
						checked={ lazyLoad }
						onChange={ ( value: boolean ) =>
							setAttributes( { lazyLoad: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ ! hasVideo ? (
					<Placeholder
						icon={ video }
						label={ __( 'YouTube Embed', 'theme-oh-my-brand' ) }
						instructions={ __(
							'Paste a YouTube video URL in the sidebar settings.',
							'theme-oh-my-brand'
						) }
					>
						<TextControl
							label={ __( 'YouTube URL', 'theme-oh-my-brand' ) }
							value={ url }
							onChange={ ( value: string ) =>
								setAttributes( { url: value } )
							}
							placeholder="https://www.youtube.com/watch?v=..."
						/>
					</Placeholder>
				) : (
					<div className="wp-block-theme-oh-my-brand-youtube__preview">
						{ videoTitle && (
							<p className="wp-block-theme-oh-my-brand-youtube__preview-title">
								{ videoTitle }
							</p>
						) }
						<div className="wp-block-theme-oh-my-brand-youtube__preview-wrapper">
							<img
								src={ getThumbnailUrl( videoId ) }
								alt={
									videoTitle ||
									__(
										'YouTube video thumbnail',
										'theme-oh-my-brand'
									)
								}
								className="wp-block-theme-oh-my-brand-youtube__preview-thumbnail"
							/>
							<div className="wp-block-theme-oh-my-brand-youtube__preview-play">
								<svg
									viewBox="0 0 68 48"
									width="68"
									height="48"
									aria-hidden="true"
								>
									<path
										d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
										fill="#f00"
									></path>
									<path
										d="M 45,24 27,14 27,34"
										fill="#fff"
									></path>
								</svg>
							</div>
							<Notice
								status="info"
								isDismissible={ false }
								className="wp-block-theme-oh-my-brand-youtube__preview-notice"
							>
								{ __(
									'Video will load on click (facade pattern for better performance)',
									'theme-oh-my-brand'
								) }
							</Notice>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
