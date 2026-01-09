/** @type {import('@commitlint/types').UserConfig} */
export default {
	extends: [ '@commitlint/config-conventional' ],
	rules: {
		// Allowed commit types
		'type-enum': [
			2,
			'always',
			[
				'feat', // New feature
				'fix', // Bug fix
				'docs', // Documentation only
				'style', // Formatting, CSS (no code logic change)
				'refactor', // Code refactoring
				'perf', // Performance improvement
				'test', // Adding/updating tests
				'build', // Build system or dependencies
				'ci', // CI configuration
				'chore', // Maintenance tasks
				'revert' // Revert a previous commit
			]
		],

		// Recommended scopes for this theme
		'scope-enum': [
			1, // Warning only (allows custom scopes)
			'always',
			[
				'blocks', // Block-related changes
				'gallery', // Gallery block
				'faq', // FAQ block
				'youtube', // YouTube block
				'theme', // Theme configuration
				'assets', // CSS/JS assets
				'acf', // ACF configuration
				'deps', // Dependencies
				'config', // Configuration files
				'ci', // CI/CD
				'vscode', // VSCode settings
				'skills', // Agent skills documentation
				'docs' // Documentation
			]
		],

		// Subject formatting
		'subject-case': [ 2, 'always', 'sentence-case' ],
		'subject-empty': [ 2, 'never' ],
		'subject-full-stop': [ 2, 'never', '.' ],

		// Header length
		'header-max-length': [ 2, 'always', 100 ],

		// Body formatting
		'body-leading-blank': [ 2, 'always' ],
		'body-max-line-length': [ 2, 'always', 100 ],

		// Footer formatting
		'footer-leading-blank': [ 2, 'always' ]
	},
	prompt: {
		questions: {
			type: {
				description: 'Select the type of change you are committing'
			},
			scope: {
				description: 'What is the scope of this change (e.g., blocks, gallery, theme)?'
			},
			subject: {
				description: 'Write a short, imperative description of the change'
			}
		}
	}
};
