/**
 * Copy additional block assets (helpers.php, style.css, editor.css) to build directory.
 *
 * This script runs after wp-scripts build to copy files that are not handled
 * by the default WordPress Scripts CopyPlugin configuration.
 *
 * @package theme-oh-my-brand
 */

const fs = require('fs');
const path = require('path');

const srcBlocks = path.resolve(__dirname, '../src/blocks');
const destBlocks = path.resolve(__dirname, '../build/blocks');

// Files to copy for each block (if they exist)
const filesToCopy = ['helpers.php', 'style.css', 'editor.css'];

// Get all block directories (exclude utils)
const blockDirs = fs.readdirSync(srcBlocks).filter((dir) => {
	const stat = fs.statSync(path.join(srcBlocks, dir));
	return stat.isDirectory() && dir !== 'utils';
});

let copiedCount = 0;

blockDirs.forEach((blockDir) => {
	const srcBlockPath = path.join(srcBlocks, blockDir);
	const destBlockPath = path.join(destBlocks, blockDir);

	// Ensure destination directory exists
	if (!fs.existsSync(destBlockPath)) {
		fs.mkdirSync(destBlockPath, { recursive: true });
	}

	filesToCopy.forEach((file) => {
		const srcFile = path.join(srcBlockPath, file);
		const destFile = path.join(destBlockPath, file);

		if (fs.existsSync(srcFile)) {
			fs.copyFileSync(srcFile, destFile);
			console.log(`✓ Copied: ${blockDir}/${file}`);
			copiedCount++;
		}
	});
});

console.log(`\nCopied ${copiedCount} additional block assets.`);
