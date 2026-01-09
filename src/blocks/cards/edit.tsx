/**
 * Cards Grid Block - Edit Component
 *
 * @package
 */

import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import {
	Button,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHStack as HStack,
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { grid as gridIcon, plus, trash } from '@wordpress/icons';

/**
 * Card link interface.
 */
interface CardLink {
	url: string;
	text: string;
	openInNewTab: boolean;
}

/**
 * Card image interface.
 */
interface CardImage {
	id: number;
	url: string;
	alt: string;
}

/**
 * Individual card interface.
 */
interface Card {
	id: string;
	title: string;
	description: string;
	image?: CardImage;
	icon?: string;
	link?: CardLink;
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
		large?: { url: string };
	};
}

/**
 * Valid heading levels.
 */
type HeadingLevel = 'h2' | 'h3' | 'h4';

/**
 * Valid card styles.
 */
type CardStyle = 'elevated' | 'outlined' | 'flat';

/**
 * Valid image positions.
 */
type ImagePosition = 'top' | 'left' | 'background';

/**
 * Valid content alignments.
 */
type ContentAlignment = 'left' | 'center';

/**
 * Valid aspect ratios.
 */
type AspectRatio = '1/1' | '4/3' | '16/9' | 'auto';

/**
 * Block attributes interface.
 */
interface CardsAttributes {
	heading: string;
	headingLevel: HeadingLevel;
	description: string;
	cards: Card[];
	columns: number;
	cardStyle: CardStyle;
	showImages: boolean;
	imagePosition: ImagePosition;
	imageAspectRatio: AspectRatio;
	showIcons: boolean;
	equalHeight: boolean;
	contentAlignment: ContentAlignment;
}

/**
 * Generate a unique ID for a card.
 */
