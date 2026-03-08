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

<div class="flex flex-col w-full h-full p-4">
	<form
		action="?/create"
		method="POST"
		class="w-full"
		enctype="multipart/form-data"
		use:enhance={submitNewProject}
	>
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="col-span-2 space-y-4 bg-base-100 p-6 rounded shadow">
				<h3 class="text-2xl font-semibold">{m['forms.project_heading']()}</h3>
				<p class="text-sm text-base-content/60">{m['forms.project_instruction']()}</p>

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

				<div>
					<label for="description" class="label font-medium pb-1"
						><span class="label-text">{m['forms.project_description']()}</span></label
					>
					<textarea
						name="description"
						class="textarea textarea-bordered textarea-primary h-28 w-full"
						disabled={loading}>{page.form?.data?.description}</textarea
					>
				</div>

				<div>
					<label for="thumbnail" class="label font-medium pb-1"
						><span class="label-text">{m['forms.thumbnail']()}</span></label
					>
					<input
						type="file"
						name="thumbnail"
						id="thumbnail"
						class="file-input file-input-bordered w-full"
						disabled={loading}
					/>
				</div>

				<div class="flex gap-3">
					<button type="submit" class="btn btn-primary">{m['forms.project_button']()}</button>
					<a href="/projects" class="btn btn-ghost">Cancel</a>
				</div>
			</div>

			<aside class="col-span-1 bg-base-200 p-4 rounded-lg shadow">
				<h4 class="font-semibold mb-2">Preview</h4>
				<div class="border p-3 rounded bg-white dark:bg-base-100">
					<h3 class="text-lg font-bold">{page.form?.data?.name ?? 'Project name'}</h3>
					<p class="text-sm text-base-content/60">{page.form?.data?.tagline ?? 'Tagline'}</p>
					<p class="mt-2 text-sm">{page.form?.data?.description ?? 'No description yet'}</p>
				</div>
			</aside>
		</div>
	</form>
</div>
