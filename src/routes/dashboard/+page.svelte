<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m['pages.dashboard_title']()}</title>
</svelte:head>

<!-- simple tailwind dashboard while the actual one is being built. info users as well -->
<div class="flex">
	<h1>{m['pages.dashboard_heading']()}</h1>
</div>
