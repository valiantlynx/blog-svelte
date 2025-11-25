import { error, redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		redirect(303, '/dashboard/profile/preview');
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email');
		const password = data.get('password');
		try {
			// Authenticate the user and get the token from the server
			await event.locals.pb.collection('users_valiantlynx').authWithPassword(email, password);
			// get their IP address
			// console.log('event', event.getClientAddress());
		} catch (err) {
			if (err.data?.data?.identity?.message) {
				error(err.status, `Your email ${err.data?.data?.identity?.message}`);
			} else if (err.data?.data?.password?.message) {
				error(err.status, `Your password ${err.data?.data?.password?.message}`);
			} else {
				error(err.status, err.message);
			}
		}
		redirect(303, '/dashboard');
	},
	oauth2google: async (event) => {
		const authMethods = await event.locals.pb?.collection('users_valiantlynx').listAuthMethods(); // generates a state and a verifier
		if (!authMethods) {
			return {
				authProviders: ''
			};
		}

		const redirectUrl = `${event.url.origin}/api/oauth/google`;
		const googleAuthProvider = authMethods.authProviders.find(
			(provider) => provider.name === 'google'
		);
		const authProviderRedirect = `${googleAuthProvider?.authUrl}${redirectUrl}&googleAuthState=${googleAuthProvider?.state}`;
		// Save the state and verifier in a cookie
		const state = googleAuthProvider.state;
		const verifier = googleAuthProvider.codeVerifier;

		/* @migration task: add path argument */ event.cookies.set('state', state);
		/* @migration task: add path argument */ event.cookies.set('verifier', verifier);
		redirect(302, authProviderRedirect);
	}
};
