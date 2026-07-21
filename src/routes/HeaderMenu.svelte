<script lang="ts">
	import { resolve } from '$app/paths';
	import OverlayMenu from './OverlayMenu.svelte';

	let scrolled = $state(false);

	function handleScroll() {
		scrolled = window.scrollY > 0;
	}

	$effect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// match the document title in head using a mutation observer
	let title = $state('Lake Conestee Dam');
	$effect(() => {
		const head = document.querySelector('head');

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					const titleElement = head?.querySelector('title');
					if (titleElement) {
						title = titleElement.textContent || '';
					}
				}
			}
		});

		observer.observe(head as Node, { childList: true, subtree: true });
		return () => observer.disconnect();
	});
</script>

<header class:scrolled>
	<OverlayMenu />

	<div class="stack">
		<div class="content">
			<nav>
				<ul>
					<li>
						<a href={resolve('/')}>
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M10.55 2.532a2.25 2.25 0 0 1 2.9 0l6.75 5.692c.507.428.8 1.057.8 1.72v9.803a1.75 1.75 0 0 1-1.75 1.75h-3.5a1.75 1.75 0 0 1-1.75-1.75v-5.5a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25v5.5a1.75 1.75 0 0 1-1.75 1.75h-3.5A1.75 1.75 0 0 1 3 19.747V9.944c0-.663.293-1.292.8-1.72l6.75-5.692Zm1.933 1.147a.75.75 0 0 0-.966 0L4.767 9.37a.75.75 0 0 0-.267.573v9.803c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-5.5c0-.967.784-1.75 1.75-1.75h3.5c.966 0 1.75.783 1.75 1.75v5.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25V9.944a.75.75 0 0 0-.267-.573l-6.75-5.692Z"
									fill="currentColor"
								/>
							</svg>
							<span>Home</span>
						</a>
					</li>
					<li>
						<a href={resolve('/story')}>
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M6.25 4h11.5a3.25 3.25 0 0 1 3.245 3.066L21 7.25v9.5a3.25 3.25 0 0 1-3.066 3.245L17.75 20H6.25a3.25 3.25 0 0 1-3.245-3.066L3 16.75v-9.5a3.25 3.25 0 0 1 3.066-3.245L6.25 4h11.5-11.5Zm11.5 1.5H6.25a1.75 1.75 0 0 0-1.744 1.606L4.5 7.25v9.5a1.75 1.75 0 0 0 1.606 1.744l.144.006h11.5a1.75 1.75 0 0 0 1.744-1.607l.006-.143v-9.5a1.75 1.75 0 0 0-1.607-1.744L17.75 5.5Zm-7.697 4.085a.5.5 0 0 1 .587-.256l.084.033 4.382 2.19a.5.5 0 0 1 .076.848l-.076.047-4.382 2.191a.5.5 0 0 1-.716-.357L10 14.19V9.809a.5.5 0 0 1 .053-.224Z"
									fill="currentColor"
								/>
							</svg>
							<span>Documentary</span>
						</a>
					</li>
					<li>
						<a href={resolve('/story/pollution')}>
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12 19.137A2.742 2.742 0 0 1 10 20H3.75A1.75 1.75 0 0 1 2 18.25V5.75C2 4.784 2.784 4 3.75 4H10c.788 0 1.499.331 2 .863A2.742 2.742 0 0 1 14 4h6.25c.966 0 1.75.784 1.75 1.75v12.5A1.75 1.75 0 0 1 20.25 20H14a2.742 2.742 0 0 1-2-.863ZM3.5 5.75v12.5c0 .138.112.25.25.25H10c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H3.75a.25.25 0 0 0-.25.25Zm9.25 11.5c0 .69.56 1.25 1.25 1.25h6.25a.25.25 0 0 0 .25-.25V5.75a.25.25 0 0 0-.25-.25H14c-.69 0-1.25.56-1.25 1.25v10.5Z"
									fill="currentColor"
								/>
							</svg>
							<span>Pollution</span>
						</a>
					</li>
					<li>
						<a href={resolve('/story/sediment')}>
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12 19.137A2.742 2.742 0 0 1 10 20H3.75A1.75 1.75 0 0 1 2 18.25V5.75C2 4.784 2.784 4 3.75 4H10c.788 0 1.499.331 2 .863A2.742 2.742 0 0 1 14 4h6.25c.966 0 1.75.784 1.75 1.75v12.5A1.75 1.75 0 0 1 20.25 20H14a2.742 2.742 0 0 1-2-.863ZM3.5 5.75v12.5c0 .138.112.25.25.25H10c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H3.75a.25.25 0 0 0-.25.25Zm9.25 11.5c0 .69.56 1.25 1.25 1.25h6.25a.25.25 0 0 0 .25-.25V5.75a.25.25 0 0 0-.25-.25H14c-.69 0-1.25.56-1.25 1.25v10.5Z"
									fill="currentColor"
								/>
							</svg>
							<span>Sediment</span>
						</a>
					</li>
					<li>
						<a href={resolve('/story/watershed')}>
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12 19.137A2.742 2.742 0 0 1 10 20H3.75A1.75 1.75 0 0 1 2 18.25V5.75C2 4.784 2.784 4 3.75 4H10c.788 0 1.499.331 2 .863A2.742 2.742 0 0 1 14 4h6.25c.966 0 1.75.784 1.75 1.75v12.5A1.75 1.75 0 0 1 20.25 20H14a2.742 2.742 0 0 1-2-.863ZM3.5 5.75v12.5c0 .138.112.25.25.25H10c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H3.75a.25.25 0 0 0-.25.25Zm9.25 11.5c0 .69.56 1.25 1.25 1.25h6.25a.25.25 0 0 0 .25-.25V5.75a.25.25 0 0 0-.25-.25H14c-.69 0-1.25.56-1.25 1.25v10.5Z"
									fill="currentColor"
								/>
							</svg>
							<span>Watershed</span>
						</a>
					</li>
					<li>
						<a href={resolve('/story/timeline')}>
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M15.25 13c.966 0 1.75.784 1.75 1.75v4.5A1.75 1.75 0 0 1 15.25 21H3.75A1.75 1.75 0 0 1 2 19.25v-4.5c0-.966.783-1.75 1.75-1.75h11.5ZM21 14.899v5.351a.75.75 0 0 1-1.494.102l-.006-.102v-5.338a3.006 3.006 0 0 0 1.5-.013Zm-5.75-.399H3.75a.25.25 0 0 0-.25.25v4.5c0 .138.111.25.25.25h11.5a.25.25 0 0 0 .25-.25v-4.5a.25.25 0 0 0-.25-.25Zm5-4.408a1.908 1.908 0 1 1 0 3.816 1.908 1.908 0 0 1 0-3.816ZM15.244 3c.967 0 1.75.784 1.75 1.75v4.5a1.75 1.75 0 0 1-1.75 1.75h-11.5a1.75 1.75 0 0 1-1.75-1.75v-4.5a1.75 1.75 0 0 1 1.607-1.744L3.745 3h11.5Zm0 1.5h-11.5l-.057.007a.25.25 0 0 0-.193.243v4.5c0 .138.112.25.25.25h11.5a.25.25 0 0 0 .25-.25v-4.5a.25.25 0 0 0-.25-.25ZM20.25 3a.75.75 0 0 1 .743.648L21 3.75v5.351a3.004 3.004 0 0 0-1.5-.013V3.75a.75.75 0 0 1 .75-.75Z"
									fill="currentColor"
								/>
							</svg>
							<span>Timeline</span>
						</a>
					</li>
					<li>
						<a href={resolve('/story/dam')}>
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12 19.137A2.742 2.742 0 0 1 10 20H3.75A1.75 1.75 0 0 1 2 18.25V5.75C2 4.784 2.784 4 3.75 4H10c.788 0 1.499.331 2 .863A2.742 2.742 0 0 1 14 4h6.25c.966 0 1.75.784 1.75 1.75v12.5A1.75 1.75 0 0 1 20.25 20H14a2.742 2.742 0 0 1-2-.863ZM3.5 5.75v12.5c0 .138.112.25.25.25H10c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H3.75a.25.25 0 0 0-.25.25Zm9.25 11.5c0 .69.56 1.25 1.25 1.25h6.25a.25.25 0 0 0 .25-.25V5.75a.25.25 0 0 0-.25-.25H14c-.69 0-1.25.56-1.25 1.25v10.5Z"
									fill="currentColor"
								/>
							</svg>
							<span>New Dam</span>
						</a>
					</li>
					<li>
						<a href={resolve('/glossary')}>
							<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M13.25 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM11.5 9.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-1.5 0Z"
									fill="currentColor"
								/>
								<path
									d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5v-15ZM19 18V4.5a1 1 0 0 0-1-1H6.5a1 1 0 0 0-1 1V18H19Z"
									fill="currentColor"
								/>
							</svg>
							<span>Glossary</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>

		<div class="title">
			<h1>{title}</h1>
		</div>
	</div>
