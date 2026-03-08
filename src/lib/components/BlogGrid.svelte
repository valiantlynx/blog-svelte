<script lang="ts">
	import BlogCards from '$lib/components/BlogCards.svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import MasonryGrid from '$lib/components/MasonryGrid.svelte';
	import * as m from '$lib/paraglide/messages.js';
	const blogs = $page.data.blogs;
</script>

<MasonryGrid items={blogs.items} columnCount={4} gap="gap-6">
	{#snippet children({ item: blog })}
		<BlogCards {blog} />
	{/snippet}
</MasonryGrid>

<!-- if they want to see more available to go to the features page -->
<div class="flex justify-center mb-8 mt-8">
	<Button href="/blogs" variant="primary">{m['buttons.show_more']()}</Button>
</div>
