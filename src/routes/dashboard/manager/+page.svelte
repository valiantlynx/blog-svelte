<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import MyBlogItem from '$lib/components/MyBlogItem.svelte';
	import MyProjectItem from '$lib/components/MyProjectItem.svelte';
	import Icon from '@iconify/svelte';
	import * as m from '$lib/paraglide/messages.js';
	let { data } = $props();
</script>

<main class="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-2xl md:text-3xl font-bold">{m['dashboard.manage_heading']()}</h1>
		<p class="text-base-content/70 mt-2">Manage your projects and blogs in one place</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-figure text-primary">
					<Icon icon="mdi:folder-star" class="text-2xl" />
				</div>
				<div class="stat-title">Projects</div>
				{#await data.projects}
					<div class="stat-value text-sm">Loading...</div>
				{:then projects}
					<div class="stat-value">{projects?.length ?? 0}</div>
				{:catch}
					<div class="stat-value">-</div>
				{/await}
			</div>
		</div>
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:file-document" class="text-2xl" />
				</div>
				<div class="stat-title">Blogs</div>
				{#await data.blogs}
					<div class="stat-value text-sm">Loading...</div>
				{:then blogs}
					<div class="stat-value">{blogs?.length ?? 0}</div>
				{:catch}
					<div class="stat-value">-</div>
				{/await}
			</div>
		</div>
	</div>

	<!-- Content Tabs for Mobile -->
	<div class="tabs tabs-boxed mb-6 md:hidden">
		<a class="tab tab-active" href="#projects">Projects</a>
		<a class="tab" href="#blogs">Blogs</a>
	</div>

	<!-- Two Column Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Projects Section -->
		<section id="projects" class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold flex items-center gap-2">
						<Icon icon="mdi:folder-star" class="text-primary" />
						Projects
					</h2>
					<p class="text-sm text-base-content/60">Manage your portfolio projects</p>
				</div>
				<Button href="/projects/new" size="sm">
					<Icon icon="mdi:plus" class="mr-1" />
					New
				</Button>
			</div>

			<div class="divider"></div>

			{#await data.projects}
				<div class="flex justify-center py-8">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{:then projects}
				{#if !projects || projects.length === 0}
					<div class="card bg-base-200 shadow-xl">
						<div class="card-body items-center text-center">
							<Icon icon="mdi:folder-plus-outline" class="text-5xl text-base-content/30 mb-4" />
							<h3 class="text-lg font-semibold">{m['dashboard.no_projects']()}</h3>
							<p class="text-base-content/60 text-sm mb-4">Start building your portfolio</p>
							<Button href="/projects/new" variant="primary" size="sm">
								<Icon icon="mdi:plus" class="mr-1" />
								{m['dashboard.add_project_button']()}
							</Button>
						</div>
					</div>
				{:else}
					<div class="space-y-4">
						{#each projects as project (project.id)}
							<MyProjectItem {project} />
						{/each}
					</div>
				{/if}
			{:catch}
				<div class="alert alert-error">
					<Icon icon="mdi:alert-circle" />
					<span>Error loading projects</span>
				</div>
			{/await}
		</section>

		<!-- Blogs Section -->
		<section id="blogs" class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold flex items-center gap-2">
						<Icon icon="mdi:file-document" class="text-secondary" />
						Blogs
					</h2>
					<p class="text-sm text-base-content/60">Manage your blog posts</p>
				</div>
				<Button href="/blogs/new" size="sm">
					<Icon icon="mdi:plus" class="mr-1" />
					New
				</Button>
			</div>

			<div class="divider"></div>

			{#await data.blogs}
				<div class="flex justify-center py-8">
					<span class="loading loading-spinner loading-lg text-secondary"></span>
				</div>
			{:then blogs}
				{#if !blogs || blogs.length === 0}
					<div class="card bg-base-200 shadow-xl">
						<div class="card-body items-center text-center">
							<Icon icon="mdi:file-plus-outline" class="text-5xl text-base-content/30 mb-4" />
							<h3 class="text-lg font-semibold">{m['dashboard.no_blogs']()}</h3>
							<p class="text-base-content/60 text-sm mb-4">Start writing your first post</p>
							<Button href="/blogs/new" variant="primary" size="sm">
								<Icon icon="mdi:plus" class="mr-1" />
								{m['dashboard.add_blog_button']()}
							</Button>
						</div>
					</div>
				{:else}
					<div class="space-y-4">
						{#each blogs as blog (blog.id)}
							<MyBlogItem {blog} />
						{/each}
					</div>
				{/if}
			{:catch}
				<div class="alert alert-error">
					<Icon icon="mdi:alert-circle" />
					<span>Error loading blogs</span>
				</div>
			{/await}
		</section>
	</div>
</main>
