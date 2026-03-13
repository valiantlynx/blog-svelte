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

<div
	class="w-full flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-base-200 rounded-lg hover:shadow-md transition-shadow"
>
	<div class="flex items-center gap-4 flex-1 min-w-0">
		<div class="avatar flex-shrink-0">
			<div class="w-16 h-16 rounded-lg overflow-hidden">
				<img
					src={project?.thumbnail
						? getImageURL(project.collectionId, project.id, project.thumbnail)
						: `https://via.placeholder.com/80/4506CB/FFFFFF/?text=${project.name}`}
					alt="project thumbnail"
					class="w-full h-full object-cover"
				/>
			</div>
		</div>
		<div class="flex-1 min-w-0">
			<a
				href="/projects/{project.id}"
				class="font-semibold text-lg hover:text-primary transition-colors block truncate"
			>
				{project.name}
			</a>
			<p class="text-sm text-base-content/70 line-clamp-2">{project.tagline}</p>
		</div>
	</div>
	<div class="flex items-center gap-2 flex-wrap flex-shrink-0">
		<Button href="/projects/{project.id}/edit" variant="outline" size="sm"
			>{m['buttons.edit_project']()}</Button
		>
		<Button variant="destructive" size="sm" onclick={() => (isModalOpen = true)}>
			{m['buttons.delete']()}
		</Button>
		<Modal bind:open={isModalOpen}>
			{#snippet heading()}
				<div>
					<h3 class="text-xl">{m['modals.delete_project']({ name: project.name })}</h3>
					<p class="text-sm font-normal mt-2">
						{m['modals.delete_confirmation']({ item: 'project' })}
					</p>
				</div>
			{/snippet}
			{#snippet actions()}
				<div class="flex w-full items-center justify-center gap-2">
					<Button variant="outline" type="button" size="sm" onclick={() => (isModalOpen = false)}>
						{m['buttons.cancel']()}
					</Button>
					<form action="?/deleteProject" method="POST" use:enhance={submitDeleteProject}>
						<input type="hidden" name="id" value={project.id} />
						<Button type="submit" variant="destructive" size="sm" disabled={loading}
							>{m['buttons.delete']()}</Button
						>
					</form>
				</div>
			{/snippet}
		</Modal>
	</div>
</div>
