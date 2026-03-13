<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m['pages.about_title']()}</title>
	<meta name="description" content={m['pages.about_description']()} />
</svelte:head>

<div class="container mx-auto px-4 py-8 md:py-12 max-w-3xl text-base-content">
	<h1 class="text-2xl md:text-3xl font-bold mb-4">{m['pages.about_description']()}</h1>
</div>
