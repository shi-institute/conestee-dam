import adapter from '@sveltejs/adapter-static';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				fallback: '404.html'
			}),
			paths: {
				relative: true,
				base:
					process.argv.includes('dev') || !process.env.BASE_PATH?.startsWith('/')
						? ''
						: (process.env.BASE_PATH as `/${string}`)
			}
		})
	],
	resolve: {
		alias: {
			$components: '/src/lib/components',
			$lib: '/src/lib',
			$timelines: '/src/lib/timelines'
		}
	},
	build: {
		// target versions that support light-dark()
		cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5', 'ios17.5']
	}
});
