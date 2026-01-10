/**
 * Hero Block - Edit Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	SelectControl,
	RangeControl,
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
	ColorPicker,
	Placeholder,
} from '@wordpress/components';
import { cover as heroIcon } from '@wordpress/icons';
import type { BlockEditProps } from '@wordpress/blocks';
import { ButtonSettingsPanel, type BlockButton } from '../utils';

/**
 * Background image interface.
 */
interface BackgroundImage {
	id?: number;
	url?: string;
	alt?: string;
	width?: number;
	height?: number;
}

/**
 * Block attributes interface.
 */
interface HeroAttributes {
	heading: string;
	headingLevel: 'h1' | 'h2';
	subheading: string;
	content: string;
	backgroundType: 'image' | 'video' | 'color';
	backgroundImage: BackgroundImage;
	backgroundVideo: string;
	overlayColor: string;
	overlayOpacity: number;
	contentAlignment: 'left' | 'center' | 'right';
	verticalAlignment: 'top' | 'center' | 'bottom';
	minHeight: string;
	primaryButton: BlockButton;
	secondaryButton: BlockButton;
}

/**
 * Media item from WordPress media library.
 */
interface MediaItem {
	id: number;
	url: string;
	alt?: string;
	width?: number;
	height?: number;
	sizes?: {
		full?: { url: string };
		large?: { url: string };
	};
}

