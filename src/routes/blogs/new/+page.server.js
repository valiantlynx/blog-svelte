import { error, redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		redirect(303, '/login');
	}

	if (!locals.user.role.includes('editor')) {
		redirect(303, '/pricing');
	}
};

export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();

		// Handle the blog image
		const image = formData.get('image');
		if (image.size === 0) {
			formData.delete('image');
		}

		formData.append('author', locals.user.id);

		// // set tags to an array of tag ids
		// const tags = formData.get('tags');
		// const tagIds = await createTags(tags, locals.pb);
		// //formData.set('tags', tagIds);

		try {
			await locals.pb.collection('blogs').create(formData);
		} catch (err) {
			console.error('Error: ', err);
			console.error('err.data: ', err.data);
			if (err.data?.data?.title?.message) {
				error(err.status, `Blog title cannot be empty: ${err.data?.data?.title?.message}`);
			} else if (err.data?.data?.summary?.message) {
				error(
                					err.status,
                					`blog summary cannot be empty: ${err.data?.data?.summary?.message}`
                				);
			} else if (err.data?.data?.slug?.message) {
				error(err.status, `blog slug cannot be empty: ${err.data?.data?.slug?.message}`);
			} else if (err.data?.data?.alt?.message) {
				error(err.status, `blog alt cannot be empty: ${err.data?.data?.alt?.message}`);
			} else {
				error(err.status, err.message);
			}
		}

		redirect(303, '/dashboard/manager');
	}
};

// function to create a tag record if it doesn't exist already for all tags and return the tag ids
const createTags = async (tags, pb) => {
	tags = tags.split(',').map((tag) => tag.trim().toLowerCase());
	const tagIds = [];
	for (const tag of tags) {
		let tagId;
		try {
			const record = await pb.collection('valiantlynx_tags').getFirstListItem(`name="${tag}"`, {});
			tagId = record?.id;
		} catch (err) {
			console.error('Error: ', err);
		}

		if (!tagId) {
			// example create data
			const data = {
				name: tag
			};
			const record = await pb.collection('valiantlynx_tags').create(data);
			tagId = record.id;
		}
		tagIds.push(tagId);
	}
	console.log('tagIds: ', tagIds);
	return tagIds;
};
