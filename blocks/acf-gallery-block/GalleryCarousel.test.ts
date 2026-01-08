import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { GalleryCarousel } from './GalleryCarousel';
import { subscribe } from '@wordpress/data';

// Mock @wordpress/data
vi.mock('@wordpress/data', () => ({
	select: vi.fn(() => ({
		getBlocks: vi.fn(() => [])
	})),
	subscribe: vi.fn((_callback: () => void) => {
		return () => {}; // Return unsubscribe function
	})
}));

// Get the mocked subscribe function
const mockSubscribe = subscribe as Mock;

describe('GalleryCarousel', () => {
	let wrapper: HTMLElement;

	const createGalleryDOM = (options: { visibleImages?: number; itemCount?: number } = {}): HTMLElement => {
		const { visibleImages = 3, itemCount = 5 } = options;

		const items = Array.from(
			{ length: itemCount },
			(_, i) => `
            <div class="acf-gallery-item" data-gallery-item>
                <img src="test${i + 1}.jpg" alt="Test ${i + 1}" loading="lazy" decoding="async">
            </div>
        `
		).join('');

		document.body.innerHTML = `
            <div data-gallery-wrapper>
                <div class="acf-gallery-inner">
                    <button data-gallery-previous aria-label="Scroll left">&larr;</button>
                    <div data-gallery data-visible="${visibleImages}" style="--visible-images: ${visibleImages};">
                        ${items}
                    </div>
                    <button data-gallery-next aria-label="Scroll right">&rarr;</button>
                </div>
            </div>
        `;

		return document.querySelector('[data-gallery-wrapper]') as HTMLElement;
	};

	beforeEach(() => {
		wrapper = createGalleryDOM();
	});

	describe('initialization', () => {
		it('should initialize successfully with valid wrapper', () => {
			new GalleryCarousel(wrapper);
			expect(wrapper.dataset.initialized).toBe('true');
		});

		it('should throw error if wrapper is null', () => {
			expect(() => new GalleryCarousel(null as unknown as HTMLElement)).toThrow(
				'Required wrapper element not found'
			);
		});

		it('should throw error if wrapper is already initialized', () => {
			new GalleryCarousel(wrapper);
			expect(() => new GalleryCarousel(wrapper)).toThrow('Required wrapper element not found');
		});

		it('should throw error if required elements are missing', () => {
			const emptyWrapper = document.createElement('div');
			expect(() => new GalleryCarousel(emptyWrapper)).toThrow('Required elements not found');
		});

		it('should throw error if gallery element is missing', () => {
			wrapper.innerHTML = `
                <button data-gallery-previous></button>
                <button data-gallery-next></button>
            `;
			wrapper.removeAttribute('data-initialized');
			expect(() => new GalleryCarousel(wrapper)).toThrow('Required elements not found');
		});

		it('should throw error if navigation buttons are missing', () => {
			wrapper.innerHTML = '<div data-gallery></div>';
			wrapper.removeAttribute('data-initialized');
			expect(() => new GalleryCarousel(wrapper)).toThrow('Required elements not found');
		});
	});

	describe('visible images configuration', () => {
		it('should read visible images from data attribute', () => {
			wrapper = createGalleryDOM({ visibleImages: 5 });
			new GalleryCarousel(wrapper);

			const gallery = wrapper.querySelector('[data-gallery]') as HTMLElement;
			expect(gallery.style.getPropertyValue('--visible-images')).toBe('5');
		});

		it('should default to 3 visible images when data attribute is missing', () => {
			const gallery = wrapper.querySelector('[data-gallery]') as HTMLElement;
			gallery.removeAttribute('data-visible');
			wrapper.removeAttribute('data-initialized');

			new GalleryCarousel(wrapper);
			expect(gallery.style.getPropertyValue('--visible-images')).toBe('3');
		});

		it('should handle different visible image values', () => {
			[1, 2, 4, 6].forEach((count) => {
				document.body.innerHTML = '';
				wrapper = createGalleryDOM({ visibleImages: count });
				new GalleryCarousel(wrapper);

				const gallery = wrapper.querySelector('[data-gallery]') as HTMLElement;
				expect(gallery.style.getPropertyValue('--visible-images')).toBe(count.toString());
			});
		});
	});

	describe('navigation', () => {
		it('should call scrollBy when next button is clicked', () => {
			const gallery = wrapper.querySelector('[data-gallery]') as HTMLElement;
			const nextButton = wrapper.querySelector('[data-gallery-next]') as HTMLElement;
			const scrollBySpy = vi.spyOn(gallery, 'scrollBy');

			// Mock clientWidth for calculation
			Object.defineProperty(gallery, 'clientWidth', { value: 900, configurable: true });

			new GalleryCarousel(wrapper);
			nextButton.click();

			expect(scrollBySpy).toHaveBeenCalledWith({
				left: 300, // 900 / 3 visible images
				behavior: 'smooth'
			});
		});

		it('should call scrollBy with negative value when previous button is clicked', () => {
			const gallery = wrapper.querySelector('[data-gallery]') as HTMLElement;
			const prevButton = wrapper.querySelector('[data-gallery-previous]') as HTMLElement;
			const scrollBySpy = vi.spyOn(gallery, 'scrollBy');

			Object.defineProperty(gallery, 'clientWidth', { value: 900, configurable: true });

			new GalleryCarousel(wrapper);
			prevButton.click();

			expect(scrollBySpy).toHaveBeenCalledWith({
				left: -300,
				behavior: 'smooth'
			});
		});

		it('should calculate scroll amount based on visible images', () => {
			wrapper = createGalleryDOM({ visibleImages: 4 });
			const gallery = wrapper.querySelector('[data-gallery]') as HTMLElement;
			const nextButton = wrapper.querySelector('[data-gallery-next]') as HTMLElement;
			const scrollBySpy = vi.spyOn(gallery, 'scrollBy');

			Object.defineProperty(gallery, 'clientWidth', { value: 800, configurable: true });

			new GalleryCarousel(wrapper);
			nextButton.click();

			expect(scrollBySpy).toHaveBeenCalledWith({
				left: 200, // 800 / 4 visible images
				behavior: 'smooth'
			});
		});
	});

	describe('editor mode', () => {
		it('should accept isEditor option', () => {
			mockSubscribe.mockClear();
			new GalleryCarousel(wrapper, { isEditor: true });

			expect(mockSubscribe).toHaveBeenCalled();
		});

		it('should not setup editor sync when isEditor is false', () => {
			// Create fresh wrapper since previous test initialized it
			wrapper = createGalleryDOM();
			mockSubscribe.mockClear();

			new GalleryCarousel(wrapper, { isEditor: false });

			expect(mockSubscribe).not.toHaveBeenCalled();
		});
	});

	describe('accessibility', () => {
		it('should have accessible navigation buttons', () => {
			const prevButton = wrapper.querySelector('[data-gallery-previous]') as HTMLElement;
			const nextButton = wrapper.querySelector('[data-gallery-next]') as HTMLElement;

			expect(prevButton.getAttribute('aria-label')).toBe('Scroll left');
			expect(nextButton.getAttribute('aria-label')).toBe('Scroll right');
		});

		it('should have lazy loading on images', () => {
			const images = wrapper.querySelectorAll('img');

			images.forEach((img) => {
				expect(img.getAttribute('loading')).toBe('lazy');
				expect(img.getAttribute('decoding')).toBe('async');
			});
		});
	});
});
