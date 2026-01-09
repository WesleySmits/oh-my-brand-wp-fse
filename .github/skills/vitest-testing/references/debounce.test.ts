/**
 * Debounce utility unit test template.
 *
 * @package theme-oh-my-brand
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should delay function execution', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 100);

		debounced();

		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should only call once for rapid invocations', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 100);

		debounced();
		debounced();
		debounced();

		vi.advanceTimersByTime(100);

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should pass arguments to callback', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 100);

		debounced('arg1', 'arg2');

		vi.advanceTimersByTime(100);

		expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
	});

	it('should reset timer on subsequent calls', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 100);

		debounced();
		vi.advanceTimersByTime(50);

		debounced();
		vi.advanceTimersByTime(50);

		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(50);

		expect(callback).toHaveBeenCalledTimes(1);
	});
});
