<?php
/**
 * Test case for Gallery Block helpers.
 *
 * @package Oh_My_Brand
 */

declare(strict_types=1);

namespace OMB\Tests\Blocks;

use WP_UnitTestCase;

/**
 * Gallery Block Test Class.
 */
class GalleryBlockTest extends WP_UnitTestCase {

    /**
     * Set up test fixtures.
     */
    public function set_up(): void {
        parent::set_up();

        // Load the gallery helpers
        $helpers_file = get_stylesheet_directory() . '/blocks/acf-gallery-block/helpers.php';
        if (file_exists($helpers_file)) {
            require_once $helpers_file;
        }
    }

    /**
     * Test that helper functions exist.
     */
    public function test_helper_functions_exist(): void {
        $this->assertTrue(
            function_exists('OMB\Blocks\Gallery\get_gallery_data'),
            'get_gallery_data function should exist'
        );

        $this->assertTrue(
            function_exists('OMB\Blocks\Gallery\parse_wrapper_attributes'),
            'parse_wrapper_attributes function should exist'
        );
    }

    /**
     * Test get_gallery_data returns array structure.
     */
    public function test_get_gallery_data_returns_array(): void {
        $post_id = self::factory()->post->create();

        $result = \OMB\Blocks\Gallery\get_gallery_data($post_id);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('gallery', $result);
        $this->assertArrayHasKey('visible_images', $result);
        $this->assertArrayHasKey('is_editor', $result);
    }

    /**
     * Test default visible images value.
     */
    public function test_get_gallery_data_default_visible_images(): void {
        $post_id = self::factory()->post->create();

        $result = \OMB\Blocks\Gallery\get_gallery_data($post_id);

        $this->assertEquals(3, $result['visible_images']);
    }

    /**
     * Test is_editor detection.
     */
    public function test_get_gallery_data_is_editor_false_by_default(): void {
        $post_id = self::factory()->post->create();

        $result = \OMB\Blocks\Gallery\get_gallery_data($post_id);

        $this->assertFalse($result['is_editor']);
    }

    /**
     * Test parse_wrapper_attributes returns array.
     */
    public function test_parse_wrapper_attributes_returns_array(): void {
        $block = [
            'name'      => 'acf/acf-gallery-block',
            'className' => 'custom-class',
        ];

        $result = \OMB\Blocks\Gallery\parse_wrapper_attributes($block, true);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('class', $result);
    }

    /**
     * Test wrapper attributes include custom class.
     */
    public function test_parse_wrapper_attributes_includes_custom_class(): void {
        $block = [
            'name'      => 'acf/acf-gallery-block',
            'className' => 'my-custom-class',
        ];

        $result = \OMB\Blocks\Gallery\parse_wrapper_attributes($block, false);

        $this->assertStringContainsString('my-custom-class', $result['class'] ?? '');
    }

    /**
     * Test wrapper attributes in preview mode.
     */
    public function test_parse_wrapper_attributes_in_preview(): void {
        $block = [
            'name' => 'acf/acf-gallery-block',
        ];

        $result = \OMB\Blocks\Gallery\parse_wrapper_attributes($block, true);

        // In preview mode, style should contain pointer-events
        $this->assertArrayHasKey('style', $result);
        $this->assertStringContainsString('pointer-events', $result['style']);
    }

    /**
     * Test gallery data with empty gallery.
     */
    public function test_get_gallery_data_handles_empty_gallery(): void {
        $post_id = self::factory()->post->create();

        // Mock ACF returning empty gallery
        add_filter('acf/load_value', fn() => [], 10);

        $result = \OMB\Blocks\Gallery\get_gallery_data($post_id);

        $this->assertIsArray($result['gallery']);
        $this->assertEmpty($result['gallery']);

        remove_all_filters('acf/load_value');
    }
}
