/** @type {import('stylelint').Config} */
export default {
	extends: [ 'stylelint-config-standard' ],
	rules: {
		// WordPress uses various class naming patterns
		'selector-class-pattern': null,
		'custom-property-pattern': null,

		// Allow descending specificity (common in WordPress themes)
		'no-descending-specificity': null,

		// Allow longhand properties (sometimes clearer)
		'declaration-block-no-redundant-longhand-properties': null,

		// CSS Layers support
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'layer',
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
				],
			},
		],

		// Allow newer pseudo-classes (scroll markers, etc.)
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: [ 'target-current' ],
			},
		],

		// Allow empty blocks (useful for placeholders)
		'block-no-empty': null,

		// Color format consistency
		'color-function-notation': 'modern',
		'alpha-value-notation': 'percentage',

		// Font family naming
		'font-family-name-quotes': 'always-where-recommended',

		// Allow WordPress-style selectors
		'selector-id-pattern': null,

		// Declaration order (optional - can be strict if preferred)
		'declaration-empty-line-before': null,

		// Allow vendor prefixes (autoprefixer handles this, but allow manual ones)
		'property-no-vendor-prefix': null,
		'value-no-vendor-prefix': null,
	},
	ignoreFiles: [
		'node_modules/**',
		'vendor/**',
		'assets/js/**',
		'coverage/**',
		'**/*.min.css',
	],
};
