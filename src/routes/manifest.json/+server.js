/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from '@sveltejs/kit';
import { pb } from '$lib/utils/api';
import { page } from '$app/stores';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const web_app = {
		short_name: `${url.hostname}`,
		name: `${url.hostname} - Tech tips, tricks, and tutorials`,
		description:
			'valiantlynx.com is a blog, portfolio, and personal website for valiantlynx, a web developer and designer. It is built with SvelteKit and TailwindCSS.',
		developer: {
			name: 'valiantlynx',
			url: 'https://valiantlynx.com'
		},
		start_url: '/',
		id: '/',
		display_override: ['window-controls-overlay', 'fullscreen', 'minimal-ui'],
		display: 'standalone',
		orientation: 'any',
		background_color: '#ffffff',
		theme_color: '#ffffff',
		scope: '/',
		protocol_handlers: [
			{
				protocol: 'mailto',
				url: '/newEmail?to=%s'
			}
		],
		shortcuts: [
			{
				name: 'projects',
				description:
					'see all the projects you have created, or create a new one to start working on',
				url: '/projects',
				icons: [
					{
						src: '/images/projects.png',
						type: 'image/png',
						purpose: 'any'
					}
				]
			},
			{
				name: 'blogs',
				description: 'view all the blogs you have created, or create a new one to start writing',
				url: '/blogs',
				icons: [
					{
						src: '/images/blogs.png',
						type: 'image/png',
						purpose: 'any'
					}
				]
			},
			{
				name: 'Account',
				description: 'Manage your account, subscriptions, and settings',
				url: '/dashboard/profile',
				icons: [
					{
						src: '/images/subscriptions.webp',
						type: 'image/webp',
						purpose: 'any'
					}
				]
			}
		],
		icons: [
			{
				src: 'pwa-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			},
			{
				src: 'pwa-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: 'pwa-64x64.png',
				sizes: '64x64',
				type: 'image/png'
			},
			{
				src: 'maskable-icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable'
			}
		],
		dir: 'auto',
		lang: 'en-US',
		categories: [
			'books',
			'business',
			'education',
			'entertainment',
			'finance',
			'food',
			'games',
			'government',
			'lifestyle',
			'music',
			'productivity',
			'shopping',
			'social',
			'travel',
			'utilities'
		],
		screenshots: [
			{
				src: '/screenshots/screenshot-1-1921x1080.png',
				sizes: '1921x1080',
				type: 'image/png',
				form_factor: 'wide'
			},
			{
				src: '/screenshots/screenshot-2-1921x1080.png',
				sizes: '1921x1080',
				type: 'image/png',
				form_factor: 'wide'
			},
			{
				src: '/screenshots/screenshot-3-1921x1080.png',
				sizes: '1921x1080',
				type: 'image/png',
				form_factor: 'wide'
			},
			{
				src: '/screenshots/screenshot-4-1921x1080.png',
				sizes: '1921x1080',
				type: 'image/png',
				form_factor: 'wide'
			},
			{
				src: '/screenshots/screenshot-1-1170x2532.png',
				sizes: '1170x2532',
				type: 'image/png'
			},
			{
				src: '/screenshots/screenshot-2-1170x2532.png',
				sizes: '1170x2532',
				type: 'image/png'
			},
			{
				src: '/screenshots/screenshot-3-1170x2532.png',
				sizes: '1170x2532',
				type: 'image/png'
			},
			{
				src: '/screenshots/screenshot-4-1170x2532.png',
				sizes: '1170x2532',
				type: 'image/png'
			}
		],

		related_applications: [
			{
				platform: 'play',
				url: 'https://play.google.com/store/apps/details?id=com.MelioKombo.OneMinute'
			},
			{
				platform: 'play',
				url: 'https://play.google.com/store/apps/details?id=com.minfuel'
			},
			{
				platform: 'webapp',
				url: 'https://www.minfuel.com/manifest.json'
			}
		],
		prefer_related_applications: false
	};

	return new Response(JSON.stringify(web_app), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
