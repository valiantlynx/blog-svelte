<script>
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import { getImageURL } from '$lib/utils/api';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';
	let loading = $state(false);

	const submitEditProject = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Project edited successfully');
					await update();
					break;
				case 'invalid':
					toast.error('Invalid credentials');
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
		method="POST"
		action="?/updateProject"
		class="w-full"
		enctype="multipart/form-data"
		use:enhance={submitEditProject}
	>
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Left: Inputs -->
			<div class="col-span-2 space-y-4 bg-base-100 p-6 rounded-lg shadow">
				<div>
					<h3 class="text-2xl font-semibold">{m['forms.project_heading']()}</h3>
					<p class="text-sm text-base-content/60">{m['forms.project_instruction']()}</p>
				</div>

				<Input
					id="name"
					name="name"
					label={m['forms.project_name']()}
					value={page.data.project.name ?? ''}
					disabled={loading}
					errors={page.form?.errors?.name}
				/>

				<Input
					id="tagline"
					name="tagline"
					label={m['forms.project_tagline']()}
					value={page.data.project.tagline ?? ''}
					disabled={loading}
					errors={page.form?.errors?.tagline}
				/>

				<Input
					id="url"
					name="url"
					label={m['forms.project_url']()}
					value={page.data.project.url ?? ''}
					disabled={loading}
					errors={page.form?.errors?.url}
				/>

				<div class="form-control w-full">
					<label for="description" class="label font-medium pb-1">
						<span class="label-text">{m['forms.project_description']()}</span>
					</label>
					<textarea
						name="description"
						class="textarea textarea-bordered textarea-primary h-24 resize-none w-full"
						value={page.data.project.description ?? ''}
						disabled={loading}
					></textarea>
				</div>

				<div class="form-control w-full">
					<label for="thumbnail" class="label font-medium pb-1">
						<span class="label-text"
							>{m['forms.thumbnail']
								? m['forms.thumbnail']()
								: m['forms.project_thumbnail']
									? m['forms.project_thumbnail']()
									: 'Thumbnail'}</span
						>
					</label>
					{#if page.data.project.thumbnail}
						<label for="thumbnail" class="avatar w-20 hover:cursor-pointer">
							<label for="thumbnail" class="absolute -top-1.5 -right-1.5 hover:cursor-pointer">
								<button formaction="?/deleteThumbnail" class="btn btn-error btn-sm btn-circle">
									<i class="fas fa-trash"></i>
								</button>
							</label>
							<div class="w-20 rounded">
								<img
									src={getImageURL(
										page.data.project.collectionId,
										page.data.project.id,
										page.data.project.thumbnail,
										'80x80'
									)}
									alt={page.data.project.name}
								/>
							</div>
						</label>
					{/if}
					<input
						type="file"
						name="thumbnail"
						id="thumbnail"
						class="file-input file-input-bordered file-input-primary w-full mt-2"
						disabled={loading}
					/>
				</div>

				<div class="flex gap-3 items-center">
					<button type="submit" class="btn btn-primary" disabled={loading}
						>{m['buttons.save']()}</button
					>
					<a href="/dashboard" class="btn btn-ghost">{m['buttons.cancel']()}</a>
				</div>
			</div>

			<!-- Right: Preview -->
			<aside class="col-span-1 bg-base-200 p-4 rounded-lg shadow">
				<h4 class="font-semibold mb-2">
					{m['pagesPreview.title'] ? m['pagesPreview.title']() : 'Preview'}
				</h4>
				<div class="border rounded p-3 bg-white dark:bg-base-100">
					<h3 class="text-lg font-bold">{page.data.project.name}</h3>
					<p class="text-sm text-base-content/60">{page.data.project.tagline}</p>
					{#if page.data.project.thumbnail}
						<div class="mt-3 w-32">
							<img
								src={getImageURL(
									page.data.project.collectionId,
									page.data.project.id,
									page.data.project.thumbnail,
									'300x200'
								)}
								alt={page.data.project.name}
							/>
						</div>
					{/if}
					<div class="mt-3 text-sm text-muted-foreground">{page.data.project.description}</div>
				</div>
			</aside>
		</div>
	</form>
</div>
