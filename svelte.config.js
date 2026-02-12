import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		prerender: {
			entries: ['/', '/login']
		},
		csp: {
			directives: {
				'default-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'script-src': ['self'],
				'img-src': ['self', 'https://api.qrserver.com'],
				'connect-src': ['self', 'https://api.qrserver.com', 'https://api.github.com']
			}
		}
	}
};

export default config;
