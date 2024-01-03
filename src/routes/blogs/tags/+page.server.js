import { serializeNonPOJOs } from '$lib/utils/api';

export const load = async (event) => {
	// you can also fetch all records at once via getFullList
	const tags = await event.locals.pb.collection('valiantlynx_tags').getFullList({
		sort: '-created'
	});
	return {
		tags: serializeNonPOJOs(tags)
	};
};
