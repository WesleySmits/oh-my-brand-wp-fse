/**
 * Lightbox unit tests.
 *
 * @package
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Lightbox, createLightboxFromElements } from './Lightbox';
import type { LightboxImage } from './Lightbox';

describe('Lightbox', () => {
	const mockImages: LightboxImage[] = [
		{ src: 'https://example.com/image1.jpg', alt: 'Image 1', caption: 'Caption 1' },
		{ src: 'https://example.com/image2.jpg', alt: 'Image 2', caption: 'Caption 2' },
		{ src: 'https://example.com/image3.jpg', alt: 'Image 3' }
	];

	beforeEach(() => {
		document.body.innerHTML = '';
	});

	afterEach(() => {
		// Clean up any dialogs
		document.querySelectorAll('dialog').forEach((dialog) => dialog.remove());
		vi.restoreAllMocks();
	});

	describe('constructor', () => {
		it('should create a lightbox instance with images', () => {
			const lightbox = new Lightbox(mockImages);
			expect(lightbox).toBeDefined();
			expect(lightbox.getCurrentIndex()).toBe(0);
		});

		it('should accept custom options', () => {
			const lightbox = new Lightbox(mockImages, {
				closeLabel: 'Custom Close',
				showCounter: false
			});
			expect(lightbox).toBeDefined();
		});
	});

	describe('open', () => {
		it('should create and show a dialog element', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			const dialog = document.querySelector('dialog');
			expect(dialog).not.toBeNull();
			expect(dialog?.open).toBe(true);
		});

		it('should open at specified index', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(1);

			expect(lightbox.getCurrentIndex()).toBe(1);
		});

		it('should clamp index to valid range', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(10);

			expect(lightbox.getCurrentIndex()).toBe(2); // Last index
		});

		it('should not open with empty images array', () => {
			const lightbox = new Lightbox([]);
			lightbox.open(0);

			const dialog = document.querySelector('dialog');
			expect(dialog).toBeNull();
		});
	});

	describe('close', () => {
		it('should close and remove the dialog', () => {
			// Mock reduced motion to avoid animation delay
			vi.spyOn(window, 'matchMedia').mockReturnValue({
				matches: true,
				media: '(prefers-reduced-motion: reduce)',
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn()
			});

			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			expect(lightbox.isOpen()).toBe(true);

			lightbox.close();

			// Dialog should be removed after close
			expect(lightbox.isOpen()).toBe(false);
		});
	});

	describe('navigation', () => {
		it('should navigate to next image', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			lightbox.next();
			expect(lightbox.getCurrentIndex()).toBe(1);
		});

		it('should not navigate past last image', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(2);

			lightbox.next();
			expect(lightbox.getCurrentIndex()).toBe(2);
		});

		it('should navigate to previous image', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(1);

			lightbox.prev();
			expect(lightbox.getCurrentIndex()).toBe(0);
		});

		it('should not navigate before first image', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			lightbox.prev();
			expect(lightbox.getCurrentIndex()).toBe(0);
		});

		it('should navigate to specific index with goTo', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			lightbox.goTo(2);
			expect(lightbox.getCurrentIndex()).toBe(2);
		});
	});

	describe('keyboard navigation', () => {
		it('should navigate with arrow keys', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(1);

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
			expect(lightbox.getCurrentIndex()).toBe(2);

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
			expect(lightbox.getCurrentIndex()).toBe(1);
		});

		it('should navigate to start with Home key', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(2);

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
			expect(lightbox.getCurrentIndex()).toBe(0);
		});

		it('should navigate to end with End key', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
			expect(lightbox.getCurrentIndex()).toBe(2);
		});
	});

	describe('content updates', () => {
		it('should update image src on navigation', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			const img = document.querySelector('.lightbox__image') as HTMLImageElement;
			expect(img?.src).toBe(mockImages[0].src);

			lightbox.next();
			expect(img?.src).toBe(mockImages[1].src);
		});

		it('should update caption on navigation', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			const caption = document.querySelector('.lightbox__caption') as HTMLElement;
			expect(caption?.textContent).toBe('Caption 1');

			lightbox.goTo(2);
			expect(caption?.hidden).toBe(true);
		});

		it('should show counter when enabled', () => {
			const lightbox = new Lightbox(mockImages, { showCounter: true });
			lightbox.open(0);

			const counter = document.querySelector('.lightbox__counter');
			expect(counter?.textContent).toBe('1 / 3');
		});
	});

	describe('isOpen', () => {
		it('should return true when open', () => {
			const lightbox = new Lightbox(mockImages);
			lightbox.open(0);

			expect(lightbox.isOpen()).toBe(true);
		});

		it('should return false when not open', () => {
			const lightbox = new Lightbox(mockImages);

			expect(lightbox.isOpen()).toBe(false);
		});
	});
});

describe('createLightboxFromElements', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	afterEach(() => {
		document.querySelectorAll('dialog').forEach((dialog) => dialog.remove());
	});

	it('should create lightbox from image elements', () => {
		document.body.innerHTML = `
			<div class="gallery">
				<img src="image1.jpg" alt="Test 1" class="gallery-image" />
				<img src="image2.jpg" alt="Test 2" class="gallery-image" />
			</div>
		`;

		const lightbox = createLightboxFromElements('.gallery-image');
		expect(lightbox).not.toBeNull();
	});

	it('should create lightbox from anchor elements wrapping images', () => {
		document.body.innerHTML = `
			<div class="gallery">
				<a href="full1.jpg" class="gallery-link">
					<img src="thumb1.jpg" alt="Test 1" />
				</a>
				<a href="full2.jpg" class="gallery-link">
					<img src="thumb2.jpg" alt="Test 2" />
				</a>
			</div>
		`;

		const lightbox = createLightboxFromElements('.gallery-link');
		expect(lightbox).not.toBeNull();
	});

	it('should return null when no elements found', () => {
		const lightbox = createLightboxFromElements('.non-existent');
		expect(lightbox).toBeNull();
	});

	it('should attach click handlers to elements', () => {
		document.body.innerHTML = `
			<div class="gallery">
				<img src="image1.jpg" alt="Test 1" class="gallery-image" />
			</div>
		`;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const lightbox = createLightboxFromElements('.gallery-image');
		const image = document.querySelector('.gallery-image') as HTMLElement;

		image.click();

		// Dialog should be open
		const dialog = document.querySelector('dialog');
		expect(dialog?.open).toBe(true);
	});

	it('should make elements focusable', () => {
		document.body.innerHTML = `
			<div class="gallery">
				<img src="image1.jpg" alt="Test 1" class="gallery-image" />
			</div>
		`;

		createLightboxFromElements('.gallery-image');
		const image = document.querySelector('.gallery-image');

		expect(image?.getAttribute('tabindex')).toBe('0');
	});
});
