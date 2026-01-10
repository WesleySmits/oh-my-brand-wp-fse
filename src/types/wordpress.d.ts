/**
 * Type declarations for WordPress packages that don't have types.
 */

declare module '@wordpress/dom-ready' {
	export default function domReady( callback: () => void ): void;
}

declare module '@wordpress/api-fetch' {
	interface ApiFetchOptions {
		path?: string;
		url?: string;
		method?: string;
		data?: Record< string, unknown >;
		headers?: Record< string, string >;
		parse?: boolean;
	}

	export default function apiFetch< T = unknown >(
		options: ApiFetchOptions
	): Promise< T >;
}
