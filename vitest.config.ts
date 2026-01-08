import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig( {
	test: {
		globals: true,
		environment: 'happy-dom',
		include: [ 'blocks/**/*.test.ts', 'src/blocks/**/*.test.ts', 'tests/unit/**/*.test.ts' ],
		exclude: [ 'node_modules', 'vendor', 'assets' ],
		coverage: {
			provider: 'v8',
			reporter: [ 'text', 'json', 'html' ],
			reportsDirectory: './coverage',
			include: [ 'blocks/**/*.ts', 'src/blocks/**/*.ts' ],
			exclude: [ '**/*.test.ts', '**/index.ts', '**/*.d.ts' ]
		},
		setupFiles: [ './tests/setup.ts' ],
		testTimeout: 10000
	},
	resolve: {
		alias: {
			'@blocks': resolve( __dirname, './blocks' ),
			'@utils': resolve( __dirname, './blocks/utils' )
		}
	}
} );
