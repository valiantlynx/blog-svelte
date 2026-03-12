<script>
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { page } from '$app/stores';
	import { site } from '$lib/utils/config';
	import * as m from '$lib/paraglide/messages.js';

	const avatar = $derived(  
        $page.data.user?.avatar  
            ? `${site.pocketbase}/api/files/${$page.data.user?.collectionId}/${$page.data.user?.id}/${$page.data.user?.avatar}`  
            : `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${$page.data.user?.username}`  
    );  


	const userStats = [
		{
			icon: 'fas fa-book',
			label: 'Blogs',
			value: $page.data.user?.blogCount || 0
		},
		{
			icon: 'fas fa-project-diagram',
			label: 'Projects',
			value: $page.data.user?.projectCount || 0
		},
		{
			icon: 'fas fa-heart',
			label: 'Total Likes',
			value: $page.data.user?.totalLikes || 0
		}
	];
</script>

<svelte:head>
	<title>Profile Preview</title>
</svelte:head>

<div class="w-full min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
	<div class="container mx-auto px-4 py-8 md:py-16">
		<!-- Main Profile Card -->
		<div class="max-w-4xl mx-auto">
			<!-- Profile Header -->
			<div class="relative bg-base-100 rounded-2xl shadow-2xl overflow-hidden mb-8">
				<!-- Negative margin to overlap banner -->
				<div class="relative  px-6 md:px-12 pt-4 pb-8">
					<div class="flex flex-col md:flex-row md:items-end md:gap-8 mb-8">
						<!-- Avatar -->
						<div class="flex-shrink-0">
							<div
								class="w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-xl overflow-hidden border-4 border-base-100 bg-base-200"
							>
								<img src={avatar} alt="Profile Avatar" class="w-full h-full object-cover" />
							</div>
						</div>

						<!-- Name and Title -->
						<div class="flex-1 pt-4 md:pt-0">
							<h1
								class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text"
							>
								{$page.data.user?.username || 'User'}
							</h1>
							{#if $page.data.user?.title}
								<p class="text-xl md:text-2xl text-base-content/70 mb-4 font-semibold">
									{$page.data.user.title}
								</p>
							{/if}
							{#if $page.data.user?.address}
								<div class="flex items-center gap-2 text-base-content/60 mb-3">
									<i class="fas fa-map-marker-alt text-primary"></i>
									<span>{$page.data.user.address}</span>
								</div>
							{/if}
							<div class="flex gap-3 mt-6">
								<Button href="/dashboard/profile/edit" variant="primary" class="font-semibold">
									<i class="fas fa-edit mr-2"></i>
									Edit Profile
								</Button>
								<Button href="/dashboard/profile/account" variant="outline" class="font-semibold">
									<i class="fas fa-cog mr-2"></i>
									Account Settings
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Stats Section -->
			<div class="grid grid-cols-3 gap-4 md:gap-6 mb-8">
				{#each userStats as stat}
					<div
						class="bg-base-100 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
					>
						<div class="text-3xl md:text-4xl mb-3 text-primary">
							<i class={stat.icon}></i>
						</div>
						<p class="text-2xl md:text-3xl font-bold text-base-content mb-1">
							{stat.value}
						</p>
						<p class="text-sm md:text-base text-base-content/60">{stat.label}</p>
					</div>
				{/each}
			</div>

			<!-- About Section -->
			{#if $page.data.user?.about}
				<div class="bg-base-100 rounded-xl shadow-lg p-8 mb-8">
					<h2 class="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
						<i class="fas fa-user-circle text-primary"></i>
						About Me
					</h2>
					<p class="text-base-content/70 leading-relaxed text-lg whitespace-pre-wrap">
						{$page.data.user.about}
					</p>
				</div>
			{/if}

			<!-- Roles and Permissions -->
			{#if $page.data.user?.role && $page.data.user.role.length > 0}
				<div class="bg-base-100 rounded-xl shadow-lg p-8 mb-8">
					<h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
						<i class="fas fa-shield-alt text-primary"></i>
						Roles & Permissions
					</h2>
					<div class="flex flex-wrap gap-3">
						{#each $page.data.user.role as role}
							<Badge variant="primary" size="lg">
								<i class="fas fa-check-circle mr-2"></i>
								{role}
							</Badge>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Quick Actions -->
			<div
				class="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-8"
			>
				<h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
					<i class="fas fa-bolt text-primary"></i>
					Quick Actions
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Button href="/dashboard/manager" variant="outline" class="w-full font-semibold">
						<i class="fas fa-tasks mr-2"></i>
						Manage Content
					</Button>
					<Button href="/dashboard/create/blog" variant="outline" class="w-full font-semibold">
						<i class="fas fa-plus mr-2"></i>
						Create Blog
					</Button>
					<Button href="/dashboard/create/project" variant="outline" class="w-full font-semibold">
						<i class="fas fa-plus mr-2"></i>
						Create Project
					</Button>
					<Button href="/dashboard" variant="outline" class="w-full font-semibold">
						<i class="fas fa-chart-line mr-2"></i>
						View Dashboard
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
