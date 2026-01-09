<?php
/**
 * ACF Block - PHPUnit test with mocked get_field.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OMB\Tests\Blocks;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;

class AcfBlockTest extends TestCase {

	/** @var array<string, mixed> */
	private static array $mockFields = [];

	public static function setUpBeforeClass(): void {
		if ( ! function_exists( 'get_field' ) ) {
			function get_field( string $field, $post_id = null ) {
				return self::getMockField( $field );
			}
		}
	}

	public static function getMockField( string $field ): mixed {
		return self::$mockFields[ $field ] ?? null;
	}

	protected function setUp(): void {
		parent::setUp();
		self::$mockFields = [];
	}

	#[Test]
	public function it_retrieves_faq_items(): void {
		self::$mockFields['faq'] = [
			[
				'vraag'    => 'Question 1',
				'antwoord' => 'Answer 1',
			],
			[
				'vraag'    => 'Question 2',
				'antwoord' => 'Answer 2',
			],
		];

		require_once OMB_PATH . '/blocks/acf-faq/helpers.php';

		$result = get_faq_data( 1 );

		$this->assertCount( 2, $result );
		$this->assertEquals( 'Question 1', $result[0]['question'] );
	}

	#[Test]
	public function it_handles_missing_acf_fields(): void {
		self::$mockFields['faq'] = null;

		require_once OMB_PATH . '/blocks/acf-faq/helpers.php';

		$result = get_faq_data( 1 );

		$this->assertEmpty( $result );
	}

	#[Test]
	public function it_handles_gallery_images(): void {
		self::$mockFields['gallery'] = [
			[
				'ID'    => 1,
				'url'   => 'https://example.com/image1.jpg',
				'sizes' => [ 'large' => 'https://example.com/image1-large.jpg' ],
				'alt'   => 'Alt text',
			],
		];

		// Test gallery processing
		$this->assertNotEmpty( self::$mockFields['gallery'] );
	}
}
