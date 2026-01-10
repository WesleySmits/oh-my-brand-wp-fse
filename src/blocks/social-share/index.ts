/**
 * Social Share Block Registration
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { share as shareIcon } from '@wordpress/icons';

import Edit from './edit';
import metadata from './block.json';

import type { BlockConfiguration } from '@wordpress/blocks';

interface SocialShareAttributes {
	platforms: string[];
	displayStyle: 'icon' | 'icon-label' | 'label';
	layout: 'horizontal' | 'vertical';
	iconStyle: 'filled' | 'outlined';
	size: 'small' | 'medium' | 'large';
	useNativeShare: boolean;
	showLabel: boolean;
	labelText: string;
	openInPopup: boolean;
	alignment: 'left' | 'center' | 'right';
}

registerBlockType< SocialShareAttributes >(
	metadata as unknown as BlockConfiguration< SocialShareAttributes >,
	{
		icon: shareIcon,
		edit: Edit,
	}
);
