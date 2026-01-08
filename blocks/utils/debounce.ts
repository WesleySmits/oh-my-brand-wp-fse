/**
 * Creates a debounced function that delays invoking func until after wait
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param func  The function to debounce.
 * @param delay The number of milliseconds to delay.
 * @return     The debounced function.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
	func: T,
	delay: number = 100
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;

	return function (this: unknown, ...args: Parameters<T>): void {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), delay);
	};
}

export default debounce;
