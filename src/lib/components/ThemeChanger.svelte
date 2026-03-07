<script lang="ts">
	import { themes } from '$lib/components/ui/styles/themes';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';

	let currentTheme = $state<string>();
	let dropdownOpen = $state(false);

	$effect(() => {
		if (browser) {
			currentTheme =
				localStorage.getItem('theme') ??
				(window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'default-dark'
					: 'default-light');
			document.documentElement.setAttribute('data-theme', currentTheme);
		}
	});

	function setTheme(themeId: string) {
		currentTheme = themeId;
		localStorage.setItem('theme', themeId);
		document.documentElement.setAttribute('data-theme', themeId);
		dropdownOpen = false;
	}

	const currentThemeLabel = $derived(themes.find((t) => t.id === currentTheme)?.label ?? '🎨 Theme');
</script>

<div class="relative inline-block">
	<Button
		variant="ghost"
		size="icon"
		onclick={() => (dropdownOpen = !dropdownOpen)}
		aria-label="Change theme"
	>
		{currentThemeLabel}
	</Button>

	{#if dropdownOpen}
		<!-- Backdrop -->
		<div
			class="fixed inset-0 z-40"
			onclick={() => (dropdownOpen = false)}
		></div>

		<!-- Dropdown Menu -->
		<div
			class="absolute top-full right-0 mt-2 w-56 bg-[var(--base-100)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
		>
			{#each themes as theme (theme.id)}
				<button
					onclick={() => setTheme(theme.id)}
					class={`
						w-full px-4 py-3 text-left transition-colors flex items-center justify-between gap-3
						${currentTheme === theme.id
							? 'bg-[var(--primary)] text-[var(--primary-content)]'
							: 'hover:bg-[var(--base-200)] text-[var(--foreground)]'}
					`}
				>
					<div class="flex-1">
						<div class="font-medium">{theme.label}</div>
						<div class="text-xs opacity-75">{theme.description}</div>
					</div>

					<!-- Color preview swatches -->
					<div class="flex gap-1">
						<div class="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
						<div class="w-2 h-2 rounded-full bg-[var(--secondary)]"></div>
						<div class="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
					</div>

					{#if currentTheme === theme.id}
						<span class="text-lg">✓</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
