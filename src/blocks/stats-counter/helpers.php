<?php
/**
 * Stats Counter Block - Helper Functions
 *
 * @package theme-oh-my-brand
 */

declare(strict_types=1);

if ( ! function_exists( 'omb_stats_render_stat' ) ) {
	/**
	 * Render a single stat item.
	 *
	 * @param array<string, mixed> $stat       Stat data.
	 * @param bool                 $show_icons Whether to show icons.
	 * @return string Rendered stat HTML.
	 */
	function omb_stats_render_stat( array $stat, bool $show_icons ): string {
		$value         = $stat['value'] ?? 0;
		$prefix        = $stat['prefix'] ?? '';
		$suffix        = $stat['suffix'] ?? '';
		$decimals      = $stat['decimals'] ?? 0;
		$label         = $stat['label'] ?? '';
		$icon          = $stat['icon'] ?? '';
		$is_currency   = $stat['isCurrency'] ?? false;
		$currency_code = $stat['currencyCode'] ?? 'USD';
		$locale        = $stat['locale'] ?? 'en-US';

		// Return empty if no value and no label.
		if ( empty( $value ) && empty( $label ) ) {
			return '';
		}

		// Format the number for aria-label (final value, accessible).
		$formatted_value = omb_stats_format_number( $value, $decimals, $is_currency, $currency_code, $locale );
		$aria_label      = $formatted_value . ( ! $is_currency ? $suffix : '' ) . ' ' . $label;

		// Build data attributes for the number element.
		$data_attrs = sprintf(
			'data-counter data-target="%s" data-decimals="%d" data-suffix="%s" data-currency="%s" data-currency-code="%s" data-locale="%s"',
			esc_attr( (string) $value ),
			$decimals,
			esc_attr( $suffix ),
			$is_currency ? 'true' : 'false',
			esc_attr( $currency_code ),
			esc_attr( $locale )
		);

		ob_start();
		?>
		<div class="wp-block-theme-oh-my-brand-stats-counter__item">
			<?php if ( $show_icons && ! empty( $icon ) ) : ?>
				<span class="wp-block-theme-oh-my-brand-stats-counter__icon" aria-hidden="true">
					<?php echo esc_html( $icon ); ?>
				</span>
			<?php endif; ?>

			<dt class="wp-block-theme-oh-my-brand-stats-counter__label">
				<?php echo esc_html( $label ); ?>
			</dt>

			<dd
				class="wp-block-theme-oh-my-brand-stats-counter__number"
				role="text"
				aria-label="<?php echo esc_attr( $aria_label ); ?>"
				style="--target-value: <?php echo esc_attr( (string) round( $value ) ); ?>;"
				<?php echo $data_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped above. ?>
			>
				<?php
				// Initial value shown before JS loads (fallback).
				echo esc_html( $formatted_value . ( ! $is_currency ? $suffix : '' ) );
				?>
			</dd>
		</div>
		<?php
		return ob_get_clean();
	}
}

if ( ! function_exists( 'omb_stats_format_number' ) ) {
	/**
	 * Format a number using NumberFormatter (similar to Intl.NumberFormat).
	 *
	 * @param float  $value         The number to format.
	 * @param int    $decimals      Number of decimal places.
	 * @param bool   $is_currency   Whether to format as currency.
	 * @param string $currency_code ISO 4217 currency code.
	 * @param string $locale        Locale string (e.g., 'en-US').
	 * @return string Formatted number string.
	 */
	function omb_stats_format_number(
		float $value,
		int $decimals,
		bool $is_currency,
		string $currency_code,
		string $locale
	): string {
		// Convert locale format (e.g., 'en-US' to 'en_US').
		$php_locale = str_replace( '-', '_', $locale );

		if ( $is_currency && class_exists( 'NumberFormatter' ) ) {
			$formatter = new NumberFormatter( $php_locale, NumberFormatter::CURRENCY );
			$formatter->setAttribute( NumberFormatter::FRACTION_DIGITS, $decimals );
			$result = $formatter->formatCurrency( $value, $currency_code );
			return false !== $result ? $result : number_format( $value, $decimals );
		}

		if ( class_exists( 'NumberFormatter' ) ) {
			$formatter = new NumberFormatter( $php_locale, NumberFormatter::DECIMAL );
			$formatter->setAttribute( NumberFormatter::FRACTION_DIGITS, $decimals );
			$result = $formatter->format( $value );
			return false !== $result ? $result : number_format( $value, $decimals );
		}

		// Fallback to basic number_format.
		return number_format( $value, $decimals );
	}
}
