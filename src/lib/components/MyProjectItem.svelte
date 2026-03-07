<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import Modal from './Modal.svelte';
	import { getImageURL } from '$lib/utils/api';
	import toast from 'svelte-french-toast';
	let { project } = $props();

	let modalOpen = $state(false);

	let loading = $state(false);

	const submitDeleteProject = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Project deleted successfully!');
					await update();
					break;
				case 'error':
					toast.error('Could not delete project. Please try again later.');
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
					? getImageURL(project.collectionId, project.id, project.thumbnail, '80x80')
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
		<Button href="/projects/{project.id}/edit" variant="outline">Edit Project</Button>
		<Modal label={project.id} checked={modalOpen}>
			{#snippet trigger()}
				<Button variant="error" class="ml-2">Delete</Button>
			{/snippet}
			{#snippet heading()}
				<div>
					<h3 class="text-2xl">Delete {project.name}</h3>
					<p class="text-base font-normal mt-2">
						Are you sure you want to delete this project? Once deleted, the project cannot be
						restored.
					</p>
				</div>
			{/snippet}
			{#snippet actions()}
				<div class="flex w-full items-center justify-center space-x-2">
					<label for={project.id}>
						<Button variant="outline" type="button">Cancel</Button>
					</label>
					<form action="?/deleteProject" method="POST" use:enhance={submitDeleteProject}>
						<input type="hidden" name="id" value={project.id} />
						<Button type="submit" variant="error" disabled={loading}>Delete</Button>
					</form>
				</div>
			{/snippet}
		</Modal>
	</div>
</div>
