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
				class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text "
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

			<!-- Moderators -->
			<div
				class="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl shadow-lg p-6 border border-warning/20"
			>
				<div class="flex items-center gap-3 mb-4">
					<div class="bg-warning/20 rounded-lg p-3">
						<i class="fas fa-shield text-warning text-lg"></i>
					</div>
					<h3 class="text-lg font-bold">{m['admin.moderators']()}</h3>
				</div>
				<p class="text-3xl font-bold text-warning">{stats.roleStats.moderator}</p>
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
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
			<!-- Recent Users -->
			<div class="bg-base-100 rounded-xl shadow-lg overflow-hidden">
				<div class="bg-gradient-to-r from-primary to-secondary p-6">
					<h2 class="text-2xl font-bold  flex items-center gap-3">
						<i class="fas fa-user-plus"></i>
						{m['admin.recent_signups']()}
					</h2>
				</div>
				<div class="overflow-x-auto">
					<table class="table table-zebra w-full">
						<thead>
							<tr>
								<th>{m['admin.username']()}</th>
								<th>{m['admin.email']()}</th>
								<th>{m['admin.role']()}</th>
								<th>{m['admin.joined']()}</th>
							</tr>
						</thead>
						<tbody>
							{#each recentUsers as user}
								<tr>
									<td class="font-semibold">{user.username}</td>
									<td class="text-sm text-base-content/70">{user.email}</td>
									<td>
										{#if user.role && user.role.length > 0}
											<div class="flex gap-1 flex-wrap">
												{#each user.role as role}
													<span class="badge badge-primary text-xs">{role}</span>
												{/each}
											</div>
										{:else}
											<span class="text-base-content/50 text-xs">User</span>
										{/if}
									</td>
									<td class="text-sm">
										{new Date(user.created).toLocaleDateString()}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					{#if recentUsers.length === 0}
						<div class="p-8 text-center text-base-content/60">
							<p>{m['admin.no_recent_signups']()}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Most Popular Blogs -->
			<div class="bg-base-100 rounded-xl shadow-lg overflow-hidden">
				<div class="bg-gradient-to-r from-success to-info p-6">
					<h2 class="text-2xl font-bold  flex items-center gap-3">
						<i class="fas fa-fire"></i>
						{m['admin.most_popular_blogs']()}
					</h2>
				</div>
				<div class="overflow-x-auto">
					<table class="table table-zebra w-full">
						<thead>
							<tr>
								<th>{m['admin.title']()}</th>
								<th>{m['admin.likes']()}</th>
								<th>{m['admin.status']()}</th>
							</tr>
						</thead>
						<tbody>
							{#each mostPopularBlogs as blog}
								<tr>
									<td class="font-semibold">
										{blog.title}
									</td>
									<td>
										<div class="flex items-center gap-2">
											<i class="fas fa-heart text-error"></i>
											{blog.likes}
										</div>
									</td>
									<td>
										<span class={`badge ${blog.published ? 'badge-success' : 'badge-warning'}`}>
											{blog.published ? m['status.published']() : m['status.draft']()}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					{#if mostPopularBlogs.length === 0}
						<div class="p-8 text-center text-base-content/60">
							<p>{m['admin.no_blogs']()}</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="bg-base-100 rounded-xl shadow-lg overflow-hidden">
			<div class="bg-gradient-to-r from-warning to-error p-6">
				<h2 class="text-2xl font-bold  flex items-center gap-3">
					<i class="fas fa-history"></i>
					{m['admin.recent_blog_activity']()}
				</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th>{m['admin.title']()}</th>
							<th>{m['admin.author']()}</th>
							<th>{m['status.published']()}</th>
							<th>{m['admin.created']()}</th>
						</tr>
					</thead>
					<tbody>
						{#each recentBlogs as blog}
							<tr>
								<td class="font-semibold">{blog.title}</td>
								<td class="text-sm">{blog.author}</td>
								<td>
									<span class={`badge ${blog.published ? 'badge-success' : 'badge-warning'}`}>
										{blog.published ? m['status.published']() : m['status.draft']()}
									</span>
								</td>
								<td class="text-sm">
									{new Date(blog.created).toLocaleDateString()}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				{#if recentBlogs.length === 0}
					<div class="p-8 text-center text-base-content/60">
						<p>{m['admin.no_recent_blogs']()}</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- All Users List -->
		<div class="mt-8 bg-base-100 rounded-xl shadow-lg overflow-hidden">
			<div class="bg-gradient-to-r from-info to-primary p-6">
				<h2 class="text-2xl font-bold  flex items-center gap-3">
					<i class="fas fa-list"></i>
					{m['admin.all_users_directory']()}
				</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th>{m['admin.username']()}</th>
							<th>{m['admin.email']()}</th>
							<th>{m['admin.role']()} (s)</th>
							<th>{m['admin.joined']()}</th>
						</tr>
					</thead>
					<tbody>
						{#each allUsers as user}
							<tr>
								<td class="font-semibold">{user.username}</td>
								<td class="text-sm">{user.email}</td>
								<td>
									{#if user.role && user.role.length > 0}
										<div class="flex gap-1 flex-wrap">
											{#each user.role as role}
												<span class="badge badge-primary text-xs">{role}</span>
											{/each}
										</div>
									{:else}
										<span class="text-base-content/50 text-xs">User</span>
									{/if}
								</td>
								<td class="text-sm">
									{new Date(user.created).toLocaleDateString()}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				{#if allUsers.length === 0}
					<div class="p-8 text-center text-base-content/60">
						<p>{m['admin.no_users_found']()}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
