<?php
/**
 * FAQ Helpers - PHPUnit tests.
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

namespace OMB\Tests\Blocks;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;

require_once OMB_PATH . '/blocks/acf-faq/helpers.php';

class FaqHelpersTest extends TestCase {

	#[Test]
	public function generate_faq_json_ld_returns_valid_json(): void {
		$faq_items = [
			[
				'question' => 'What is ACF?',
				'answer'   => 'Advanced Custom Fields.',
			],
			[
				'question' => 'Is it free?',
				'answer'   => 'ACF has free and PRO versions.',
			],
		];

		$result  = generate_faq_json_ld( $faq_items );
		$decoded = json_decode( $result, true );

		$this->assertNotNull( $decoded );
		$this->assertEquals( 'https://schema.org', $decoded['@context'] );
		$this->assertEquals( 'FAQPage', $decoded['@type'] );
	}

	#[Test]
	public function generate_faq_json_ld_includes_all_items(): void {
		$faq_items = [
			[
				'question' => 'Q1',
				'answer'   => 'A1',
			],
			[
				'question' => 'Q2',
				'answer'   => 'A2',
			],
		];

		$result  = generate_faq_json_ld( $faq_items );
		$decoded = json_decode( $result, true );

		$this->assertCount( 2, $decoded['mainEntity'] );
	}

	#[Test]
	public function generate_faq_json_ld_returns_empty_for_no_items(): void {
		$result = generate_faq_json_ld( [] );

		$this->assertEmpty( $result );
	}

	#[Test]
	public function generate_faq_json_ld_escapes_html(): void {
		$faq_items = [
			[
				'question' => '<script>alert("xss")</script>',
				'answer'   => 'Safe answer',
			],
		];

		$result = generate_faq_json_ld( $faq_items );

		$this->assertStringNotContainsString( '<script>', $result );
	}
}
