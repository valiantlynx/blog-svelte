<script>
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getImageURL } from '$lib/utils/api';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	let loading = $state(false);

	const blog = page.data.blog;

	// Rich text editor
	let ValiantRichText = $state(null);
	let isSaving = $state(false);
	let isLoading = $state(true);

	// Slug handling
	let titleValue = $state(blog?.title || '');
	let slugValue = $state(blog?.slug || '');

	// Convert title to slug
	function generateSlug(text) {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function onTitleInput(e) {
		titleValue = e.target.value;
		slugValue = generateSlug(titleValue);
	}

	$effect(() => {
		isLoading = true;
		import('@mythrantic/svelte-rich-text')
			.then((module) => {
				ValiantRichText = module.ValiantRichText;
			})
			.catch((err) => {
				console.error('Failed to load rich text editor:', err);
			})
			.finally(() => {
				isLoading = false;
			});
	});

	// Handle content_object
	let content = $derived.by(() => {
		const co = blog?.content_object;
		if (!co) return {};
		if (typeof co === 'string') {
			try {
				return JSON.parse(co);
			} catch {
				return {};
			}
		}
		return co;
	});

	let editor = $state();
	let contentJson = $state('');

	function onUpdate() {
		if (editor?.getJSON) {
			const json = editor.getJSON();
			contentJson = JSON.stringify(json);
		}
	}

	// Initialize contentJson
	$effect(() => {
		if (content && typeof content === 'object') {
			contentJson = JSON.stringify(content);
		}
	});

	const submitEditBlog = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Blog edited successfully');
					await update();
					break;
				case 'invalid':
					toast.error('Invalid data');
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
			method="POST"
			action="?/updateBlog"
			class="flex flex-col space-y-2 w-full items-center"
			enctype="multipart/form-data"
			use:enhance={submitEditBlog}
		>
			<h3 class="text-3xl font-bold">Edit {blog?.title}</h3>

			<!-- Basic blog fields -->
			<Input
				id="title"
				name="title"
				label="Blog title"
				value={titleValue}
				disabled={loading}
				oninput={onTitleInput}
			/>
			<Input
				id="summary"
				name="summary"
				label="Blog summary"
				value={blog?.summary ?? ''}
				disabled={loading}
			/>
			<Input
				id="alt"
				name="alt"
				label="Image alt text"
				value={blog?.alt ?? ''}
				disabled={loading}
			/>
			<Input
				id="slug"
				name="slug"
				label="Blog slug"
				value={slugValue}
				disabled={loading}
				placeholder="auto-generated-from-title"
			/>
			<p class="text-sm text-muted-foreground -mt-2 mb-2">
				Will be converted to: /blogs/{slugValue}
			</p>

			<!-- Blog image -->
			<div class="form-control w-full max-w-lg">
				<label for="image" class="label font-medium pb-1">
					<span class="label-text">Blog Image</span>
				</label>
				{#if blog?.image}
					<label for="image" class="avatar w-32 hover:cursor-pointer">
						<div class="w-32 rounded">
							<img src={blog?.image} alt={blog?.alt ?? blog?.title} />
						</div>
					</label>
				{/if}
				<input
					type="file"
					name="image"
					id="image"
					class="file-input file-input-bordered w-full max-w-lg mt-2"
					disabled={loading}
				/>
			</div>

			<!-- Rich Text Editor for Blog Content -->
			<div class="w-full max-w-lg mt-4">
				<label class="label font-medium pb-1">
					<span class="label-text">Blog Content</span>
				</label>
				<input type="hidden" name="content_object" bind:value={contentJson} />
				{#if isLoading}
					<div class="border p-4 rounded bg-base-200">
						<p class="text-sm">Loading editor...</p>
					</div>
				{:else if ValiantRichText}
					<ValiantRichText bind:editor {content} {onUpdate} editable={true} />
				{:else}
					<div class="border p-4 rounded bg-base-200">
						<p class="text-sm text-error">Failed to load editor. Please refresh.</p>
					</div>
				{/if}
			</div>

			<div class="w-full max-w-lg pt-3">
				<Button type="submit" variant="primary" class="w-full" disabled={loading}>
					{loading ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>
		</form>
	</div>
</div>
