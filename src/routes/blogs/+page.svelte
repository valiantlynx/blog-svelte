<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import BlogCards from '$lib/components/BlogCards.svelte';
	import MasonryGrid from '$lib/components/MasonryGrid.svelte';
	import Icon from '@iconify/svelte';
	let { data } = $props();
</script>

<div class="w-full mt-4 p-4">
	<h2 class="text-3xl font-bold mb-6">My Blogs</h2>
	<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
	<p class="text-center text-3xl">would you like to make a blog blogs.</p>
	<Button href="/blogs/new" variant="primary" class="max-w-md mt-4">Add One</Button>
</div>

<div class="w-full mt-4 p-4">
	<h2 class="text-3xl font-bold mb-6">All Blogs</h2>

	{#if data.blogs.items.length > 0}
		<MasonryGrid items={data.blogs.items} columnCount={4} gap="gap-4">
			{#snippet children({ item: blog })}
				<BlogCards {blog} />
			{/snippet}
		</MasonryGrid>
	{/if}
</div>
