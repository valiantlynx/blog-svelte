<script>
	import MyBlogItem from '$lib/components/MyBlogItem.svelte';
	import MyProjectItem from '$lib/components/MyProjectItem.svelte';
	export let data;
	console.log('data', data);
</script>

<main class="flex flex-col w-full overflow-hidden m-4">
	<h2 class="sm:text-3xl text-md font-bold w-full">Manage your blogs and projects</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
		<div class="w-full mt-4 flex flex-col items-center m-3">
			<h2 class="sm:text-3xl text-md font-bold w-full">Create a new project</h2>
			<a href="/projects/new" class="btn btn-primary btn-outline m-4">
				<i class="fa fa-project-diagram" />
				Create a new project
			</a>

			<h2 class="sm:text-3xl text-md3xl font-bold w-full">My Projects</h2>
			{#if data.projects.length === 0}
				<p class="text-center text-3xl">☹️</p>
				<p class="text-center sm:text-3xl text-md">Looks like you don't have any projects.</p>
				<a href="/projects/new" class="btn btn-primary max-w-md mt-4">Add One</a>
			{:else}
				{#each data.projects as project}
					<MyProjectItem {project} />
					<div class="divider mt-0 mb-2" />
				{/each}
			{/if}
		</div>

		<div class="w-full mt-4 flex flex-col items-center mx-3">
			<h2 class="text-3xl font-bold w-full">Create a new blog</h2>
			<a href="/blogs/new" class="btn btn-primary btn-outline my-4">
				<i class="fa fa-plus"></i>
				Create a new blog
			</a>

			<h2 class="text-3xl font-bold w-full">My Blogs (under construction)</h2>
			{#if data.blogs.length === 0}
				<p class="text-center text-3xl">☹️</p>
				<p class="text-center text-xl">Looks like you don't have any blogs.</p>
				<a href="/blogs/new" class="btn btn-primary max-w-md mt-4">Add One</a>
			{:else}
				<div class="w-full">
					{#each data.blogs as blog}
						<div class="flex flex-col my-2">
							<MyBlogItem {blog} />
						</div>
						<div class="divider" />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</main>
