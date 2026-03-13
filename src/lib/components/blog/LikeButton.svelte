<script>
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { pb } from '$lib/utils/api';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';

	const blog = $derived($page.data.blog);
	let isLiked = $state(false);
	let blogLikes = $state([]);
	let loading = $state(false);
	let unsubscribe = $state(null);

	async function getRecords() {
		try {
			const records = await pb.collection('valiantlynx_likes').getFullList(200, {
				sort: '-created',
				filter: `contentId='${blog?.id}'`
			});
			return records;
		} catch (error) {
			console.error('Error fetching likes:', error);
			return [];
		}
	}

	$effect(() => {
		if (blog?.id) {
			// Set up subscription
			pb.collection('valiantlynx_likes').subscribe('*', async (e) => {
				blogLikes = await getRecords();
				isLiked = blogLikes.some((like) => like.userId === $page.data.user?.id);
			});

			// Load initial data
			getRecords().then((records) => {
				blogLikes = records;
				isLiked = records.some((like) => like.userId === $page.data.user?.id);
			});

			// Return cleanup function
			return () => {
				pb.collection('valiantlynx_likes').unsubscribe('*');
			};
		}
	});

	const submitLike = () => {
		loading = true;
		if ($page.data.user) {
			return async ({ result, update }) => {
				switch (result.type) {
					case 'success':
						await update();
						toast.success(result.data.message);
						break;
					case 'invalid':
						toast.error(m['messages.error_like_failed']?.() ?? 'Failed to like');
						await update();
						break;
					case 'error':
						toast.error(result.error?.message ?? 'Error liking blog');
						break;
					default:
						await update();
				}
				loading = false;
			};
		} else {
			return async ({ result, update }) => {
				switch (result.type) {
					case 'error':
						toast.error(m['messages.error_login_like']?.() ?? 'Please login to like');
						break;
					default:
						await update();
				}
				loading = false;
			};
		}
	};
</script>

<form use:enhance={submitLike} action="/blogs/{blog?.slug}?/toggleLike" method="POST">
	<input type="hidden" name="blogId" value={blog?.id} />
	<input type="hidden" name="userId" value={$page.data.user?.id} />
	<Button
		variant="outline"
		size="sm"
		class="flex items-center gap-2"
		disabled={loading}
		type="submit"
	>
		<i class="material-icons">{isLiked ? 'thumb_up' : 'thumb_up_off_alt'}</i>
		{isLiked ? m['buttons.liked']() : m['buttons.like']()}
		<span class="ml-2">({blogLikes.length})</span>
	</Button>
</form>
