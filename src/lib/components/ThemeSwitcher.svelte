<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { themeNames } from '$lib/components/ui/styles/themes';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';
	import { themeStore } from '$lib/utils/stores';

	let themeConfig = $state({ theme: 'default', mode: 'light' as const });
	let dropdownOpen = $state(false);

	$effect(() => {
		if (browser) {
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

	function setTheme(themeName: string) {
		themeStore.setTheme(themeName);
		dropdownOpen = false;
	}

	const currentThemeLabel = $derived(
		themeNames.find((t) => t.id === themeConfig.theme)?.label ?? m['tooltips.theme']()
	);

	// SVG icon mapping for themes
	const themeIcons: Record<string, string> = {
		default: 'palette',
		ocean: 'water',
		forest: 'leaf',
		sunset: 'sunset',
		lavender: 'flower'
	};
</script>

<div class="relative inline-block">
	<Button
		variant="ghost"
		size="lg"
		onclick={() => (dropdownOpen = !dropdownOpen)}
		ariaLabel={m['tooltips.change_theme']()}
		class="flex items-center gap-2"
	>
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<circle cx="12" cy="12" r="1"></circle>
			<circle cx="19" cy="12" r="1"></circle>
			<circle cx="5" cy="12" r="1"></circle>
			<path d="M12 17v4"></path>
			<path d="M8.59 4.59a2 2 0 1 1 2.83 2.83l-.5.5"></path>
			<path d="M14.41 4.41a2 2 0 0 0-2.83 2.83l.5.5"></path>
		</svg>
		<span class="hidden sm:inline text-sm font-medium">{currentThemeLabel}</span>
	</Button>

	{#if dropdownOpen}
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 z-40"
			onclick={() => (dropdownOpen = false)}
			aria-label="Close menu"
		></button>

		<!-- Dropdown Menu -->
		<div
			class="absolute top-full right-0 mt-2 w-64 bg-[var(--base-100)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
		>
			{#each themeNames as theme (theme.id)}
				{@const svgIcon = themeIcons[theme.id]}
				<button
					type="button"
					onclick={() => setTheme(theme.id)}
					class={`
						w-full px-4 py-3 text-left transition-colors flex items-center justify-between gap-3
						${
							themeConfig.theme === theme.id
								? 'bg-[var(--primary)] text-[var(--primary-content)]'
								: 'hover:bg-[var(--base-200)] text-[var(--foreground)]'
						}
					`}
				>
					<div class="flex items-center gap-3 flex-1">
						{#if svgIcon === 'palette'}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="flex-shrink-0"
							>
								<circle cx="12" cy="12" r="1"></circle>
								<circle cx="19" cy="12" r="1"></circle>
								<circle cx="5" cy="12" r="1"></circle>
								<path d="M12 17v4"></path>
								<path d="M8.59 4.59a2 2 0 1 1 2.83 2.83l-.5.5"></path>
								<path d="M14.41 4.41a2 2 0 0 0-2.83 2.83l.5.5"></path>
							</svg>
						{:else if svgIcon === 'water'}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="flex-shrink-0"
							>
								<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
							</svg>
						{:else if svgIcon === 'leaf'}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="flex-shrink-0"
							>
								<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 21 1 21 1s-6 5.5-5.9 11.2A7 7 0 0 1 11 20z"
								></path>
							</svg>
						{:else if svgIcon === 'sunset'}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="flex-shrink-0"
							>
								<path d="M17 18a5 5 0 1 0-10 0"></path>
								<line x1="12" y1="2" x2="12" y2="9"></line>
								<line x1="4.22" y1="4.22" x2="9.9" y2="9.9"></line>
								<line x1="1" y1="12" x2="8" y2="12"></line>
								<line x1="21" y1="12" x2="14" y2="12"></line>
								<line x1="19.78" y1="4.22" x2="14.1" y2="9.9"></line>
							</svg>
						{:else if svgIcon === 'flower'}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="flex-shrink-0"
							>
								<circle cx="12" cy="12" r="3"></circle>
								<path d="M12 1v6"></path>
								<path d="M4.22 4.22l4.24 4.24"></path>
								<path d="M1 12h6"></path>
								<path d="M4.22 19.78l4.24-4.24"></path>
								<path d="M12 19v6"></path>
								<path d="M19.78 19.78l-4.24-4.24"></path>
								<path d="M23 12h-6"></path>
								<path d="M19.78 4.22l-4.24 4.24"></path>
							</svg>
						{/if}
						<div>
							<div class="font-medium">{theme.label}</div>
							<div class="text-xs opacity-75">{theme.description}</div>
						</div>
					</div>

					<!-- Color preview swatches -->
					<div class="flex gap-1 flex-shrink-0">
						<div class="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
						<div class="w-2 h-2 rounded-full bg-[var(--secondary)]"></div>
						<div class="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
					</div>

					{#if themeConfig.theme === theme.id}
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="flex-shrink-0"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
