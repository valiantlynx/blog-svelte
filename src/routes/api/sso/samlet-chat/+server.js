// /api/sso/commento/+server.js
import { redirect, error } from '@sveltejs/kit';
import { createHmac, timingSafeEqual } from 'crypto';
import { COMMENTO_SSO_KEY, COMMENTO_URL } from '$env/static/private';

function hmacSha256(dataBuffer, keyBuffer) {
	return createHmac('sha256', keyBuffer).update(dataBuffer).digest();
}

export const GET = async ({ locals, url, cookies }) => {
	const token = url.searchParams.get('token');
	const hmac = url.searchParams.get('hmac');
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	// -------------------------------------------------------
	// STAGE 2: Zitadel redirected back here after login
	// -------------------------------------------------------
	if (code && state) {
		const redirectUrl = `${url.origin}/api/sso/commento`;
		const expectedState = cookies.get('state');
		const expectedVerifier = cookies.get('verifier');
		const commentoToken = cookies.get('commento_token');

		if (!commentoToken) {
			console.error('No commento_token cookie found');
			throw redirect(302, '/');
		}

		if (expectedState !== state) {
			console.error('State mismatch', expectedState, state);
			throw redirect(302, '/');
		}

		const authMethods = await locals.pb?.collection('users_valiantlynx').listAuthMethods();
		const provider = authMethods?.oauth2.providers.find((p) => p.name === 'oidc');
		if (!provider) {
			console.error('OIDC provider not found');
			throw redirect(302, '/');
		}

		try {
			await locals.pb
				?.collection('users_valiantlynx')
				.authWithOAuth2Code(provider.name, code, expectedVerifier, redirectUrl, {
					role: ['user']
				});
			await locals.pb.collection('users_valiantlynx').authRefresh();

			const user = locals.pb.authStore.model;

			// Build Commento payload
			const payloadObj = {
				token: commentoToken,
				email: user.email,
				name: user.name || user.username,
				...(user.avatarUrl && { photo: user.avatarUrl })
			};
			const payloadJson = JSON.stringify(payloadObj);

			const key = Buffer.from(COMMENTO_SSO_KEY, 'hex');
			const payloadHex = Buffer.from(payloadJson).toString('hex');
			const hmacHex = hmacSha256(Buffer.from(payloadJson), key).toString('hex');

			// Clean up cookies
			cookies.delete('commento_token', { path: '/' });
			cookies.delete('state', { path: '/' });
			cookies.delete('verifier', { path: '/' });

			// Redirect back to Commento
			throw redirect(
				302,
				`${COMMENTO_URL}/api/oauth/sso/callback?payload=${payloadHex}&hmac=${hmacHex}`
			);
		} catch (e) {
			if (e.status) throw e; // rethrow SvelteKit redirects
			console.error('Commento SSO stage 2 error', e);
			throw redirect(302, '/');
		}
	}

	// -------------------------------------------------------
	// STAGE 1: Commento sent user here to start SSO
	// -------------------------------------------------------
	if (token && hmac) {
		const key = Buffer.from(COMMENTO_SSO_KEY, 'hex');
		const tokenBytes = Buffer.from(token, 'hex');
		const hmacBytes = Buffer.from(hmac, 'hex');
		const expectedHmac = hmacSha256(tokenBytes, key);

		// Timing-safe comparison (prevents timing attacks)
		if (!timingSafeEqual(hmacBytes, expectedHmac)) {
			throw error(403, 'Invalid HMAC signature');
		}

		// Store Commento token to use after Zitadel login
		cookies.set('commento_token', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 10 // 10 min, matches Commento's token expiry
		});

		// Start OIDC flow via PocketBase
		const redirectUrl = `${url.origin}/api/sso/commento`;
		const authMethods = await locals.pb?.collection('users_valiantlynx').listAuthMethods();
		const provider = authMethods?.oauth2.providers.find((p) => p.name === 'oidc');
		if (!provider) {
			console.error('OIDC provider not found');
			throw redirect(302, '/');
		}

		// Save state + verifier for the callback
		cookies.set('state', provider.state, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});
		cookies.set('verifier', provider.codeVerifier, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		// Redirect user to Zitadel login
		throw redirect(302, `${provider.authURL}${encodeURIComponent(redirectUrl)}`);
	}

	throw error(400, 'Missing required parameters');
};