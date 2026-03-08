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

<div class="flex flex-col w-full h-full p-2">
	<div class="w-full">
		<form
			action="?/create"
			method="POST"
			class="flex flex-col space-y-2 w-full items-center"
			enctype="multipart/form-data"
			use:enhance={submitNewBlog}
		>
			<h3 class="text-3xl font-bold">{m['forms.blog_heading']()}</h3>
			<p class="mt-2 text-lg">{m['forms.blog_instruction']()}</p>

			<!-- Basic blog fields -->
			<Input
				id="title"
				name="title"
				label={m['forms.blog_title']()}
				disabled={loading}
				value={page.form?.data?.title ?? ''}
				errors={page.form?.errors?.title}
			/>
			<Input
				id="summary"
				name="summary"
				label={m['forms.blog_summary']()}
				disabled={loading}
				value={page.form?.data?.summary ?? ''}
				errors={page.form?.errors?.summary}
			/>
			<Input
				id="alt"
				name="alt"
				label={m['forms.blog_image_alt']()}
				disabled={loading}
				value={page.form?.data?.alt ?? ''}
				errors={page.form?.errors?.alt}
			/>
			<Input
				id="slug"
				name="slug"
				label={m['forms.blog_slug']()}
				disabled={loading}
				value={page.form?.data?.slug ?? ''}
				errors={page.form?.errors?.slug}
			/>
			<Input
				id="image"
				name="image"
				label={m['forms.blog_image']()}
				type="file"
				disabled={loading}
				errors={page.form?.errors?.image}
			/>

			<!-- Rich Text Editor for Blog Content -->
			<div class="w-full max-w-lg mt-4">
				<label class="label font-medium pb-1">
					<span class="label-text">Blog Content</span>
				</label>
				<input type="hidden" name="content_object" bind:value={contentJson} />
				{#if ValiantRichText}
					<ValiantRichText bind:editor {content} {onUpdate} editable={true} />
				{:else}
					<div class="border p-4 rounded bg-base-200">
						<p class="text-sm text-muted-foreground">Loading editor...</p>
					</div>
				{/if}
			</div>

			<div class="w-full max-w-lg pt-3">
				<Button type="submit" variant="primary" class="w-full max-w-lg" disabled={loading}
					>{m['forms.blog_button']()}</Button
				>
			</div>
		</form>
	</div>
</div>
