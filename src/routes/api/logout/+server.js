import { redirect } from '@sveltejs/kit';
import { authStore } from '$lib/utils/stores';

export const POST = (event) => {
	event.locals.pb.authStore.clear();
	event.locals.user = undefined;
	authStore.set(null);

	redirect(303, '/login');
};
