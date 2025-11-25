import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const load = async (event) => {
	if (!event.locals.pb.authStore.isValid) {
		redirect(303, '/login');
	}
};
