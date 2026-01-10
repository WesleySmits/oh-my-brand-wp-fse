/**
 * Breadcrumbs block editor component.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	RangeControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';

interface BreadcrumbsAttributes {
	separator: string;
	showHome: boolean;
	homeLabel: string;
	homeUrl: string;
	showCurrent: boolean;
	linkCurrent: boolean;
	truncateOnMobile: boolean;
	maxVisibleItems: number;
	showSchema: boolean;
	taxonomyPriority: string[];
}

const SEPARATOR_OPTIONS = [
	{ label: '› (Chevron)', value: '›' },
	{ label: '/ (Slash)', value: '/' },
	{ label: '» (Double Chevron)', value: '»' },
	{ label: '→ (Arrow)', value: '→' },
	{ label: '· (Dot)', value: '·' },
	{ label: '| (Pipe)', value: '|' },
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BreadcrumbsAttributes > ): JSX.Element {
	const {
		separator,
		showHome,
		homeLabel,
		showCurrent,
		linkCurrent,
		truncateOnMobile,
		maxVisibleItems,
		showSchema,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-theme-oh-my-brand-breadcrumbs',
	} );

	// Generate preview breadcrumbs for the editor
	const previewItems = [
		...( showHome
			? [
					{
						label: homeLabel || __( 'Home', 'theme-oh-my-brand' ),
						isLink: true,
					},
			  ]
			: [] ),
		{ label: __( 'Category', 'theme-oh-my-brand' ), isLink: true },
		{ label: __( 'Subcategory', 'theme-oh-my-brand' ), isLink: true },
		...( showCurrent
			? [
					{
						label: __( 'Current Page', 'theme-oh-my-brand' ),
						isLink: linkCurrent,
					},
			  ]
			: [] ),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show Home Link', 'theme-oh-my-brand' ) }
						help={ __(
							'Include the home page as the first breadcrumb item.',
							'theme-oh-my-brand'
						) }
						checked={ showHome }
						onChange={ ( value ) =>
							setAttributes( { showHome: value } )
						}
					/>

					{ showHome && (
						<TextControl
							label={ __( 'Home Label', 'theme-oh-my-brand' ) }
							help={ __(
								'Custom text for the home link.',
								'theme-oh-my-brand'
							) }
							value={ homeLabel }
							onChange={ ( value ) =>
								setAttributes( { homeLabel: value } )
							}
						/>
					) }

					<ToggleControl
						label={ __( 'Show Current Page', 'theme-oh-my-brand' ) }
						help={ __(
							'Display the current page title in the breadcrumb trail.',
							'theme-oh-my-brand'
						) }
						checked={ showCurrent }
						onChange={ ( value ) =>
							setAttributes( { showCurrent: value } )
						}
					/>

					{ showCurrent && (
						<ToggleControl
							label={ __(
								'Link Current Page',
								'theme-oh-my-brand'
							) }
							help={ __(
								'Make the current page title a clickable link.',
								'theme-oh-my-brand'
							) }
							checked={ linkCurrent }
							onChange={ ( value ) =>
								setAttributes( { linkCurrent: value } )
							}
						/>
					) }

					<SelectControl
						label={ __( 'Separator', 'theme-oh-my-brand' ) }
						help={ __(
							'Character displayed between breadcrumb items.',
							'theme-oh-my-brand'
						) }
						value={ separator }
						options={ SEPARATOR_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { separator: value } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Display', 'theme-oh-my-brand' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __(
							'Truncate on Mobile',
							'theme-oh-my-brand'
						) }
						help={ __(
							'Show ellipsis for middle items on small screens.',
							'theme-oh-my-brand'
						) }
						checked={ truncateOnMobile }
						onChange={ ( value ) =>
							setAttributes( { truncateOnMobile: value } )
						}
					/>

					{ truncateOnMobile && (
						<RangeControl
							label={ __(
								'Max Visible Items',
								'theme-oh-my-brand'
							) }
							help={ __(
								'Maximum items visible when truncated (first + last items).',
								'theme-oh-my-brand'
							) }
							value={ maxVisibleItems }
							onChange={ ( value ) =>
								setAttributes( { maxVisibleItems: value ?? 3 } )
							}
							min={ 2 }
							max={ 5 }
						/>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'SEO', 'theme-oh-my-brand' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __(
							'Enable Schema Markup',
							'theme-oh-my-brand'
						) }
						help={ __(
							'Output JSON-LD structured data for search engines.',
							'theme-oh-my-brand'
						) }
						checked={ showSchema }
						onChange={ ( value ) =>
							setAttributes( { showSchema: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<nav
				{ ...blockProps }
				aria-label={ __( 'Breadcrumb', 'theme-oh-my-brand' ) }
			>
				<ol className="wp-block-theme-oh-my-brand-breadcrumbs__list">
					{ previewItems.map( ( item, index ) => {
						const isLast = index === previewItems.length - 1;
						const isCurrent = isLast && showCurrent;

						return (
							<li
								key={ index }
								className={ `wp-block-theme-oh-my-brand-breadcrumbs__item${
									isCurrent
										? ' wp-block-theme-oh-my-brand-breadcrumbs__item--current'
										: ''
								}` }
								{ ...( isCurrent
									? { 'aria-current': 'page' }
									: {} ) }
							>
								{ item.isLink ? (
									<span className="wp-block-theme-oh-my-brand-breadcrumbs__link">
										{ item.label }
									</span>
								) : (
									<span className="wp-block-theme-oh-my-brand-breadcrumbs__current">
										{ item.label }
									</span>
								) }

								{ ! isLast && (
									<span
										className="wp-block-theme-oh-my-brand-breadcrumbs__separator"
										aria-hidden="true"
									>
										{ separator }
									</span>
								) }
							</li>
						);
					} ) }
				</ol>
			</nav>
		</>
	);
}
