/**
 * CTA Block - Edit Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import { ButtonSettingsPanel, type BlockButton } from '../utils';

/**
 * Valid heading levels.
 */
type HeadingLevel = 'h2' | 'h3' | 'h4';

/**
 * Valid alignment options.
 */
type ContentAlignment = 'left' | 'center' | 'right';

/**
 * Block attributes interface.
 */
interface CTAAttributes {
	heading: string;
	headingLevel: HeadingLevel;
	content: string;
	contentAlignment: ContentAlignment;
	primaryButton: BlockButton;
	secondaryButton: BlockButton;
}

/**
 * Edit component for the CTA block.
 *
 * @param props               - Block edit props
 * @param props.attributes    - Block attributes
 * @param props.setAttributes - Function to update attributes
 */
export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< CTAAttributes > ): JSX.Element {
	const {
		heading,
		headingLevel,
		content,
		contentAlignment,
		primaryButton,
		secondaryButton,
	} = attributes;

	// Build class names based on attributes
	const classNames = [
		'wp-block-theme-oh-my-brand-cta',
		`wp-block-theme-oh-my-brand-cta--align-${ contentAlignment }`,
	].join( ' ' );

	const blockProps = useBlockProps( {
		className: classNames,
	} );

	return (
		<>
			<InspectorControls>
				{ /* Heading Settings */ }
				<PanelBody
					title={ __( 'Heading Settings', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					<SelectControl< HeadingLevel >
						label={ __( 'Heading Level', 'theme-oh-my-brand' ) }
						value={ headingLevel }
						options={ [
							{
								label: __( 'H2', 'theme-oh-my-brand' ),
								value: 'h2',
							},
							{
								label: __( 'H3', 'theme-oh-my-brand' ),
								value: 'h3',
							},
							{
								label: __( 'H4', 'theme-oh-my-brand' ),
								value: 'h4',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>

				{ /* Layout Settings */ }
				<PanelBody
					title={ __( 'Layout Settings', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					<SelectControl< ContentAlignment >
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
						onChange={ ( value ) =>
							setAttributes( { contentAlignment: value } )
						}
					/>
				</PanelBody>

				{ /* Primary Button Settings */ }
				<ButtonSettingsPanel
					title={ __( 'Primary Button', 'theme-oh-my-brand' ) }
					button={ primaryButton }
					onChange={ ( button: BlockButton ) =>
						setAttributes( { primaryButton: button } )
					}
					initialOpen={ true }
				/>

				{ /* Secondary Button Settings */ }
				<ButtonSettingsPanel
					title={ __( 'Secondary Button', 'theme-oh-my-brand' ) }
					button={ secondaryButton }
					onChange={ ( button: BlockButton ) =>
						setAttributes( { secondaryButton: button } )
					}
					initialOpen={ false }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-theme-oh-my-brand-cta__content">
					<RichText
						tagName={ headingLevel }
						className="wp-block-theme-oh-my-brand-cta__heading"
						value={ heading }
						onChange={ ( value: string ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __(
							'Add heading…',
							'theme-oh-my-brand'
						) }
					/>

					<RichText
						tagName="p"
						className="wp-block-theme-oh-my-brand-cta__text"
						value={ content }
						onChange={ ( value: string ) =>
							setAttributes( { content: value } )
						}
						placeholder={ __(
							'Add supporting text…',
							'theme-oh-my-brand'
						) }
					/>

					{ ( primaryButton?.text || secondaryButton?.text ) && (
						<div className="wp-block-theme-oh-my-brand-cta__buttons">
							{ primaryButton?.text && (
								<span className="wp-block-theme-oh-my-brand-cta__button wp-block-theme-oh-my-brand-cta__button--primary">
									{ primaryButton.text }
								</span>
							) }
							{ secondaryButton?.text && (
								<span className="wp-block-theme-oh-my-brand-cta__button wp-block-theme-oh-my-brand-cta__button--secondary">
									{ secondaryButton.text }
								</span>
							) }
						</div>
					) }
				</div>
			</div>
		</>
	);
}
