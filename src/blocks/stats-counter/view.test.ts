/**
 * Stats Counter Block - View Script Tests
 *
 * @package
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import the Web Component to register it.
import './view';

describe('OmbStatsCounter', () => {
	let container: HTMLElement;

	beforeEach(() => {
		// Mock matchMedia globally for all tests.
		vi.stubGlobal(
			'matchMedia',
			vi.fn().mockImplementation(() => ({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			}))
		);

		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(() => {
		container.remove();
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	describe('registration', () => {
		it('should register the custom element', () => {
			expect(customElements.get('omb-stats-counter')).toBeDefined();
		});

		it('should create an instance of the custom element', () => {
			container.innerHTML = '<omb-stats-counter></omb-stats-counter>';
			const element = container.querySelector('omb-stats-counter');
			expect(element).toBeInstanceOf(HTMLElement);
		});
	});

	describe('visibility class', () => {
		it('should add is-visible class when animate is false', async () => {
			container.innerHTML = `
				<omb-stats-counter data-animate="false">
					<span data-counter data-target="100" data-decimals="0" data-currency="false" data-locale="en-US"></span>
				</omb-stats-counter>
			`;

			const element = container.querySelector('omb-stats-counter') as HTMLElement;

			// Wait for connectedCallback to execute.
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(element.classList.contains('is-visible')).toBe(true);
		});

		it('should not add is-visible class immediately when animate is true', async () => {
			// Mock IntersectionObserver.
			const mockObserve = vi.fn();
			const mockDisconnect = vi.fn();

			vi.stubGlobal(
				'IntersectionObserver',
				vi.fn().mockImplementation(() => ({
					observe: mockObserve,
					disconnect: mockDisconnect,
					unobserve: vi.fn()
				}))
			);

			container.innerHTML = `
				<omb-stats-counter data-animate="true">
					<span data-counter data-target="100"></span>
				</omb-stats-counter>
			`;

			const element = container.querySelector('omb-stats-counter') as HTMLElement;

			await new Promise((resolve) => setTimeout(resolve, 0));

			// Should set up observer, not add class immediately.
			expect(mockObserve).toHaveBeenCalled();
			expect(element.classList.contains('is-visible')).toBe(false);
		});

		it('should add is-visible class immediately when prefers-reduced-motion is set', async () => {
			// Mock matchMedia to return reduced motion preference.
			vi.stubGlobal(
				'matchMedia',
				vi.fn().mockImplementation(() => ({
					matches: true,
					addEventListener: vi.fn(),
					removeEventListener: vi.fn()
				}))
			);

			container.innerHTML = `
				<omb-stats-counter data-animate="true">
					<span data-counter data-target="100"></span>
				</omb-stats-counter>
			`;

			const element = container.querySelector('omb-stats-counter') as HTMLElement;

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(element.classList.contains('is-visible')).toBe(true);
		});
	});

	describe('number formatting', () => {
		/**
		 * Helper to create a stats counter element and wait for it to be upgraded.
		 * Using document.createElement ensures the connectedCallback runs immediately.
		 * @param counterAttrs
		 */
		function createStatsCounter(counterAttrs: Record<string, string>): HTMLElement {
			const element = document.createElement('omb-stats-counter') as HTMLElement;
			element.dataset.animate = 'false';

			const counter = document.createElement('span');
			counter.dataset.counter = '';
			Object.entries(counterAttrs).forEach(([key, value]) => {
				counter.dataset[key] = value;
			});

			element.appendChild(counter);
			container.appendChild(element);

			return counter;
		}

		it('should format decimal numbers correctly', () => {
			const counter = createStatsCounter({
				target: '1234.56',
				decimals: '2',
				currency: 'false',
				locale: 'en-US',
				suffix: ''
			});

			expect(counter.textContent).toBe('1,234.56');
		});

		it('should format currency correctly (USD)', () => {
			const counter = createStatsCounter({
				target: '2500',
				decimals: '0',
				currency: 'true',
				currencyCode: 'USD',
				locale: 'en-US',
				suffix: ''
			});

			expect(counter.textContent).toBe('$2,500');
		});

		it('should format currency correctly (EUR with German locale)', () => {
			const counter = createStatsCounter({
				target: '1234.50',
				decimals: '2',
				currency: 'true',
				currencyCode: 'EUR',
				locale: 'de-DE',
				suffix: ''
			});

			// German locale uses period for thousands and comma for decimals.
			expect(counter.textContent).toContain('€');
			expect(counter.textContent).toContain('1.234,50');
		});

		it('should append suffix for non-currency numbers', () => {
			const counter = createStatsCounter({
				target: '500',
				decimals: '0',
				currency: 'false',
				locale: 'en-US',
				suffix: '+'
			});

			expect(counter.textContent).toBe('500+');
		});

		it('should not append suffix for currency numbers', () => {
			const counter = createStatsCounter({
				target: '100',
				decimals: '0',
				currency: 'true',
				currencyCode: 'USD',
				locale: 'en-US',
				suffix: '+'
			});

			expect(counter.textContent).toBe('$100');
			expect(counter.textContent).not.toContain('+');
		});
	});

	describe('IntersectionObserver', () => {
		it('should start animation and disconnect observer after becoming visible', async () => {
			const mockDisconnect = vi.fn();
			let observerCallback: IntersectionObserverCallback | null = null;

			vi.stubGlobal(
				'IntersectionObserver',
				vi.fn().mockImplementation((callback: IntersectionObserverCallback) => {
					observerCallback = callback;
					return {
						observe: vi.fn(),
						disconnect: mockDisconnect,
						unobserve: vi.fn()
					};
				})
			);

			container.innerHTML = `
				<omb-stats-counter data-animate="true" data-duration="2000">
					<span data-counter data-target="100"></span>
				</omb-stats-counter>
			`;

			const element = container.querySelector('omb-stats-counter') as HTMLElement;

			await new Promise((resolve) => setTimeout(resolve, 0));

			// Simulate intersection.
			observerCallback!(
				[{ isIntersecting: true, target: element } as unknown as IntersectionObserverEntry],
				{} as IntersectionObserver
			);

			// Should disconnect observer after intersection.
			expect(mockDisconnect).toHaveBeenCalled();
		});

		it('should not start animation when not intersecting', async () => {
			let observerCallback: IntersectionObserverCallback | null = null;

			vi.stubGlobal(
				'IntersectionObserver',
				vi.fn().mockImplementation((callback: IntersectionObserverCallback) => {
					observerCallback = callback;
					return {
						observe: vi.fn(),
						disconnect: vi.fn(),
						unobserve: vi.fn()
					};
				})
			);

			container.innerHTML = `
				<omb-stats-counter data-animate="true" data-duration="2000">
					<span data-counter data-target="100"></span>
				</omb-stats-counter>
			`;

			const element = container.querySelector('omb-stats-counter') as HTMLElement;

			await new Promise((resolve) => setTimeout(resolve, 0));

			// Simulate NOT intersecting.
			observerCallback!(
				[{ isIntersecting: false, target: element } as unknown as IntersectionObserverEntry],
				{} as IntersectionObserver
			);

			expect(element.classList.contains('is-visible')).toBe(false);
		});
	});

	describe('cleanup', () => {
		it('should disconnect observer on disconnectedCallback', async () => {
			const mockDisconnect = vi.fn();

			vi.stubGlobal(
				'IntersectionObserver',
				vi.fn().mockImplementation(() => ({
					observe: vi.fn(),
					disconnect: mockDisconnect,
					unobserve: vi.fn()
				}))
			);

			container.innerHTML = `
				<omb-stats-counter data-animate="true">
					<span data-counter data-target="100"></span>
				</omb-stats-counter>
			`;

			await new Promise((resolve) => setTimeout(resolve, 0));

			// Remove element to trigger disconnectedCallback.
			const element = container.querySelector('omb-stats-counter');
			element?.remove();

			expect(mockDisconnect).toHaveBeenCalled();
		});
	});
});
