<script>
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	let loading = $state(false);

	const submitNewProject = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(m['messages.success_project_created']());
					await update();
					break;
				case 'invalid':
					toast.error(m['messages.error_invalid_credentials']());
					await update();
					break;
				case 'error':
					toast.error(result.error.message);
					break;
				default:
					await update();
			}
			loading = false;
		};
	};
</script>

<div class="flex flex-col w-full h-full p-2">
	<div class="w-full">
		<form
			action="?/create"
			method="POST"
			class="flex flex-col space-y-2 w-full items-center"
			enctype="multipart/form-data"
			use:enhance={submitNewProject}
		>
			<h3 class="text-3xl font-bold">{m['forms.project_heading']()}</h3>
			<p class="mt-2 text-lg">{m['forms.project_instruction']()}</p>
			<Input
				id="name"
				label={m['forms.project_name']()}
				disabled={loading}
				value={page.form?.data?.name}
				errors={page.form?.errors?.name}
			/>
			<Input
				id="tagline"
				label={m['forms.project_tagline']()}
				disabled={loading}
				value={page.form?.data?.tagline}
				errors={page.form?.errors?.tagline}
			/>
			<Input
				id="url"
				label={m['forms.project_url']()}
				disabled={loading}
				value={page.form?.data?.url}
				errors={page.form?.errors?.url}
			/>
			<div class="form-control w-full max-w-lg">
				<label for="description" class="label font-medium pb-1">
					<span class="label-text">{m['forms.project_description']()}</span>
				</label>
				<textarea
					name="description"
					class="textarea textarea-bordered textarea-primary h-24"
					disabled={loading}
					value={page.form?.data?.description}
					errors={page.form?.errors?.description}
				></textarea>
			</div>
			<div class="form-control w-full max-w-lg">
				<label for="thumbnail" class="label font-medium pb-1">
					<span class="label-text">{m['forms.thumbnail']()}</span>
				</label>
				<input
					type="file"
					name="thumbnail"
					id="thumbnail"
					class="file-input file-input-bordered file-input-primary w-full max-w-lg"
					disabled={loading}
				/>
			</div>
			<div class="w-full max-w-lg pt-3">
				<button type="submit" class="btn btn-primary w-full max-w-lg" disabled={loading}
					>{m['forms.project_button']()}</button
				>
			</div>
		</form>
	</div>
</div>
