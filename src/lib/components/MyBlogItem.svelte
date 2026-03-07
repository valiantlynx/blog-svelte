<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import Modal from './Modal.svelte';
	import { getImageURL } from '$lib/utils/api';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';
	let { blog } = $props();

	let modalOpen = $state(false);

	let loading = $state(false);

	const submitDeleteBlog = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(m['messages.success_blog_deleted']());
					await update();
					break;
				case 'error':
					toast.error(m['messages.error_create_failed']({ item: 'blog' }));
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
		<Button href="/blogs/{blog?.id}/edit" variant="outline">{m['buttons.edit_blog']()}</Button>
		<Modal label={blog?.id} checked={modalOpen}>
			{#snippet trigger()}
				<Button variant="error" class="ml-2">{m['buttons.delete']()}</Button>
			{/snippet}
			{#snippet heading()}
				<div>
					<h3 class="text-2xl">{m['modals.delete_blog']({ title: blog?.title })}</h3>
					<p class="text-base font-normal mt-2">
						{m['modals.delete_confirmation']({ item: 'blog' })}
					</p>
				</div>
			{/snippet}
			{#snippet actions()}
				<div class="flex w-full items-center justify-center space-x-2">
					<label for={blog?.id}>
						<Button variant="outline" type="button">{m['buttons.cancel']()}</Button>
					</label>
					<form action="?/deleteBlog" method="POST" use:enhance={submitDeleteBlog}>
						<input type="hidden" name="id" value={blog?.id} />
						<Button type="submit" variant="error" disabled={loading}>{m['buttons.delete']()}</Button
						>
					</form>
				</div>
			{/snippet}
		</Modal>
	</div>
</div>
