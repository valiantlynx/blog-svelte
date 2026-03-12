<script>
	import { page } from '$app/stores';
	import { m } from '$lib/paraglide/messages.js';

	const stats = $derived($page.data.stats);
	const recentUsers = $derived($page.data.recentUsers);
	const recentBlogs = $derived($page.data.recentBlogs);
	const mostPopularBlogs = $derived($page.data.mostPopularBlogs);
	const allUsers = $derived($page.data.allUsers);
</script>

<svelte:head>
	<title>{m['admin.dashboard_title']()}</title>
</svelte:head>

<div
	class="w-full min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4 md:p-8 te"
>
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1
				class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text"
			>
				{m['admin.dashboard_title']()}
			</h1>
			<p class="text-base-content/60 text-lg">{m['admin.dashboard_subtitle']()}</p>
		</div>

		<!-- System Overview -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<!-- Total Users -->
			<div class="bg-base-100 rounded-xl shadow-lg p-6 border-l-4 border-primary">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-base-content/60 text-sm font-semibold">{m['admin.total_users']()}</p>
						<p class="text-3xl font-bold mt-2">{stats.totalUsers}</p>
					</div>
					<i class="fas fa-users text-primary text-3xl opacity-20"></i>
				</div>
			</div>

			<!-- Total Blogs -->
			<div class="bg-base-100 rounded-xl shadow-lg p-6 border-l-4 border-info">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-base-content/60 text-sm font-semibold">{m['admin.total_blogs']()}</p>
						<p class="text-3xl font-bold mt-2">{stats.totalBlogs}</p>
						<div class="flex gap-2 mt-2 text-xs">
							<span class="badge badge-success"
								>{stats.publishedBlogs} {m['admin.published']()}</span
							>
							<span class="badge badge-warning">{stats.draftBlogs} {m['admin.draft']()}</span>
						</div>
					</div>
					<i class="fas fa-book text-info text-3xl opacity-20"></i>
				</div>
			</div>

			<!-- Total Projects -->
			<div class="bg-base-100 rounded-xl shadow-lg p-6 border-l-4 border-success">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-base-content/60 text-sm font-semibold">{m['admin.total_projects']()}</p>
						<p class="text-3xl font-bold mt-2">{stats.totalProjects}</p>
					</div>
					<i class="fas fa-project-diagram text-success text-3xl opacity-20"></i>
				</div>
			</div>

			<!-- Total Likes -->
			<div class="bg-base-100 rounded-xl shadow-lg p-6 border-l-4 border-error">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-base-content/60 text-sm font-semibold">{m['admin.total_likes']()}</p>
						<p class="text-3xl font-bold mt-2">{stats.totalLikes}</p>
					</div>
					<i class="fas fa-heart text-error text-3xl opacity-20"></i>
				</div>
			</div>
		</div>

		<!-- Active Users -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
			<!-- Active Today -->
			<div class="bg-base-100 rounded-xl shadow-lg p-6">
				<div class="flex items-center gap-3 mb-4">
					<i class="fas fa-calendar-day text-warning text-2xl"></i>
					<h3 class="text-xl font-bold">{m['admin.active_today']()}</h3>
				</div>
				<p class="text-4xl font-bold text-warning">{stats.activeUsersToday}</p>
				<p class="text-base-content/60 text-sm mt-2">{m['admin.active_today_description']()}</p>
			</div>

			<!-- Active This Week -->
			<div class="bg-base-100 rounded-xl shadow-lg p-6">
				<div class="flex items-center gap-3 mb-4">
					<i class="fas fa-calendar-week text-info text-2xl"></i>
					<h3 class="text-xl font-bold">{m['admin.active_this_week']()}</h3>
				</div>
				<p class="text-4xl font-bold text-info">{stats.activeUsersWeek}</p>
				<p class="text-base-content/60 text-sm mt-2">{m['admin.active_this_week_description']()}</p>
			</div>
		</div>

		<!-- User Roles Distribution -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			<!-- Admins -->
			<div
				class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl shadow-lg p-6 border border-primary/20"
			>
				<div class="flex items-center gap-3 mb-4">
					<div class="bg-primary/20 rounded-lg p-3">
						<i class="fas fa-crown text-primary text-lg"></i>
					</div>
					<h3 class="text-lg font-bold">{m['admin.admins']()}</h3>
				</div>
				<p class="text-3xl font-bold text-primary">{stats.roleStats.admin}</p>
			</div>

			<!-- Editors -->
			<div
				class="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl shadow-lg p-6 border border-warning/20"
			>
				<div class="flex items-center gap-3 mb-4">
					<div class="bg-warning/20 rounded-lg p-3">
						<i class="fas fa-shield text-warning text-lg"></i>
					</div>
					<h3 class="text-lg font-bold">{m['admin.editors']()}</h3>
				</div>
				<p class="text-3xl font-bold text-warning">{stats.roleStats.editor}</p>
			</div>

			<!-- Regular Users -->
			<div
				class="bg-gradient-to-br from-success/10 to-success/5 rounded-xl shadow-lg p-6 border border-success/20"
			>
				<div class="flex items-center gap-3 mb-4">
					<div class="bg-success/20 rounded-lg p-3">
						<i class="fas fa-user text-success text-lg"></i>
					</div>
					<h3 class="text-lg font-bold">{m['admin.regular_users']()}</h3>
				</div>
				<p class="text-3xl font-bold text-success">{stats.roleStats.user}</p>
			</div>
		</div>

		<!-- Two Column Layout -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
			<!-- Recent Signups -->
			<div
				class="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-primary/10 hover:shadow-2xl transition-shadow"
			>
				<div class="bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-sm p-8">
					<div class="flex items-center gap-4">
						<div class="bg-primary/20 rounded-lg p-3 ring-2 ring-primary/30">
							<i class="fas fa-user-plus text-primary text-2xl"></i>
						</div>
						<div>
							<h2 class="text-2xl font-bold text-white">{m['admin.recent_signups']()}</h2>
							<p class="text-primary/80 text-sm mt-1">
								{recentUsers.length}
								{m['admin.total_users']()}
							</p>
						</div>
					</div>
				</div>
				<div class="p-6">
					{#if recentUsers.length > 0}
						<div class="space-y-4">
							{#each recentUsers as user, idx}
								<div
									class="flex items-center justify-between p-4 rounded-lg bg-base-200/40 hover:bg-base-200/80 transition-colors border border-base-300/20 group"
								>
									<div class="flex-1">
										<div class="flex items-center gap-3 mb-2">
											<div
												class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold ring-2 ring-primary/20"
											>
												{user.username.charAt(0).toUpperCase()}
											</div>
											<div>
												<p class="font-semibold text-base-content">{user.username}</p>
												<p class="text-xs text-base-content/60">{user.email}</p>
											</div>
										</div>
									</div>
									<div class="text-right">
										{#if user.role && user.role.length > 0}
											<div class="flex gap-1 flex-wrap justify-end mb-2">
												{#each user.role as role}
													<span class="badge badge-sm badge-primary text-xs">{role}</span>
												{/each}
											</div>
										{:else}
											<span class="badge badge-sm badge-ghost text-xs mb-2">User</span>
										{/if}
										<p class="text-xs text-base-content/50">
											{new Date(user.created).toLocaleDateString()}
										</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-12">
							<i class="fas fa-inbox text-4xl text-base-content/20 mb-4"></i>
							<p class="text-base-content/60">{m['admin.no_recent_signups']()}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Most Popular Blogs -->
			<div
				class="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-success/10 hover:shadow-2xl transition-shadow"
			>
				<div class="bg-gradient-to-r from-success/80 to-info/80 backdrop-blur-sm p-8">
					<div class="flex items-center gap-4">
						<div class="bg-success/20 rounded-lg p-3 ring-2 ring-success/30">
							<i class="fas fa-fire text-success text-2xl"></i>
						</div>
						<div>
							<h2 class="text-2xl font-bold text-white">{m['admin.most_popular_blogs']()}</h2>
							<p class="text-success/80 text-sm mt-1">
								{mostPopularBlogs.length}
								{m['admin.total_blogs']()}
							</p>
						</div>
					</div>
				</div>
				<div class="p-6">
					{#if mostPopularBlogs.length > 0}
						<div class="space-y-4">
							{#each mostPopularBlogs as blog, idx}
								<div
									class="flex items-center justify-between p-4 rounded-lg bg-base-200/40 hover:bg-base-200/80 transition-colors border border-base-300/20 group"
								>
									<div class="flex-1 min-w-0">
										<p class="font-semibold text-base-content truncate">{blog.title}</p>
										<p class="text-xs text-base-content/60 mt-1">
											{blog.published ? m['status.published']() : m['status.draft']()}
										</p>
									</div>
									<div class="text-right ml-4">
										<div class="flex items-center gap-2 justify-end mb-2">
											<i class="fas fa-heart text-error text-lg"></i>
											<span class="font-bold text-lg text-base-content">{blog.likes}</span>
										</div>
										<span
											class={`badge badge-sm ${blog.published ? 'badge-success' : 'badge-warning'}`}
										>
											{blog.published ? m['status.published']() : m['status.draft']()}
										</span>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-12">
							<i class="fas fa-inbox text-4xl text-base-content/20 mb-4"></i>
							<p class="text-base-content/60">{m['admin.no_blogs']()}</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Recent Blog Activity -->
		<div
			class="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-warning/10 hover:shadow-2xl transition-shadow mb-12"
		>
			<div class="bg-gradient-to-r from-warning/80 to-error/80 backdrop-blur-sm p-8">
				<div class="flex items-center gap-4">
					<div class="bg-warning/20 rounded-lg p-3 ring-2 ring-warning/30">
						<i class="fas fa-history text-warning text-2xl"></i>
					</div>
					<div>
						<h2 class="text-2xl font-bold text-white">{m['admin.recent_blog_activity']()}</h2>
						<p class="text-warning/80 text-sm mt-1">
							{recentBlogs.length}
							{m['admin.total_blogs']()}
						</p>
					</div>
				</div>
			</div>
			<div class="p-6">
				{#if recentBlogs.length > 0}
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="border-b border-base-300/30">
									<th
										class="text-left py-3 px-4 font-semibold text-sm text-base-content/70 uppercase tracking-wide"
										>{m['admin.title']()}</th
									>
									<th
										class="text-left py-3 px-4 font-semibold text-sm text-base-content/70 uppercase tracking-wide"
										>{m['admin.author']()}</th
									>
									<th
										class="text-left py-3 px-4 font-semibold text-sm text-base-content/70 uppercase tracking-wide"
										>{m['status.published']()}</th
									>
									<th
										class="text-left py-3 px-4 font-semibold text-sm text-base-content/70 uppercase tracking-wide"
										>{m['admin.created']()}</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-base-300/20">
								{#each recentBlogs as blog}
									<tr class="hover:bg-base-200/30 transition-colors">
										<td class="py-4 px-4 font-semibold text-base-content">{blog.title}</td>
										<td class="py-4 px-4 text-sm text-base-content/70">{blog.author}</td>
										<td class="py-4 px-4">
											<span
												class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${blog.published ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}
											>
												{blog.published ? m['status.published']() : m['status.draft']()}
											</span>
										</td>
										<td class="py-4 px-4 text-sm text-base-content/60"
											>{new Date(blog.created).toLocaleDateString()}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-12">
						<i class="fas fa-inbox text-4xl text-base-content/20 mb-4"></i>
						<p class="text-base-content/60">{m['admin.no_recent_blogs']()}</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- All Users Directory -->
		<div
			class="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-info/10 hover:shadow-2xl transition-shadow"
		>
			<div class="bg-gradient-to-r from-info/80 to-primary/80 backdrop-blur-sm p-8">
				<div class="flex items-center gap-4">
					<div class="bg-info/20 rounded-lg p-3 ring-2 ring-info/30">
						<i class="fas fa-list text-info text-2xl"></i>
					</div>
					<div>
						<h2 class="text-2xl font-bold text-white">{m['admin.all_users_directory']()}</h2>
						<p class="text-info/80 text-sm mt-1">{allUsers.length} {m['admin.total_users']()}</p>
					</div>
				</div>
			</div>
			<div class="p-6">
				{#if allUsers.length > 0}
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="border-b border-base-300/30">
									<th
										class="text-left py-3 px-4 font-semibold text-sm text-base-content/70 uppercase tracking-wide"
										>{m['admin.username']()}</th
									>
									<th
										class="text-left py-3 px-4 font-semibold text-sm text-base-content/70 uppercase tracking-wide"
										>{m['admin.email']()}</th
									>
									<th
										class="text-left py-3 px-4 font-semibold text-sm text-base-content/70 uppercase tracking-wide"
										>{m['admin.role']()}</th
									>
									<th
										class="text-left py-3 px-4 font-semibold text-sm text-base-content/70 uppercase tracking-wide"
										>{m['admin.joined']()}</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-base-300/20">
								{#each allUsers as user}
									<tr class="hover:bg-base-200/30 transition-colors">
										<td class="py-4 px-4 font-semibold text-base-content">{user.username}</td>
										<td class="py-4 px-4 text-sm text-base-content/70">{user.email}</td>
										<td class="py-4 px-4">
											{#if user.role && user.role.length > 0}
												<div class="flex gap-1 flex-wrap">
													{#each user.role as role}
														<span class="badge badge-sm badge-primary text-xs">{role}</span>
													{/each}
												</div>
											{:else}
												<span class="badge badge-sm badge-ghost text-xs">User</span>
											{/if}
										</td>
										<td class="py-4 px-4 text-sm text-base-content/60"
											>{new Date(user.created).toLocaleDateString()}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-12">
						<i class="fas fa-inbox text-4xl text-base-content/20 mb-4"></i>
						<p class="text-base-content/60">{m['admin.no_users_found']()}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
