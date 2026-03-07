<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import MyBlogItem from '$lib/components/MyBlogItem.svelte';
	import MyProjectItem from '$lib/components/MyProjectItem.svelte';
	import Icon from '@iconify/svelte';
	import * as m from '$lib/paraglide/messages.js';
	let { data } = $props();
	console.log('data', data);
</script>

<main class="flex flex-col w-full overflow-hidden m-4">
	<h2 class="sm:text-3xl text-md font-bold w-full">{m['dashboard.manage_heading']()}</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
		<div class="w-full mt-4 flex flex-col items-center m-3">
			<h2 class="sm:text-3xl text-md font-bold w-full">
				{m['dashboard.create_project_section']()}
			</h2>
			<Button href="/projects/new" variant="outline" class="m-4">
				<i class="fa fa-project-diagram"></i>
				{m['dashboard.create_project_button']()}
			</Button>

			<h2 class="sm:text-3xl text-md3xl font-bold w-full">
				{m['dashboard.my_projects_heading']()}
			</h2>
			{#if data.projects.length === 0}
				<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
				<p class="text-center sm:text-3xl text-md">{m['dashboard.no_projects']()}</p>
				<Button href="/projects/new" variant="primary" class="max-w-md mt-4"
					>{m['dashboard.add_project_button']()}</Button
				>
			{:else}
				{#each data.projects as project}
					<MyProjectItem {project} />
					<div class="divider mt-0 mb-2"></div>
				{/each}
			{/if}
		</div>

		<div class="w-full mt-4 flex flex-col items-center mx-3">
			<h2 class="text-3xl font-bold w-full">{m['dashboard.create_blog_section']()}</h2>
			<Button href="/blogs/new" variant="outline" class="my-4">
				<i class="fa fa-plus"></i>
				{m['dashboard.create_blog_button']()}
			</Button>

			<h2 class="text-3xl font-bold w-full">{m['dashboard.my_blogs_heading']()}</h2>
			{#if data.blogs.length === 0}
				<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
				<p class="text-center text-xl">{m['dashboard.no_blogs']()}</p>
				<Button href="/blogs/new" variant="primary" class="max-w-md mt-4"
					>{m['dashboard.add_blog_button']()}</Button
				>
			{:else}
				<div class="w-full">
					{#each data.blogs as blog}
						<div class="flex flex-col my-2">
							<MyBlogItem {blog} />
						</div>
						<div class="divider"></div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</main>
