/**
 * Breadcrumbs block frontend interactivity.
 *
 * Handles ellipsis expansion on mobile devices.
 *
 * @package
 */

const BLOCK_SELECTOR = '.wp-block-theme-oh-my-brand-breadcrumbs--truncatable';
const ELLIPSIS_SELECTOR = '.wp-block-theme-oh-my-brand-breadcrumbs__ellipsis';
const EXPANDED_CLASS = 'wp-block-theme-oh-my-brand-breadcrumbs--expanded';

/**
 * Initialize breadcrumbs ellipsis expansion.
 */
function initBreadcrumbs(): void {
	const blocks = document.querySelectorAll< HTMLElement >( BLOCK_SELECTOR );

	blocks.forEach( ( block ) => {
		const ellipsisButton =
			block.querySelector< HTMLButtonElement >( ELLIPSIS_SELECTOR );

		if ( ! ellipsisButton ) {
			return;
		}

		ellipsisButton.addEventListener( 'click', () => {
			const isExpanded = block.classList.contains( EXPANDED_CLASS );

			block.classList.toggle( EXPANDED_CLASS );
			ellipsisButton.setAttribute(
				'aria-expanded',
				String( ! isExpanded )
			);
		} );
	} );
}

// Initialize on DOM ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initBreadcrumbs );
} else {
	initBreadcrumbs();
}
