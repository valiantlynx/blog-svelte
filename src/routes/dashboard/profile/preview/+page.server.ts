import { pb } from '$lib/utils/api';

export const load = async ({ locals }) => {
	const userId = locals.user.id;

	try {
		// Get count of blogs authored by this user
		const blogCount = await pb.collection('blogs').getList(1, 1, {
			filter: `author = '${userId}'`
		});

		// Get count of projects created by this user (projects use 'user' field, not 'author')
		const projectCount = await pb.collection('projects_valiantlynx').getList(1, 1, {
			filter: `user = '${userId}'`
		});

		// Get total likes on content authored by this user
		// This requires getting all blogs and projects, then counting likes on those
		const userBlogs = await pb.collection('blogs').getFullList({
			filter: `author = '${userId}'`
		});

		const userProjects = await pb.collection('projects_valiantlynx').getFullList({
			filter: `user = '${userId}'`
		});

		let totalLikes = 0;

		// Count likes on blogs
		if (userBlogs && userBlogs.length > 0) {
			const blogIds = userBlogs.map((blog: any) => `contentId = '${blog.id}'`).join(' || ');
			const blogLikes = await pb.collection('valiantlynx_likes').getList(1, 1, {
				filter: `(${blogIds}) && contentType = 'blog'`
			});
			totalLikes += blogLikes.totalItems;
		}

		// Count likes on projects
		if (userProjects && userProjects.length > 0) {
			const projectIds = userProjects
				.map((project: any) => `contentId = '${project.id}'`)
				.join(' || ');
			const projectLikes = await pb.collection('valiantlynx_likes').getList(1, 1, {
				filter: `(${projectIds}) && contentType = 'project'`
			});
			totalLikes += projectLikes.totalItems;
		}

		return {
			stats: {
				blogCount: blogCount.totalItems,
				projectCount: projectCount.totalItems,
				totalLikes: totalLikes
			}
		};
	} catch (error) {
		console.error('Error loading profile stats:', error);
		return {
			stats: {
				blogCount: 0,
				projectCount: 0,
				totalLikes: 0
			}
		};
	}
};
