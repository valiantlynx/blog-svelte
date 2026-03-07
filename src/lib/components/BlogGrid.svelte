<script>
	import BlogCards from '$lib/components/BlogCards.svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';
	const blogs = $page.data.blogs;
</script>

<div class="flex flex-wrap">
	{#each blogs.items as blog (blog?.id)}
		<BlogCards {blog} />
	{/each}
</div>
<!-- if they want to see more available to go to the features page -->
<div class="justify-center mb-8">
	<Button href="/blogs" variant="primary" class="flex mx-8">{m["buttons.show_more"]()}</Button>
</div>
