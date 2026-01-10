<?php
/**
 * PHPUnit bootstrap file for WordPress theme testing.
 *
 * @package Oh_My_Brand
 */

declare(strict_types=1);

// Define test constant (guard against multiple definitions)
if ( ! defined( 'OMB_TESTING' ) ) {
    define( 'OMB_TESTING', true );
}

// Load Composer autoloader
$composer_autoload = dirname(__DIR__, 2) . '/vendor/autoload.php';
if (file_exists($composer_autoload)) {
    require_once $composer_autoload;
}

// Path to WordPress test library
$_tests_dir = getenv('WP_TESTS_DIR');

if (! $_tests_dir) {
    // Try wp-phpunit package location
    $_tests_dir = dirname(__DIR__, 2) . '/vendor/wp-phpunit/wp-phpunit';
}

if (! file_exists($_tests_dir . '/includes/functions.php')) {
    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    echo "Could not find WordPress test library at {$_tests_dir}/includes/functions.php\n";
    echo "Please run: bash bin/install-wp-tests.sh <db-name> <db-user> <db-pass> [db-host]\n";
    exit(1);
}

// Give access to tests_add_filter() function
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the theme being tested.
 */
tests_add_filter(
    'setup_theme',
    function (): void {
        // Point to the theme directory
        $theme_dir = dirname(__DIR__, 2);
        register_theme_directory(dirname($theme_dir));

        // Switch to the theme
        switch_theme('oh-my-brand');
    }
);

/**
 * Mock ACF functions if Advanced Custom Fields is not available.
 */
if (! function_exists('get_field')) {
    /**
     * Mock get_field function.
     *
     * @param string     $field   Field name.
     * @param int|string $post_id Post ID or 'option'.
     * @return mixed
     */
    function get_field(string $field, $post_id = null): mixed {
        return apply_filters('acf/load_value', null, $post_id, ['name' => $field]);
    }
}

if (! function_exists('get_fields')) {
    /**
     * Mock get_fields function.
     *
     * @param int|string $post_id Post ID or 'option'.
     * @return array|false
     */
    function get_fields($post_id = null): array|false {
        return apply_filters('acf/load_value/all', [], $post_id);
    }
}

if (! function_exists('have_rows')) {
    /**
     * Mock have_rows function.
     *
     * @param string     $field   Field name.
     * @param int|string $post_id Post ID or 'option'.
     * @return bool
     */
    function have_rows(string $field, $post_id = null): bool {
        return false;
    }
}

if (! function_exists('the_row')) {
    /**
     * Mock the_row function.
     *
     * @return void
     */
    function the_row(): void {
        // Mock implementation
    }
}

if (! function_exists('get_sub_field')) {
    /**
     * Mock get_sub_field function.
     *
     * @param string $field Field name.
     * @return mixed
     */
    function get_sub_field(string $field): mixed {
        return null;
    }
}

// Start up the WP testing environment
require $_tests_dir . '/includes/bootstrap.php';
