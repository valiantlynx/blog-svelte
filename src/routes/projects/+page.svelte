<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Icon from '@iconify/svelte';
	let { data } = $props();
</script>

<div class="w-full mt-4 flex flex-wrap -m-4 p-10 items-center">
	<h2 class="text-3xl font-bold w-full">My Projects</h2>
	{#if data.projects.items.length === 0}
		<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
		<p class="text-center text-3xl">Looks like you don't have any projects.</p>
		<Button href="/projects/new" variant="primary" class="max-w-md mt-4">Add One</Button>
	{:else}
		{#each data.projects.items as project}
			<ProjectCard {project} />
		{/each}
	{/if}
</div>
