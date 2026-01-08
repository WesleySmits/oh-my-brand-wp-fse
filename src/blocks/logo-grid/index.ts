/**
 * Logo Grid Block Registration
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { grid as gridIcon } from '@wordpress/icons';

import Edit from './edit';
import metadata from './block.json';

import type { BlockConfiguration } from '@wordpress/blocks';

interface LogoGridAttributes {
	heading: string;
	headingLevel: string;
	images: Array<{
		id: number;
		url: string;
		alt: string;
		link?: string;
	}>;
	columns: number;
	columnsMobile: number;
	grayscale: boolean;
	colorOnHover: boolean;
	logoMaxHeight: number;
}

registerBlockType(metadata.name as 'theme-oh-my-brand/logo-grid', {
	...(metadata as unknown as BlockConfiguration<LogoGridAttributes>),
	icon: gridIcon,
	edit: Edit
});
