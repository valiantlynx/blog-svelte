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

<main class="w-full max-w-7xl mx-auto p-6">
	<!-- Fresh hero header -->
	<header class="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
		<div
			class="col-span-2 rounded-3xl p-8 bg-gradient-to-r from-sky-50 to-white shadow-md relative overflow-hidden"
		>
			<div class="absolute -right-24 -top-10 opacity-10 transform rotate-12">
				<svg
					width="220"
					height="220"
					viewBox="0 0 100 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="50" cy="50" r="45" stroke="rgba(99,102,241,0.15)" stroke-width="10" />
				</svg>
			</div>
			<div class="relative z-10">
				<div class="flex items-center gap-4">
					<div
						class="h-14 w-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold"
					>
						VL
					</div>
					<div>
						<h1 class="text-2xl font-extrabold">
							{m['dashboard_extra.welcome_back']
								? m['dashboard_extra.welcome_back']()
								: 'Welcome back'}
						</h1>
						<p class="text-sm text-base-content/60 mt-1">{m['dashboard.manage_subheading']()}</p>
					</div>
				</div>

				<div class="mt-6 flex flex-wrap gap-3">
					<Button
						href="/blogs/new"
						variant="ghost"
						class="px-4 py-2 shadow-sm bg-white/60 backdrop-blur-sm"
					>
						<Icon icon="mdi:plus" class="mr-2" />
						{m['dashboard.add_blog_button']()}
					</Button>
					<Button href="/projects/new" variant="outline" class="px-4 py-2">
						<Icon icon="mdi:rocket-launch" class="mr-2" />
						{m['dashboard.add_project_button']()}
					</Button>
				</div>
			</div>
		</div>

		<div class="rounded-2xl p-6 bg-base-100 shadow-md flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<p class="text-sm text-base-content/60">{m['dashboard.quick_stats']()}</p>
				<span class="text-xs text-base-content/50">{m['status.active']()}</span>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-3xl font-bold">
						{#if projectsCount === null || blogsCount === null}—{:else}{projectsCount +
								blogsCount}{/if}
					</p>
					<p class="text-sm text-base-content/60">{m['dashboard.total_items']()}</p>
				</div>
				<Icon icon="mdi:chart-donut" class="text-5xl text-primary/80" />
			</div>
		</div>
	</header>

	<!-- Compact stat widgets -->
	<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<article class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-lg bg-primary/10 text-primary">
					<Icon icon="mdi:folder-multiple-plus" />
				</div>
				<div>
					<div class="text-sm text-base-content/60">{m['dashboard.total_items']()}</div>
					<div class="text-xl font-semibold">
						{#if projectsCount === null || blogsCount === null}—{:else}{projectsCount +
								blogsCount}{/if}
					</div>
				</div>
			</div>
		</article>

		<article class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-lg bg-secondary/10 text-secondary">
					<Icon icon="mdi:folder-star" />
				</div>
				<div>
					<div class="text-sm text-base-content/60">{m['dashboard.projects_count']()}</div>
					{#await data.projects}
						<div class="text-xl font-semibold">—</div>
					{:then projects}
						<div class="text-xl font-semibold">{projects?.length ?? 0}</div>
					{/await}
				</div>
			</div>
		</article>

		<article class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-lg bg-accent/10 text-accent">
					<Icon icon="mdi:file-document-multiple" />
				</div>
				<div>
					<div class="text-sm text-base-content/60">{m['dashboard.blogs_count']()}</div>
					{#await data.blogs}
						<div class="text-xl font-semibold">—</div>
					{:then blogs}
						<div class="text-xl font-semibold">{blogs?.length ?? 0}</div>
					{/await}
				</div>
			</div>
		</article>

		<article class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-lg bg-accent/10 text-accent">
					<Icon icon="mdi:clock-outline" />
				</div>
				<div>
					<div class="text-sm text-base-content/60">{m['dashboard.recent_activity']()}</div>
					<div class="text-xl font-semibold">{m['status.active']()}</div>
				</div>
			</div>
		</article>
	</section>

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