function generateCardId(): string {
	return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Edit component for the Cards Grid block.
 *
 * @param props               - Block edit props
 * @param props.attributes    - Block attributes
 * @param props.setAttributes - Function to update attributes
 */
export default function Edit({ attributes, setAttributes }: BlockEditProps<CardsAttributes>): JSX.Element {
	const {
		heading,
		headingLevel,
		description,
		cards,
		columns,
		cardStyle,
		showImages,
		imagePosition,
		imageAspectRatio,
		showIcons,
		equalHeight,
		contentAlignment
	} = attributes;

	const HeadingTag = headingLevel as HeadingLevel;

	// Build class names based on attributes
	const classNames = [
		'wp-block-theme-oh-my-brand-cards',
		`wp-block-theme-oh-my-brand-cards--style-${cardStyle}`,
		`wp-block-theme-oh-my-brand-cards--align-${contentAlignment}`,
		`wp-block-theme-oh-my-brand-cards--image-${imagePosition}`,
		equalHeight ? 'wp-block-theme-oh-my-brand-cards--equal-height' : ''
	]
		.filter(Boolean)
		.join(' ');

	const blockProps = useBlockProps({
		className: classNames,
		style: {
			'--cards-columns': columns,
			'--cards-aspect-ratio': imageAspectRatio
		} as React.CSSProperties
	});

	/**
	 * Add a new card to the list.
	 */
	const addCard = (): void => {
		const newCard: Card = {
			id: generateCardId(),
			title: '',
			description: ''
		};
		setAttributes({ cards: [...cards, newCard] });
	};

	/**
	 * Update a specific card.
	 *
	 * @param index   - Card index
	 * @param updates - Card updates
	 */
	const updateCard = (index: number, updates: Partial<Card>): void => {
		const updatedCards = cards.map((card, i) => (i === index ? { ...card, ...updates } : card));
		setAttributes({ cards: updatedCards });
	};

	/**
	 * Remove a card from the list.
	 *
	 * @param index - Card index to remove
	 */
	const removeCard = (index: number): void => {
		const updatedCards = cards.filter((_, i) => i !== index);
		setAttributes({ cards: updatedCards });
	};

	/**
	 * Handle image selection for a card.
	 *
	 * @param index - Card index
	 * @param media - Selected media item
	 */
	const handleImageSelect = (index: number, media: MediaItem): void => {
		const imageUrl = media.sizes?.large?.url || media.sizes?.medium?.url || media.url;
		updateCard(index, {
			image: {
				id: media.id,
				url: imageUrl,
				alt: media.alt || ''
			}
		});
	};

	/**
	 * Remove image from a card.
	 *
	 * @param index - Card index
	 */
	const removeImage = (index: number): void => {
		updateCard(index, { image: undefined });
	};

	return (
		<>
			<InspectorControls>
				{/* Section Settings */}
				<PanelBody title={__('Section Settings', 'oh-my-brand')} initialOpen={true}>
					<SelectControl<HeadingLevel>
						label={__('Heading Level', 'oh-my-brand')}
						value={headingLevel}
						options={[
							{ label: __('H2', 'oh-my-brand'), value: 'h2' },
							{ label: __('H3', 'oh-my-brand'), value: 'h3' },
							{ label: __('H4', 'oh-my-brand'), value: 'h4' }
						]}
						onChange={(value) => setAttributes({ headingLevel: value })}
					/>
				</PanelBody>

				{/* Grid Settings */}
				<PanelBody title={__('Grid Settings', 'oh-my-brand')} initialOpen={true}>
					<RangeControl
						label={__('Maximum Columns', 'oh-my-brand')}
						help={__('Grid will automatically show fewer columns on smaller screens.', 'oh-my-brand')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value ?? 3 })}
						min={2}
						max={4}
					/>
					<ToggleControl
						label={__('Equal Height Cards', 'oh-my-brand')}
						checked={equalHeight}
						onChange={(value) => setAttributes({ equalHeight: value })}
					/>
				</PanelBody>

				{/* Card Settings */}
				<PanelBody title={__('Card Settings', 'oh-my-brand')} initialOpen={false}>
					<SelectControl<CardStyle>
						label={__('Card Style', 'oh-my-brand')}
						value={cardStyle}
						options={[
							{
								label: __('Elevated', 'oh-my-brand'),
								value: 'elevated'
							},
							{
								label: __('Outlined', 'oh-my-brand'),
								value: 'outlined'
							},
							{
								label: __('Flat', 'oh-my-brand'),
								value: 'flat'
							}
						]}
						onChange={(value) => setAttributes({ cardStyle: value })}
					/>
					<SelectControl<ContentAlignment>
						label={__('Content Alignment', 'oh-my-brand')}
						value={contentAlignment}
						options={[
							{
								label: __('Left', 'oh-my-brand'),
								value: 'left'
							},
							{
								label: __('Center', 'oh-my-brand'),
								value: 'center'
							}
						]}
						onChange={(value) => setAttributes({ contentAlignment: value })}
					/>
				</PanelBody>

				{/* Image Settings */}
				<PanelBody title={__('Image Settings', 'oh-my-brand')} initialOpen={false}>
					<ToggleControl
						label={__('Show Images', 'oh-my-brand')}
						checked={showImages}
						onChange={(value) => setAttributes({ showImages: value })}
					/>
					{showImages && (
						<>
							<SelectControl<ImagePosition>
								label={__('Image Position', 'oh-my-brand')}
								value={imagePosition}
								options={[
									{
										label: __('Top', 'oh-my-brand'),
										value: 'top'
									},
									{
										label: __('Left', 'oh-my-brand'),
										value: 'left'
									},
									{
										label: __('Background', 'oh-my-brand'),
										value: 'background'
									}
								]}
								onChange={(value) => setAttributes({ imagePosition: value })}
							/>
							<SelectControl<AspectRatio>
								label={__('Image Aspect Ratio', 'oh-my-brand')}
								value={imageAspectRatio}
								options={[
									{
										label: __('Square (1:1)', 'oh-my-brand'),
										value: '1/1'
									},
									{
										label: __('Standard (4:3)', 'oh-my-brand'),
										value: '4/3'
									},
									{
										label: __('Widescreen (16:9)', 'oh-my-brand'),
										value: '16/9'
									},
									{
										label: __('Auto', 'oh-my-brand'),
										value: 'auto'
									}
								]}
								onChange={(value) => setAttributes({ imageAspectRatio: value })}
							/>
						</>
					)}
					<ToggleControl
						label={__('Show Icons', 'oh-my-brand')}
						checked={showIcons}
						onChange={(value) => setAttributes({ showIcons: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				{/* Section Header */}
				<div className="wp-block-theme-oh-my-brand-cards__header">
					<RichText
						tagName={HeadingTag}
						className="wp-block-theme-oh-my-brand-cards__heading"
						value={heading}
						onChange={(value: string) => setAttributes({ heading: value })}
						placeholder={__('Add section heading…', 'oh-my-brand')}
					/>
					<RichText
						tagName="p"
						className="wp-block-theme-oh-my-brand-cards__description"
						value={description}
						onChange={(value: string) => setAttributes({ description: value })}
						placeholder={__('Add section description…', 'oh-my-brand')}
					/>
				</div>

				{/* Cards Grid */}
				{cards.length === 0 ? (
					<Placeholder
						icon={gridIcon}
						label={__('Cards Grid', 'oh-my-brand')}
						instructions={__('Add cards to display content in a grid layout.', 'oh-my-brand')}
					>
						<Button variant="primary" onClick={addCard}>
							{__('Add First Card', 'oh-my-brand')}
						</Button>
					</Placeholder>
				) : (
					<ul className="wp-block-theme-oh-my-brand-cards__list">
						{cards.map((card, index) => (
							<li key={card.id} className="wp-block-theme-oh-my-brand-cards__item">
								<article className="wp-block-theme-oh-my-brand-cards__card">
									{/* Card Image */}
									{showImages && (
										<div className="wp-block-theme-oh-my-brand-cards__image-wrapper">
											{card.image?.url ? (
												<>
													<img
														src={card.image.url}
														alt={card.image.alt}
														className="wp-block-theme-oh-my-brand-cards__image"
													/>
													<Button
														icon={trash}
														label={__('Remove image', 'oh-my-brand')}
														onClick={() => removeImage(index)}
														className="wp-block-theme-oh-my-brand-cards__remove-image"
														isDestructive
													/>
												</>
											) : (
												<MediaUploadCheck>
													<MediaUpload
														onSelect={(media: MediaItem) => handleImageSelect(index, media)}
														allowedTypes={['image']}
														value={card.image?.id}
														render={({ open }: { open: () => void }) => (
															<Button
																variant="secondary"
																onClick={open}
																className="wp-block-theme-oh-my-brand-cards__add-image"
															>
																{__('Add Image', 'oh-my-brand')}
															</Button>
														)}
													/>
												</MediaUploadCheck>
											)}
										</div>
									)}

									{/* Card Content */}
									<div className="wp-block-theme-oh-my-brand-cards__content">
										<RichText
											tagName="h3"
											className="wp-block-theme-oh-my-brand-cards__card-title"
											value={card.title}
											onChange={(value: string) =>
												updateCard(index, {
													title: value
												})
											}
											placeholder={__('Card title…', 'oh-my-brand')}
										/>
										<RichText
											tagName="p"
											className="wp-block-theme-oh-my-brand-cards__card-description"
											value={card.description}
											onChange={(value: string) =>
												updateCard(index, {
													description: value
												})
											}
											placeholder={__('Card description…', 'oh-my-brand')}
										/>

										{/* Card Link */}
										<div className="wp-block-theme-oh-my-brand-cards__link-settings">
											<TextControl
												label={__('Link URL', 'oh-my-brand')}
												value={card.link?.url || ''}
												onChange={(value: string) =>
													updateCard(index, {
														link: {
															url: value,
															text: card.link?.text || __('Learn More', 'oh-my-brand'),
															openInNewTab: card.link?.openInNewTab || false
														}
													})
												}
												placeholder="https://"
											/>
											{card.link?.url && (
												<>
													<TextControl
														label={__('Link Text', 'oh-my-brand')}
														value={card.link?.text || ''}
														onChange={(value: string) =>
															updateCard(index, {
																link: {
																	...card.link!,
																	text: value
																}
															})
														}
													/>
													<ToggleControl
														label={__('Open in new tab', 'oh-my-brand')}
														checked={card.link?.openInNewTab || false}
														onChange={(value: boolean) =>
															updateCard(index, {
																link: {
																	...card.link!,
																	openInNewTab: value
																}
															})
														}
													/>
												</>
											)}
										</div>
									</div>

									{/* Remove Card Button */}
									<Button
										icon={trash}
										label={__('Remove card', 'oh-my-brand')}
										onClick={() => removeCard(index)}
										className="wp-block-theme-oh-my-brand-cards__remove-card"
										isDestructive
									/>
								</article>
							</li>
						))}
					</ul>
				)}

				{/* Add Card Button */}
				{cards.length > 0 && (
					<HStack justify="center">
						<Button variant="secondary" icon={plus} onClick={addCard}>
							{__('Add Card', 'oh-my-brand')}
						</Button>
					</HStack>
				)}
			</section>
		</>
	);
}
