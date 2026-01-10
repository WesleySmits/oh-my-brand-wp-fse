import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import debounce from './debounce';

describe( 'debounce', () => {
	beforeEach( () => {
		vi.useFakeTimers();
	} );

	afterEach( () => {
		vi.useRealTimers();
	} );

	it( 'should delay function execution', () => {
		const fn = vi.fn();
		const debouncedFn = debounce( fn, 100 );

		debouncedFn();
		expect( fn ).not.toHaveBeenCalled();

		vi.advanceTimersByTime( 100 );
		expect( fn ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'should only call function once for rapid calls', () => {
		const fn = vi.fn();
		const debouncedFn = debounce( fn, 100 );

		debouncedFn();
		debouncedFn();
		debouncedFn();

		vi.advanceTimersByTime( 100 );
		expect( fn ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'should reset timer on each call', () => {
		const fn = vi.fn();
		const debouncedFn = debounce( fn, 100 );

		debouncedFn();
		vi.advanceTimersByTime( 50 );

		debouncedFn();
		vi.advanceTimersByTime( 50 );

		expect( fn ).not.toHaveBeenCalled();

		vi.advanceTimersByTime( 50 );
		expect( fn ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'should pass arguments to debounced function', () => {
		const fn = vi.fn();
		const debouncedFn = debounce( fn, 100 );

		debouncedFn( 'arg1', 'arg2' );
		vi.advanceTimersByTime( 100 );

		expect( fn ).toHaveBeenCalledWith( 'arg1', 'arg2' );
	} );

	it( 'should use default delay of 100ms', () => {
		const fn = vi.fn();
		const debouncedFn = debounce( fn );

		debouncedFn();
		vi.advanceTimersByTime( 99 );
		expect( fn ).not.toHaveBeenCalled();

		vi.advanceTimersByTime( 1 );
		expect( fn ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'should preserve "this" context', () => {
		const fn = vi.fn( function ( this: { value: number } ) {
			return this.value;
		} );
		const debouncedFn = debounce( fn, 100 );

		const context = { value: 42 };
		debouncedFn.call( context );
		vi.advanceTimersByTime( 100 );

		expect( fn ).toHaveBeenCalledTimes( 1 );
		expect( fn.mock.instances[ 0 ] ).toBe( context );
	} );

	it( 'should allow multiple independent debounced functions', () => {
		const fn1 = vi.fn();
		const fn2 = vi.fn();
		const debouncedFn1 = debounce( fn1, 100 );
		const debouncedFn2 = debounce( fn2, 200 );

		debouncedFn1();
		debouncedFn2();

		vi.advanceTimersByTime( 100 );
		expect( fn1 ).toHaveBeenCalledTimes( 1 );
		expect( fn2 ).not.toHaveBeenCalled();

		vi.advanceTimersByTime( 100 );
		expect( fn2 ).toHaveBeenCalledTimes( 1 );
	} );
} );
