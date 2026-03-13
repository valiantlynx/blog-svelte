<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		searchResults?: any;
		handleClick: any;
	}

	let { searchResults = [], handleClick }: Props = $props();
</script>

<ul class="menu p-2 shadow-lg bg-base-100 rounded-box w-full">
	{#if searchResults.length > 0}
		{#each searchResults as result (result.slug)}
			<li>
				<button class="flex items-center gap-2" onclick={handleClick(result.src)}>
					<img
						src={result.authorAvatar || result.img}
						alt={result.author || result.title}
						class="w-8 h-8 rounded-full"
					/>
					<span class="truncate">{result.title}</span>
				</button>
			</li>
		{/each}
	{:else}
		<li class="text-center">{m['messages.no_search_results']()}</li>
	{/if}
</ul>
