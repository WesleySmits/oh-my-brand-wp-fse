<?php
/**
 * DataProvider examples - PHPUnit tests.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OMB\Tests\Blocks;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;

class DataProviderTest extends TestCase {

	#[Test]
	#[DataProvider( 'alignmentProvider' )]
	public function it_applies_alignment_class( string $align, string $expectedClass ): void {
		$attributes = [ 'align' => $align ];

		// Build class string
		$classes = [ 'wp-block-theme-oh-my-brand-gallery' ];
		if ( $align ) {
			$classes[] = "align{$align}";
		}

		$this->assertContains( $expectedClass, $classes );
	}

	public static function alignmentProvider(): array {
		return [
			'wide alignment'   => [ 'wide', 'alignwide' ],
			'full alignment'   => [ 'full', 'alignfull' ],
			'center alignment' => [ 'center', 'aligncenter' ],
		];
	}

	#[Test]
	#[DataProvider( 'visibleImagesProvider' )]
	public function it_clamps_visible_images( int $input, int $expected ): void {
		$clamped = max( 1, min( $input, 6 ) );

		$this->assertEquals( $expected, $clamped );
	}

	public static function visibleImagesProvider(): array {
		return [
			'below minimum' => [ 0, 1 ],
			'at minimum'    => [ 1, 1 ],
			'in range'      => [ 3, 3 ],
			'at maximum'    => [ 6, 6 ],
			'above maximum' => [ 10, 6 ],
		];
	}

	#[Test]
	#[DataProvider( 'spacingPresetsProvider' )]
	public function it_converts_spacing_presets( string $input, string $expected ): void {
		$result = omb_gallery_get_block_gap( [ 'style' => [ 'spacing' => [ 'blockGap' => $input ] ] ] );

		$this->assertEquals( $expected, $result );
	}

	public static function spacingPresetsProvider(): array {
		return [
			'preset 10' => [ 'var:preset|spacing|10', 'var(--wp--preset--spacing--10)' ],
			'preset 20' => [ 'var:preset|spacing|20', 'var(--wp--preset--spacing--20)' ],
			'preset 40' => [ 'var:preset|spacing|40', 'var(--wp--preset--spacing--40)' ],
			'raw rem'   => [ '2rem', '2rem' ],
			'raw px'    => [ '16px', '16px' ],
		];
	}
}
