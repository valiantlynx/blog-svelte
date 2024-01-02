/* eslint-disable no-console */

/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache=${version}`;

const ASSETS = [...build, ...files];

// install the service worker
self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

// activate the service worker
self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) {
				await caches.delete(key);
			}
		}
	}
	event.waitUntil(deleteOldCaches());
});

// listen to fetch event
self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function response() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// serve build files from the cache
		if (ASSETS.includes(url.pathname)) {
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		//try the network first
		try {
			const response = await fetch(event.request);

			const isNotExtension = url.protocol == 'http:';
			const isSuccess = response.status == 200;

			if (isNotExtension && isSuccess) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			// fallback to cache
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		return new Response('Not Found', { status: 404 });
	}

	event.respondWith(response());
});

self.addEventListener('message', (event) => {
	if (event.data && event.data.type == 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

// self.addEventListener('sync', event => {
// 	if (event.tag === "sync-messages") {
// 		event.waitUntil(sendOutboxMessages());
// 	  }
// })

// self.addEventListener("periodicsync", (event) => {
//   if (event.tag === "get-latest-news") {
//     event.waitUntil(fetchAndCacheLatestNews());
//   }
// });

// Background Fetch API provides a method for managing downloads that may take a significant amount of time such as
// movies, audio files, and software.
if (!('BackgroundFetchManager' in self)) {
	// Provide fallback downloading.
}

self.addEventListener(
	'notificationclick',
	(event) => {
		event.notification.close();
		if (event.action === 'archive') {
			// User selected the Archive action.
			console.log('archive');
		} else if (event.action === 'hello') {
			console.log('hello');
		} else {
			// User selected (e.g., clicked in) the main body of notification.
			console.log('open');
			const clients = self.clients as unknown as Clients;
			clients.openWindow('/desktop');
		}
	},
	false
);

// fredrick add push notification

const urlBase64ToUint8Array = (base64String) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

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

self.addEventListener('activate', async () => {
	const subscription = await self.registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(
			'BN-uaYr5X_DoEGX20GbblMV1WiC9wl6YNM0GtUBeJoZPElFt_fSUUCj1iV6RfSMweUh7I9pMODAeCb4sj1LgBLU'
		)
	});

	const response = await saveSubscription(subscription);
	console.log('response', response);
});

self.addEventListener('push', (e) => {
	//const data = e.data.json();
	console.log('[Service Worker] Push Received.', e);

	const title = 'hello pushy test'; //data.title
	const options = {
		body: 'Notification from NodeJs server',
		icon: '/android-icon-96x96.png',
		badge: '/android-icon-96x96.png'
	};
	self.registration.showNotification(title, options);
});
