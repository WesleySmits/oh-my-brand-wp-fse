/**
 * Gallery Carousel - Edit Component
 *
 * Full example demonstrating:
 * - useBlockProps for wrapper attributes
 * - InspectorControls for sidebar settings
 * - MediaUpload for gallery selection
 * - Placeholder state when empty
 * - TypeScript interfaces for attributes
 *
 * @package theme-oh-my-brand
 */

import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { gallery as blockIcon } from '@wordpress/icons';

/**
 * Image interface.
 */
interface ImageData {
	id: number;
	url: string;
	alt: string;
	fullUrl?: string;
}

/**
 * Block attributes interface.
 */
interface BlockAttributes {
	images: ImageData[];
	visibleImages: number;
	showLightbox: boolean;
}

/**
 * Edit component.
 */
export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BlockAttributes > ): JSX.Element {
	const { images, visibleImages, showLightbox } = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-block-theme-oh-my-brand-gallery',
	} );

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
						value={ visibleImages }
						onChange={ ( value ) => {
							if ( value !== undefined ) {
								setAttributes( { visibleImages: value } );
							}
						} }
						min={ 1 }
						max={ 6 }
					/>
					<ToggleControl
						label={ __( 'Enable Lightbox', 'theme-oh-my-brand' ) }
						checked={ showLightbox }
						onChange={ ( value ) =>
							setAttributes( { showLightbox: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ ! hasImages ? (
					<Placeholder
						icon={ blockIcon }
						label={ __( 'Gallery Carousel', 'theme-oh-my-brand' ) }
						instructions={ __(
							'Select images to display in the carousel.',
							'theme-oh-my-brand'
						) }
					>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									const selected = media.map( ( item ) => ( {
										id: item.id,
										url: item.sizes?.large?.url || item.url,
										alt: item.alt || '',
										fullUrl: item.url,
									} ) );
									setAttributes( { images: selected } );
								} }
								allowedTypes={ [ 'image' ] }
								multiple={ true }
								gallery={ true }
								render={ ( { open } ) => (
									<Button variant="primary" onClick={ open }>
										{ __(
											'Select Images',
											'theme-oh-my-brand'
										) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
					</Placeholder>
				) : (
					<div className="wp-block-theme-oh-my-brand-gallery__preview">
						<div className="wp-block-theme-oh-my-brand-gallery__grid">
							{ images.map( ( image, index ) => (
								<div
									key={ image.id || index }
									className="wp-block-theme-oh-my-brand-gallery__item"
								>
									<img src={ image.url } alt={ image.alt } />
								</div>
							) ) }
						</div>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									const selected = media.map( ( item ) => ( {
										id: item.id,
										url: item.sizes?.large?.url || item.url,
										alt: item.alt || '',
										fullUrl: item.url,
									} ) );
									setAttributes( { images: selected } );
								} }
								allowedTypes={ [ 'image' ] }
								multiple={ true }
								gallery={ true }
								value={ images.map( ( img ) => img.id ) }
								render={ ( { open } ) => (
									<Button
										variant="secondary"
										onClick={ open }
										className="wp-block-theme-oh-my-brand-gallery__edit-button"
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
				) }
			</div>
		</>
	);
}
