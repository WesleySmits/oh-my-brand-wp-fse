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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerBlockType(
	metadata.name as any,
	{
		...metadata,
		icon: ctaIcon,
		edit: Edit,
	} as any
);
