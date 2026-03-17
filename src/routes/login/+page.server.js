import { error, redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/dashboard/profile/preview');
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	oauth2samletnorge: async (event) => {
		const authMethods = await event.locals.pb?.collection('users_valiantlynx').listAuthMethods(); // generates a state and a verifier
		if (!authMethods) {
			return {
				authProviders: ''
			};
		}

		const redirectUrl = `${event.url.origin}/api/oauth/samletnorge`;
		const samletnorgeAuthProvider = authMethods.oauth2.providers.find(
			(provider) => provider.name === 'oidc'
		);
		const authProviderRedirect = `${samletnorgeAuthProvider?.authUrl}${redirectUrl}&samletnorgeAuthState=${samletnorgeAuthProvider?.state}`;
		// Save the state and verifier in a cookie
		const state = samletnorgeAuthProvider.state;
		const verifier = samletnorgeAuthProvider.codeVerifier;

		event.cookies.set('state', state, { path: '/' });
		event.cookies.set('verifier', verifier, { path: '/' });
		throw redirect(302, authProviderRedirect);
	}
};
