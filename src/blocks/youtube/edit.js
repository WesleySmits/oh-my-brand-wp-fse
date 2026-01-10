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
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import { video } from '@wordpress/icons';

/**
 * Extract YouTube video ID from URL or iframe.
 *
 * @param {string} input YouTube URL or iframe HTML.
 * @return {string|null} Video ID or null.
 */
function getVideoId( input ) {
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
 * Edit component for the YouTube block.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} Editor element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { url, width, height, lazyLoad } = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-block-theme-oh-my-brand-youtube',
	} );

	const videoId = getVideoId( url );
	const hasVideo = !! videoId;

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
						onChange={ ( value ) =>
							setAttributes( { url: value } )
						}
					/>
					<RangeControl
						label={ __( 'Width', 'theme-oh-my-brand' ) }
						value={ width }
						onChange={ ( value ) =>
							setAttributes( { width: value } )
						}
						min={ 320 }
						max={ 1920 }
						step={ 10 }
					/>
					<RangeControl
						label={ __( 'Height', 'theme-oh-my-brand' ) }
						value={ height }
						onChange={ ( value ) =>
							setAttributes( { height: value } )
						}
						min={ 180 }
						max={ 1080 }
						step={ 10 }
					/>
					<ToggleControl
						label={ __( 'Lazy Load', 'theme-oh-my-brand' ) }
						help={ __(
							'Load the video only when visible on screen.',
							'theme-oh-my-brand'
						) }
						checked={ lazyLoad }
						onChange={ ( value ) =>
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
							onChange={ ( value ) =>
								setAttributes( { url: value } )
							}
							placeholder="https://www.youtube.com/watch?v=..."
						/>
					</Placeholder>
				) : (
					<div className="wp-block-theme-oh-my-brand-youtube__wrapper">
						<iframe
							width={ width }
							height={ height }
							src={ `https://www.youtube.com/embed/${ videoId }` }
							title={ __( 'YouTube video', 'theme-oh-my-brand' ) }
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							style={ {
								maxWidth: '100%',
								height: 'auto',
								aspectRatio: '16 / 9',
							} }
						/>
					</div>
				) }
			</div>
		</>
	);
}
