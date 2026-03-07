<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import Modal from './Modal.svelte';
	import { getImageURL } from '$lib/utils/api';
	import toast from 'svelte-french-toast';
	let { blog } = $props();

	let modalOpen = $state(false);

	let loading = $state(false);

	const submitDeleteBlog = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Blog deleted successfully!');
					await update();
					break;
				case 'error':
					toast.error('Could not delete blog. Please try again later.');
					break;
				default:
					await update();
			}
			loading = false;
		};
	};
</script>

<div class="w-full flex items-center justify-between">
	<div class="avatar">
		<div class="h-48 rounded">
			<img
				src={blog?.image
					? getImageURL(blog?.collectionId, blog?.id, blog?.image, '80x80')
					: `https://via.placeholder.com/80/4506CB/FFFFFF/?text=${blog?.title}`}
				alt="{blog?.image} blog image"
			/>
		</div>
	</div>
	<div class="flex flex-col w-full ml-4 h-full justify-center">
		<a href="/blogs/{blog?.id}" class="font-semibold text-lg">{blog?.title}</a>
		<p>{blog?.summary}</p>
	</div>
	<div class="flex items-center justify-end w-full">
		<Button href="/blogs/{blog?.id}/edit" variant="outline">Edit blog</Button>
		<Modal label={blog?.id} checked={modalOpen}>
			{#snippet trigger()}
				<Button variant="error" class="ml-2">Delete</Button>
			{/snippet}
			{#snippet heading()}
				<div>
					<h3 class="text-2xl">Delete {blog?.title}</h3>
					<p class="text-base font-normal mt-2">
						Are you sure you want to delete this blog? Once deleted, the blog cannot be restored.
					</p>
				</div>
			{/snippet}
			{#snippet actions()}
				<div class="flex w-full items-center justify-center space-x-2">
					<label for={blog?.id}>
						<Button variant="outline" type="button">Cancel</Button>
					</label>
					<form action="?/deleteBlog" method="POST" use:enhance={submitDeleteBlog}>
						<input type="hidden" name="id" value={blog?.id} />
						<Button type="submit" variant="error" disabled={loading}>Delete</Button>
					</form>
				</div>
			{/snippet}
		</Modal>
	</div>
</div>
