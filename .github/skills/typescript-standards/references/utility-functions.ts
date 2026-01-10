/**
 * Debounces a function call.
 *
 * Full example demonstrating:
 * - Generic type parameters
 * - Explicit return types
 * - Proper `this` context handling
 * - ReturnType utility type
 *
 * @param func - The function to debounce.
 * @param wait - The debounce delay in milliseconds.
 * @returns A debounced version of the function.
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *     console.log('Searching:', query);
 * }, 300);
 *
 * // Only executes once after 300ms of no calls
 * debouncedSearch('a');
 * debouncedSearch('ab');
 * debouncedSearch('abc'); // This one executes
 * ```
 */
export function debounce< T extends ( ...args: unknown[] ) => unknown >(
	func: T,
	wait: number
): ( ...args: Parameters< T > ) => void {
	let timeoutId: ReturnType< typeof setTimeout > | null = null;

	return function ( this: unknown, ...args: Parameters< T > ): void {
		if ( timeoutId !== null ) {
			clearTimeout( timeoutId );
		}

		timeoutId = setTimeout( () => {
			func.apply( this, args );
			timeoutId = null;
		}, wait );
	};
}

/**
 * Throttles a function call.
 *
 * Similar to debounce but executes at most once per wait period.
 *
 * @param func - The function to throttle.
 * @param wait - The throttle interval in milliseconds.
 * @returns A throttled version of the function.
 */
export function throttle< T extends ( ...args: unknown[] ) => unknown >(
	func: T,
	wait: number
): ( ...args: Parameters< T > ) => void {
	let lastCall = 0;

	return function ( this: unknown, ...args: Parameters< T > ): void {
		const now = Date.now();

		if ( now - lastCall >= wait ) {
			lastCall = now;
			func.apply( this, args );
		}
	};
}
