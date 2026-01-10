import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing.
 *
 * Local development: Uses Local by Flywheel site (demo-site.local)
 * CI environment: Uses wp-env (localhost:8888)
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig( {
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [ [ 'html', { open: 'never' } ], [ 'list' ] ],

	use: {
		// Local by Flywheel URL for local dev, wp-env URL for CI
		baseURL: process.env.WP_BASE_URL || 'http://demo-site.local',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices[ 'Desktop Chrome' ] },
		},
		{
			name: 'webkit',
			use: { ...devices[ 'Desktop Safari' ] },
		},
		// Mobile viewports
		{
			name: 'mobile-chrome',
			use: { ...devices[ 'Pixel 5' ] },
		},
		{
			name: 'mobile-safari',
			use: { ...devices[ 'iPhone 12' ] },
		},
	],

	// Web server configuration (optional - for CI with wp-env)
	// Uncomment if using wp-env locally
	// webServer: {
	//     command: 'npx wp-env start',
	//     url: 'http://localhost:8888',
	//     reuseExistingServer: !process.env.CI,
	//     timeout: 120 * 1000
	// }
} );
