<script lang="ts">
	import { Timeline } from '$lib/components';

	import TimberDam from './Glendale-Timber-Dam.png?enhanced&w=96&aspect=1';
	import Sanborn2020 from './Sanborn-ConesteeMills-1920.png?enhanced&w=96&aspect=1';
</script>

<Timeline.Track>
	<Timeline.Entry
		date={1920}
		icon={{
			src: Sanborn2020,
			alt: ''
		}}
	>
		{#snippet heading()}
			Sanborn Map
		{/snippet}
		{#snippet caption()}
			1920
		{/snippet}

		<enhanced:img src="./Sanborn-ConesteeMills-1920.png" alt="Sanborn Map 1920" />
	</Timeline.Entry>

	<Timeline.Entry date={1923} icon={{ src: TimberDam, alt: '' }}>
		{#snippet heading()}
			City determined need for sewage disposal plant for Greenville
		{/snippet}
		{#snippet caption()}
			1923
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

	<Timeline.Entry date={{ start: 1923, end: 1924 }} icon={{ src: TimberDam, alt: '' }}>
		{#snippet heading()}
			Reedy River and Lake Conestee conditions "at their worst"
		{/snippet}
		{#snippet caption()}
			1923-1924
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
		date={{ start: 1923, end: 1924 }}
		icon={{
			src: 'https://imgs.search.brave.com/fk3dWwxKWb3Rso5QonAo8o3pOS0mF7qRYcU_16STB4Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iLnRo/dW1icy5yZWRkaXRt/ZWRpYS5jb20vZkpP/Qm1MclJ3d0NUNG1O/RTZjdGN4WjM5VDAy/WVpGMkUzdGdvN0ZY/bG5rcy5qcGc',
			alt: 'Sample icon'
		}}
	>
		{#snippet heading()}
			much sickness in Conestee Mills
		{/snippet}
		{#snippet caption()}
			1923-1924
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

	<Timeline.Entry date={{ start: 1923, end: 1927 }} icon={{ src: TimberDam, alt: '' }}>
		{#snippet heading()}
			Widespread complaints about sewage in the Reedy River and Lake Conestee throughout the City
		{/snippet}
		{#snippet caption()}
			1923-1927
		{/snippet}

		<p>
			R.F. Watson-Mayor; first sewage complaints (1924 or 1925); complaints throughout City; need
			for sewer District; raw sewage from sources upstream of city; 15-20 times as many people above
			the City, e.g. City View
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={1923} icon={{ src: TimberDam, alt: '' }}>
		{#snippet heading()}
			State and County healthy authorities become active
		{/snippet}
		{#snippet caption()}
			1923
		{/snippet}

		<p>conditions very serious; State and County healthy authorities become active</p>

		<p>
			Reedy River in very bad condition; per Dr. Baylis Earle; inspections by Earle and Filby (City
			Engineer)
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={1924} icon={{ src: TimberDam, alt: '' }}>
		{#snippet heading()}
			lake drawn down several times to release contaminated water
		{/snippet}
		{#snippet caption()}
			1924
		{/snippet}

		<p>conditions very serious; State and County healthy authorities become active</p>

		<p>
			Reedy River in very bad condition; per Dr. Baylis Earle; inspections by Earle and Filby (City
			Engineer)
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={{ start: 1924, end: 1925 }} icon={{ src: TimberDam, alt: '' }}>
		{#snippet heading()}
			After long legislative stuggle, Greenville becomes first city in South Carolina to treat
			sewage
		{/snippet}
		{#snippet caption()}
			1924-1925
		{/snippet}

		<p>City agitated legislature in 1924</p>

		<p>
			minutes of Greater Greenville Sewer District Commission; proposals for award to J.E. Sirrine
			for sewer plant
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={1925} icon={{ src: TimberDam, alt: '' }}>
		{#snippet heading()}
			Conestee Mills sues City of Greenville
		{/snippet}
		{#snippet caption()}
			1924-1925
		{/snippet}

		<p>Lawsuit Conestee Mills v. City of Greenville Commenced - seeking $100K damages</p>
	</Timeline.Entry>
</Timeline.Track>

<style>
	/* undo the margin and padding reset applied by StoryMaps */
	* {
		margin: revert;
		padding: revert;
	}
</style>
