<script>
	import Nav from '$lib/components/Nav.svelte';
	import Feedback from '$lib/components/feedback/Feedback.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.postcss';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	async function detectServiceWorkerUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newServiceWorker = registration.installing;
			newServiceWorker?.addEventListener('statechange', () => {
				if (newServiceWorker.state == 'installed') {
					// TODO: Add badge to show unread notifications
					let unreadCount = 1;
					navigator.setAppBadge(unreadCount);
					if (confirm('New update Available! Reload to update')) {
						navigator.clearAppBadge();
						// skipWaiting() will force the waiting ServiceWorker to become the active ServiceWorker
						newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
						window.location.reload;
					}
				}
			});
		});
	}

	//Background Synchronization API enables a web app to defer tasks so that they can
	// be run in a service worker once the user has a stable network connection
	async function syncMessagesLater(message) {
		const registration = await navigator.serviceWorker.ready;
		try {
			await registration.sync.register(message);
		} catch {
			console.log('Background Sync could not be registered!');
		}
	}
	async function checkSyncStatus(message) {
		const registration = await navigator.serviceWorker.ready;
		const tags = await registration.sync.getTags();
		if (tags.includes(message)) {
			console.log('Messages sync already requested');
		}
	}

	// Periodic Sync API enables a web app to schedule a background sync
	async function registerPeriodicNewsCheck() {
		const registration = await navigator.serviceWorker.ready;
		try {
			await registration.periodicSync.register('get-latest-news', {
				minInterval: 24 * 60 * 60 * 1000 // 1 day
			});
		} catch {
			console.log('Periodic Sync could not be registered!');
		}
	}
	async function checkPeriodicSyncStatus() {
		const registration = await navigator.serviceWorker.ready;
		const tags = await registration.periodicSync.getTags();
		if (tags.includes('get-latest-news')) {
			console.log('Periodic Sync already requested');
		}
	}

	// removes a Periodic Background Sync task to stop articles syncing in the background.
	async function unregisterPeriodicNewsCheck() {
		const registration = await navigator.serviceWorker.ready;
		try {
			await registration.periodicSync.unregister('get-latest-news');
		} catch {
			console.log('Periodic Sync could not be unregistered!');
		}
	}

	// Background Fetch API enables a web app to download assets in the background
	// and handle the completion of the download in a Service Worker.
	async function registerBackgroundFetch() {
		const registration = await navigator.serviceWorker.ready;
		try {
			const bgFetch = await registration.backgroundFetch.fetch(
				'my-fetch',
				['/divewithme.mp3', 'og.png'],
				{
					title: 'Episode 5: dive with me music.',
					icons: [
						{
							sizes: '300x300',
							src: '/divewithme.avif',
							type: 'image/avif'
						}
					],
					downloadTotal: 60 * 1024 * 1024 // 60 MB
				}
			);
		} catch {
			console.log('Background Fetch could not be registered!');
		}
	}

	// get related installed apps
	async function getInstalledApps() {
		const relatedApps = await navigator.getInstalledRelatedApps();
		const PWAisInstalled = relatedApps.length > 0;
		console.log('PWA is installed: ' + PWAisInstalled, relatedApps);
	}

	onMount(async () => {
		detectServiceWorkerUpdate();
		getInstalledApps();
	});

	function displayNotification() {
		//Ask user if we show notifications
		if (window.Notification && Notification.permission === 'granted') {
			notification();
			// We will create this function in a further step.
		}
		// If the user hasn't told whether he wants to be notified or not
		// Note: because of Chrome, we cannot be sure the permission property
		// is set, therefore it's unsafe to check for the "default" value.
		else if (window.Notification && Notification.permission !== 'denied') {
			Notification.requestPermission((status) => {
				notification();
				if (status === 'granted') {
					notification();
				} else {
					alert('You denied or dismissed permissions to notifications.');
				}
			});
		} else {
			// If the user refuses to get notified
			alert(
				'You denied permissions to notifications. Please go to your browser or phone setting to allow notifications.'
			);
		}
	}

	async function notification() {
		const reg = await navigator.serviceWorker.getRegistration();
		const options = {
			body: 'Testing Our Notification',
			icon: '/mine.png'
		};
		reg.showNotification('PWA Notification!', options);
		await not();
	}

	const urlBase64ToUint8Array = (base64String) => {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

		const rawData = atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}

		return outputArray;
	};

	const saveSubscription = async (subscription) => {
		const response = await fetch('/save-subscription', {
			method: 'post',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(subscription)
		});

		return response.json();
	};

	async function not() {
		const reg = await navigator.serviceWorker.getRegistration();
		const subscription = await reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				'BN-uaYr5X_DoEGX20GbblMV1WiC9wl6YNM0GtUBeJoZPElFt_fSUUCj1iV6RfSMweUh7I9pMODAeCb4sj1LgBLU'
			)
		});

		const response = await saveSubscription(subscription);
	}
</script>


<svelte:head>
	<title>{$page.data.siteName}</title>
	<!-- Canonical Link -->
	<link rel="canonical" href="https://{$page.data.siteName}/" />
	<!-- Author Meta Tag -->
	<meta name="author" content="{$page.data.siteName}" />
	<!--OWN STUFF-->
	<link rel="dns-prefetch" href="https://{$page.data.siteName}" />

	<meta name="apple-mobile-web-app-title" content={$page.data.siteName} />

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<meta name="mobile-web-app-capable" content="yes" />

	{#if $page.data.sites}
		<!-- clarity there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead-->
		{@html `<script type="text/javascript">
			(function (c, l, a, r, i, t, y) {
				c[a] =
					c[a] ||
					function () {
						(c[a].q = c[a].q || []).push(arguments);
					};
				t = l.createElement(r);
				t.async = 1;
				t.src = 'https://www.clarity.ms/tag/' + i;
				y = l.getElementsByTagName(r)[0];
				y.parentNode.insertBefore(t, y);
			})(window, document, 'clarity', 'script', '${$page.data.sites.clarity_tag}');
		</script>`}

		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id={$page.data.sites.google_tag}"
		></script>
		{@html `<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());

			gtag('config', '${$page.data.sites.google_tag}');
		</script>`}

		<!-- Google Adsense -->
		<!-- Google Adsense -->
		<!-- Google Adsense -->
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={$page.data.sites
				.google_ads_client}"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>


<Toaster />
<Nav />
<slot />
<Feedback />
<Footer />

