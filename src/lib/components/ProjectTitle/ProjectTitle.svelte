<h1>
	<span class="title-main">Containment<span class="visually-hidden">:</span></span>
	<span class="title-sub">The Conestee Dam Story</span>
</h1>

<style>
	h1 {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		line-height: 1.15;
		margin: 0;
	}

	.title-main {
		font-size: clamp(3rem, 11vw, 7.5rem);
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.03em;
		text-shadow: 0 2px 24px rgba(0 0 0 / 35%);
	}

	.title-sub {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: clamp(1rem, 2.6vw, 1.5rem);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: light-dark(#4868a9, #c5dbff);
	}

	.title-sub::before {
		content: '';
		flex: none;
		width: clamp(2rem, 6vw, 4rem);
		height: 3px;
		border-radius: 2px;
		background-color: currentColor;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
