/**
 * Gallery Block - Edit Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	Placeholder,
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import { gallery as galleryIcon } from '@wordpress/icons';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Gallery image interface.
 */
interface GalleryImage {
	id: number;
	url: string;
	fullUrl: string;
	alt: string;
	caption: string;
}

/**
 * Block attributes interface.
 */
interface GalleryAttributes {
	images: GalleryImage[];
	visibleImages: number;
}

/**
 * Media item from WordPress media library.
 */
interface MediaItem {
	id: number;
	url: string;
	alt?: string;
	caption?: string;
	sizes?: {
		full?: { url: string };
		large?: { url: string };
		medium?: { url: string };
	};
	[ k: string ]: unknown;
}

/**
 * Edit component for the Gallery block.
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 */
export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< GalleryAttributes > ): JSX.Element {
	const { images, visibleImages } = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-block-theme-oh-my-brand-gallery',
	} );

	/**
	 * Handle image selection from media library.
	 * @param selectedImages
	 */
	const onSelectImages = ( selectedImages: MediaItem[] ): void => {
		const newImages: GalleryImage[] = selectedImages.map( ( image ) => ( {
			id: image.id,
			url: image.url,
			fullUrl:
				image.sizes?.full?.url || image.sizes?.large?.url || image.url,
			alt: image.alt || '',
			caption: image.caption || '',
		} ) );
		setAttributes( { images: newImages } );
	};

	/**
	 * Remove an image from the gallery.
	 * @param indexToRemove
	 */
	const removeImage = ( indexToRemove: number ): void => {
		const newImages = images.filter(
			( _: GalleryImage, index: number ) => index !== indexToRemove
		);
		setAttributes( { images: newImages } );
	};

	const hasImages = images && images.length > 0;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Gallery Settings', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					<RangeControl
						label={ __( 'Visible Images', 'theme-oh-my-brand' ) }
						help={ __(
							'Number of images visible at once.',
							'theme-oh-my-brand'
						) }
						value={ visibleImages }
						onChange={ ( value: number | undefined ) => {
							if ( value !== undefined ) {
								setAttributes( { visibleImages: value } );
							}
						} }
						min={ 1 }
						max={ 6 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ ! hasImages ? (
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImages }
							allowedTypes={ [ 'image' ] }
							multiple
							gallery
							render={ ( { open }: { open: () => void } ) => (
								<Placeholder
									icon={ galleryIcon }
									label={ __(
										'Gallery Carousel',
										'theme-oh-my-brand'
									) }
									instructions={ __(
										'Select images to create a carousel gallery.',
										'theme-oh-my-brand'
									) }
								>
									<Button variant="primary" onClick={ open }>
										{ __(
											'Select Images',
											'theme-oh-my-brand'
										) }
									</Button>
								</Placeholder>
							) }
						/>
					</MediaUploadCheck>
				) : (
					<div className="wp-block-theme-oh-my-brand-gallery__wrapper">
						<div className="wp-block-theme-oh-my-brand-gallery__inner">
							<div
								className="wp-block-theme-oh-my-brand-gallery__track"
								style={
									{
										'--visible-images': visibleImages,
									} as React.CSSProperties
								}
							>
								{ images.map(
									( image: GalleryImage, index: number ) => (
										<div
											key={ image.id || index }
											className="wp-block-theme-oh-my-brand-gallery__item"
										>
											<img
												src={ image.url }
												alt={ image.alt }
											/>
											<Button
												className="wp-block-theme-oh-my-brand-gallery__remove"
												icon="no-alt"
												label={ __(
													'Remove image',
													'theme-oh-my-brand'
												) }
												onClick={ () =>
													removeImage( index )
												}
											/>
										</div>
									)
								) }
							</div>
						</div>
						<div className="wp-block-theme-oh-my-brand-gallery__toolbar">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectImages }
									allowedTypes={ [ 'image' ] }
									multiple
									gallery
									value={ images.map(
										( img: GalleryImage ) => img.id
									) }
									render={ ( {
										open,
									}: {
										open: () => void;
									} ) => (
										<Button
											variant="secondary"
											onClick={ open }
										>
											{ __(
												'Edit Gallery',
												'theme-oh-my-brand'
											) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
