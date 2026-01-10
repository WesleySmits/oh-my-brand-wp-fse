/**
 * Cards Grid Block Registration
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { grid as gridIcon } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerBlockType(
	metadata.name as any,
	{
		...metadata,
		icon: gridIcon,
		edit: Edit,
	} as any
);
