/**
 * Breadcrumbs block registration.
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { navigation } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';
import './style.css';
import './editor.css';

registerBlockType(metadata.name, {
	...metadata,
	icon: navigation,
	edit: Edit
});
