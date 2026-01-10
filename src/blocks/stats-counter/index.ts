/**
 * Stats Counter Block Registration
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { chartBar } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';

import type { BlockConfiguration } from '@wordpress/blocks';

/**
 * Stat item interface.
 */
export interface Stat {
	id: string;
	value: number;
	prefix: string;
	suffix: string;
	decimals: number;
	label: string;
	icon: string;
	isCurrency: boolean;
	currencyCode: string;
	locale: string;
}

/**
 * Valid heading levels.
 */
export type HeadingLevel = 'h2' | 'h3' | 'h4';

/**
 * Valid stat styles.
 */
export type StatStyle = 'default' | 'boxed' | 'bordered' | 'minimal';

/**
 * Valid content alignments.
 */
export type ContentAlignment = 'left' | 'center' | 'right';

/**
 * Block attributes interface.
 */
export interface StatsCounterAttributes {
	heading: string;
	headingLevel: HeadingLevel;
	description: string;
	stats: Stat[];
	columns: number;
	statStyle: StatStyle;
	showIcons: boolean;
	animateOnScroll: boolean;
	animationDuration: number;
	contentAlignment: ContentAlignment;
}

/**
 * Register the Stats Counter block.
 */
registerBlockType( metadata.name as 'theme-oh-my-brand/stats-counter', {
	...( metadata as unknown as BlockConfiguration< StatsCounterAttributes > ),
	icon: chartBar,
	edit: Edit,
	save: () => null, // Server-side rendered
} );
