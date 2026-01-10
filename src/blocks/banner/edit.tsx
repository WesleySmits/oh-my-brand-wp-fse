/**
 * Banner Block - Edit Component
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
	Placeholder,
} from '@wordpress/components';
import { image as bannerIcon } from '@wordpress/icons';
import type { BlockEditProps } from '@wordpress/blocks';
import { ButtonSettingsPanel, type BlockButton } from '../utils';

/**
 * Image object interface.
 */
interface BannerImage {
	id?: number;
	url?: string;
	alt?: string;
	width?: number;
	height?: number;
}

/**
 * Block attributes interface.
 */
interface BannerAttributes {
	heading: string;
	headingLevel: 'h2' | 'h3' | 'h4';
	content: string;
	image: BannerImage;
	imagePosition: 'left' | 'right';
	imageSize: '33' | '50' | '66';
	imageFit: 'fill' | 'contain' | 'cover';
	verticalAlignment: 'top' | 'center' | 'bottom';
	button: BlockButton;
	mobileStack: 'image-first' | 'content-first';
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
		medium?: { url: string };
	};
}

/**
 * Edit component for the Banner block.
 *
 * @param props               - Block edit props
 * @param props.attributes    - Block attributes
 * @param props.setAttributes - Function to update attributes
 */
export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BannerAttributes > ): JSX.Element {
	const {
		heading,
		headingLevel,
		content,
		image,
		imagePosition,
		imageSize,
		imageFit,
		verticalAlignment,
		button,
		mobileStack,
	} = attributes;

	// Build class names based on attributes
	const classNames = [
		'wp-block-theme-oh-my-brand-banner',
		`wp-block-theme-oh-my-brand-banner--image-${ imagePosition }`,
		`wp-block-theme-oh-my-brand-banner--align-${ verticalAlignment }`,
		`wp-block-theme-oh-my-brand-banner--mobile-${ mobileStack }`,
	].join( ' ' );

	const getImageSizeValue = ( size: string ): string => {
		const sizeMap: Record< string, string > = {
			'33': '33.333%',
			'66': '66.666%',
		};
		return sizeMap[ size ] || '50%';
	};

	const blockProps = useBlockProps( {
		className: classNames,
		style: {
			'--banner-image-size': getImageSizeValue( imageSize ),
			'--banner-image-fit': imageFit,
		} as React.CSSProperties,
	} );

	/**
	 * Handle image selection.
	 *
	 * @param media - Selected media item
	 */
	const onSelectImage = ( media: MediaItem ): void => {
		setAttributes( {
			image: {
				id: media.id,
				url: media.sizes?.large?.url || media.url,
				alt: media.alt || '',
				width: media.width,
				height: media.height,
			},
		} );
	};

	/**
	 * Remove selected image.
	 */
	const removeImage = (): void => {
		setAttributes( { image: {} } );
	};

	return (
		<>
			<InspectorControls>
				{ /* Layout Settings */ }
				<PanelBody
					title={ __( 'Layout Settings', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Image Position', 'theme-oh-my-brand' ) }
						value={ imagePosition }
						options={ [
							{
								label: __( 'Left', 'theme-oh-my-brand' ),
								value: 'left',
							},
							{
								label: __( 'Right', 'theme-oh-my-brand' ),
								value: 'right',
							},
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								imagePosition: value as 'left' | 'right',
							} )
						}
					/>

					<SelectControl
						label={ __( 'Image Size', 'theme-oh-my-brand' ) }
						value={ imageSize }
						options={ [
							{
								label: __( '33%', 'theme-oh-my-brand' ),
								value: '33',
							},
							{
								label: __( '50%', 'theme-oh-my-brand' ),
								value: '50',
							},
							{
								label: __( '66%', 'theme-oh-my-brand' ),
								value: '66',
							},
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								imageSize: value as '33' | '50' | '66',
							} )
						}
					/>

					<SelectControl
						label={ __( 'Image Fit', 'theme-oh-my-brand' ) }
						value={ imageFit }
						options={ [
							{
								label: __( 'Cover', 'theme-oh-my-brand' ),
								value: 'cover',
							},
							{
								label: __( 'Contain', 'theme-oh-my-brand' ),
								value: 'contain',
							},
							{
								label: __( 'Fill', 'theme-oh-my-brand' ),
								value: 'fill',
							},
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								imageFit: value as 'fill' | 'contain' | 'cover',
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
						label={ __(
							'Mobile Stack Order',
							'theme-oh-my-brand'
						) }
						value={ mobileStack }
						options={ [
							{
								label: __( 'Image First', 'theme-oh-my-brand' ),
								value: 'image-first',
							},
							{
								label: __(
									'Content First',
									'theme-oh-my-brand'
								),
								value: 'content-first',
							},
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								mobileStack: value as
									| 'image-first'
									| 'content-first',
							} )
						}
					/>
				</PanelBody>

				{ /* Content Settings */ }
				<PanelBody
					title={ __( 'Content Settings', 'theme-oh-my-brand' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Heading Level', 'theme-oh-my-brand' ) }
						value={ headingLevel }
						options={ [
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								headingLevel: value as 'h2' | 'h3' | 'h4',
							} )
						}
					/>
				</PanelBody>

				{ /* Image Settings */ }
				<PanelBody
					title={ __( 'Image', 'theme-oh-my-brand' ) }
					initialOpen={ false }
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							value={ image?.id }
							render={ ( { open } ) => (
								<>
									{ image?.url ? (
										<div className="banner-image-preview">
											<img
												src={ image.url }
												alt={ image.alt || '' }
												style={ {
													maxWidth: '100%',
													marginBottom: '1rem',
												} }
											/>
											<Button
												variant="secondary"
												onClick={ open }
												style={ {
													marginRight: '0.5rem',
												} }
											>
												{ __(
													'Replace',
													'theme-oh-my-brand'
												) }
											</Button>
											<Button
												variant="link"
												isDestructive
												onClick={ removeImage }
											>
												{ __(
													'Remove',
													'theme-oh-my-brand'
												) }
											</Button>
										</div>
									) : (
										<Button
											variant="primary"
											onClick={ open }
										>
											{ __(
												'Select Image',
												'theme-oh-my-brand'
											) }
										</Button>
									) }
								</>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				{ /* Button Settings */ }
				<ButtonSettingsPanel
					title={ __( 'Button', 'theme-oh-my-brand' ) }
					button={
						button || { text: '', url: '', openInNewTab: false }
					}
					onChange={ ( newButton: BlockButton ) =>
						setAttributes( { button: newButton } )
					}
				/>
			</InspectorControls>

			<div { ...blockProps }>
				{ /* Image Column */ }
				<div className="wp-block-theme-oh-my-brand-banner__image-wrapper">
					{ image?.url ? (
						<img
							src={ image.url }
							alt={ image.alt || '' }
							className="wp-block-theme-oh-my-brand-banner__image"
						/>
					) : (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImage }
								allowedTypes={ [ 'image' ] }
								value={ image?.id }
								render={ ( { open } ) => (
									<Placeholder
										icon={ bannerIcon }
										label={ __(
											'Banner Image',
											'theme-oh-my-brand'
										) }
										instructions={ __(
											'Select an image to display alongside your content.',
											'theme-oh-my-brand'
										) }
									>
										<Button
											variant="primary"
											onClick={ open }
										>
											{ __(
												'Select Image',
												'theme-oh-my-brand'
											) }
										</Button>
									</Placeholder>
								) }
							/>
						</MediaUploadCheck>
					) }
				</div>

				{ /* Content Column */ }
				<article className="wp-block-theme-oh-my-brand-banner__article">
					<RichText
						tagName={ headingLevel as 'h2' | 'h3' | 'h4' }
						className="wp-block-theme-oh-my-brand-banner__heading"
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
						tagName="div"
						className="wp-block-theme-oh-my-brand-banner__text"
						placeholder={ __(
							'Add content…',
							'theme-oh-my-brand'
						) }
						value={ content }
						onChange={ ( value: string ) =>
							setAttributes( { content: value } )
						}
						multiline="p"
					/>

					{ button?.text && (
						<div className="wp-block-theme-oh-my-brand-banner__button-wrapper">
							<span className="wp-block-theme-oh-my-brand-banner__button wp-block-theme-oh-my-brand-banner__button--primary">
								{ button.text }
							</span>
						</div>
					) }
				</article>
			</div>
		</>
	);
}
