<script>
	import { enhance } from '$app/forms';
	import {Input} from '@valiantlynx/svelte-ui';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	let loading = false;

	const submitNewBlog= () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Blog created!');
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
<div class="flex flex-col w-full h-full p-2">
    <div class="w-full">
        <form
            action="?/create"
            method="POST"
            class="flex flex-col space-y-2 w-full items-center"
            enctype="multipart/form-data"
            use:enhance={submitNewBlog}
        >
            <h3 class="text-3xl font-bold">Create a new blog</h3>
            <p class="mt-2 text-lg">Please fill in the blog details</p>
            
            <!-- Add new fields for blog creation -->
            <Input id="title" label="Title" disabled={loading} value={$page.form?.data?.title} errors={$page.form?.errors?.title}/>
            <Input id="summary" label="Summary" disabled={loading} value={$page.form?.data?.summary} errors={$page.form?.errors?.summary}/>
            <Input id="alt" label="Image Alt Text" disabled={loading} value={$page.form?.data?.alt} errors={$page.form?.errors?.alt}/>
            <Input id="slug" label="Slug" disabled={loading} value={$page.form?.data?.slug} errors={$page.form?.errors?.slug}/>
            <Input id="tags" label="Tags" disabled={loading} value={$page.form?.data?.tags} errors={$page.form?.errors?.tags}/>

            <div class="form-control w-full max-w-lg">
                <label for="image" class="label font-medium pb-1">
                    <span class="label-text">Blog Image</span>
                </label>
                <input
                    type="file"
                    name="image"
                    id="image"
                    class="file-input file-input-bordered file-input-primary w-full max-w-lg"
                    disabled={loading}
                />
            </div>
            <div class="w-full max-w-lg pt-3">
                <button type="submit" class="btn btn-primary w-full max-w-lg" disabled={loading}>Create Blog</button>
            </div>
        </form>
    </div>
</div>