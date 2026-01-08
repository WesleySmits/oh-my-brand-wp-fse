/**
 * Banner Block Registration
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { image as bannerIcon } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';

import './style.css';
import './editor.css';

/**
 * Register the Banner block.
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: bannerIcon,
	edit: Edit
});
