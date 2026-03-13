<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		items: unknown[];
		columnCount?: number;
		gap?: string;
		children: Snippet<[{ item: unknown; index: number }]>;
	}

	let { items, columnCount = 4, gap = 'gap-4', children }: Props = $props();

	// Reactive column count based on screen size
	let windowWidth = $state(0);

	function getColumnCount(count: number, width: number): number {
		if (width < 640) return 1;
		if (width < 768) return 2;
		if (width < 1024) return 3;
		if (width < 1280) return 4;
		return count;
	}

	let responsiveColumnCount = $derived(getColumnCount(columnCount, windowWidth));

	// Distribute items into columns for true masonry layout
	let columns = $derived.by(() => {
		const count = responsiveColumnCount;
		const cols: unknown[][] = Array.from({ length: count }, () => []);

		items.forEach((item, index) => {
			cols[index % count].push(item);
		});

		return cols;
	});

	let colClass = $derived(
		responsiveColumnCount === 1
			? 'grid-cols-1'
			: responsiveColumnCount === 2
				? 'grid-cols-2'
				: responsiveColumnCount === 3
					? 'grid-cols-3'
					: 'grid-cols-4'
	);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="grid {colClass} {gap} w-full mt-8">
	{#each columns as column, colIndex (colIndex)}
		<div class="flex flex-col {gap}">
			{#each column as item, index (typeof item === 'object' && item !== null ? ((item as Record<string, unknown>).id ?? `${colIndex}-${index}`) : `${colIndex}-${index}`)}
				<div class="w-full">
					{@render children({ item, index: colIndex * columnCount + index })}
				</div>
			{/each}
		</div>
	{/each}
</div>
