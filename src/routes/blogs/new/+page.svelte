<script>
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	let loading = $state(false);

	// Rich text editor
	let ValiantRichText = $state();
	let editor = $state();
	let content = $state({});
	let contentJson = $state('');

	// Slug handling
	let titleValue = $state('');
	let slugValue = $state('');

	// Convert title to slug
	function generateSlug(text) {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '') // Remove special chars except spaces and dashes
			.replace(/[\s_-]+/g, '-') // Replace spaces and underscores with dashes
			.replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
	}

	// Auto-generate slug when title changes
	function onTitleInput(e) {
		titleValue = e.target.value;
		// Only auto-generate slug if user hasn't manually edited it
		// For simplicity, we'll always update slug from title
		slugValue = generateSlug(titleValue);
	}

	onMount(() => {
		import('@mythrantic/svelte-rich-text').then((module) => {
			ValiantRichText = module.ValiantRichText;
		});
	});

	function onUpdate() {
		content = editor?.getJSON ? editor?.getJSON() : {};
		contentJson = JSON.stringify(content);
	}

	const submitNewBlog = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(m['messages.success_blog_created']());
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
		use:enhance={submitNewBlog}
	>
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Left: Inputs -->
			<div class="col-span-2 space-y-4 bg-base-100 p-6 rounded-lg shadow">
				<div>
					<h3 class="text-2xl font-semibold">{m['forms.blog_heading']()}</h3>
					<p class="text-sm text-base-content/60">{m['forms.blog_instruction']()}</p>
				</div>

				<Input
					id="title"
					name="title"
					label={m['forms.blog_title']()}
					disabled={loading}
					value={page.form?.data?.title ?? titleValue}
					errors={page.form?.errors?.title}
					oninput={onTitleInput}
				/>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						id="slug"
						name="slug"
						label={m['forms.blog_slug']()}
						disabled={loading}
						value={page.form?.data?.slug ?? slugValue}
						errors={page.form?.errors?.slug}
						placeholder="auto-generated-from-title"
					/>
					<Input
						id="alt"
						name="alt"
						label={m['forms.blog_image_alt']()}
						disabled={loading}
						value={page.form?.data?.alt ?? ''}
						errors={page.form?.errors?.alt}
					/>
				</div>

				<Input
					id="summary"
					name="summary"
					label={m['forms.blog_summary']()}
					disabled={loading}
					value={page.form?.data?.summary ?? ''}
					errors={page.form?.errors?.summary}
				/>

				<div>
					<label class="label font-medium pb-1"
						><span class="label-text">{m['forms.blog_image']()}</span></label
					>
					<input
						type="file"
						name="image"
						id="image"
						class="file-input file-input-bordered w-full"
						disabled={loading}
					/>
				</div>

				<div>
					<label class="label font-medium pb-1"><span class="label-text">Blog Content</span></label>
					<input type="hidden" name="content_object" bind:value={contentJson} />
					{#if ValiantRichText}
						<ValiantRichText bind:editor {content} {onUpdate} editable={true} />
					{:else}
						<div class="border p-4 rounded bg-base-200">
							<p class="text-sm text-muted-foreground">{m['tooltips.loading']()}</p>
						</div>
					{/if}
				</div>

				<div class="flex gap-3 items-center">
					<Button type="submit" variant="primary" disabled={loading}
						>{m['forms.blog_button']()}</Button
					>
					<a href="/blogs" class="btn btn-ghost">Cancel</a>
				</div>
			</div>

			<!-- Right: Live Preview -->
			<aside class="col-span-1 bg-base-200 p-4 rounded-lg shadow">
				<h4 class="font-semibold mb-2">Live Preview</h4>
				<div class="border rounded p-3 bg-white dark:bg-base-100">
					<h3 class="text-xl font-bold">{titleValue || page.form?.data?.title || 'Untitled'}</h3>
					<p class="text-sm text-base-content/60">{page.form?.data?.summary || 'No summary yet'}</p>
					<div class="mt-3 prose max-w-none">
						<!-- simplified preview, render JSON content if present -->
						{#if contentJson}
							{@html contentJson.slice(0, 500)}
						{:else}
							<p class="text-sm text-muted-foreground">{m['placeholders.write_comment']()}</p>
						{/if}
					</div>
				</div>
			</aside>
		</div>
	</form>
</div>
