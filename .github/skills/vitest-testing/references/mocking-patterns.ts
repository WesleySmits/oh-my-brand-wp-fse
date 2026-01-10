/**
 * Mocking patterns for Vitest.
 *
 * @package theme-oh-my-brand
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ==========================================================================
// Mock Functions
// ==========================================================================

describe( 'Mock Functions', () => {
	it( 'creates and configures mock functions', () => {
		// Create a mock function
		const mockCallback = vi.fn();

		// Configure return value
		mockCallback.mockReturnValue( 'mocked value' );

		expect( mockCallback() ).toBe( 'mocked value' );
	} );

	it( 'tracks call arguments', () => {
		const mockCallback = vi.fn();

		mockCallback( 'arg1', 'arg2' );

		expect( mockCallback ).toHaveBeenCalled();
		expect( mockCallback ).toHaveBeenCalledTimes( 1 );
		expect( mockCallback ).toHaveBeenCalledWith( 'arg1', 'arg2' );
	} );

	it( 'mocks async functions', async () => {
		const mockAsync = vi.fn();

		mockAsync.mockResolvedValue( { data: [] } );

		const result = await mockAsync();
		expect( result ).toEqual( { data: [] } );
	} );

	it( 'mocks rejected promises', async () => {
		const mockAsync = vi.fn();

		mockAsync.mockRejectedValue( new Error( 'Failed' ) );

		await expect( mockAsync() ).rejects.toThrow( 'Failed' );
	} );
} );

// ==========================================================================
// Mock Modules
// ==========================================================================

// Mock entire module
vi.mock( './utils/api', () => ( {
	fetchData: vi.fn().mockResolvedValue( { data: [] } ),
	postData: vi.fn().mockResolvedValue( { success: true } ),
} ) );

// Mock WordPress modules
vi.mock( '@wordpress/dom-ready', () => ( {
	default: ( callback: () => void ) => callback(),
} ) );

// ==========================================================================
// Mock Timers
// ==========================================================================

describe( 'Mock Timers', () => {
	beforeEach( () => {
		vi.useFakeTimers();
	} );

	afterEach( () => {
		vi.useRealTimers();
	} );

	it( 'advances time', () => {
		const callback = vi.fn();
		setTimeout( callback, 1000 );

		vi.advanceTimersByTime( 1000 );

		expect( callback ).toHaveBeenCalled();
	} );

	it( 'runs all timers', () => {
		const callback = vi.fn();
		setTimeout( callback, 5000 );

		vi.runAllTimers();

		expect( callback ).toHaveBeenCalled();
	} );
} );

// ==========================================================================
// Mock matchMedia (Reduced Motion)
// ==========================================================================

describe( 'Mock matchMedia', () => {
	it( 'mocks reduced motion preference', () => {
		vi.spyOn( window, 'matchMedia' ).mockReturnValue( {
			matches: true, // User prefers reduced motion
			media: '(prefers-reduced-motion: reduce)',
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		} );

		const result = window.matchMedia( '(prefers-reduced-motion: reduce)' );
		expect( result.matches ).toBe( true );
	} );
} );

// ==========================================================================
// Spy on Methods
// ==========================================================================

describe( 'Spy on Methods', () => {
	it( 'spies on object methods', () => {
		const object = {
			method: () => 'original',
		};

		const spy = vi.spyOn( object, 'method' );

		object.method();

		expect( spy ).toHaveBeenCalled();
	} );

	it( 'mocks spy implementation', () => {
		const object = {
			method: () => 'original',
		};

		const spy = vi.spyOn( object, 'method' );
		spy.mockReturnValue( 'mocked' );

		expect( object.method() ).toBe( 'mocked' );
	} );
} );
