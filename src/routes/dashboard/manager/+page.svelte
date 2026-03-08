<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import MyBlogItem from '$lib/components/MyBlogItem.svelte';
	import MyProjectItem from '$lib/components/MyProjectItem.svelte';
	import Icon from '@iconify/svelte';
	import * as m from '$lib/paraglide/messages.js';
	let { data } = $props();

	let projectsCount = $state<number | null>(null);
	let blogsCount = $state<number | null>(null);
</script>

<main class="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
	<!-- Redesigned Header -->
	<div
		class="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 p-6 shadow-lg ring-1 ring-base-content/5"
	>
		<div
			class="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
		>
			<div class="flex-1">
				<h1 class="text-2xl md:text-3xl font-extrabold text-base-content">
					{m['dashboard.manage_heading']()}
				</h1>
				<p class="mt-1 text-base-content/60 max-w-xl">{m['dashboard.manage_subheading']()}</p>
				<div class="mt-4 flex flex-wrap gap-3">
					<a href="/blogs/new" class="btn btn-outline btn-sm">
						<Icon icon="mdi:plus" class="mr-1" />
						{m['dashboard.add_blog_button']()}
					</a>
					<a href="/projects/new" class="btn btn-outline btn-sm">
						<Icon icon="mdi:plus" class="mr-1" />
						{m['dashboard.add_project_button']()}
					</a>
				</div>
			</div>
			<div class="flex items-center gap-4">
				<div class="text-right">
					<p class="text-sm text-base-content/60">{m['dashboard.quick_stats']()}</p>
					<p class="text-2xl font-bold">
						{#if projectsCount === null || blogsCount === null}...{:else}{projectsCount +
								blogsCount}{/if}
					</p>
				</div>
				<Icon icon="mdi:account-circle" class="text-5xl opacity-25" />
			</div>
		</div>
	</div>

	<!-- Modern Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<!-- Total Content Card -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-base-100 p-5 shadow-lg ring-1 ring-base-content/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-primary/20 dark:ring-white/10"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative z-10 flex items-center gap-4">
				<div
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content"
				>
					<Icon icon="mdi:folder-multiple-plus" />
				</div>
				<div>
					<p class="text-sm font-medium text-base-content/60">{m['dashboard.total_items']()}</p>
					{#if projectsCount === null || blogsCount === null}
						<div class="text-2xl font-bold">{m['tooltips.loading']()}</div>
					{:else}
						<div class="text-2xl font-bold">{projectsCount + blogsCount}</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Projects Card -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-base-100 p-5 shadow-lg ring-1 ring-base-content/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-primary/20 dark:ring-white/10"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative z-10 flex items-center gap-4">
				<div
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content"
				>
					<Icon icon="mdi:folder-star" />
				</div>
				<div>
					<p class="text-sm font-medium text-base-content/60">{m['dashboard.projects_count']()}</p>
					{#await data.projects}
						<div class="text-2xl font-bold">Loading...</div>
					{:then projects}
						<div class="text-2xl font-bold">{projects?.length ?? 0}</div>
					{/await}
				</div>
			</div>
		</div>

		<!-- Blogs Card -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-base-100 p-5 shadow-lg ring-1 ring-base-content/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-secondary/20 dark:ring-white/10"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative z-10 flex items-center gap-4">
				<div
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-content"
				>
					<Icon icon="mdi:file-document-multiple" />
				</div>
				<div>
					<p class="text-sm font-medium text-base-content/60">{m['dashboard.blogs_count']()}</p>
					{#await data.blogs}
						<div class="text-2xl font-bold">Loading...</div>
					{:then blogs}
						<div class="text-2xl font-bold">{blogs?.length ?? 0}</div>
					{/await}
				</div>
			</div>
		</div>

		<!-- Recent Activity Card -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-base-100 p-5 shadow-lg ring-1 ring-base-content/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-accent/20 dark:ring-white/10"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
			></div>
			<div class="relative z-10 flex items-center gap-4">
				<div
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-content"
				>
					<Icon icon="mdi:clock-outline" />
				</div>
				<div>
					<p class="text-sm font-medium text-base-content/60">{m['dashboard.recent_activity']()}</p>
					<div class="mt-1 flex items-center gap-2">
						<span class="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
						<span class="text-sm font-medium">Active</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Content Tabs for Mobile -->
	<div class="tabs tabs-boxed mb-6 md:hidden">
		<a class="tab tab-active" href="#projects">{m['dashboard.projects_count']()}</a>
		<a class="tab" href="#blogs">{m['dashboard.blogs_count']()}</a>
	</div>

	<!-- Two Column Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Projects Section -->
		<section id="projects" class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold flex items-center gap-2">
						<Icon icon="mdi:folder-star" class="text-primary" />
						{m['dashboard.projects_count']()}
					</h2>
					<p class="text-sm text-base-content/60">{m['dashboard.manage_heading']()}</p>
				</div>
				<Button href="/projects/new" size="sm">
					<Icon icon="mdi:plus" class="mr-1" />
					{m['dashboard.add_project_button']()}
				</Button>
			</div>

			<div class="divider"></div>

			{#await data.projects}
				<div class="flex justify-center py-8">
					<span class="loading loading-spinner loading-lg text-primary" />
				</div>
			{:then projects}
				{#if !projects || projects.length === 0}
					<div class="card bg-base-200 shadow-xl">
						<div class="card-body items-center text-center">
							<Icon icon="mdi:folder-plus-outline" class="text-5xl text-base-content/30 mb-4" />
							<h3 class="text-lg font-semibold">{m['dashboard.no_projects']()}</h3>
							<p class="text-base-content/60 text-sm mb-4">{m['dashboard.no_projects_desc']()}</p>
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
			{/await}
		</section>

		<!-- Blogs Section -->
		<section id="blogs" class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold flex items-center gap-2">
						<Icon icon="mdi:file-document" class="text-secondary" />
						{m['dashboard.blogs_count']()}
					</h2>
					<p class="text-sm text-base-content/60">{m['dashboard.manage_heading']()}</p>
				</div>
				<Button href="/blogs/new" size="sm">
					<Icon icon="mdi:plus" class="mr-1" />
					{m['dashboard.add_blog_button']()}
				</Button>
			</div>

			<div class="divider"></div>

			{#await data.blogs}
				<div class="flex justify-center py-8">
					<span class="loading loading-spinner loading-lg text-secondary" />
				</div>
			{:then blogs}
				{#if !blogs || blogs.length === 0}
					<div class="card bg-base-200 shadow-xl">
						<div class="card-body items-center text-center">
							<Icon icon="mdi:file-plus-outline" class="text-5xl text-base-content/30 mb-4" />
							<h3 class="text-lg font-semibold">{m['dashboard.no_blogs']()}</h3>
							<p class="text-base-content/60 text-sm mb-4">{m['dashboard.no_blogs_desc']()}</p>
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
			{/await}
		</section>
	</div>
</main>
