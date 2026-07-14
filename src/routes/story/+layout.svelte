<script lang="ts">
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<header>
	<nav>
		<ul>
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
		gap: 1rem;
	}
</style>
