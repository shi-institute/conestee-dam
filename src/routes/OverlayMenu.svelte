<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';

	let popoverElement: HTMLElement | null = null;
	afterNavigate(() => {
		popoverElement?.hidePopover();
	});
</script>

<button
	popovertarget="overlay-menu"
	popovertargetaction="show"
	title="Open menu"
	class="menu-button"
>
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M2.753 18h18.5a.75.75 0 0 1 .102 1.493l-.102.007h-18.5a.75.75 0 0 1-.102-1.493L2.753 18h18.5-18.5Zm0-6.497h18.5a.75.75 0 0 1 .102 1.493l-.102.007h-18.5a.75.75 0 0 1-.102-1.493l.102-.007h18.5-18.5Zm-.001-6.5h18.5a.75.75 0 0 1 .102 1.493l-.102.007h-18.5A.75.75 0 0 1 2.65 5.01l.102-.007h18.5-18.5Z"
			fill="currentColor"
		/>
	</svg>
</button>

<nav popover="auto" id="overlay-menu" bind:this={popoverElement}>
	<div class="menu-button-container">
		<button
			popovertarget="overlay-menu"
			popovertargetaction="hide"
			title="Close menu"
			class="menu-button"
		>
			<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M2.753 18h18.5a.75.75 0 0 1 .102 1.493l-.102.007h-18.5a.75.75 0 0 1-.102-1.493L2.753 18h18.5-18.5Zm0-6.497h18.5a.75.75 0 0 1 .102 1.493l-.102.007h-18.5a.75.75 0 0 1-.102-1.493l.102-.007h18.5-18.5Zm-.001-6.5h18.5a.75.75 0 0 1 .102 1.493l-.102.007h-18.5A.75.75 0 0 1 2.65 5.01l.102-.007h18.5-18.5Z"
					fill="currentColor"
				/>
			</svg>
		</button>
	</div>

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

		<li>
			<a href="https://shi-institute.github.io/conestee-dam-archive/index.html">
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M19.25 3c.966 0 1.75.784 1.75 1.75v2c0 .698-.408 1.3-1 1.581v9.919A3.75 3.75 0 0 1 16.25 22h-8.5A3.75 3.75 0 0 1 4 18.25V8.332A1.75 1.75 0 0 1 3 6.75v-2C3 3.784 3.784 3 4.75 3h14.5Zm-.75 5.5h-13v9.75a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25V8.5Zm-8.5 3h4a.75.75 0 0 1 .102 1.493L14 13h-4a.75.75 0 0 1-.102-1.493L10 11.5h4-4Zm9.25-7H4.75a.25.25 0 0 0-.25.25v2c0 .138.112.25.25.25h14.5a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25Z"
						fill="currentColor"
					/>
				</svg>
				<span>Archive: Lake Conestee Dam Restoration Project</span>
			</a>
		</li>
	</ul>
</nav>

<style>
	nav {
		height: 100%;
		border: none;
		padding: 0;
		margin: 0;
		left: 0;
		width: 240px;
		display: block !important;
		background-color: light-dark(white, #212121);
		box-shadow: 0 1px 0 light-dark(#ccc, #333);

		transform: translateX(calc(-100% - 1px));
		transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	nav:popover-open {
		transform: translateX(0);
	}

	nav:popover-open::backdrop {
		background-color: rgba(0 0 0 / 25%);
		opacity: 1;
	}
	nav::backdrop {
		opacity: 0;
		transition: opacity 200ms;
	}
	@starting-style {
		nav:popover-open::backdrop {
			opacity: 0;
		}
	}

	ul {
		margin: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		padding: 0;
		gap: 0.25rem;
		flex-wrap: no-wrap;
		overflow-x: hidden;
		padding: 0 0.5rem;
	}

	a,
	.menu-button {
		text-decoration: none;
		cursor: default;
		color: light-dark(#4868a9, #c5dbff);
		font-weight: 500;
		padding: 0.5rem 0.5rem;
		transition: background-color 80ms ease-in-out;
		border-radius: 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	a span,
	.menu-button {
		text-box: trim-both cap alphabetic;
		margin-top: 1px;
		flex-grow: 1;
		flex-shrink: 1;
	}
	.menu-button {
		flex-grow: 0;
	}
	a:hover,
	.menu-button:hover {
		background-color: light-dark(#ecf3ff, #303030);
	}
	a:active,
	.menu-button:active {
		background-color: light-dark(#d6e2ff, #3a3a3a);
	}

	svg {
		block-size: 1.25rem;
		inline-size: 1.25rem;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.menu-button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		height: 2.25rem;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-button-container {
		height: var(--header-height);
		display: flex;
		align-items: center;
		padding: 0 0.5rem;
	}
</style>
