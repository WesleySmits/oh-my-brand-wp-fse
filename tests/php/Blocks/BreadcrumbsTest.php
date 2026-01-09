<?php
/**
 * Breadcrumbs block tests.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OMB\Tests\Blocks;

use WP_UnitTestCase;

/**
 * Test class for Breadcrumbs block helper functions.
 */
class BreadcrumbsTest extends WP_UnitTestCase {

	/**
	 * Set up test fixtures.
	 */
	public function set_up(): void {
		parent::set_up();
		require_once get_stylesheet_directory() . '/src/blocks/breadcrumbs/helpers.php';
	}

	/**
	 * Test that helper functions exist.
	 */
	public function test_helper_functions_exist(): void {
		$this->assertTrue( function_exists( 'omb_breadcrumbs_get_trail' ) );
		$this->assertTrue( function_exists( 'omb_breadcrumbs_get_singular_trail' ) );
		$this->assertTrue( function_exists( 'omb_breadcrumbs_get_page_ancestors' ) );
		$this->assertTrue( function_exists( 'omb_breadcrumbs_get_primary_term' ) );
		$this->assertTrue( function_exists( 'omb_breadcrumbs_render_item' ) );
		$this->assertTrue( function_exists( 'omb_breadcrumbs_get_schema' ) );
	}

	/**
	 * Test breadcrumb trail returns array.
	 */
	public function test_get_trail_returns_array(): void {
		$attributes = [
			'showHome'    => true,
			'homeLabel'   => 'Home',
			'showCurrent' => true,
		];

		$result = omb_breadcrumbs_get_trail( $attributes );

		$this->assertIsArray( $result );
	}

	/**
	 * Test home item is included when showHome is true.
	 */
	public function test_home_item_included_when_enabled(): void {
		$attributes = [
			'showHome'  => true,
			'homeLabel' => 'Home',
		];

		$result = omb_breadcrumbs_get_trail( $attributes );

		$this->assertNotEmpty( $result );
		$this->assertEquals( 'Home', $result[0]['label'] );
	}

	/**
	 * Test home item uses custom label.
	 */
	public function test_home_item_uses_custom_label(): void {
		$attributes = [
			'showHome'  => true,
			'homeLabel' => 'Start',
		];

		$result = omb_breadcrumbs_get_trail( $attributes );

		$this->assertEquals( 'Start', $result[0]['label'] );
	}

	/**
	 * Test home item not included when showHome is false.
	 */
	public function test_home_item_excluded_when_disabled(): void {
		$attributes = [
			'showHome' => false,
		];

		$result = omb_breadcrumbs_get_trail( $attributes );

		if ( ! empty( $result ) ) {
			$this->assertNotEquals( 'Home', $result[0]['label'] ?? '' );
		}
	}

	/**
	 * Test schema output is valid JSON.
	 */
	public function test_schema_output_is_valid_json(): void {
		$items = [
			[
				'label' => 'Home',
				'url'   => 'https://example.com/',
			],
			[
				'label' => 'Category',
				'url'   => 'https://example.com/category/',
			],
		];

		$schema_html = omb_breadcrumbs_get_schema( $items );

		// Extract JSON from script tag.
		preg_match( '/<script[^>]*>(.*?)<\/script>/s', $schema_html, $matches );
		$json = $matches[1] ?? '';

		$decoded = json_decode( $json, true );

		$this->assertNotNull( $decoded );
		$this->assertEquals( 'BreadcrumbList', $decoded['@type'] );
		$this->assertCount( 2, $decoded['itemListElement'] );
	}

	/**
	 * Test render item escapes HTML.
	 */
	public function test_render_item_escapes_html(): void {
		$item = [
			'label' => '<script>alert("xss")</script>',
			'url'   => 'https://example.com/',
		];

		$attributes = [
			'separator' => '›',
		];

		$html = omb_breadcrumbs_render_item( $item, 1, false, $attributes );

		$this->assertStringNotContainsString( '<script>', $html );
		$this->assertStringContainsString( '&lt;script&gt;', $html );
	}

	/**
	 * Test page ancestors are retrieved in correct order.
	 */
	public function test_page_ancestors_correct_order(): void {
		// Create parent page.
		$parent_id = self::factory()->post->create(
			[
				'post_type'  => 'page',
				'post_title' => 'Parent Page',
			]
		);

		// Create child page.
		$child_id = self::factory()->post->create(
			[
				'post_type'   => 'page',
				'post_title'  => 'Child Page',
				'post_parent' => $parent_id,
			]
		);

		$child_post = get_post( $child_id );
		$ancestors  = omb_breadcrumbs_get_page_ancestors( $child_post );

		$this->assertCount( 1, $ancestors );
		$this->assertEquals( 'Parent Page', $ancestors[0]['label'] );
	}
}
