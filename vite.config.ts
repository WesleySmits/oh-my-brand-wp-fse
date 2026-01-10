import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname( fileURLToPath( import.meta.url ) );

export default {
	build: {
		lib: {
			entry: {
				gallery: resolve(
					__dirname,
					'blocks/acf-gallery-block/index.ts'
				),
			},
			formats: [ 'es' ],
			name: 'OhMyBrandBlocks',
		},
		outDir: 'assets/js',
		minify: 'terser',
		terserOptions: {
			keep_classnames: true,
		},
		rollupOptions: {
			output: {
				entryFileNames: '[name].js',
			},
		},
		emptyOutDir: false,
	},
};
