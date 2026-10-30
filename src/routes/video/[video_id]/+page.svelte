<script lang="ts">
	import { resolve } from '$app/paths';
	import { ProjectTitle, StoryMapEmbed } from '$lib/components';
	import '$lib/videojs';
	import { getNextEpisode, getStoryEpisodes, normalizePath, type Episode } from '$lib/videos';
	import type { YouTubeVideoElement } from '@videojs/html/media/youtube-video';
	import type { PageProps } from './$types';
	import GlossarySidebar from './GlossarySidebar.svelte';

	/** The documentary uses the project title instead of a plain heading. */
	const PROJECT_TITLE_VIDEO_ID = 1;

	let { data }: PageProps = $props();

	const video = $derived(data.video);
	const nextEpisode = $derived(getNextEpisode(video));
	const seeAlso = $derived(
		getStoryEpisodes().filter(
			(episode) => !nextEpisode || normalizePath(episode.path) !== normalizePath(nextEpisode.path)
		)
	);

	/**
	 * Sets the video source.
	 */
	function setYouTubeSource(element: Element) {
		(element as YouTubeVideoElement).source = {
			src: `https://www.youtube-nocookie.com/embed/${video.youtube_id}`,
			engine: { youtube: { rel: 0 } }
		};
	}

	const skinOverrides = typeof CSSStyleSheet === 'undefined' ? null : new CSSStyleSheet();
	skinOverrides?.replaceSync(
		'.media-skin { --media-control-radius: 0; --media-menu-item-radius: 0; --media-popup-radius: 0; }'
	);

	/**
	 * Squares the corners of the skin's controls. The skin sets this variable inside its
	 * shadow root (in a cascade layer), so it cannot be overridden from this page's styles.
	 */
	function overrideSkinStyles(element: Element) {
		if (!element.shadowRoot || !skinOverrides) return;
		element.shadowRoot.adoptedStyleSheets = [
			...element.shadowRoot.adoptedStyleSheets,
			skinOverrides
		];
	}

	/** The full title of the video for share sheets and link previews. */
	const shareTitle = $derived(`${video.title}: ${video.title_caption}`);
	const shareDescription = $derived(video.document_description);

	let glossaryOpen = $state(false);

	/** The share icon matches the visitor's platform, which is only known in the browser. */
	let sharePlatform = $state<'apple' | 'android' | 'other'>('other');
	$effect(() => {
		const userAgent = navigator.userAgent;
		if (/android/i.test(userAgent)) {
			sharePlatform = 'android';
		} else if (/iPhone|iPad|iPod|Macintosh/.test(userAgent)) {
			sharePlatform = 'apple';
		}
	});

	let linkCopied = $state(false);
	let linkCopiedTimeout: ReturnType<typeof setTimeout> | undefined;

	/**
	 * Opens the share sheet of the operating system. Browsers without one (such as Firefox
	 * on desktop) copy the link instead.
	 */
	async function share() {
		const data = { title: shareTitle, text: shareDescription, url: location.href };
		if (navigator.share && navigator.canShare?.(data) !== false) {
			try {
				await navigator.share(data);
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					// the visitor closed the share sheet without sharing
					return;
				}
				console.error('The page could not be shared:', error);
			}
			return;
		}

		try {
			await navigator.clipboard.writeText(data.url);
			linkCopied = true;
			clearTimeout(linkCopiedTimeout);
			linkCopiedTimeout = setTimeout(() => (linkCopied = false), 2000);
		} catch (error) {
			console.error('The link could not be copied:', error);
		}
	}

	let descriptionHeading = $state<HTMLHeadingElement>();

	/**
	 * Scrolls past the related episodes (which are above the description
	 * on small screens).
	 */
	function scrollToDescription() {
		if (!descriptionHeading) {
			return;
		}

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		descriptionHeading.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
		descriptionHeading.focus({ preventScroll: true });
	}

	/**
	 * Hides the story's cover, which is the first element of the story's article.
	 *
	 * Since the title is already shown above the description, the cover is not needed
	 * and would be redundant.
	 *
	 * @param article
	 */
	function hideCover(article: HTMLElement) {
		const cover = article.firstElementChild as HTMLElement | null;
		if (cover) {
			cover.style.display = 'none';
		}
	}
</script>

