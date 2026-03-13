<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		searchResults?: any;
		handleClick: any;
	}

	let { searchResults = [], handleClick }: Props = $props();
</script>

<div
	class="space-y-1 max-h-96 overflow-y-auto bg-gradient-to-br from-base-100 via-base-100 to-base-200 rounded-box border border-base-300/50 shadow-xl"
>
	{#if searchResults.length > 0}
		<div class="p-2 space-y-1">
			{#each searchResults as result, index (result.slug)}
				<button
					onclick={handleClick(result.src)}
					class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-out group hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:shadow-md active:scale-95"
				>
					<!-- Avatar with ring effect -->
					<div
						class="relative flex-shrink-0 w-9 h-9 rounded-full overflow-hidden ring-2 ring-base-300 group-hover:ring-primary/50 transition-all duration-200"
					>
						<img
							src={result.authorAvatar || result.img}
							alt={result.author || result.title}
							class="w-full h-full object-cover"
						/>
					</div>

					<!-- Title with fade effect -->
					<span
						class="flex-1 text-left text-sm font-medium text-base-content truncate group-hover:text-primary transition-colors duration-200"
					>
						{result.title}
					</span>

					<!-- Index indicator -->
					<span
						class="text-xs px-1.5 py-0.5 rounded-full bg-base-300/50 text-base-content/60 font-semibold group-hover:bg-primary/20 group-hover:text-primary transition-all duration-200"
					>
						{index + 1}
					</span>
				</button>
			{/each}
		</div>
	{:else}
		<div
			class="p-4 text-center text-sm text-base-content/50 flex items-center justify-center min-h-20"
		>
			<span>{m['messages.no_search_results']()}</span>
		</div>
	{/if}
</div>

<style>
	div ::-webkit-scrollbar {
		width: 6px;
	}

	div ::-webkit-scrollbar-track {
		background: transparent;
	}

	div ::-webkit-scrollbar-thumb {
		background: var(--fallback-bc, oklch(var(--bc) / 0.2));
		border-radius: 3px;
	}

	div ::-webkit-scrollbar-thumb:hover {
		background: var(--fallback-bc, oklch(var(--bc) / 0.4));
	}
</style>
