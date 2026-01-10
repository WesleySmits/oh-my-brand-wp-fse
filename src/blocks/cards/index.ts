/**
 * Cards Grid Block Registration
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { grid as gridIcon } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';

import type { BlockConfiguration } from '@wordpress/blocks';

/**
 * Card link interface.
 */
interface CardLink {
	url: string;
	text: string;
	openInNewTab: boolean;
}

/**
 * Card image interface.
 */
interface CardImage {
	id: number;
	url: string;
	alt: string;
}

/**
 * Individual card interface.
 */
interface Card {
	id: string;
	title: string;
	description: string;
	image?: CardImage;
	icon?: string;
	link?: CardLink;
}

/**
 * Block attributes interface.
 */
interface CardsAttributes {
	heading: string;
	headingLevel: string;
	description: string;
	cards: Card[];
	columns: number;
	cardStyle: string;
	showImages: boolean;
	imagePosition: string;
	imageAspectRatio: string;
	showIcons: boolean;
	equalHeight: boolean;
	contentAlignment: string;
}

registerBlockType( metadata.name as 'theme-oh-my-brand/cards', {
	...( metadata as unknown as BlockConfiguration< CardsAttributes > ),
	icon: gridIcon,
	edit: Edit,
} );
