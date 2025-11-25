import { getImageURL, serializeNonPOJOs } from '$lib/utils/api';

export const load = async (event) => {
	try {
		const blogs = await event.locals.pb.collection('blogs').getList(1, 10, {
			sort: '-create',
			expand: 'author'
		});

		for (const item of blogs.items) {
			item.image = getImageURL(item.collectionId, item.id, item.image);
		}

		return {
			blogs: serializeNonPOJOs(blogs)
		};
	} catch (error) {
		console.warn('Could not fetch blogs:', error instanceof Error ? error.message : error);
		return {
			blogs: { items: [], page: 1, perPage: 10, totalItems: 0, totalPages: 0 }
		};
	}
};
