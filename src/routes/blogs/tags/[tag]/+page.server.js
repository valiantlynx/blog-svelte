import { serializeNonPOJOs } from '$lib/utils/api';

export const load = async (event) => {
	const slug = event.params['tag'];

	// you can also fetch all records at once via getFullList
	const tags = await pb.collection('valiantlynx_tags').getFullList({
		sort: '-created',
		filter: `name="${slug}"`
	});
	return {
		tags: serializeNonPOJOs(tags)
	};
};
