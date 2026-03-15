<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Toaster } from 'svelte-french-toast';
	import Icon from '@iconify/svelte';
	import * as m from '$lib/paraglide/messages.js';
	import '../app.postcss';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Extract page data for use in svelte:head to avoid SSR issues
	let siteName = $derived(page.data.siteName);
	let sites = $derived(page.data.sites);

	async function detectServiceWorkerUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newServiceWorker = registration.installing;
			newServiceWorker?.addEventListener('statechange', () => {
				if (newServiceWorker.state == 'installed') {
					// TODO: Add badge to show unread notifications
					let unreadCount = 1;
					navigator.setAppBadge(unreadCount);
					console.log('New Service Worker found, update available.');
					if (navigator.serviceWorker.controller) {
						console.log('New Service Worker installed.');
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

    if (page.data.user) {
        const tryClick = () => {
            // Try inner text div first, fall back to outer
            const loginBtn = document.querySelector('.samlet-chat-login-text') 
                          ?? document.querySelector('#samlet-chat-login');
            if (loginBtn instanceof HTMLElement) {
                loginBtn.click();
                return true;
            }
            return false;
        };

        // Check if button already exists before setting up observer
        if (!tryClick()) {
            const target = document.getElementById('samlet-chat');
            if (target) {
                const observer = new MutationObserver(() => {
                    if (tryClick()) observer.disconnect();
                });
                observer.observe(target, { childList: true, subtree: true });
                setTimeout(() => observer.disconnect(), 10000);
            }
        }
    }
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
					alert(m['notifications.permission_denied']());
				}
			});
		} else {
			// If the user refuses to get notified
			alert(m['notifications.permission_denied_detailed']());
		}
	}

	async function notification() {
		const reg = await navigator.serviceWorker.getRegistration();
		const options = {
			body: m['notifications.notification_test_body'](),
			icon: '/mine.png'
		};
		reg.showNotification(m['notifications.notification_test_title'](), options);
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

	let loadingHref = $state('');

	function handleNavClick(href: string) {
		loadingHref = href;
	}
</script>

<svelte:head>
	<title>{siteName}</title>
	<!-- Canonical Link -->
	<link rel="canonical" href="https://{siteName}/" />
	<!-- Author Meta Tag -->
	<meta name="author" content={siteName} />
	<!--OWN STUFF-->
	<link rel="dns-prefetch" href="https://{siteName}" />

	<meta name="apple-mobile-web-app-title" content={siteName} />

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<meta name="mobile-web-app-capable" content="yes" />

	{#if sites}
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
			})(window, document, 'clarity', 'script', '${sites.clarity_tag}');
		</script>`}

		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id={page.data.sites.google_tag}"
		></script>
		{@html `<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());

			gtag('config', '${page.data.sites.google_tag}');
		</script>`}

		<!-- Google Adsense -->
		<!-- Google Adsense -->
		<!-- Google Adsense -->
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={page.data.sites
				.google_ads_client}"
			crossorigin="anonymous"
		></script>

		<script
			defer
			data-domain="valiantlynx.com"
			src="https://plausible.valiantlynx.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
		></script>
		<script>
			window.plausible =
				window.plausible ||
				function () {
					(window.plausible.q = window.plausible.q || []).push(arguments);
				};
		</script>
	{/if}
</svelte:head>

<Toaster />
<Nav />
<!-- Mobile spacer: compensates for the fixed top nav height (h-14 = 56px) -->
<div class="h-14 md:hidden" aria-hidden="true"></div>
{@render children?.()}
<div class="container mx-auto">
	<script defer src="https://samlet-chat.valiantlynx.com/js/samlet-chat.js"></script>
	<div id="samlet-chat"></div>
</div>

{#if page.data.feedbackToken}
	<feedback-widget
		data-repo="valiantlynx/blog-svelte"
		data-token={page.data.feedbackToken}
		data-type="discussions"
		data-title={m['buttons.send']()}
		data-position="right"
		data-primary-color="#10b981"
	>
	</feedback-widget>
{/if}

<!-- Mobile Dashboard Bottom Navigation — only on /dashboard/* routes, only on mobile -->
{#if page.data.user} 
	<nav
		class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-base-200 border-t border-base-300 shadow-lg"
	>
		<div class="flex items-center justify-around px-2 py-1">
			{#each [
				{ href: '/', icon: 'bx:bx-home', label: m['tooltips.home']() },
				{ href: '/dashboard/profile', icon: 'iconoir:profile-circle', label: m['tooltips.profile']() },
				{ href: '/dashboard/manager', icon: 'material-symbols:bookmark-manager', label: m['tooltips.manage']() },
				...(page.data.user?.role.includes('admin') ? [{ href: '/dashboard/admin', icon: 'bx:bx-shield', label: m['tooltips.admin']() }] : [])
			] as item}
				<a
					target="_self"
					href={item.href}
					onclick={() => handleNavClick(item.href)}
					class="flex flex-col items-center gap-0.5 text-base-content hover:text-primary transition-colors p-2 min-w-0 relative"
				>
					{#if loadingHref === item.href}
						<svg
							class="animate-spin h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					{:else}
						<Icon icon={item.icon} width="22" height="22" />
					{/if}
					<span class="text-xs truncate">{item.label}</span>
				</a>
			{/each}

			<form action="/api/logout" method="POST">
				<button
					type="submit"
					class="flex flex-col items-center gap-0.5 text-base-content hover:text-primary transition-colors p-2 min-w-0"
				>
					<Icon icon="bx:bx-log-out" width="22" height="22" />
					<span class="text-xs truncate">{m['tooltips.logout']()}</span>
				</button>
			</form>
		</div>
	</nav>
{/if}
<Footer />
