<script>
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getImageURL } from '$lib/utils/api';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';
	import { goto, invalidateAll } from '$app/navigation';
	let loading = $state(false);
	let isPublishing = $state(false);

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
			console.log('Form result:', result);
			await goto(`/blogs/${result.data.data.slug}`);
			loading = false;
		};
	};
</script>

<div class="flex flex-col w-full h-full p-4">
	<form
		method="POST"
		action="?/updateBlog"
		class="w-full"
		enctype="multipart/form-data"
		use:enhance={submitEditBlog}
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
						value={page.form?.data?.alt ?? blog?.alt ?? ''}
						errors={page.form?.errors?.alt}
					/>
				</div>

				<Input
					id="summary"
					name="summary"
					label={m['forms.blog_summary']()}
					disabled={loading}
					value={page.form?.data?.summary ?? blog?.summary ?? ''}
					errors={page.form?.errors?.summary}
				/>

				<div>
					<label class="label font-medium pb-1">
						<span class="label-text">{m['forms.blog_image']()}</span>
					</label>
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
						<ValiantRichText bind:editor {content} {onUpdate} editable={true} theme="inherit"  />
					{:else}
						<div class="border p-4 rounded bg-base-200">
							<p class="text-sm text-muted-foreground">{m['tooltips.loading']()}</p>
						</div>
					{/if}
				</div>

				<div class="flex gap-3 items-center flex-wrap">
					<Button type="submit" variant="primary" disabled={loading}>{m['buttons.save']()}</Button>
					<Button
						type="button"
						variant={blog?.published ? 'ghost' : 'primary'}
						disabled={isPublishing}
						onclick={() => {
							const form = new FormData();
							form.append('blogId', blog?.id);

							const submitForm = async () => {
								isPublishing = true;
								try {
									const response = await fetch('?/togglePublish', {
										method: 'POST',
										body: form
									});

									if (response.ok) {
										const data = await response.json();
										if (data.type === 'success') {
											toast.success(data.data.message);
											// Reload page to update UI
											window.location.reload();
										} else {
											toast.error(data.error?.message || m['blog.update_error']());
										}
									} else {
										toast.error(m['blog.update_error']());
									}
								} catch (err) {
									console.error('Error:', err);
									toast.error(m['blog.update_error']());
								} finally {
									isPublishing = false;
								}
							};

							submitForm();
						}}
					>
						{isPublishing
							? 'Updating...'
							: blog?.published
								? m['blog.unpublish']()
								: m['blog.publish']()}
					</Button>
					<a href="/blogs" class="btn btn-ghost">{m['buttons.cancel']()}</a>
				</div>
			</div>

			<!-- Right: Live Preview -->
			<aside class="col-span-1 bg-base-200 p-4 rounded-lg shadow">
				<h4 class="font-semibold mb-2">
					{m['pagesPreview.title'] ? m['pagesPreview.title']() : 'Live Preview'}
				</h4>
				<div class="border rounded p-3 bg-white dark:bg-base-100">
					<h3 class="text-xl font-bold">
						{titleValue || page.form?.data?.title || blog?.title || 'Untitled'}
					</h3>
					<p class="text-sm text-base-content/60">
						{page.form?.data?.summary || blog?.summary || 'No summary yet'}
					</p>
					<div class="mt-3 prose max-w-none">
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
