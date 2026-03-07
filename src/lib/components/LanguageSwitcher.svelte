<script>
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import Dropdown from './ui/dropdown/Dropdown.svelte';
	import Button from './ui/button/Button.svelte';

	let currentLocale = getLocale();

	const handleLanguageChange = async (locale) => {
		if (locale !== currentLocale) {
			await setLocale(locale, { reload: true });
		}
	};

	// Get language display names dynamically from footer.languages.{locale}
	const getLanguageName = (locale) => {
		const key = `footer.languages.${locale}`;
		try {
			return m[key]();
		} catch {
			// Fallback to locale code if translation key doesn't exist
			return locale.toUpperCase();
		}
	};

	// Create a reactive language names object for all locales
	const languageNames = Object.fromEntries(
		locales.map((locale) => [locale, getLanguageName(locale)])
	);
</script>

<Dropdown align="right">
	<svelte:fragment slot="trigger">
		<Button variant="ghost" size="sm">
			{languageNames[currentLocale]}
		</Button>
	</svelte:fragment>

	<div class="flex flex-col gap-1 p-2">
		{#each locales as locale}
			<button
				class="px-3 py-2 rounded text-sm text-left hover:bg-primary hover:text-white transition-colors"
				class:font-semibold={locale === currentLocale}
				class:bg-base-200={locale === currentLocale}
				on:click={() => handleLanguageChange(locale)}
			>
				{languageNames[locale]}
			</button>
		{/each}
	</div>
</Dropdown>
