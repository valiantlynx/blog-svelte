import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs, getImageURL } from '$lib/utils/api';

export const load = async ({ locals, params }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	try {
		// Look up blog by slug since URL uses slug
		const blog = serializeNonPOJOs(
			await locals.pb.collection('blogs').getFirstListItem(`slug="${params.blog}"`)
		);

		// Check if user is the author
		if (locals.user.id !== blog.author) {
			throw error(403, 'You can only edit your own blogs');
		}

		// Get the image URL
		blog.image = getImageURL(blog.collectionId, blog.id, blog.image);

		return {
			blog
		};
	} catch (err) {
		console.error('Error: ', err);
		throw error(err.status || 500, err.message || 'Failed to load blog');
	}
};

export const actions = {
	updateBlog: async ({ request, locals, params }) => {
		const formData = await request.formData();

		// First get the blog by slug to get the ID
		let blogId = params.blog;
		try {
			const blog = await locals.pb.collection('blogs').getFirstListItem(`slug="${params.blog}"`);
			blogId = blog.id;
		} catch (err) {
			// Try using as ID directly if slug lookup fails
			blogId = params.blog;
		}

		// Handle content_object
		const contentObjectStr = formData.get('content_object');
		if (contentObjectStr) {
			try {
				const content_object = JSON.parse(contentObjectStr);
				formData.set('content_object', JSON.stringify(content_object));
			} catch (err) {
				console.error('Error parsing content_object:', err);
			}
		}

		// Handle image
		const image = formData.get('image');
		if (image && image.size === 0) {
			formData.delete('image');
		}

		try {
			await locals.pb.collection('blogs').update(blogId, formData);
		} catch (err) {
			console.error('Error: ', err);
			console.error('Error.data: ', err.data);
			if (err.data?.data?.title?.message) {
				throw error(err.status, `Blog title cannot be empty: ${err.data?.data?.title?.message}`);
			} else if (err.data?.data?.summary?.message) {
				throw error(
					err.status,
					`Blog summary cannot be empty: ${err.data?.data?.summary?.message}`
				);
			} else if (err.data?.data?.slug?.message) {
				throw error(err.status, `Blog slug cannot be empty: ${err.data?.data?.slug?.message}`);
			} else {
				throw error(err.status || 500, err.message || 'Failed to update blog');
			}
		}

		// Don't redirect - just return success so the toast shows and page stays
		return {
			success: true,
			message: 'Blog updated successfully'
		};
	}
};
