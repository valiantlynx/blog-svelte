<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import MasonryGrid from '$lib/components/MasonryGrid.svelte';
	import Icon from '@iconify/svelte';
	let { data } = $props();
</script>

<div class="w-full mt-4 p-4">
	<h2 class="text-3xl font-bold mb-6">My Projects</h2>
	{#if data.projects.items.length === 0}
		<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
		<p class="text-center text-3xl">Looks like you don't have any projects.</p>
		<Button href="/projects/new" variant="primary" class="max-w-md mt-4">Add One</Button>
	{:else}
		<MasonryGrid items={data.projects.items} columnCount={4} gap="gap-4">
			{#snippet children({ item: project })}
				<ProjectCard {project} />
			{/snippet}
		</MasonryGrid>
	{/if}
</div>
