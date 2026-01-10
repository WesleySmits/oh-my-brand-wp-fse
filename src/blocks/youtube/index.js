/**
 * YouTube Block - Editor Script
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit.tsx';
import metadata from './block.json';

/**
 * Register the YouTube block.
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null, // Dynamic block - rendered via PHP
} );
