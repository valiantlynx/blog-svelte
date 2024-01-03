import { serializeNonPOJOs, getImageURL } from '$lib/utils/api';

export const load = async (event) => {
	const id = event.params['tag'];

	// you can also fetch all records at once via getFullList
	const blogs = await event.locals.pb.collection('blogs').getFullList({
		sort: '-created', 	
		expand: ['tags, author']
	});
	
	blogs.forEach((blog) => {
		blog.image = getImageURL(blog.collectionId, blog.id, blog.image, 'thumb=200x200');
	} );
	const tag = await event.locals.pb.collection('valiantlynx_tags').getOne(id, {});
	return {
		blogs: serializeNonPOJOs(blogs),
		tag: serializeNonPOJOs(tag)
	};
};
