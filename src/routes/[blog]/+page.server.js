import { serializeNonPOJOs, getImageURL } from '$lib/utils/api';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const slug = event.params['blog'];
	const blog = await event.locals.pb.collection('blogs').getFirstListItem(`slug="${slug}"`, {
		expand: ['tags, author']
	});
	blog.image = getImageURL(blog.collectionId, blog.id, blog.image, 'thumb=200x200');
	return {
		blog: serializeNonPOJOs(blog)
	};
};

export const actions = {
	toggleLike: async ({ locals, request }) => {
		const form = await request.formData();
		const contentId = form.get('blogId');
		const userId = form.get('userId');
		try {
			console.log('contentId', contentId);
			console.log('userId', userId);

			// Logic to toggle like
			// Check if the like exists
			const existingLike = await locals.pb
				.collection('valiantlynx_likes')
				.getFirstListItem(`userId='${userId}' && contentId='${contentId}'`, {});

			console.log('existingLike', existingLike);

			if (existingLike) {
				console.log('unliking');
				// Unlike
				await locals.pb.collection('valiantlynx_likes').delete(existingLike.id);
				return {
					status: 200,
					message: 'Unliked blog successfully'
				};
			} else {
				console.log('liking');
				// Like
				const data = {
					userId: userId,
					contentType: 'blog',
					contentId: contentId
				};
				await locals.pb.collection('valiantlynx_likes').create(data);
				return {
					status: 200,
					message: 'Liked blog successfully'
				};
			}
		} catch (err) {
			// Handle not found error specifically
			if (err.status === 404) {
				// If like record not found, create a new like
				const data = {
					userId: userId,
					contentType: 'blog',
					contentId: contentId
				};
				await locals.pb.collection('valiantlynx_likes').create(data);
			} else {
				// Other errors
				throw error(err.status, err.message);
			}
			console.log('err', err);
			if (err.data?.data?.identity?.message) {
				throw error(err.status, `Your email ${err.data?.data?.identity?.message}`);
			} else if (err.data?.data?.password?.message) {
				throw error(err.status, `Your password ${err.data?.data?.password?.message}`);
			} else {
				throw error(err.status, err.message);
			}
		}
	}
};
