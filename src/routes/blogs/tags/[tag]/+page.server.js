import { serializeNonPOJOs } from '$lib/utils/api';

export const load = async (event) => {
	const slug = event.params['tag'];

	// you can also fetch all records at once via getFullList
	const blogs = await event.locals.pb.collection('blogs').getFullList({
		sort: '-created',
		filter: `tags?="${slug}"`
	});

	return {
		blogs: serializeNonPOJOs(blogs)
	};
};
