<script>
	import Search from '$lib/components/Search.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { metaKeywords } from '$lib/utils/stores';
</script>

<svelte:head>
	<title>{m['pages.search_title']()}</title>
	<meta name="description" content={m['pages.search_description']()} />
	<meta name="keywords" content={`blog, note, developers advice, coding ${$metaKeywords}`} />
</svelte:head>

<main class="min-h-screen text-base-content">
	<!-- Decorative Background Elements -->
	<div class="fixed inset-0 -z-10 opacity-5 pointer-events-none overflow-hidden">
		<div class="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
		<div class="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
	</div>

	<!-- Header Section -->
	<div class="py-12 px-4 text-center">
		<div class="mb-8 inline-block">
			<div class="bg-gradient-to-r from-primary to-secondary bg-clip-text">
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
	<div class="pb-16"></div>
</main>

<style>
</style>
