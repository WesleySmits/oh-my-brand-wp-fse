module.exports = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
	ignorePatterns: [
		'node_modules/**',
		'vendor/**',
		'assets/js/**',
		'build/**',
		'*.min.js',
		'coverage/**',
		'blocks/**'
	],
	rules: {
		'no-console': ['warn', { allow: ['warn', 'error'] }],
		'prefer-const': 'error',
		'no-var': 'error'
	},
	overrides: [
		{
			files: ['*.config.js', 'webpack.config.js'],
			env: {
				node: true
			}
		}
	]
};