<svelte:head>
	<title>{video.document_title ?? video.title} - Lake Conestee Dam</title>
	{#if video.document_description}
		<meta name="description" content={video.document_description} />
	{/if}

	<!-- apps that are sent a link to this page read these tags to build a preview of it -->
	<meta property="og:site_name" content="Lake Conestee Dam" />
	<meta property="og:type" content="video.other" />
	<meta property="og:title" content={shareTitle} />
	<meta property="og:description" content={shareDescription} />
	<meta property="og:image" content="https://i.ytimg.com/vi/{video.youtube_id}/maxresdefault.jpg" />
	<meta property="og:video" content="https://www.youtube.com/watch?v={video.youtube_id}" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#snippet episodeCard(episode: Episode, featured = false)}
	<a
		class="episode"
		class:featured
		href={resolve(...([episode.path] as Parameters<typeof resolve>))}
	>
		<div class="thumbnail" aria-hidden="true">
			{#if episode.youtubeId}
				<img src="https://i.ytimg.com/vi/{episode.youtubeId}/mqdefault.jpg" alt="" loading="lazy" />
			{:else if episode.picture}
				<enhanced:img src={episode.picture} alt="" sizes="9rem" loading="lazy" />
			{:else}
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12 19.137A2.742 2.742 0 0 1 10 20H3.75A1.75 1.75 0 0 1 2 18.25V5.75C2 4.784 2.784 4 3.75 4H10c.788 0 1.499.331 2 .863A2.742 2.742 0 0 1 14 4h6.25c.966 0 1.75.784 1.75 1.75v12.5A1.75 1.75 0 0 1 20.25 20H14a2.742 2.742 0 0 1-2-.863ZM3.5 5.75v12.5c0 .138.112.25.25.25H10c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H3.75a.25.25 0 0 0-.25.25Zm9.25 11.5c0 .69.56 1.25 1.25 1.25h6.25a.25.25 0 0 0 .25-.25V5.75a.25.25 0 0 0-.25-.25H14c-.69 0-1.25.56-1.25 1.25v10.5Z"
						fill="currentColor"
					/>
				</svg>
			{/if}
		</div>
		<div class="episode-text">
			<h3>{episode.label}</h3>
			<p>{episode.description}</p>
			<span class="kind">{episode.type === 'video' ? 'Video' : 'Story'}</span>
		</div>
	</a>
{/snippet}

<div class="video-page" class:glossary-open={glossaryOpen}>
	<main class="watch">
		<div class="primary">
			<div class="player">
				<video-player>
					<video-skin {@attach overrideSkinStyles}>
						<youtube-video autoplay {@attach setYouTubeSource}></youtube-video>
					</video-skin>
				</video-player>
			</div>

			<div class="title-row">
				{#if video.id === PROJECT_TITLE_VIDEO_ID}
					<div class="project-title">
						<ProjectTitle />
					</div>
				{:else}
					<div class="title">
						<h1>{video.title}</h1>
						<p class="caption">{video.title_caption}</p>
					</div>
				{/if}

				<div class="actions">
					<button type="button" class="action-button" onclick={share}>
						<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							{#if sharePlatform === 'apple'}
								<path
									d="M12.5303 2.21967C12.2374 1.92678 11.7626 1.92678 11.4697 2.21967L6.21967 7.46967C5.92678 7.76256 5.92678 8.23744 6.21967 8.53033C6.51256 8.82322 6.98744 8.82322 7.28033 8.53033L11.25 4.56066V15.25C11.25 15.6642 11.5858 16 12 16C12.4142 16 12.75 15.6642 12.75 15.25V4.56066L16.7197 8.53033C17.0126 8.82322 17.4874 8.82322 17.7803 8.53033C18.0732 8.23744 18.0732 7.76256 17.7803 7.46967L12.5303 2.21967ZM3.75 11C4.16421 11 4.5 11.3358 4.5 11.75V17.75C4.5 18.7165 5.2835 19.5 6.25 19.5H17.75C18.7165 19.5 19.5 18.7165 19.5 17.75V11.75C19.5 11.3358 19.8358 11 20.25 11C20.6642 11 21 11.3358 21 11.75V17.75C21 19.5449 19.5449 21 17.75 21H6.25C4.45507 21 3 19.5449 3 17.75V11.75C3 11.3358 3.33579 11 3.75 11Z"
									fill="currentColor"
								/>
							{:else if sharePlatform === 'android'}
								<path
									d="M17 2.49805C18.934 2.49805 20.5018 4.06584 20.5018 5.99982C20.5018 7.93379 18.934 9.50158 17 9.50158C15.97 9.50158 15.0439 9.05692 14.4032 8.34909L9.84455 10.9535C9.94786 11.2839 10.0035 11.6354 10.0035 11.9998C10.0035 12.3643 9.94786 12.7157 9.84455 13.0461L14.4023 15.6516C15.043 14.9431 15.9695 14.498 17 14.498C18.934 14.498 20.5018 16.0658 20.5018 17.9998C20.5018 19.9338 18.934 21.5016 17 21.5016C15.066 21.5016 13.4982 19.9338 13.4982 17.9998C13.4982 17.6354 13.5539 17.2839 13.6572 16.9535L9.09951 14.3481C8.45873 15.0565 7.53223 15.5016 6.50177 15.5016C4.5678 15.5016 3 13.9338 3 11.9998C3 10.0658 4.5678 8.49805 6.50177 8.49805C7.53173 8.49805 8.45784 8.94271 9.09859 9.65054L13.6572 7.04612C13.5539 6.71571 13.4982 6.36427 13.4982 5.99982C13.4982 4.06584 15.066 2.49805 17 2.49805ZM17 15.998C15.8945 15.998 14.9982 16.8943 14.9982 17.9998C14.9982 19.1054 15.8945 20.0016 17 20.0016C18.1055 20.0016 19.0018 19.1054 19.0018 17.9998C19.0018 16.8943 18.1055 15.998 17 15.998ZM6.50177 9.99805C5.39622 9.99805 4.5 10.8943 4.5 11.9998C4.5 13.1054 5.39622 14.0016 6.50177 14.0016C7.60731 14.0016 8.50354 13.1054 8.50354 11.9998C8.50354 10.8943 7.60731 9.99805 6.50177 9.99805ZM17 3.99805C15.8945 3.99805 14.9982 4.89427 14.9982 5.99982C14.9982 7.10536 15.8945 8.00158 17 8.00158C18.1055 8.00158 19.0018 7.10536 19.0018 5.99982C19.0018 4.89427 18.1055 3.99805 17 3.99805Z"
									fill="currentColor"
								/>
							{:else}
								<path
									d="M10.2499 2.99985C10.6641 2.99985 10.9999 3.33571 10.9999 3.74985C10.9999 4.16407 10.6642 4.49985 10.2499 4.49985H6.74994C5.50735 4.49985 4.50002 5.50728 4.49994 6.74985V17.2499L4.51166 17.4803C4.62708 18.6147 5.58511 19.4999 6.74994 19.4999H17.2499C18.4926 19.4999 19.4999 18.4925 19.4999 17.2499V15.2499C19.5 14.8357 19.8358 14.4999 20.2499 14.4999C20.6641 14.4999 20.9999 14.8357 20.9999 15.2499V17.2499C20.9999 19.3209 19.321 20.9999 17.2499 20.9999H6.74994C4.74372 20.9999 3.10545 19.4244 3.00482 17.4432L2.99994 17.2499V6.74985C3.00002 4.67885 4.67892 2.99985 6.74994 2.99985H10.2499ZM14.9365 2.06821C15.2025 1.94588 15.5159 1.98997 15.7382 2.18052L22.7382 8.18052C22.8985 8.31798 22.9937 8.5173 22.9999 8.72837C23.006 8.93935 22.9224 9.14336 22.7704 9.28989L15.7704 16.0399C15.554 16.2486 15.2337 16.3077 14.957 16.1903C14.6801 16.0726 14.4999 15.8007 14.4999 15.4999V12.5243C13.4856 12.5878 12.5295 12.7971 11.5605 13.2928C10.4241 13.8742 9.21636 14.8744 7.87103 16.5956L7.59955 16.9501C7.40582 17.2081 7.06877 17.3138 6.76263 17.2118C6.4564 17.1097 6.24994 16.8227 6.24994 16.4999C6.24996 13.6426 6.93653 10.9108 8.41791 8.87192C9.79374 6.97863 11.8288 5.72528 14.4999 5.52817V2.74985L14.5078 2.64146C14.5441 2.39271 14.7037 2.17528 14.9365 2.06821ZM15.9999 6.24985C15.9999 6.66407 15.6642 6.99985 15.2499 6.99985C12.6932 6.99985 10.8549 8.06982 9.63177 9.75278C8.75381 10.961 8.17788 12.5099 7.91498 14.2459C8.91528 13.1985 9.89191 12.4608 10.8769 11.9569C12.3601 11.1981 13.8009 10.9999 15.2499 10.9999C15.4488 10.9999 15.6396 11.079 15.7802 11.2196C15.9208 11.3602 15.9999 11.551 15.9999 11.7499V13.7342L21.1347 8.78208L15.9999 4.37974V6.24985Z"
									fill="currentColor"
								/>
							{/if}
						</svg>
						<span aria-live="polite">{linkCopied ? 'Link copied' : 'Share'}</span>
					</button>

					<button
						type="button"
						class="action-button"
						aria-expanded={glossaryOpen}
						aria-controls="glossary-sidebar"
						onclick={() => (glossaryOpen = !glossaryOpen)}
					>
						<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path
								d="M13.25 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM11.5 9.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-1.5 0Z"
								fill="currentColor"
							/>
							<path
								d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5v-15ZM19 18V4.5a1 1 0 0 0-1-1H6.5a1 1 0 0 0-1 1V18H19Z"
								fill="currentColor"
							/>
						</svg>
						{glossaryOpen ? 'Close glossary' : 'Open glossary'}
					</button>
				</div>
			</div>

			<button type="button" class="jump-button" onclick={scrollToDescription}>
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path
						d="M19.79 13.267a.75.75 0 0 0-1.086-1.034l-5.954 6.251V3.75a.75.75 0 1 0-1.5 0v14.734l-5.955-6.251a.75.75 0 1 0-1.086 1.034l7.067 7.42c.16.168.366.268.58.3a.753.753 0 0 0 .29-.001.995.995 0 0 0 .578-.3l7.067-7.419Z"
						fill="currentColor"
					/>
				</svg>
				Go to description
			</button>

			<section class="description" aria-labelledby="description-heading">
				<h2 id="description-heading" tabindex="-1" bind:this={descriptionHeading}>Description</h2>
				<div class="description-story">
					<StoryMapEmbed
						story={data.story}
						loadingHeight="30rem"
						loadingName="description"
						heading={false}
						onStoryLoaded={hideCover}
					/>
				</div>
			</section>
		</div>

		<aside class="related" aria-label="More from this project">
			{#if nextEpisode}
				<section aria-labelledby="next-heading">
					<h2 id="next-heading">{nextEpisode.type === 'video' ? 'Watch next' : 'Read next'}</h2>
					{@render episodeCard(nextEpisode, true)}
				</section>
			{/if}
			{#if seeAlso.length > 0}
				<section aria-labelledby="see-also-heading">
					<h2 id="see-also-heading">See also</h2>
					<ul>
						{#each seeAlso as episode (episode.path)}
							<li>{@render episodeCard(episode)}</li>
						{/each}
					</ul>
				</section>
			{/if}
		</aside>
	</main>

	{#if glossaryOpen}
		<GlossarySidebar id="glossary-sidebar" onclose={() => (glossaryOpen = false)} />
	{/if}
</div>

<style>
	/* use dark mode for a cinematic experience that focuses the video */
	:global(:root:has(.video-page)) {
		color-scheme: dark;
	}

	.video-page {
		--gutter: 1.5rem;
		--related-width: 22rem;
		display: flex;
		align-items: flex-start;
		color: var(--color-text);
		line-height: 1.5;
	}

	@media (max-width: 999px) {
		.video-page {
			--gutter: 1rem;
		}

		/* leave room to scroll the page above the glossary sheet */
		.video-page.glossary-open {
			padding-bottom: 55dvh;
		}
	}

	.watch {
		flex: 1;
		min-width: 0;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: 'player' 'title' 'jump' 'related' 'description';
		margin-inline: auto;
		padding: var(--gutter);
	}

	/* on small screens, the related episodes are placed between the title and the description */
	.primary {
		display: contents;
	}

	/*
	 * On wide screens, the related episodes are beside the video, and each column scrolls on
	 * its own (instead of the page), so the pinned glossary's scrollbar is not beside the page's.
	 * The video is kept short enough that its title is in view.
	 */
	@media (min-width: 1000px) {
		.video-page {
			--related-padding-left: 0.5rem;
			height: calc(100dvh - var(--header-height));
			align-items: stretch;
		}

		.watch {
			grid-template-columns:
				minmax(0, 1fr)
				calc(var(--related-width) + var(--related-padding-left) + var(--gutter));
			grid-template-rows: minmax(0, 1fr);
			grid-template-areas: 'primary related';
			max-width: calc(
				(100dvh - var(--header-height) - 12rem) * 16 / 9 + var(--related-width) +
					var(--related-padding-left) + 3 * var(--gutter)
			);
			min-width: min(60rem, 100%);
			padding: 0;
		}

		.primary {
			/* the story's sticky elements stick to the top of this column, not below the header */
			--header-height: 0px;
			grid-area: primary;
			display: block;
			overflow-y: auto;
			padding: var(--gutter);
		}

		.related {
			overflow-y: auto;
			/* the left padding leaves room for the hover background of the episodes */
			padding: var(--gutter) var(--gutter) var(--gutter) var(--related-padding-left);
		}
	}

	h2 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.2;
	}

	/* player */
	.player {
		grid-area: player;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: var(--radius-surface);
		background-color: black;
	}

	.player video-skin {
		display: block;
		width: 100%;
		height: 100%;
		--media-accent-color: var(--color-accent);
		--media-accent-text-color: var(--color-surface);
		--media-border-color: transparent;
		--media-border-radius: var(--radius-surface);
		--media-font-family: inherit;
	}

	/* the element is a small inline box by default, and its iframe fills it */
	.player youtube-video {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* the video spans the full width of small screens */
	@media (max-width: 999px) {
		.player {
			margin: calc(-1 * var(--gutter)) calc(-1 * var(--gutter)) 0;
			border-radius: 0;
		}
	}

	/* title */
	.title-row {
		grid-area: title;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem 1.5rem;
		padding-block: 1.25rem;
	}

	.project-title {
		--project-title-size: clamp(2.5rem, 6vw, 4rem);
		--project-subtitle-size: clamp(0.9rem, 1.8vw, 1.125rem);
		--project-title-shadow: none;
	}

	.title h1 {
		margin: 0;
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: -0.01em;
		text-wrap: balance;
	}

	.caption {
		margin: 0.35rem 0 0;
		font-size: 1.125rem;
		color: var(--color-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.action-button {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-button);
		background-color: transparent;
		color: var(--color-accent);
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		transition:
			background-color 80ms ease-in-out,
			border-color 80ms ease-in-out;
	}

	.action-button svg {
		flex: none;
		width: 1.125rem;
		height: 1.125rem;
	}

	.action-button:hover {
		border-color: var(--color-accent);
		background-color: var(--color-accent-bg);
	}

	.action-button:active {
		border-color: var(--color-accent);
		background-color: var(--color-accent-bg-active);
	}

	.action-button[aria-expanded='true'] {
		border-color: var(--color-accent);
		background-color: var(--color-accent);
		color: var(--color-surface);
	}

	.jump-button {
		grid-area: jump;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		padding: 0.55rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-button);
		background-color: transparent;
		color: var(--color-accent);
		font: inherit;
		font-weight: 600;
		transition: background-color 80ms ease-in-out;
	}

	.jump-button svg {
		flex: none;
		width: 1.25rem;
		height: 1.25rem;
	}

	.jump-button:hover {
		background-color: var(--color-accent-bg);
	}

	.jump-button:active {
		background-color: var(--color-accent-bg-active);
	}

	/* the description is right below the title on wide screens */
	@media (min-width: 1000px) {
		.jump-button {
			display: none;
		}
	}

	.action-button:focus-visible,
	.jump-button:focus-visible,
	.episode:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: 2px;
	}

	/* related episodes */
	.related {
		grid-area: related;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding-bottom: 1.5rem;
	}

	.related section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.related ul {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.episode {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		margin-inline: -0.5rem;
		padding: 0.5rem;
		border-radius: var(--radius-surface);
		color: inherit;
		text-decoration: none;
		transition: background-color 80ms ease-in-out;
	}

	.episode:hover {
		background-color: var(--color-accent-bg);
	}

	.episode:active {
		background-color: var(--color-accent-bg-active);
	}

	.thumbnail {
		flex: none;
		display: grid;
		place-items: center;
		width: 9rem;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-surface);
		background-color: var(--color-accent-bg);
		color: var(--color-accent);
	}

	.thumbnail :global(picture) {
		display: contents;
	}

	.thumbnail :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumbnail svg {
		width: 2rem;
		height: 2rem;
	}

	.episode-text {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.episode h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.25;
		color: var(--color-accent);
	}

	.episode p {
		display: -webkit-box;
		margin: 0;
		overflow: hidden;
		font-size: 0.875rem;
		line-height: 1.35;
		color: var(--color-muted);
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.kind {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	/* the next episode gets a larger card, with its thumbnail above its text */
	.episode.featured {
		flex-direction: column;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		margin-inline: 0;
	}

	.episode.featured:hover {
		border-color: var(--color-accent);
	}

	.episode.featured .thumbnail {
		width: 100%;
	}

	.episode.featured .thumbnail svg {
		width: 3rem;
		height: 3rem;
	}

	.episode.featured h3 {
		font-size: 1.125rem;
	}

	/* description */
	.description {
		grid-area: description;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-border);
	}

	/* outline the story so it reads as one embedded document */
	.description-story {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-surface);
	}

	/* keep the top of the section in view below the sticky header when jumping to it */
	#description-heading {
		scroll-margin-top: calc(var(--header-height) + 1.25rem);
	}

	/* the heading is only focused by script, after jumping to it */
	#description-heading:focus {
		outline: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.action-button,
		.jump-button,
		.episode {
			transition: none;
		}
	}
</style>
