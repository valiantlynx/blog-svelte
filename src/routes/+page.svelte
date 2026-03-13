<script>
	import Carousel from '$lib/components/splide/Carousel.svelte';
	import BlogGrid from '$lib/components/BlogGrid.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';

	async function requestNotificationPermission() {
		if (!('Notification' in window)) {
			// Check if the browser supports notifications
			alert(m['notifications.browser_no_support']());
		} else if (Notification.permission === 'granted') {
			// Check whether notification permissions have already been granted;
			// if so, create a notification
			await showNotification(m['notifications.notification_title'](), {
				actions: [
					{
						action: 'hello',
						title: m['notifications.notification_action']()
					}
				],
				body: m['notifications.notification_body'](),
				icon: 'logo.svg',
				vibrate: [200, 100, 200, 100, 200, 100, 200],
				requireInteraction: true,
				renotify: true,
				image: 'og.png',
				tag: m['notifications.notification_tag'](),
				lang: 'en',
				dir: 'ltr',
				badge: 'logo.svg',
				sound: 'mixkit-bubble-pop-up-alert-notification-2357.wav'
			});
		} else if (Notification.permission !== 'denied') {
			// We need to ask the user for permission
			Notification.requestPermission().then((permission) => {
				// If the user accepts, let's create a notification
				if (permission === 'granted') {
					const notification = new Notification(m['notifications.notification_title']());
					// …
				}
			});
		}

		// At last, if the user has denied notifications, and you
		// want to be respectful there is no need to bother them anymore.
	}

	// example notification
	async function showNotification(message, options) {
		const registration = await navigator.serviceWorker.ready;
		// Show a notification that includes an action titled Archive.
		registration.showNotification(message, options);
	}
</script>

<Carousel />

<!-- Navigation Section -->
<div class="flex flex-col items-center justify-center m-5 pt-10 gap-4 text-base-content">
	<h2 class="text-3xl font-bold">Explore More</h2>
	<div class="flex flex-col sm:flex-row gap-4">
		<Button href="/blogs" variant="outline" class="min-w-[200px]">📝 View All Blogs</Button>
		<Button href="/projects" variant="outline" class="min-w-[200px]">🚀 View Projects</Button>
	</div>
</div>

<!-- Most Recent Blogs -->
<div class="flex flex-col items-center justify-center m-5 pt-10 gap-4 text-base-content">
	<h2 class="text-4xl font-bold">{m['home.most_recent_blogs']()}</h2>
	<Button href="/blogs" variant="primary">{m['buttons.show_more']()}</Button>
</div>

<BlogGrid />

<button
	class="transition cursor-pointer xl:mb-5 mr-5 xl:mr-0"
	onclick={requestNotificationPermission}
>
	<img src="/images/subscriptions.webp" alt="notify me" class="w-10 h-10" />
</button>

<svelte:head>
	<title>{page.data.siteName}</title>
	<!-- Canonical Link -->
	<link rel="canonical" href="https://{page.data.siteName}/" />
	<!-- Author Meta Tag -->
	<meta name="author" content={page.data.siteName} />
	<!--OWN STUFF-->
	<link rel="dns-prefetch" href="https://{page.data.siteName}" />

	<meta name="apple-mobile-web-app-title" content={page.data.siteName} />

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<meta name="mobile-web-app-capable" content="yes" />

	<!-- Open Graph Meta Tags (for social media sharing) -->
	<meta property="og:title" content={page.data.siteName} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.origin} />
	<!--meta property="og:image" content="/twitter-image.png" /-->
	<meta property="og:image:alt" content="{page.data.siteName} Logo" />
	<meta property="og:site_name" content={page.data.siteName} />

	<!-- Twitter Meta Tags (for social media sharing) -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={page.data.siteName} />
	<meta
		name="twitter:description"
		content="ValiantLynx.com is an innovative digital platform dedicated to empowering creators, tech enthusiasts, and curious minds. Our website offers a dynamic blend of inspiring blog posts, cutting-edge project showcases, and a vibrant community space. Dive into a world where technology meets creativity, with in-depth articles, engaging tutorials, and the latest tech trends. Whether you're a seasoned developer, a creative professional, or just passionate about technology, ValiantLynx.com is your go-to source for insights, inspiration, and cutting-edge digital exploration. Join us at ValiantLynx.com – where technology and creativity converge to spark imagination and drive innovation."
	/>
	<!--meta name="twitter:image" content="/twitter-image.png" /-->

	<!-- Google / Search Engine Tags -->
	<meta itemprop="name" content={page.data.siteName} />

	<!-- Facebook Meta Tags (for social media sharing) -->
	<meta property="fb:app_id" content={page.data.siteName} />
	<meta property="fb:admins" content={page.data.siteName} />
	<meta property="fb:page_id" content={page.data.siteName} />
	<meta property="fb:site_name" content={page.data.siteName} />
	<meta property="article:publisher" content={page.data.siteName} />
	<meta property="article:author" content={page.data.siteName} />
	<meta property="article:section" content={page.data.siteName} />
	<meta property="article:tag" content={page.data.siteName} />
	<meta property="article:published_time" content={page.data.siteName} />
	<meta property="article:modified_time" content={page.data.siteName} />
	<meta property="article:expiration_time" content={page.data.siteName} />
	<meta property="article:author:first_name" content={page.data.siteName} />
	<meta property="article:author:last_name" content={page.data.siteName} />
	<meta property="article:author:username" content={page.data.siteName} />

	<!-- Schema.org Meta Tags (for SEO) -->
	<meta itemprop="headline" content={page.data.siteName} />
	<meta
		itemprop="description"
		content="ValiantLynx.com is an innovative digital platform dedicated to empowering creators, tech enthusiasts, and curious minds. Our website offers a dynamic blend of inspiring blog posts, cutting-edge project showcases, and a vibrant community space. Dive into a world where technology meets creativity, with in-depth articles, engaging tutorials, and the latest tech trends. Whether you're a seasoned developer, a creative professional, or just passionate about technology, ValiantLynx.com is your go-to source for insights, inspiration, and cutting-edge digital exploration. Join us at ValiantLynx.com – where technology and creativity converge to spark imagination and drive innovation."
	/>
	<!--meta itemprop="image" content="/twitter-image.png" /-->
	<!-- Keywords Meta Tag -->
	<meta name="keywords" content="{import.meta.env.VITE_SITE_TAGS} {page.data.siteName}" />
</svelte:head>
