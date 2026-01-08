/**
 * Logo Grid Block - Edit Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Button,
	Placeholder,
	TextControl,
	Spinner,
	Notice
} from '@wordpress/components';
import { grid as gridIcon } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * WordPress API fetch helper.
 * @param options
 * @param options.path
 */
const apiFetch = <T,>(options: { path: string }): Promise<T> => {
	return window.wp.apiFetch(options) as Promise<T>;
};

// Extend Window interface for WordPress
declare global {
	interface Window {
		wp: {
			apiFetch: (options: { path: string }) => Promise<unknown>;
		};
	}
}

/**
 * Logo image interface.
 */
interface LogoImage {
	id: number;
	url: string;
	alt: string;
	link?: string;
}

/**
 * Block attributes interface.
 */
interface LogoGridAttributes {
	heading: string;
	headingLevel: string;
	source: 'manual' | 'dynamic';
	postType: string;
	imageSource: string;
	linkSource: string;
	altSource: string;
	maxLogos: number;
	orderBy: string;
	order: string;
	images: LogoImage[];
	columns: number;
	columnsMobile: number;
	grayscale: boolean;
	colorOnHover: boolean;
	logoMaxHeight: number;
	enableMarquee: boolean;
	marqueeSpeed: 'slow' | 'medium' | 'fast';
	marqueeDirection: 'left' | 'right';
	pauseOnHover: boolean;
}

/**
 * Media item from WordPress media library.
 */
interface MediaItem {
	id: number;
	url: string;
	alt?: string;
	sizes?: {
		medium?: { url: string };
		thumbnail?: { url: string };
	};
}

/**
 * Post type from REST API.
 */
interface PostType {
	slug: string;
	name: string;
	rest_base: string;
}

/**
 * Meta field info.
 */
interface MetaField {
	key: string;
	label: string;
	type: string;
}

type HeadingLevel = 'h2' | 'h3' | 'h4';
type SourceType = 'manual' | 'dynamic';
type OrderType = 'ASC' | 'DESC';

