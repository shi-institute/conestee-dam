import { mount, unmount } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import Lightbox from './Lightbox.svelte';

function parseSrcset(srcset: string): { url: string; width: number }[] {
	return srcset
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean)
		.map((entry) => {
			const [url, descriptor] = entry.split(/\s+/);
			const width = descriptor ? parseInt(descriptor, 10) : 0;
			return { url, width: Number.isNaN(width) ? 0 : width };
		});
}

/**
 * Gets the largest available source for an image, considering its `srcset`
 * and any `<source>` elements in a parent `<picture>`. If no candidates are
 * found, it falls back to `currentSrc` or `src`.
 * @param img
 * @returns
 */
function getLargestSource(img: HTMLImageElement): string {
	const candidates = [...parseSrcset(img.srcset)];

	const picture = img.closest('picture');
	if (picture) {
		for (const source of picture.querySelectorAll('source')) {
			const srcset = source.getAttribute('srcset');
			if (srcset) {
				candidates.push(...parseSrcset(srcset));
			}
		}
	}

	if (candidates.length === 0) {
		return img.currentSrc || img.src;
	}

	candidates.sort((a, b) => b.width - a.width);
	return candidates[0].url;
}

/**
 * A Svelte attachment that wraps images in a lightbox.
 *
 * It scans the element to which it is attached for `<img>` elements, including those
 * with `src`, `srcset`, and `<picture>` elements. For every found image, it adds
 * event listeners to open a fullscreen lightbox on click, enter key, or space key.
 * The lightbox displays the largest available source of the image.
 *
 * @example
 * ```svelte
 * <div {@attach wrapImagesInLightbox}>
 * 	{@render children()}
 * </div>
 * ```
 */
export const wrapImagesInLightbox: Attachment<HTMLElement> = (node) => {
	// create a host (parent) element for the lightbox and append it to the document body
	const host = document.createElement('div');
	document.body.appendChild(host);

	// mount the lightbox component
	const lightboxProps = $state({ open: false, src: '', alt: '' });
	const lightbox = mount(Lightbox, { target: host, props: lightboxProps });

	// wrap all existing images in the node in a lightbox trigger
	for (const img of node.querySelectorAll('img')) {
		enhanceWithLightbox(img);
	}

	// also watch for new images added to the node and wrap them in a lightbox trigger
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const addedNode of mutation.addedNodes) {
				if (!(addedNode instanceof HTMLElement)) {
					continue;
				}

				if (addedNode instanceof HTMLImageElement) {
					enhanceWithLightbox(addedNode);
				}
				for (const img of addedNode.querySelectorAll('img')) {
					enhanceWithLightbox(img);
				}
			}
		}
	});
	observer.observe(node, { childList: true, subtree: true });

	function enhanceWithLightbox(img: HTMLImageElement) {
		if (img.dataset.lightboxEnhanced) return;
		img.dataset.lightboxEnhanced = 'true';
		img.style.cursor = 'zoom-in';
		img.tabIndex = 0;
		img.setAttribute('role', 'button');
		img.setAttribute(
			'aria-label',
			img.alt ? `View "${img.alt}" fullscreen` : 'View image fullscreen'
		);

		const open = () => {
			lightboxProps.src = getLargestSource(img);
			lightboxProps.alt = img.alt;
			lightboxProps.open = true;
		};
		img.addEventListener('click', open);
		img.addEventListener('keydown', (event) => {
			if (event.key !== 'Enter' && event.key !== ' ') return;
			event.preventDefault();
			open();
		});
	}

	return () => {
		observer.disconnect();
		unmount(lightbox);
		host.remove();
	};
};
