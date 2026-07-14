<script lang="ts">
	import { Timeline } from '$lib/components';
</script>

<Timeline.Track>
	<Timeline.Entry date={1980}>
		{#snippet heading()}
			Lorem ipsum dolor sit amet consectetur adipiscing elit.
		{/snippet}
		{#snippet caption()}
			1980
		{/snippet}

		<p>
			Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus
			duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus
			nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
			hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
			inceptos himenaeos.
		</p>

		<p>
			Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
			pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean
			sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
			massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti
			sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
		</p>

		<ol>
			<li>First item</li>
			<li>Second item</li>
			<li>Third item</li>
		</ol>
	</Timeline.Entry>

	<Timeline.Entry date={1981}>
		{#snippet heading()}
			Lorem ipsum dolor sit amet consectetur adipiscing elit.
		{/snippet}
		{#snippet caption()}
			1981
		{/snippet}

		<p>
			Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus
			duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus
			nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
			hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
			inceptos himenaeos.
		</p>

		<p>
			Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
			pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean
			sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
			massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti
			sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
		</p>

		<ol>
			<li>First item</li>
			<li>Second item</li>
			<li>Third item</li>
		</ol>
	</Timeline.Entry>

	<Timeline.Entry
		date={{ start: 1981, end: 1985 }}
		icon={{
			src: 'https://imgs.search.brave.com/fk3dWwxKWb3Rso5QonAo8o3pOS0mF7qRYcU_16STB4Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iLnRo/dW1icy5yZWRkaXRt/ZWRpYS5jb20vZkpP/Qm1MclJ3d0NUNG1O/RTZjdGN4WjM5VDAy/WVpGMkUzdGdvN0ZY/bG5rcy5qcGc',
			alt: 'Sample icon'
		}}
	>
		{#snippet heading()}
			Lorem ipsum dolor sit amet consectetur adipiscing elit.
		{/snippet}
		{#snippet caption()}
			1981-1985
		{/snippet}

		<p>
			Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus
			duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus
			nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
			hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
			inceptos himenaeos.
		</p>

		<img
			src="https://imgs.search.brave.com/fk3dWwxKWb3Rso5QonAo8o3pOS0mF7qRYcU_16STB4Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iLnRo/dW1icy5yZWRkaXRt/ZWRpYS5jb20vZkpP/Qm1MclJ3d0NUNG1O/RTZjdGN4WjM5VDAy/WVpGMkUzdGdvN0ZY/bG5rcy5qcGc"
			alt=""
		/>

		<p>
			Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
			pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean
			sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
			massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti
			sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
		</p>

		<ol>
			<li>First item</li>
			<li>Second item</li>
			<li>Third item</li>
		</ol>

		<p>
			Habitant morbi senectus netus suscipit auctor curabitur facilisi cubilia curae hac habitasse
			platea dictumst lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex
			sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus
			leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas
			iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent
			taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque
			penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis
			nulla molestie mattis scelerisque maximus eget fermentum odio phasellus non purus est
			efficitur laoreet mauris pharetra vestibulum fusce dictum risus blandit quis suspendisse
			aliquet nisi sodales consequat magna ante condimentum neque at luctus nibh finibus facilisis
			dapibus etiam interdum tortor ligula congue sollicitudin erat viverra ac tincidunt nam.
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={1984}>
		{#snippet heading()}
			Lorem ipsum dolor sit amet consectetur adipiscing elit.
		{/snippet}
		{#snippet caption()}
			1984
		{/snippet}

		<p>
			Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus
			duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus
			nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
			hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
			inceptos himenaeos.
		</p>

		<p>
			Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
			pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean
			sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
			massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti
			sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
		</p>

		<ol>
			<li>First item</li>
			<li>Second item</li>
			<li>Third item</li>
		</ol>
	</Timeline.Entry>
</Timeline.Track>

<style>
	/* undo the margin and padding reset applied by StoryMaps */
	* {
		margin: revert;
		padding: revert;
	}
</style>
