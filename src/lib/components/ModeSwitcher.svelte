<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';
	import { themeStore } from '$lib/utils/stores';

	let themeConfig = $state({ theme: 'default', mode: 'light' as const });

	$effect(() => {
		if (browser) {
			// Load initial config from store
			themeStore.loadFromStorage();
		}
	});

	// Subscribe to store changes
	$effect(() => {
		const unsubscribe = themeStore.subscribe((config) => {
			themeConfig = config;
		});

		return () => unsubscribe();
	});

	$effect(() => {
		if (browser && themeConfig.theme) {
			const themeId = `${themeConfig.theme}-${themeConfig.mode}`;
			document.documentElement.setAttribute('data-theme', themeId);
		}
	});

	function toggleMode() {
		themeStore.toggleMode();
	}

	const modeLabel = $derived(
		themeConfig.mode === 'light' ? m['tooltips.dark_mode']() : m['tooltips.light_mode']()
	);
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={toggleMode}
	ariaLabel={m['tooltips.toggle_mode']()}
	title={modeLabel}
>
	{#if themeConfig.mode === 'light'}
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	{:else}
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<circle cx="12" cy="12" r="5"></circle>
			<line x1="12" y1="1" x2="12" y2="3"></line>
			<line x1="12" y1="21" x2="12" y2="23"></line>
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
			<line x1="1" y1="12" x2="3" y2="12"></line>
			<line x1="21" y1="12" x2="23" y2="12"></line>
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
		</svg>
	{/if}
</Button>
