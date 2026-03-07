<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m['pages.about_title']()}</title>
	<meta name="description" content={m['pages.about_description']()} />
</svelte:head>

<div class="text-column">
	<h1>{m['pages.about_description']()}</h1>
</div>
