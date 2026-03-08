<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import Modal from './Modal.svelte';
	import { getImageURL } from '$lib/utils/api';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';
	let { project } = $props();

	let isModalOpen = $state(false);

	let loading = $state(false);

	const submitDeleteProject = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(m['messages.success_project_deleted']());
					isModalOpen = false;
					await update();
					break;
				case 'error':
					toast.error(m['messages.error_create_failed']({ item: 'project' }));
					break;
				default:
					await update();
			}
			loading = false;
		};
	};
</script>

<div class="w-full h-28 flex items-center justify-between">
	<div class="avatar">
		<div class="w-20 rounded">
			<img
				src={project?.thumbnail
					? getImageURL(project.collectionId, project.id, project.thumbnail)
					: `https://via.placeholder.com/80/4506CB/FFFFFF/?text=${project.name}`}
				alt="project thumbnail"
			/>
		</div>
	</div>
	<div class="flex flex-col w-full ml-4 h-full justify-center">
		<a href="/projects/{project.id}" class="font-semibold text-lg">{project.name}</a>
		<p>{project.tagline}</p>
	</div>
	<div class="flex items-center justify-end w-full">
		<Button href="/projects/{project.id}/edit" variant="outline"
			>{m['buttons.edit_project']()}</Button
		>
		<Button variant="destructive" class="ml-2" onclick={() => (isModalOpen = true)}>
			{m['buttons.delete']()}
		</Button>
		<Modal bind:open={isModalOpen}>
			{#snippet heading()}
				<div>
					<h3 class="text-2xl">{m['modals.delete_project']({ name: project.name })}</h3>
					<p class="text-base font-normal mt-2">
						{m['modals.delete_confirmation']({ item: 'project' })}
					</p>
				</div>
			{/snippet}
			{#snippet actions()}
				<div class="flex w-full items-center justify-center space-x-2">
					<Button variant="outline" type="button" onclick={() => (isModalOpen = false)}>
						{m['buttons.cancel']()}
					</Button>
					<form action="?/deleteProject" method="POST" use:enhance={submitDeleteProject}>
						<input type="hidden" name="id" value={project.id} />
						<Button type="submit" variant="destructive" disabled={loading}
							>{m['buttons.delete']()}</Button
						>
					</form>
				</div>
			{/snippet}
		</Modal>
	</div>
</div>
