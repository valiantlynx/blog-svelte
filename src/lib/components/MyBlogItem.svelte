<script>
	import { enhance } from '$app/forms';
	import {Modal} from '@valiantlynx/svelte-ui';
	import { getImageURL } from '$lib/utils/api';
	import toast from 'svelte-french-toast';
	export let blog;

	let modalOpen;

	let loading = false;

	
	const submitDeleteBlog = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Blog deleted successfully!');
					await update();
					break;
				case 'error':
					toast.error('Could not delete blog. Please try again later.');
					break;
				default:
					await update();
			}
			loading = false;
		};
	};

	console.log("blog", blog);

	$: modalOpen = false;
</script>

<div class="w-full flex items-center justify-between">
	<div class="avatar">
		<div class="h-48 rounded">
			<img
				src={blog?.image
					? getImageURL(blog.collectionId, blog.id, blog.image, '80x80')
					: `https://via.placeholder.com/80/4506CB/FFFFFF/?text=${blog.title}`}
				alt="{blog.image} blog image"
			/>
		</div>
	</div>
	<div class="flex flex-col w-full ml-4 h-full justify-center">
		<a href="/blogs/{blog.id}" class="font-semibold text-lg">{blog.title}</a>
		<p>{blog.summary}</p>
	</div>
	<div class="flex items-center justify-end w-full">
		<a href="/blogs/{blog.id}/edit" class="btn btn-outline">Edit blog</a>
		<Modal label={blog.id} checked={modalOpen}>
			<span slot="trigger" class="btn btn-error ml-2">Delete</span>
			<div slot="heading">
				<h3 class="text-2xl">Delete {blog.title}</h3>
				<p class="text-base font-normal mt-2">
					Are you sure you want to delete this blog? Once deleted, the blog cannot be
					restored.
				</p>
			</div>
			<div slot="actions" class="flex w-full items-center justify-center space-x-2">
				<label for={blog.id} class="btn btn-outline">Cancel</label>
				<form action="?/deleteBlog" method="POST" use:enhance={submitDeleteBlog}>
					<input type="hidden" name="id" value={blog.id} />
					<button type="submit" class="btn btn-error" disabled={loading} >Delete</button>
				</form>
			</div>
		</Modal>
	</div>
</div>