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
		'blocks/faq/index': path.resolve(__dirname, 'src/blocks/faq/index.js'),
		'blocks/gallery/index': path.resolve(__dirname, 'src/blocks/gallery/index.js'),
		'blocks/gallery/view': path.resolve(__dirname, 'src/blocks/gallery/view.ts'),
		'blocks/youtube/index': path.resolve(__dirname, 'src/blocks/youtube/index.js'),
		'blocks/youtube/view': path.resolve(__dirname, 'src/blocks/youtube/view.ts')
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, 'build')
	}
};