/**
 * Edit component for the Logo Grid block.
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 */
export default function Edit({ attributes, setAttributes }: BlockEditProps<LogoGridAttributes>): JSX.Element {
	const {
		heading,
		headingLevel,
		source,
		postType,
		imageSource,
		linkSource,
		altSource,
		maxLogos,
		orderBy,
		order,
		images,
		columns,
		columnsMobile,
		grayscale,
		colorOnHover,
		logoMaxHeight,
		enableMarquee,
		marqueeSpeed,
		marqueeDirection,
		pauseOnHover
	} = attributes;

	// State for dynamic source
	const [postTypes, setPostTypes] = useState<PostType[]>([]);
	const [metaFields, setMetaFields] = useState<MetaField[]>([]);
	const [dynamicLogos, setDynamicLogos] = useState<LogoImage[]>([]);
	const [isLoadingPostTypes, setIsLoadingPostTypes] = useState(false);
	const [isLoadingLogos, setIsLoadingLogos] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const HeadingTag = headingLevel as HeadingLevel;

	const blockProps = useBlockProps({
		className: 'wp-block-theme-oh-my-brand-logo-grid',
		style: {
			'--logo-grid-columns': columns,
			'--logo-grid-columns-mobile': columnsMobile,
			'--logo-grid-logo-height': `${logoMaxHeight}px`,
			'--logo-grid-grayscale': grayscale ? '1' : '0'
		} as React.CSSProperties
	});

	// Fetch available post types
	useEffect(() => {
		if (source !== 'dynamic') {
			return;
		}

		setIsLoadingPostTypes(true);
		apiFetch<Record<string, PostType>>({ path: '/wp/v2/types' })
			.then((types: Record<string, PostType>) => {
				// Filter to public post types with REST support
				const publicTypes = (Object.values(types) as PostType[]).filter(
					(type: PostType) => type.rest_base && type.slug !== 'attachment'
				);
				setPostTypes(publicTypes);
				setIsLoadingPostTypes(false);
			})
			.catch(() => {
				setError(__('Failed to load post types.', 'theme-oh-my-brand'));
				setIsLoadingPostTypes(false);
			});
	}, [source]);

	// Fetch meta fields for selected post type
	useEffect(() => {
		if (!postType || source !== 'dynamic') {
			setMetaFields([]);
			return;
		}

		// Fetch custom endpoint that returns meta fields
		apiFetch<MetaField[]>({ path: `/theme-oh-my-brand/v1/meta-fields/${postType}` })
			.then((fields: MetaField[]) => {
				setMetaFields(fields);
			})
			.catch(() => {
				// If endpoint doesn't exist, provide empty array
				setMetaFields([]);
			});
	}, [postType, source]);

	// Fetch dynamic logos preview
	useEffect(() => {
		if (source !== 'dynamic' || !postType) {
			setDynamicLogos([]);
			return;
		}

		setIsLoadingLogos(true);
		setError(null);

		const queryParams = new URLSearchParams({
			post_type: postType,
			image_source: imageSource,
			link_source: linkSource,
			alt_source: altSource,
			max_logos: String(maxLogos),
			orderby: orderBy,
			order
		});

		apiFetch<LogoImage[]>({ path: `/theme-oh-my-brand/v1/logo-grid-preview?${queryParams}` })
			.then((logos: LogoImage[]) => {
				setDynamicLogos(logos);
				setIsLoadingLogos(false);
			})
			.catch(() => {
				setError(__('Failed to load logos from selected post type.', 'theme-oh-my-brand'));
				setIsLoadingLogos(false);
			});
	}, [source, postType, imageSource, linkSource, altSource, maxLogos, orderBy, order]);

	/**
	 * Handle image selection from media library.
	 * @param selectedImages
	 */
	const onSelectImages = (selectedImages: MediaItem[]): void => {
		const newImages: LogoImage[] = selectedImages.map((image) => {
			const existingImage = images.find((img) => img.id === image.id);
			return {
				id: image.id,
				url: image.sizes?.medium?.url || image.url,
				alt: image.alt || '',
				link: existingImage?.link || ''
			};
		});
		setAttributes({ images: newImages });
	};

	/**
	 * Update a single image's link.
	 * @param index
	 * @param link
	 */
	const updateImageLink = (index: number, link: string): void => {
		const newImages = [...images];
		newImages[index] = { ...newImages[index], link };
		setAttributes({ images: newImages });
	};

	/**
	 * Remove an image from the grid.
	 * @param indexToRemove
	 */
	const removeImage = (indexToRemove: number): void => {
		const newImages = images.filter((_, index) => index !== indexToRemove);
		setAttributes({ images: newImages });
	};

	// Determine which logos to display
	const displayLogos = source === 'dynamic' ? dynamicLogos : images;
	const hasLogos = displayLogos && displayLogos.length > 0;

	const headingLevelOptions: Array<{ label: string; value: HeadingLevel }> = [
		{ label: __('H2', 'theme-oh-my-brand'), value: 'h2' },
		{ label: __('H3', 'theme-oh-my-brand'), value: 'h3' },
		{ label: __('H4', 'theme-oh-my-brand'), value: 'h4' }
	];

	const sourceOptions: Array<{ label: string; value: SourceType }> = [
		{ label: __('Manual Selection', 'theme-oh-my-brand'), value: 'manual' },
		{ label: __('Dynamic (from Post Type)', 'theme-oh-my-brand'), value: 'dynamic' }
	];

	const postTypeOptions = [
		{ label: __('— Select Post Type —', 'theme-oh-my-brand'), value: '' },
		...postTypes.map((pt) => ({ label: pt.name, value: pt.slug }))
	];

	const imageSourceOptions = [
		{ label: __('Featured Image', 'theme-oh-my-brand'), value: 'featured_image' },
		...metaFields.filter((f) => f.type === 'image').map((f) => ({ label: f.label, value: `meta:${f.key}` }))
	];

	const linkSourceOptions = [
		{ label: __('Post Permalink', 'theme-oh-my-brand'), value: 'permalink' },
		{ label: __('None', 'theme-oh-my-brand'), value: 'none' },
		...metaFields
			.filter((f) => f.type === 'url' || f.type === 'text')
			.map((f) => ({ label: f.label, value: `meta:${f.key}` }))
	];

	const altSourceOptions = [
		{ label: __('Post Title', 'theme-oh-my-brand'), value: 'title' },
		...metaFields.filter((f) => f.type === 'text').map((f) => ({ label: f.label, value: `meta:${f.key}` }))
	];

	const orderByOptions = [
		{ label: __('Menu Order', 'theme-oh-my-brand'), value: 'menu_order' },
		{ label: __('Title', 'theme-oh-my-brand'), value: 'title' },
		{ label: __('Date', 'theme-oh-my-brand'), value: 'date' },
		{ label: __('Random', 'theme-oh-my-brand'), value: 'rand' }
	];

	const orderOptions: Array<{ label: string; value: OrderType }> = [
		{ label: __('Ascending', 'theme-oh-my-brand'), value: 'ASC' },
		{ label: __('Descending', 'theme-oh-my-brand'), value: 'DESC' }
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Data Source', 'theme-oh-my-brand')} initialOpen={true}>
					<SelectControl<SourceType>
						label={__('Source', 'theme-oh-my-brand')}
						value={source as SourceType}
						options={sourceOptions}
						onChange={(value) => setAttributes({ source: value })}
						help={
							source === 'dynamic'
								? __('Logos will be pulled dynamically from a post type.', 'theme-oh-my-brand')
								: __('Manually select logos from the media library.', 'theme-oh-my-brand')
						}
					/>

					{source === 'dynamic' && (
						<>
							{isLoadingPostTypes ? (
								<Spinner />
							) : (
								<SelectControl
									label={__('Post Type', 'theme-oh-my-brand')}
									value={postType}
									options={postTypeOptions}
									onChange={(value) => setAttributes({ postType: value })}
								/>
							)}

							{postType && (
								<>
									<SelectControl
										label={__('Image Source', 'theme-oh-my-brand')}
										value={imageSource}
										options={imageSourceOptions}
										onChange={(value) => setAttributes({ imageSource: value })}
										help={__('Where to get the logo image from.', 'theme-oh-my-brand')}
									/>

									<SelectControl
										label={__('Link Source', 'theme-oh-my-brand')}
										value={linkSource}
										options={linkSourceOptions}
										onChange={(value) => setAttributes({ linkSource: value })}
										help={__('Where the logo should link to.', 'theme-oh-my-brand')}
									/>

									<SelectControl
										label={__('Alt Text Source', 'theme-oh-my-brand')}
										value={altSource}
										options={altSourceOptions}
										onChange={(value) => setAttributes({ altSource: value })}
									/>

									<RangeControl
										label={__('Maximum Logos', 'theme-oh-my-brand')}
										value={maxLogos}
										onChange={(value) => setAttributes({ maxLogos: value ?? 12 })}
										min={1}
										max={50}
									/>

									<SelectControl
										label={__('Order By', 'theme-oh-my-brand')}
										value={orderBy}
										options={orderByOptions}
										onChange={(value) => setAttributes({ orderBy: value })}
									/>

									<SelectControl<OrderType>
										label={__('Order', 'theme-oh-my-brand')}
										value={order as OrderType}
										options={orderOptions}
										onChange={(value) => setAttributes({ order: value })}
									/>
								</>
							)}
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Heading Settings', 'theme-oh-my-brand')} initialOpen={false}>
					<SelectControl<HeadingLevel>
						label={__('Heading Level', 'theme-oh-my-brand')}
						value={headingLevel as HeadingLevel}
						options={headingLevelOptions}
						onChange={(value) => setAttributes({ headingLevel: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Grid Settings', 'theme-oh-my-brand')} initialOpen={false}>
					{enableMarquee && (
						<Notice status="info" isDismissible={false}>
							{__('Grid columns are disabled when marquee is enabled.', 'theme-oh-my-brand')}
						</Notice>
					)}
					<RangeControl
						label={__('Columns (Desktop)', 'theme-oh-my-brand')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value ?? 4 })}
						min={2}
						max={6}
						disabled={enableMarquee}
					/>
					<RangeControl
						label={__('Columns (Mobile)', 'theme-oh-my-brand')}
						value={columnsMobile}
						onChange={(value) => setAttributes({ columnsMobile: value ?? 2 })}
						min={1}
						max={3}
						disabled={enableMarquee}
					/>
					<RangeControl
						label={__('Logo Max Height (px)', 'theme-oh-my-brand')}
						value={logoMaxHeight}
						onChange={(value) => setAttributes({ logoMaxHeight: value ?? 80 })}
						min={40}
						max={200}
						step={10}
					/>
				</PanelBody>

				<PanelBody title={__('Animation Settings', 'theme-oh-my-brand')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Marquee', 'theme-oh-my-brand')}
						help={__('Display logos in a continuous horizontal scroll.', 'theme-oh-my-brand')}
						checked={enableMarquee}
						onChange={(value) => setAttributes({ enableMarquee: value })}
					/>
					{enableMarquee && displayLogos.length < 4 && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'Marquee requires at least 4 logos to display properly. Add more logos or disable marquee.',
								'theme-oh-my-brand'
							)}
						</Notice>
					)}
					{enableMarquee && displayLogos.length >= 4 && (
						<>
							<SelectControl
								label={__('Speed', 'theme-oh-my-brand')}
								value={marqueeSpeed}
								options={[
									{ label: __('Slow', 'theme-oh-my-brand'), value: 'slow' },
									{ label: __('Medium', 'theme-oh-my-brand'), value: 'medium' },
									{ label: __('Fast', 'theme-oh-my-brand'), value: 'fast' }
								]}
								onChange={(value) =>
									setAttributes({ marqueeSpeed: value as 'slow' | 'medium' | 'fast' })
								}
							/>
							<SelectControl
								label={__('Direction', 'theme-oh-my-brand')}
								value={marqueeDirection}
								options={[
									{ label: __('Left', 'theme-oh-my-brand'), value: 'left' },
									{ label: __('Right', 'theme-oh-my-brand'), value: 'right' }
								]}
								onChange={(value) => setAttributes({ marqueeDirection: value as 'left' | 'right' })}
							/>
							<ToggleControl
								label={__('Pause on Hover', 'theme-oh-my-brand')}
								help={__('Pause the animation when users hover over logos.', 'theme-oh-my-brand')}
								checked={pauseOnHover}
								onChange={(value) => setAttributes({ pauseOnHover: value })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Display Settings', 'theme-oh-my-brand')} initialOpen={false}>
					<ToggleControl
						label={__('Grayscale', 'theme-oh-my-brand')}
						help={__('Display logos in grayscale.', 'theme-oh-my-brand')}
						checked={grayscale}
						onChange={(value) => setAttributes({ grayscale: value })}
					/>
					{grayscale && (
						<ToggleControl
							label={__('Color on Hover', 'theme-oh-my-brand')}
							help={__('Show original colors when hovering over logos.', 'theme-oh-my-brand')}
							checked={colorOnHover}
							onChange={(value) => setAttributes({ colorOnHover: value })}
						/>
					)}
				</PanelBody>

				{source === 'manual' && hasLogos && (
					<PanelBody title={__('Logo Links', 'theme-oh-my-brand')} initialOpen={false}>
						{images.map((image, index) => (
							<TextControl
								key={image.id}
								label={`${__('Logo', 'theme-oh-my-brand')} ${index + 1} ${
									image.alt ? `(${image.alt})` : ''
								}`}
								value={image.link || ''}
								onChange={(value) => updateImageLink(index, value)}
								placeholder={__('https://example.com', 'theme-oh-my-brand')}
							/>
						))}
					</PanelBody>
				)}
			</InspectorControls>

			<section {...blockProps}>
				<RichText
					tagName={HeadingTag}
					className="wp-block-theme-oh-my-brand-logo-grid__heading"
					value={heading}
					onChange={(value) => setAttributes({ heading: value })}
					placeholder={__('Our Trusted Partners', 'theme-oh-my-brand')}
				/>

				{error && (
					<Notice status="error" isDismissible={false}>
						{error}
					</Notice>
				)}

				{source === 'dynamic' && !postType && (
					<Placeholder
						icon={gridIcon}
						label={__('Logo Grid', 'theme-oh-my-brand')}
						instructions={__('Select a post type in the sidebar to display logos.', 'theme-oh-my-brand')}
					/>
				)}

				{source === 'dynamic' && postType && isLoadingLogos && (
					<div className="wp-block-theme-oh-my-brand-logo-grid__loading">
						<Spinner />
						<p>{__('Loading logos…', 'theme-oh-my-brand')}</p>
					</div>
				)}

				{source === 'manual' && !hasLogos && (
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImages}
							allowedTypes={['image']}
							multiple
							gallery
							render={({ open }: { open: () => void }) => (
								<Placeholder
									icon={gridIcon}
									label={__('Logo Grid', 'theme-oh-my-brand')}
									instructions={__('Select logos to display in the grid.', 'theme-oh-my-brand')}
								>
									<Button variant="primary" onClick={open}>
										{__('Select Logos', 'theme-oh-my-brand')}
									</Button>
								</Placeholder>
							)}
						/>
					</MediaUploadCheck>
				)}

				{hasLogos && !isLoadingLogos && (
					<>
						<ul className="wp-block-theme-oh-my-brand-logo-grid__list">
							{displayLogos.map((image, index) => (
								<li key={image.id || index} className="wp-block-theme-oh-my-brand-logo-grid__item">
									<img
										src={image.url}
										alt={image.alt}
										className="wp-block-theme-oh-my-brand-logo-grid__image"
									/>
									{source === 'manual' && (
										<Button
											className="wp-block-theme-oh-my-brand-logo-grid__remove"
											icon="no-alt"
											label={__('Remove logo', 'theme-oh-my-brand')}
											onClick={() => removeImage(index)}
											isDestructive
										/>
									)}
								</li>
							))}
						</ul>

						{source === 'manual' && (
							<div className="wp-block-theme-oh-my-brand-logo-grid__toolbar">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={onSelectImages}
										allowedTypes={['image']}
										multiple
										gallery
										value={images.map((img) => img.id)}
										render={({ open }: { open: () => void }) => (
											<Button variant="secondary" onClick={open}>
												{__('Edit Logos', 'theme-oh-my-brand')}
											</Button>
										)}
									/>
								</MediaUploadCheck>
							</div>
						)}

						{source === 'dynamic' && (
							<p className="wp-block-theme-oh-my-brand-logo-grid__dynamic-notice">
								{__('Showing preview. Logos are loaded dynamically from:', 'theme-oh-my-brand')}{' '}
								<strong>{postType}</strong>
							</p>
						)}
					</>
				)}
			</section>
		</>
	);
}
