import devtoolsJson from 'vite-plugin-devtools-json';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		}),
		devtoolsJson()
	],
	server: {
		allowedHosts: [
			'7db9b44ed38a.ngrok-free.app',
			'localhost',
			'www.valiantlynx.com',
			'posthog.valiantlynx.com'
		]
	}
});
