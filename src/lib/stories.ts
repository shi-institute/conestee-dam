/** The StoryMaps stories in this project, in the order they are listed on the home page. */
export const stories = [
	{
		href: '/story/pollution',
		label: 'Pollution history',
		description:
			'Textile mills, power plants, sewage, and more: how many kinds of pollution reached the Reedy River.'
	},
	{
		href: '/story/sediment',
		label: 'Sediment aggradation',
		description: 'An exploration of how sediment has reduced the size of Lake Conestee over time.'
	},
	{
		href: '/story/watershed',
		label: 'About the watershed',
		description:
			'What a watershed is and how it works, the Reedy River watershed, and the challenges of an aging dam.'
	},
	{
		href: '/timeline',
		label: 'Timeline',
		description:
			'A chronological timeline of the dam, the mills, and the river since the 18ᵗʰ century.'
	},
	{
		href: '/story/dam',
		label: 'The new dam',
		description: 'Completed in 2025, a containment barrier built just downstream of the old dam.'
	}
] as const;
