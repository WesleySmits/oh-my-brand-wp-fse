/**
 * Stats Counter Block - Edit Component
 *
 * @package
 */

import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
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
import { chartBar, plus, trash } from '@wordpress/icons';

import type { ContentAlignment, HeadingLevel, Stat, StatStyle, StatsCounterAttributes } from './index';

/**
 * Generate a unique ID for a stat.
 */
function generateStatId(): string {
	return `stat-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create a default stat object.
 */
function createDefaultStat(): Stat {
	return {
		id: generateStatId(),
		value: 0,
		prefix: '',
		suffix: '',
		decimals: 0,
		label: '',
		icon: '📊',
		isCurrency: false,
		currencyCode: 'USD',
		locale: 'en-US'
	};
}

/**
 * Format number using Intl.NumberFormat.
 * @param value
 * @param decimals
 * @param isCurrency
 * @param currencyCode
 * @param locale
 * @param suffix
 */
function formatNumber(
	value: number,
	decimals: number,
	isCurrency: boolean,
	currencyCode: string,
	locale: string,
	suffix: string
): string {
	if (isCurrency) {
		return (
			new Intl.NumberFormat(locale, {
				style: 'currency',
				currency: currencyCode,
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals
			}).format(value) + suffix
		);
	}

	return (
		new Intl.NumberFormat(locale, {
			style: 'decimal',
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		}).format(value) + suffix
	);
}

/**
 * Edit component for the Stats Counter block.
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 */
export default function Edit({ attributes, setAttributes }: BlockEditProps<StatsCounterAttributes>): JSX.Element {
	const {
		heading,
		headingLevel,
		description,
		stats,
		columns,
		statStyle,
		showIcons,
		animateOnScroll,
		animationDuration,
		contentAlignment
	} = attributes;

	const HeadingTag = headingLevel as HeadingLevel;

	// Build class names based on attributes.
	const classNames = [
		'wp-block-theme-oh-my-brand-stats-counter',
		`wp-block-theme-oh-my-brand-stats-counter--style-${statStyle}`,
		`wp-block-theme-oh-my-brand-stats-counter--align-${contentAlignment}`,
		// Always visible in editor (no scroll animation).
		'is-visible'
	]
		.filter(Boolean)
		.join(' ');

	// Build inline styles for CSS custom properties.
	const customStyles = {
		'--stats-columns': columns,
		'--stats-animation-duration': `${animationDuration}ms`
	} as React.CSSProperties;

	const blockProps = useBlockProps({
		className: classNames,
		style: customStyles
	});

	/**
	 * Add a new stat.
	 */
	const addStat = (): void => {
		const newStat = createDefaultStat();
		setAttributes({ stats: [...stats, newStat] });
	};

	/**
	 * Update a stat at a given index.
	 * @param index
	 * @param updates
	 */
	const updateStat = (index: number, updates: Partial<Stat>): void => {
		const updatedStats = stats.map((stat, i) => (i === index ? { ...stat, ...updates } : stat));
		setAttributes({ stats: updatedStats });
	};

	/**
	 * Remove a stat at a given index.
	 * @param index
	 */
	const removeStat = (index: number): void => {
		const updatedStats = stats.filter((_, i) => i !== index);
		setAttributes({ stats: updatedStats });
	};

	/**
	 * Heading level options.
	 */
	const headingLevelOptions = [
		{ label: __('H2', 'theme-oh-my-brand'), value: 'h2' },
		{ label: __('H3', 'theme-oh-my-brand'), value: 'h3' },
		{ label: __('H4', 'theme-oh-my-brand'), value: 'h4' }
	];

	/**
	 * Style options.
	 */
	const styleOptions = [
		{ label: __('Default', 'theme-oh-my-brand'), value: 'default' },
		{ label: __('Boxed', 'theme-oh-my-brand'), value: 'boxed' },
		{ label: __('Bordered', 'theme-oh-my-brand'), value: 'bordered' },
		{ label: __('Minimal', 'theme-oh-my-brand'), value: 'minimal' }
	];

	/**
	 * Alignment options.
	 */
	const alignmentOptions = [
		{ label: __('Left', 'theme-oh-my-brand'), value: 'left' },
		{ label: __('Center', 'theme-oh-my-brand'), value: 'center' },
		{ label: __('Right', 'theme-oh-my-brand'), value: 'right' }
	];

	/**
	 * Currency options.
	 */
	const currencyOptions = [
		{ label: 'USD ($)', value: 'USD' },
		{ label: 'EUR (€)', value: 'EUR' },
		{ label: 'GBP (£)', value: 'GBP' },
		{ label: 'JPY (¥)', value: 'JPY' },
		{ label: 'CAD (CA$)', value: 'CAD' },
		{ label: 'AUD (A$)', value: 'AUD' },
		{ label: 'CHF', value: 'CHF' }
	];

	/**
	 * Locale options.
	 */
	const localeOptions = [
		{ label: 'English (US)', value: 'en-US' },
		{ label: 'English (UK)', value: 'en-GB' },
		{ label: 'German (DE)', value: 'de-DE' },
		{ label: 'French (FR)', value: 'fr-FR' },
		{ label: 'Spanish (ES)', value: 'es-ES' },
		{ label: 'Dutch (NL)', value: 'nl-NL' },
		{ label: 'Japanese (JP)', value: 'ja-JP' }
	];

	const hasStats = stats.length > 0;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Section Settings', 'theme-oh-my-brand')}>
					<SelectControl
						label={__('Heading Level', 'theme-oh-my-brand')}
						value={headingLevel}
						options={headingLevelOptions}
						onChange={(value) => setAttributes({ headingLevel: value as HeadingLevel })}
					/>
				</PanelBody>

				<PanelBody title={__('Layout Settings', 'theme-oh-my-brand')}>
					<RangeControl
						label={__('Columns', 'theme-oh-my-brand')}
						value={columns}
						onChange={(value) => value !== undefined && setAttributes({ columns: value })}
						min={2}
						max={6}
						help={__('Number of columns on larger screens.', 'theme-oh-my-brand')}
					/>
					<SelectControl
						label={__('Style', 'theme-oh-my-brand')}
						value={statStyle}
						options={styleOptions}
						onChange={(value) => setAttributes({ statStyle: value as StatStyle })}
					/>
					<SelectControl
						label={__('Alignment', 'theme-oh-my-brand')}
						value={contentAlignment}
						options={alignmentOptions}
						onChange={(value) => setAttributes({ contentAlignment: value as ContentAlignment })}
					/>
				</PanelBody>

				<PanelBody title={__('Display Settings', 'theme-oh-my-brand')}>
					<ToggleControl
						label={__('Show Icons', 'theme-oh-my-brand')}
						checked={showIcons}
						onChange={(value) => setAttributes({ showIcons: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Animation Settings', 'theme-oh-my-brand')}>
					<ToggleControl
						label={__('Animate on Scroll', 'theme-oh-my-brand')}
						checked={animateOnScroll}
						onChange={(value) => setAttributes({ animateOnScroll: value })}
						help={__('Count up animation when scrolled into view.', 'theme-oh-my-brand')}
					/>
					{animateOnScroll && (
						<RangeControl
							label={__('Animation Duration (ms)', 'theme-oh-my-brand')}
							value={animationDuration}
							onChange={(value) => value !== undefined && setAttributes({ animationDuration: value })}
							min={500}
							max={5000}
							step={100}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				<header className="wp-block-theme-oh-my-brand-stats-counter__header">
					<RichText
						tagName={HeadingTag}
						className="wp-block-theme-oh-my-brand-stats-counter__heading"
						value={heading}
						onChange={(value) => setAttributes({ heading: value })}
						placeholder={__('Stats heading…', 'theme-oh-my-brand')}
					/>
					<RichText
						tagName="p"
						className="wp-block-theme-oh-my-brand-stats-counter__description"
						value={description}
						onChange={(value) => setAttributes({ description: value })}
						placeholder={__('Optional description…', 'theme-oh-my-brand')}
					/>
				</header>

				{!hasStats ? (
					<Placeholder
						icon={chartBar}
						label={__('Stats Counter', 'theme-oh-my-brand')}
						instructions={__('Add statistics to display.', 'theme-oh-my-brand')}
					>
						<Button variant="primary" icon={plus} onClick={addStat}>
							{__('Add Stat', 'theme-oh-my-brand')}
						</Button>
					</Placeholder>
				) : (
					<>
						<div className="wp-block-theme-oh-my-brand-stats-counter__list">
							{stats.map((stat, index) => (
								<div key={stat.id} className="wp-block-theme-oh-my-brand-stats-counter__item">
									{showIcons && (
										<TextControl
											className="wp-block-theme-oh-my-brand-stats-counter__icon-input"
											label={__('Icon (emoji)', 'theme-oh-my-brand')}
											value={stat.icon}
											onChange={(value) => updateStat(index, { icon: value })}
											placeholder="📊"
										/>
									)}

									<div className="wp-block-theme-oh-my-brand-stats-counter__number-preview">
										{formatNumber(
											stat.value,
											stat.decimals,
											stat.isCurrency,
											stat.currencyCode,
											stat.locale,
											stat.suffix
										)}
									</div>

									<div className="wp-block-theme-oh-my-brand-stats-counter__stat-controls">
										<TextControl
											label={__('Value', 'theme-oh-my-brand')}
											type="number"
											value={String(stat.value)}
											onChange={(value) => updateStat(index, { value: parseFloat(value) || 0 })}
										/>
										<RangeControl
											label={__('Decimals', 'theme-oh-my-brand')}
											value={stat.decimals}
											onChange={(value) =>
												value !== undefined && updateStat(index, { decimals: value })
											}
											min={0}
											max={2}
										/>
										<ToggleControl
											label={__('Currency', 'theme-oh-my-brand')}
											checked={stat.isCurrency}
											onChange={(value) => updateStat(index, { isCurrency: value })}
										/>
										{stat.isCurrency ? (
											<>
												<SelectControl
													label={__('Currency Code', 'theme-oh-my-brand')}
													value={stat.currencyCode}
													options={currencyOptions}
													onChange={(value) => updateStat(index, { currencyCode: value })}
												/>
												<SelectControl
													label={__('Locale', 'theme-oh-my-brand')}
													value={stat.locale}
													options={localeOptions}
													onChange={(value) => updateStat(index, { locale: value })}
												/>
											</>
										) : (
											<TextControl
												label={__('Suffix', 'theme-oh-my-brand')}
												value={stat.suffix}
												onChange={(value) => updateStat(index, { suffix: value })}
												placeholder="+, %, K, M"
											/>
										)}
										<TextControl
											label={__('Label', 'theme-oh-my-brand')}
											value={stat.label}
											onChange={(value) => updateStat(index, { label: value })}
											placeholder={__('e.g., Projects Completed', 'theme-oh-my-brand')}
										/>
									</div>

									<HStack>
										<Button
											variant="tertiary"
											icon={trash}
											isDestructive
											onClick={() => removeStat(index)}
											label={__('Remove stat', 'theme-oh-my-brand')}
										/>
									</HStack>
								</div>
							))}
						</div>

						<div className="wp-block-theme-oh-my-brand-stats-counter__add-button">
							<Button variant="secondary" icon={plus} onClick={addStat}>
								{__('Add Stat', 'theme-oh-my-brand')}
							</Button>
						</div>
					</>
				)}
			</section>
		</>
	);
}
