import PocketBase from 'pocketbase';
import { site } from '$lib/utils/config';
import { serializeNonPOJOs } from '$lib/utils/api';
import { authStore } from '$lib/utils/stores';
import { detectUserLanguage } from '$lib/utils/language-detection';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(site.pocketbase);

	// Language detection from request headers and user preference
	const cfCountry = event.request.headers.get('cf-ipcountry') || undefined; // Cloudflare
	console.log('CF Country:', cfCountry);
	const acceptLanguage = event.request.headers.get('accept-language') || undefined;

	// Check if user already has a language preference set (via cookie)
	const cookies = event.request.headers.get('cookie') || '';
	const existingLocale = cookies.match(/PARAGLIDE_LOCALE=([^;]+)/)?.[1];

	let userLanguage: string;

	if (existingLocale) {
		// User has already set a language preference, use it
		userLanguage = existingLocale;
		console.log('Using existing user language preference:', userLanguage);
	} else {
		// First-time visitor: detect language from country/accept-language headers
		userLanguage = detectUserLanguage(acceptLanguage, cfCountry);
		console.log('Detected language for first-time visitor:', userLanguage);
	}

	event.locals.language = userLanguage;

	let storedAuth;
	// subscribe to the auth store
	authStore.subscribe((value) => {
		storedAuth = value;
	});
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users_valiantlynx').authRefresh();
			event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
		} else if (storedAuth) {
			event.locals.pb.authStore = storedAuth;
			await event.locals.pb.collection('users_valiantlynx').authRefresh();
			event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
		}
	} catch (_) {
		await event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	// Set language cookie for first-time visitors (only if no existing preference)
	if (!existingLocale) {
		response.headers.append(
			'set-cookie',
			`PARAGLIDE_LOCALE=${userLanguage}; Max-Age=34560000; Path=/; SameSite=Lax`
		);
	}

	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: true }));
	return response;
};
