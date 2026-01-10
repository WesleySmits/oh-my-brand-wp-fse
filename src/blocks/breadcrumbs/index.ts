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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerBlockType(
	metadata.name as any,
	{
		...metadata,
		icon: navigation,
		edit: Edit,
	} as any
);
