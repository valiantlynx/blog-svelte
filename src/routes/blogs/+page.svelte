<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import BlogCards from '$lib/components/BlogCards.svelte';
	import Icon from '@iconify/svelte';
	let { data } = $props();
</script>

<div class="w-full mt-4 flex flex-wrap -m-4 p-10 items-center">
	<h2 class="text-3xl font-bold w-full">My Blogs</h2>
	<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
	<p class="text-center text-3xl">would you like to make a blog blogs.</p>
	<Button href="/blogs/new" variant="primary" class="max-w-md mt-4">Add One</Button>
</div>

<div class="w-full mt-4 flex flex-wrap -m-4 p-10 items-center">
	<h2 class="text-3xl font-bold w-full">All Blogs</h2>

	{#each data.blogs.items as blog}
		<BlogCards {blog} />
	{/each}
</div>
