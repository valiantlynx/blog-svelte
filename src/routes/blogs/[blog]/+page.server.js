import { serializeNonPOJOs, getImageURL } from '$lib/utils/api';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const slug = event.params['blog'];
	const blog = await event.locals.pb.collection('blogs').getFirstListItem(`slug="${slug}"`, {
		expand: ['tags, author']
	});

	// Check if blog is published or if user is the author
	const isAuthor = event.locals.user && event.locals.user.id === blog.author;
	if (!blog.published && !isAuthor) {
		throw error(404, 'Blog not found');
	}

	blog.image = getImageURL(blog?.collectionId, blog?.id, blog?.image, 'thumb=200x200');
	return {
		blog: serializeNonPOJOs(blog)
	};
};

export const actions = {
	toggleLike: async ({ locals, request }) => {
		const form = await request.formData();
		const contentId = form.get('blogId');
		const userId = form.get('userId');

		if (!userId || !contentId) {
			throw error(400, 'Invalid request data');
		}

		try {
			const existingLike = await locals.pb
				.collection('valiantlynx_likes')
				.getFirstListItem(`userId='${userId}' && contentId='${contentId}'`, {});

			if (!existingLike) {
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
			} else {
				await locals.pb.collection('valiantlynx_likes').delete(existingLike.id);
				return {
					status: 200,
					message: 'Unliked blog successfully'
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
				return {
					status: 200,
					message: 'Liked blog successfully'
				};
			} else {
				throw error(err.status, err.message);
			}
		}
	},

	updateBlog: async ({ locals, request, params }) => {
		// Check if user is authenticated
		if (!locals.pb.authStore.isValid) {
			throw error(401, 'Unauthorized - Please log in');
		}

		const form = await request.formData();
		const contentObjectStr = form.get('content_object');
		const blogId = form.get('blogId');

		if (!contentObjectStr || !blogId) {
			throw error(400, 'Invalid request data');
		}

		try {
			// Parse the content object
			const content_object = JSON.parse(contentObjectStr);

			// Update the blog with the authenticated pb instance
			const updatedBlog = await locals.pb.collection('blogs').update(blogId, {
				content_object
			});

			return {
				success: true,
				message: 'Blog post updated successfully',
				blog: serializeNonPOJOs(updatedBlog)
			};
		} catch (err) {
			console.error('Error updating blog:', err);
			throw error(err.status || 500, err.message || 'Failed to update blog');
		}
	},

	togglePublish: async ({ locals, request, params }) => {
		// Check if user is authenticated
		if (!locals.pb.authStore.isValid) {
			throw error(401, 'Unauthorized - Please log in');
		}

		const form = await request.formData();
		const blogId = form.get('blogId');

		if (!blogId) {
			throw error(400, 'Invalid request data');
		}

		try {
			// Get the current blog to check if user is the author
			const blog = await locals.pb.collection('blogs').getOne(blogId);

			// Check if user is the author
			if (blog.author !== locals.user.id) {
				throw error(403, 'Forbidden - You can only toggle your own blogs');
			}

			// Toggle the published status
			const updatedBlog = await locals.pb.collection('blogs').update(blogId, {
				published: !blog.published
			});

			return {
				success: true,
				message: updatedBlog.published ? 'Blog published successfully' : 'Blog moved to draft',
				blog: serializeNonPOJOs(updatedBlog)
			};
		} catch (err) {
			console.error('Error toggling publish status:', err);
			throw error(err.status || 500, err.message || 'Failed to update blog status');
		}
	}
};
