<?php
/**
 * BLOCK_TITLE - Unit tests.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OMB\Tests\Blocks;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;

require_once OMB_PATH . '/PATH/TO/helpers.php';

class BLOCK_CLASSTest extends TestCase {

	#[Test]
	public function it_returns_empty_array_when_no_data(): void {
		// Arrange
		$input = [];

		// Act
		$result = get_BLOCK_NAME_data( 1 );

		// Assert
		$this->assertIsArray( $result );
	}

	#[Test]
	#[DataProvider( 'inputProvider' )]
	public function it_handles_various_inputs( mixed $input, mixed $expected ): void {
		// Test with data provider
		$this->assertEquals( $expected, $input );
	}

	public static function inputProvider(): array {
		return [
			'case 1' => [ 'input1', 'input1' ],
			'case 2' => [ 'input2', 'input2' ],
		];
	}
}
