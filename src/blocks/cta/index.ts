/**
 * CTA Block Registration
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { button as ctaIcon } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';

import './style.css';
import './editor.css';

/**
 * Register the CTA block.
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: ctaIcon,
	edit: Edit
});
