<?php
/**
 * Gallery Helpers - PHPUnit tests.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OMB\Tests\Blocks;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;

require_once OMB_PATH . '/src/blocks/gallery/helpers.php';

class GalleryHelpersTest extends TestCase {

	#[Test]
	public function get_block_gap_returns_empty_for_missing_value(): void {
		// Arrange
		$attributes = [];

		// Act
		$result = omb_gallery_get_block_gap( $attributes );

		// Assert
		$this->assertEmpty( $result );
	}

	#[Test]
	public function get_block_gap_handles_preset_values(): void {
		$attributes = [
			'style' => [
				'spacing' => [
					'blockGap' => 'var:preset|spacing|20',
				],
			],
		];

		$result = omb_gallery_get_block_gap( $attributes );

		$this->assertEquals( 'var(--wp--preset--spacing--20)', $result );
	}

	#[Test]
	public function get_block_gap_returns_raw_value(): void {
		$attributes = [
			'style' => [
				'spacing' => [
					'blockGap' => '2rem',
				],
			],
		];

		$result = omb_gallery_get_block_gap( $attributes );

		$this->assertEquals( '2rem', $result );
	}
}
