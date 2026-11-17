<h1>
	<span class="title-main">
		<span class="line upstream">Dammed if you <em>do</em>,</span>
		<span class="line downstream">dammed if you <em>don’t</em>.</span>
	</span>
	<span class="visually-hidden">:</span>
	<span class="title-sub">The Lake Conestee Dam Story</span>
</h1>

<style>
	h1 {
		--box-border: 3px;
		--box-pad: clamp(1.25rem, 3.5vw, 2.75rem);
		display: flex;
		flex-direction: column;
		gap: clamp(0.75rem, 2vw, 1.5rem);
		width: fit-content;
		max-width: 100%;
		box-sizing: border-box;
		line-height: 1.15;
		/* make room for the half of the subtitle that hangs below the box */
		margin: 0 0 0.75rem;
		padding: var(--box-pad) var(--box-pad) 0;
		border: var(--box-border) solid var(--color-accent);
		border-bottom: none;
	}

	.title-main {
		display: grid;
		width: fit-content;
		max-width: 100%;
		font-size: var(--project-title-size, clamp(1.75rem, 7.5vw, 5.25rem));
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		text-shadow: var(--project-title-shadow, 0 2px 24px rgba(0 0 0 / 35%));
	}

	.line {
		display: block;
		text-wrap: balance;
	}

	.downstream {
		justify-self: end;
		padding-left: 1.25em;
		color: var(--color-accent);
	}

	em {
		font-style: italic;
		font-weight: 800;
	}

	.title-sub {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: var(--project-subtitle-size, clamp(1rem, 2.6vw, 1.5rem));
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-accent);
		/* stretch to the box's outer edges and center on its bottom edge so the
		   lines on either side of the text become the box's bottom border */
		margin-inline: calc(-1 * (var(--box-pad) + var(--box-border)));
		transform: translateY(50%);
	}

	.title-sub::before,
	.title-sub::after {
		content: '';
		height: var(--box-border);
		background-color: currentColor;
	}

	.title-sub::before {
		flex: none;
		width: calc(var(--box-pad) - 1rem + var(--box-border));
	}

	.title-sub::after {
		flex: 1 1 1rem;
		min-width: 1rem;
	}

	@media (max-width: 480px) {
		h1 {
			--box-pad: 1rem;
			width: 100%;
			/* size the title relative to the box so it always fills the box's width */
			container-type: inline-size;
		}

		.title-main {
			font-size: var(--project-title-size, 10.8cqi);
		}

		.downstream {
			justify-self: start;
			padding-left: 0;
		}

		.title-sub {
			gap: 0.5rem;
			font-size: var(--project-subtitle-size, min(0.875rem, 5.6cqi));
			letter-spacing: 0.08em;
		}

		.title-sub::before {
			width: calc(var(--box-pad) - 0.5rem + var(--box-border));
		}
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
