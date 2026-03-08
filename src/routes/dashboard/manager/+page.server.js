/* eslint-disable no-console */
import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs } from '$lib/utils/api';

export const load = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	// Allow any logged-in user to view their blogs/projects
	// Removed role check: if (!locals.user.role.includes('editor')) {
	//     throw redirect(303, '/pricing');
	// }

	const getUsersProjects = async (userId) => {
		try {
			const projects = serializeNonPOJOs(
				await locals.pb.collection('projects_valiantlynx').getFullList(undefined, {
					filter: `user = "${userId}"`
				})
			);
			return projects;
		} catch (err) {
			console.error('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	const getUsersBlogs = async (userId) => {
		try {
			const blogs = serializeNonPOJOs(
				await locals.pb.collection('blogs').getFullList(undefined, {
					filter: `author = "${userId}"`,
					sort: '-created'
				})
			);
			return blogs;
		} catch (err) {
			console.error('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	return {
		projects: getUsersProjects(locals.user.id),
		blogs: getUsersBlogs(locals.user.id)
	};
};

export const actions = {
	deleteProject: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			// Verify the project exists and belongs to the current user
			const project = await locals.pb.collection('projects_valiantlynx').getOne(id);

			if (project.user !== locals.user.id) {
				throw error(403, 'You can only delete your own projects');
			}

			await locals.pb.collection('projects_valiantlynx').delete(id);
		} catch (err) {
			console.error('Error: ', err);
			throw error(err.status, err.message);
		}
		return {
			success: true
		};
	},
	deleteBlog: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			// Verify the blog exists and belongs to the current user
			const blog = await locals.pb.collection('blogs').getOne(id);

			if (blog.author !== locals.user.id) {
				throw error(403, 'You can only delete your own blogs');
			}

			await locals.pb.collection('blogs').delete(id);
		} catch (err) {
			console.error('Error: ', err);
			throw error(err.status, err.message);
		}
		return {
			success: true
		};
	}
};
