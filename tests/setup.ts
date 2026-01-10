/**
 * Vitest setup file for unit tests.
 *
 * This file is run before each test file and sets up the testing environment.
 */
import { beforeEach, vi } from 'vitest';

// Mock WordPress globals
vi.mock( '@wordpress/dom-ready', () => ( {
	default: ( callback: () => void ) => {
		// Execute callback immediately in tests
		callback();
	},
} ) );

// Reset DOM before each test
beforeEach( () => {
	document.body.innerHTML = '';
	document.head.innerHTML = '';

	// Reset any global state
	vi.clearAllMocks();
} );

// Mock window.matchMedia for responsive tests
Object.defineProperty( window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation( ( query: string ) => ( {
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // Deprecated
		removeListener: vi.fn(), // Deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	} ) ),
} );

// Mock IntersectionObserver
class MockIntersectionObserver {
	readonly root: Element | null = null;
	readonly rootMargin: string = '';
	readonly thresholds: ReadonlyArray< number > = [];

	/* eslint-disable @typescript-eslint/no-unused-vars, no-useless-constructor */
	constructor(
		_callback: IntersectionObserverCallback,
		_options?: IntersectionObserverInit
	) {}
	/* eslint-enable @typescript-eslint/no-unused-vars, no-useless-constructor */

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	observe( _target: Element ): void {
		// Mock implementation
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unobserve( _target: Element ): void {
		// Mock implementation
	}

	disconnect(): void {
		// Mock implementation
	}

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

vi.stubGlobal( 'IntersectionObserver', MockIntersectionObserver );

// Mock ResizeObserver
class MockResizeObserver {
	// eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-unused-vars
	constructor( _callback: ResizeObserverCallback ) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	observe( _target: Element ): void {
		// Mock implementation
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unobserve( _target: Element ): void {
		// Mock implementation
	}

	disconnect(): void {
		// Mock implementation
	}
}

vi.stubGlobal( 'ResizeObserver', MockResizeObserver );

// Mock requestAnimationFrame
vi.stubGlobal( 'requestAnimationFrame', ( callback: FrameRequestCallback ) => {
	return setTimeout( () => callback( Date.now() ), 0 );
} );

vi.stubGlobal( 'cancelAnimationFrame', ( id: number ) => {
	clearTimeout( id );
} );

// Mock scrollTo and scrollBy
Element.prototype.scrollTo = vi.fn();
Element.prototype.scrollBy = vi.fn();
