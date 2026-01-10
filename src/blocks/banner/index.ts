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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerBlockType(
	metadata.name as any,
	{
		...metadata,
		icon: bannerIcon,
		edit: Edit,
	} as any
);
