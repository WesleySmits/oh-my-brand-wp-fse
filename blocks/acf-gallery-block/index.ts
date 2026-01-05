import domReady from '@wordpress/dom-ready';
import { GalleryCarousel } from './GalleryCarousel.js';

document.addEventListener('DOMContentLoaded', () => {
    const isEditor =
        document.body.classList.contains('block-editor-iframe__body') ||
        document.body.classList.contains('block-editor-page');

    function initAllGalleries() {
        const wrappers: HTMLElement[] = Array.from(
            document.querySelectorAll('[data-gallery-wrapper]')
        );
        wrappers.forEach((wrapper) => new GalleryCarousel(wrapper, { isEditor }));
    }
    if (domReady) {
        domReady(initAllGalleries);
    } else {
        initAllGalleries();
    }
});
