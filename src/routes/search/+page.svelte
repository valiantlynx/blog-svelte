<script>
	import Search from '$lib/components/Search.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { metaKeywords } from '$lib/utils/stores';
</script>

<svelte:head>
	<title>{m['pages.search_title']()}</title>
	<meta name="description" content={m['pages.search_description']()} />
	<meta
		name="keywords"
		content={`manga, search, manga search, manga search engine, manga search site, manga search website, manga search app, manga search application, manga search online, manga search free, manga search unlimited, manga search for free, manga search for unlimited, manga search for everyone, manga search for anyone, manga search for all, manga search for all users, manga search for all visitors, manga search for isekai, manga search for shounen, manga search for shoujo, manga search for seinen, manga search for josei, manga search for seinen, manga search for yuri, manga search for yaoi, manga search for ecchi, manga search for harem, manga search for romance, manga search for comedy, manga search for action, manga search for adventure, manga search for fantasy, manga search for horror, manga search for mystery, manga search for psychological, manga search for drama, manga search for slice of life, manga search for sports, manga search for mecha, manga search for sci-fi ${$metaKeywords}`}
	/>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200">
	<!-- Decorative Background Elements -->
	<div class="fixed inset-0 -z-10 opacity-5 pointer-events-none overflow-hidden">
		<div class="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
		<div class="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
	</div>

	<!-- Header Section -->
	<div class="py-12 px-4 text-center">
		<div class="mb-8 inline-block">
			<div class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
				<h1 class="text-5xl md:text-6xl font-black tracking-tight">
					{m['pages.search_heading']()}
				</h1>
			</div>
		</div>
		<p class="text-base-content/70 text-lg max-w-2xl mx-auto">
			Search through all your favorite blogs and projects in one place
		</p>
	</div>

	<!-- Search Box Container -->
	<div class="flex justify-center px-4 pb-8">
		<div class="w-full max-w-4xl">
			<div class="bg-base-100 rounded-2xl p-8 shadow-2xl border border-base-300 backdrop-blur-sm">
				<Search type="big" />
			</div>
		</div>
	</div>

	<!-- Footer spacing -->
	<div class="pb-16" />
</main>

<style>
	:global(body) {
		background: linear-gradient(to bottom right, var(--fallback-b1), var(--fallback-b2)) !important;
	}
</style>
