/**
 * WordPress Scripts webpack configuration.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		'blocks/breadcrumbs/index': path.resolve(__dirname, 'src/blocks/breadcrumbs/index.ts'),
		'blocks/breadcrumbs/view': path.resolve(__dirname, 'src/blocks/breadcrumbs/view.ts'),
		'blocks/faq/index': path.resolve(__dirname, 'src/blocks/faq/index.js'),
		'blocks/gallery/index': path.resolve(__dirname, 'src/blocks/gallery/index.js'),
		'blocks/gallery/view': path.resolve(__dirname, 'src/blocks/gallery/view.ts'),
		'blocks/logo-grid/index': path.resolve(__dirname, 'src/blocks/logo-grid/index.ts'),
		'blocks/logo-grid/view': path.resolve(__dirname, 'src/blocks/logo-grid/view.ts'),
		'blocks/social-share/index': path.resolve(__dirname, 'src/blocks/social-share/index.ts'),
		'blocks/social-share/view': path.resolve(__dirname, 'src/blocks/social-share/view.ts'),
		'blocks/youtube/index': path.resolve(__dirname, 'src/blocks/youtube/index.js'),
		'blocks/youtube/view': path.resolve(__dirname, 'src/blocks/youtube/view.ts')
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, 'build')
	}
};
