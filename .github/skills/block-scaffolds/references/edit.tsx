/**
 * BLOCK_TITLE - Edit Component
 *
 * @package theme-oh-my-brand
 */

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Block attributes interface.
 */
interface BlockAttributes {
	// Define attributes
}

/**
 * Edit component.
 */
export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BlockAttributes > ): JSX.Element {
	const blockProps = useBlockProps( {
		className: 'wp-block-theme-oh-my-brand-BLOCK_NAME',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					{ /* Controls */ }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>{ /* Block content */ }</div>
		</>
	);
}