</header>

<style>
	:global(body) {
		--header-height: 3rem;
	}

	/* make StoryMap navigation bar stick below the main app navigation bar */
	:global(.layout-wrapper.navigation-bar) {
		top: var(--header-height) !important;
	}
	/* make StoryMap navigation bar the same size as the main app navigation bar */
	:global(.layout-wrapper.navigation-bar .bar-container) {
		height: var(--header-height) !important;
	}

	header {
		--fade-duration: 167ms;

		position: sticky;
		top: 0;
		z-index: 100;
		background-color: white;

		display: flex;
		align-items: center;
		flex-direction: row;

		height: var(--header-height);
		padding: 0 1rem 0 0.5rem;
		box-shadow: 0 1px 0 #ccc;
	}

	.stack {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.content,
	.title {
		position: absolute;
		inset: 0;
		opacity: 1;
		transition: opacity var(--fade-duration) ease;
	}

	/* not scrolled: show the nav, hide the title */
	.title {
		opacity: 0;
		pointer-events: none;
		transition-delay: 0s;
	}

	@media (min-width: 1001px) {
		/* scrolled: hide the nav (fades out first), then fade in the title */
		header.scrolled .content {
			opacity: 0;
			pointer-events: none;
			transition-delay: 0s;
		}
		header.scrolled .title {
			opacity: 1;
			pointer-events: auto;
			transition-delay: var(--fade-duration);
		}

		/* scrolling back up: hide the title first, then fade the nav back in */
		header:not(.scrolled) .content {
			transition-delay: var(--fade-duration);
		}
		header:not(.scrolled) .title {
			transition-delay: 0s;
		}
	}

	@media (max-width: 1000px) {
		/* on small screens, always show the title and hide the nav */
		.content {
			opacity: 0;
			pointer-events: none;
			transition-delay: 0s;
		}
		.title {
			opacity: 1;
			pointer-events: auto;
			transition-delay: 0s;
		}
	}

	.title {
		display: flex;
		align-items: center;
		padding-left: 0.5rem;
	}
	.title h1 {
		font-size: 1.125rem;
		font-weight: 600;
		text-box: trim-both cap alphabetic;
		margin: 0;
		color: #4868a9;
	}

	nav {
		position: absolute;
		inset: 0;
	}
	@media (max-width: 1000px) {
		nav {
			display: none;
		}
	}

	ul {
		margin: 0;
		list-style: none;
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0;
		gap: 0.25rem;
		flex-wrap: nowrap;
		overflow-x: hidden;
	}

	a {
		text-decoration: none;
		cursor: default;
		color: #4868a9;
		font-weight: 500;
		padding: 0.5rem 0.5rem;
		transition: background-color 80ms ease-in-out;
		border-radius: 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	a span {
		text-box: trim-both cap alphabetic;
		margin-top: 1px;
		flex-grow: 0;
		flex-shrink: 0;
		white-space: nowrap;
	}
	a:hover {
		background-color: #ecf3ff;
	}
	a:active {
		background-color: #d6e2ff;
	}

	svg {
		block-size: 1.25rem;
		inline-size: 1.25rem;
		flex-grow: 0;
		flex-shrink: 0;
	}
</style>
