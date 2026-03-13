<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import BlogCards from '$lib/components/BlogCards.svelte';
	import MasonryGrid from '$lib/components/MasonryGrid.svelte';
	import Icon from '@iconify/svelte';
	let { data } = $props();
</script>

<div class="w-full mt-4 p-4 text-base-content">
	<h2 class="text-3xl font-bold mb-6">My Blogs</h2>
	<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
	<p class="text-center text-3xl">would you like to make a blog blogs.</p>
	<Button href="/blogs/new" variant="primary" class="max-w-md mt-4">Add One</Button>
</div>

<!-- Tags Navigation -->
<div class="w-full p-4">
	<Button href="/blogs/tags" variant="outline" class="flex items-center gap-2">
		🏷️ Browse by Tags
	</Button>
</div>

<div class="w-full mt-4 p-4">
	<h2 class="text-3xl font-bold mb-6">All Blogs</h2>

	{#await data.blogs}
		<p>Loading...</p>
	{:then blogs}
		{#if !blogs?.items || blogs.items.length === 0}
			<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
			<p class="text-center text-3xl">No blogs yet.</p>
			<Button href="/blogs/new" variant="primary" class="max-w-md mt-4">Add One</Button>
		{:else}
			<MasonryGrid items={blogs.items} columnCount={4} gap="gap-4">
				{#snippet children({ item: blog })}
					<BlogCards {blog} />
				{/snippet}
			</MasonryGrid>
		{/if}
	{:catch error}
		<p class="text-error">Error loading blogs</p>
	{/await}
</div>
