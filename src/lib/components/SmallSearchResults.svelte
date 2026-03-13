<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		searchResults?: any;
		handleClick: any;
	}

	let { searchResults = [], handleClick }: Props = $props();
</script>

<div class="w-full bg-base-100 rounded-lg overflow-hidden">
	{#if searchResults.length > 0}
		<div class="divide-y divide-base-200">
			{#each searchResults as result, index (result.slug)}
				<button
					onclick={handleClick(result.src)}
					class="w-full px-4 py-3 hover:bg-base-200/50 transition-all duration-150 flex items-center gap-3 group text-left"
				>
					<!-- Thumbnail -->
					<div class="flex-shrink-0 relative">
						<img
							src={result.img}
							alt={result.title}
							class="w-10 h-10 rounded-lg object-cover ring-2 ring-base-300 group-hover:ring-primary/50 transition-all duration-150"
						/>
						<div
							class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 ring-2 ring-primary/30"
						></div>
					</div>

					<!-- Content -->
					<div class="flex-1 min-w-0">
						<h4
							class="font-medium text-base-content truncate group-hover:text-primary transition-colors duration-150"
						>
							{result.title}
						</h4>
						<p class="text-sm text-base-content/60 truncate">
							{result.author || m['labels.anonymous']?.()}
						</p>
					</div>

					<!-- Icon -->
					<div
						class="flex-shrink-0 text-base-content/30 group-hover:text-primary/70 transition-all duration-150 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</button>
			{/each}
		</div>

		<!-- Footer hint -->
		<div class="px-4 py-2 bg-base-200/30 text-center text-xs text-base-content/50">
			{m['messages.search_results_count']?.({ count: searchResults.length }) ||
				`${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
		</div>
	{:else}
		<div class="px-4 py-6 text-center">
			<div class="text-base-content/50 mb-2">
				<svg
					class="w-8 h-8 mx-auto opacity-30"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<p class="text-sm text-base-content/60">{m['messages.no_search_results']()}</p>
		</div>
	{/if}
</div>
