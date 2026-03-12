<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import Modal from './Modal.svelte';
	import { getImageURL } from '$lib/utils/api';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';
	import { invalidateAll } from '$app/navigation';
	let { blog } = $props();

	let loading = $state(false);
	let isPublishing = $state(false);

	let isModalOpen = $state(false);

	const submitDeleteBlog = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(m['messages.success_blog_deleted']());
					isModalOpen = false;
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

	const togglePublish = async () => {
		const formData = new FormData();
		formData.append('id', blog?.id);

		isPublishing = true;
		try {
			const response = await fetch('?/toggleBlogPublish', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const data = await response.json();
				if (data.type === 'success') {
					// Update local blog state to reflect new publish status
					blog.published = data.data.published;
					// Show appropriate success message based on new published status
					const message = data.data.published
						? m['blog.published_message']()
						: m['blog.unpublished_message']();
					toast.success(message);
				} else {
					toast.error(data.error?.message || m['blog.update_error']());
				}
			} else {
				toast.error(m['blog.update_error']());
			}
		} catch (err) {
			console.error('Error:', err);
			toast.error(m['blog.update_error']());
		} finally {
			isPublishing = false;
			await invalidateAll(); // Refresh data to reflect changes
		}
	};
</script>

<div
	class="w-full flex items-center gap-4 p-4 bg-base-200 rounded-lg hover:shadow-md transition-shadow"
>
	<div class="avatar flex-shrink-0">
		<div class="w-16 h-16 rounded-lg overflow-hidden">
			<img
				src={blog?.image
					? getImageURL(blog?.collectionId, blog?.id, blog?.image)
					: `https://via.placeholder.com/80/4506CB/FFFFFF/?text=${blog?.title}`}
				alt="{blog?.image} blog image"
				class="w-full h-full object-cover"
			/>
		</div>
	</div>
	<div class="flex-1 min-w-0">
		<div class="flex items-center gap-2">
			<a
				href="/blogs/{blog?.slug}"
				class="font-semibold text-lg hover:text-primary transition-colors truncate"
			>
				{blog?.title}
			</a>
			{#if !blog?.published}
				<div class="badge badge-warning badge-sm flex-shrink-0">{m['blog.status.draft']()}</div>
			{/if}
		</div>
		<p class="text-sm text-base-content/70 line-clamp-2">{blog?.summary}</p>
	</div>
	<div class="flex items-center gap-2 flex-shrink-0">
		<Button
			type="button"
			variant={blog?.published ? 'ghost' : 'primary'}
			size="sm"
			disabled={isPublishing}
			onclick={togglePublish}
		>
			{isPublishing ? 'Updating...' : blog?.published ? m['blog.unpublish']() : m['blog.publish']()}
		</Button>
		<Button href="/blogs/{blog?.slug}/edit" variant="outline" size="sm"
			>{m['buttons.edit_blog']()}</Button
		>
		<Button variant="destructive" size="sm" onclick={() => (isModalOpen = true)}>
			{m['buttons.delete']()}
		</Button>
		<Modal bind:open={isModalOpen}>
			{#snippet heading()}
				<div>
					<h3 class="text-xl">{m['modals.delete_blog']({ title: blog?.title })}</h3>
					<p class="text-sm font-normal mt-2">
						{m['modals.delete_confirmation']({ item: 'blog' })}
					</p>
				</div>
			{/snippet}
			{#snippet actions()}
				<div class="flex w-full items-center justify-center gap-2">
					<Button variant="outline" type="button" size="sm" onclick={() => (isModalOpen = false)}>
						{m['buttons.cancel']()}
					</Button>
					<form action="?/deleteBlog" method="POST" use:enhance={submitDeleteBlog}>
						<input type="hidden" name="id" value={blog?.id} />
						<Button type="submit" variant="destructive" size="sm" disabled={loading}
							>{m['buttons.delete']()}</Button
						>
					</form>
				</div>
			{/snippet}
		</Modal>
	</div>
</div>
