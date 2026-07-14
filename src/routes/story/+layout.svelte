<script lang="ts">
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<header>
	<nav>
		<ul>
			<li>
				<a href={resolve('/')}>Home</a>
			</li>
			<li>
				<a href={resolve('/story/pollution')}>Pollution StoryMap</a>
			</li>
			<li>
				<a href={resolve('/story/watershed')}>Watershed StoryMap</a>
			</li>
			<li>
				<a href={resolve('/story/dam')}>New Dam StoryMap</a>
			</li>
		</ul>
	</nav>
</header>

{@render children()}

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
		position: sticky;
		top: 0;
		z-index: 100;
		background-color: white;

		height: var(--header-height);
		box-shadow: 0 1px 0 #ccc;
	}

	nav {
		height: 100%;
	}

	ul {
		margin: 0;
		list-style: none;
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0 1rem;
		gap: 0.25rem;
	}

	a {
		text-decoration: none;
		cursor: default;
		color: #4868a9;
		font-weight: 500;
		padding: 0.5rem 0.5rem;
		transition: background-color 80ms ease-in-out;
		border-radius: 0.25rem;
	}
	a:hover {
		background-color: #ecf3ff;
	}
	a:active {
		background-color: #d6e2ff;
	}
</style>
