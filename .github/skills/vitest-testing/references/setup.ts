/**
 * Vitest test setup file.
 *
 * @package theme-oh-my-brand
 */

import { beforeEach, vi } from 'vitest';

// Reset DOM before each test
beforeEach(() => {
	document.body.innerHTML = '';
	document.head.innerHTML = '';
	vi.clearAllMocks();
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock IntersectionObserver
class MockIntersectionObserver {
	readonly root: Element | null = null;
	readonly rootMargin: string = '';
	readonly thresholds: ReadonlyArray<number> = [];

	constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}

	observe(_target: Element): void {}
	unobserve(_target: Element): void {}
	disconnect(): void {}
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// Mock ResizeObserver
class MockResizeObserver {
	constructor(_callback: ResizeObserverCallback) {}
	observe(_target: Element): void {}
	unobserve(_target: Element): void {}
	disconnect(): void {}
}

vi.stubGlobal('ResizeObserver', MockResizeObserver);

// Mock requestAnimationFrame
vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
	return setTimeout(() => callback(Date.now()), 0);
});

vi.stubGlobal('cancelAnimationFrame', (id: number) => {
	clearTimeout(id);
});

// Mock scroll methods
Element.prototype.scrollTo = vi.fn();
Element.prototype.scrollBy = vi.fn();