/**
 * Edit component for the Hero block.
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 */
export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< HeroAttributes > ): JSX.Element {
	const {
		heading,
		headingLevel,
		subheading,
		content,
		backgroundType,
		backgroundImage,
		backgroundVideo,
		overlayColor,
		overlayOpacity,
		contentAlignment,
		verticalAlignment,
		minHeight,
		primaryButton,
		secondaryButton,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-theme-oh-my-brand-hero',
		style: {
			'--hero-min-height': minHeight,
			'--hero-overlay-opacity': overlayOpacity / 100,
			'--hero-content-align': contentAlignment,
			'--hero-vertical-align': verticalAlignment,
		} as React.CSSProperties,
	} );

	/**
	 * Handle background image selection.
	 * @param media
	 */
	const onSelectBackgroundImage = ( media: MediaItem ): void => {
		setAttributes( {
			backgroundImage: {
				id: media.id,
				url: media.sizes?.large?.url || media.url,
				alt: media.alt || '',
				width: media.width,
				height: media.height,
			},
		} );
	};

	/**
	 * Remove background image.
	 */
	const removeBackgroundImage = (): void => {
		setAttributes( { backgroundImage: {} } );
	};

	return (
		<>
			<InspectorControls>
				{ /* Background Settings */ }
				<PanelBody
					title={ __( 'Background Settings', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Background Type', 'theme-oh-my-brand' ) }
						value={ backgroundType }
						options={ [
							{
								label: __( 'Color', 'theme-oh-my-brand' ),
								value: 'color',
							},
							{
								label: __( 'Image', 'theme-oh-my-brand' ),
								value: 'image',
							},
							{
								label: __( 'Video', 'theme-oh-my-brand' ),
								value: 'video',
							},
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								backgroundType: value as
									| 'image'
									| 'video'
									| 'color',
							} )
						}
					/>

					{ backgroundType === 'image' && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectBackgroundImage }
								allowedTypes={ [ 'image' ] }
								value={ backgroundImage?.id }
								render={ ( { open } ) => (
									<div className="hero-background-image-control">
										{ backgroundImage?.url ? (
											<>
												<img
													src={ backgroundImage.url }
													alt={
														backgroundImage.alt ||
														''
													}
													style={ {
														maxWidth: '100%',
														marginBottom: '8px',
													} }
												/>
												<Button
													variant="secondary"
													onClick={ open }
													style={ {
														marginRight: '8px',
													} }
												>
													{ __(
														'Replace Image',
														'theme-oh-my-brand'
													) }
												</Button>
												<Button
													variant="link"
													isDestructive
													onClick={
														removeBackgroundImage
													}
												>
													{ __(
														'Remove',
														'theme-oh-my-brand'
													) }
												</Button>
											</>
										) : (
											<Button
												variant="secondary"
												onClick={ open }
											>
												{ __(
													'Select Background Image',
													'theme-oh-my-brand'
												) }
											</Button>
										) }
									</div>
								) }
							/>
						</MediaUploadCheck>
					) }

					{ backgroundType === 'video' && (
						<TextControl
							label={ __( 'Video URL', 'theme-oh-my-brand' ) }
							help={ __(
								'Enter a video file URL (MP4, WebM)',
								'theme-oh-my-brand'
							) }
							value={ backgroundVideo }
							onChange={ ( value: string ) =>
								setAttributes( { backgroundVideo: value } )
							}
						/>
					) }

					<div style={ { marginTop: '16px' } }>
						<p style={ { marginBottom: '8px' } }>
							{ __( 'Overlay Color', 'theme-oh-my-brand' ) }
						</p>
						<ColorPicker
							color={ overlayColor }
							onChange={ ( value: string ) =>
								setAttributes( { overlayColor: value } )
							}
							enableAlpha
						/>
					</div>

					<RangeControl
						label={ __( 'Overlay Opacity', 'theme-oh-my-brand' ) }
						value={ overlayOpacity }
						onChange={ ( value: number | undefined ) => {
							if ( value !== undefined ) {
								setAttributes( { overlayOpacity: value } );
							}
						} }
						min={ 0 }
						max={ 100 }
						step={ 5 }
					/>
				</PanelBody>

				{ /* Layout Settings */ }
				<PanelBody
					title={ __( 'Layout Settings', 'theme-oh-my-brand' ) }
					initialOpen={ false }
				>
					<UnitControl
						label={ __( 'Minimum Height', 'theme-oh-my-brand' ) }
						value={ minHeight }
						onChange={ ( value: string | undefined ) => {
							if ( value !== undefined ) {
								setAttributes( { minHeight: value } );
							}
						} }
						units={ [
							{ value: 'vh', label: 'vh' },
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
						] }
					/>

					<SelectControl
						label={ __( 'Content Alignment', 'theme-oh-my-brand' ) }
						value={ contentAlignment }
						options={ [
							{
								label: __( 'Left', 'theme-oh-my-brand' ),
								value: 'left',
							},
							{
								label: __( 'Center', 'theme-oh-my-brand' ),
								value: 'center',
							},
							{
								label: __( 'Right', 'theme-oh-my-brand' ),
								value: 'right',
							},
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								contentAlignment: value as
									| 'left'
									| 'center'
									| 'right',
							} )
						}
					/>

					<SelectControl
						label={ __(
							'Vertical Alignment',
							'theme-oh-my-brand'
						) }
						value={ verticalAlignment }
						options={ [
							{
								label: __( 'Top', 'theme-oh-my-brand' ),
								value: 'top',
							},
							{
								label: __( 'Center', 'theme-oh-my-brand' ),
								value: 'center',
							},
							{
								label: __( 'Bottom', 'theme-oh-my-brand' ),
								value: 'bottom',
							},
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								verticalAlignment: value as
									| 'top'
									| 'center'
									| 'bottom',
							} )
						}
					/>

					<SelectControl
						label={ __( 'Heading Level', 'theme-oh-my-brand' ) }
						value={ headingLevel }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								headingLevel: value as 'h1' | 'h2',
							} )
						}
					/>
				</PanelBody>

				{ /* Primary Button Settings */ }
				<ButtonSettingsPanel
					title={ __( 'Primary Button', 'theme-oh-my-brand' ) }
					button={
						primaryButton || {
							text: '',
							url: '',
							openInNewTab: false,
						}
					}
					onChange={ ( button: BlockButton ) =>
						setAttributes( { primaryButton: button } )
					}
				/>

				{ /* Secondary Button Settings */ }
				<ButtonSettingsPanel
					title={ __( 'Secondary Button', 'theme-oh-my-brand' ) }
					button={
						secondaryButton || {
							text: '',
							url: '',
							openInNewTab: false,
						}
					}
					onChange={ ( button: BlockButton ) =>
						setAttributes( { secondaryButton: button } )
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ /* Background */ }
				{ backgroundType === 'image' && backgroundImage?.url && (
					<div className="wp-block-theme-oh-my-brand-hero__background">
						<img src={ backgroundImage.url } alt="" />
					</div>
				) }
				{ backgroundType === 'video' && backgroundVideo && (
					<div className="wp-block-theme-oh-my-brand-hero__background">
						<video src={ backgroundVideo } muted loop playsInline />
					</div>
				) }

				{ /* Overlay */ }
				<div
					className="wp-block-theme-oh-my-brand-hero__overlay"
					style={ {
						backgroundColor: overlayColor,
						opacity: overlayOpacity / 100,
					} }
				/>

				{ /* Content */ }
				<div className="wp-block-theme-oh-my-brand-hero__content">
					{ ! heading && ! subheading && ! content ? (
						<Placeholder
							icon={ heroIcon }
							label={ __( 'Hero Section', 'theme-oh-my-brand' ) }
							instructions={ __(
								'Add a heading, subheading, and content for your hero section.',
								'theme-oh-my-brand'
							) }
						/>
					) : null }

					<header className="wp-block-theme-oh-my-brand-hero__header">
						<RichText
							tagName={ headingLevel as 'h1' | 'h2' }
							className="wp-block-theme-oh-my-brand-hero__heading"
							placeholder={ __(
								'Add heading…',
								'theme-oh-my-brand'
							) }
							value={ heading }
							onChange={ ( value: string ) =>
								setAttributes( { heading: value } )
							}
						/>

						<RichText
							tagName="p"
							className="wp-block-theme-oh-my-brand-hero__subheading"
							placeholder={ __(
								'Add subheading…',
								'theme-oh-my-brand'
							) }
							value={ subheading }
							onChange={ ( value: string ) =>
								setAttributes( { subheading: value } )
							}
						/>
					</header>

					<RichText
						tagName="p"
						className="wp-block-theme-oh-my-brand-hero__text"
						placeholder={ __(
							'Add content…',
							'theme-oh-my-brand'
						) }
						value={ content }
						onChange={ ( value: string ) =>
							setAttributes( { content: value } )
						}
					/>

					{ /* Buttons Preview */ }
					{ ( primaryButton?.text || secondaryButton?.text ) && (
						<nav className="wp-block-theme-oh-my-brand-hero__buttons">
							{ primaryButton?.text && (
								<span className="wp-block-theme-oh-my-brand-hero__button wp-block-theme-oh-my-brand-hero__button--primary">
									{ primaryButton.text }
								</span>
							) }
							{ secondaryButton?.text && (
								<span className="wp-block-theme-oh-my-brand-hero__button wp-block-theme-oh-my-brand-hero__button--secondary">
									{ secondaryButton.text }
								</span>
							) }
						</nav>
					) }
				</div>
			</div>
		</>
	);
}
