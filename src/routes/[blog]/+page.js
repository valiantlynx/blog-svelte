import { redirect } from '@sveltejs/kit';

export const load = async ({url}) => {
	// Redirect from /* to/blogs/*
	const path = url.pathname;
	throw redirect(307, "/blogs" + path);
};