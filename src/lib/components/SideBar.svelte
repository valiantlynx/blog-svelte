<script>
	import * as m from '$lib/paraglide/messages.js';
	import SideBarIcon from '$lib/components/SideBarIcon.svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
</script>

<!-- Desktop Sidebar (hidden on mobile) -->
<div
	class="relative top-0 left-0 w-16 h-screen bg-base-200 m-0 hidden md:flex flex-col text-base-content shadow"
>
	<a href="/"><SideBarIcon tooltip={m['tooltips.home']()} icon="bx:bx-home" /></a>
	<a href="/dashboard/profile">
		<SideBarIcon tooltip={m['tooltips.profile']()} icon="iconoir:profile-circle" /></a
	>
	<a href="/dashboard/manager"
		><SideBarIcon tooltip={m['tooltips.manage']()} icon="material-symbols:bookmark-manager" /></a
	>

	{#if page.data.user?.role.includes('admin')}
		<a href="/dashboard/admin"
			><SideBarIcon tooltip={m['tooltips.admin']()} icon="bx:bx-shield" /></a
		>
	{/if}

	<form action="/api/logout" method="POST" class="absolute bottom-1/4 w-full">
		<button type="submit" class="w-full">
			<SideBarIcon tooltip={m['tooltips.logout']()} icon="bx:bx-log-out" />
		</button>
	</form>
</div>

<!-- Mobile Bottom Navigation (visible only on mobile) -->
<nav
	class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-base-200 border-t border-base-300 shadow-lg"
>
	<div class="flex items-center justify-around px-2 py-1">
		<a
			href="/"
			class="flex flex-col items-center gap-0.5 text-base-content hover:text-primary transition-colors p-2 min-w-0"
		>
			<Icon icon="bx:bx-home" width="22" height="22" />
			<span class="text-xs truncate">{m['tooltips.home']()}</span>
		</a>
		<a
			href="/dashboard/profile"
			class="flex flex-col items-center gap-0.5 text-base-content hover:text-primary transition-colors p-2 min-w-0"
		>
			<Icon icon="iconoir:profile-circle" width="22" height="22" />
			<span class="text-xs truncate">{m['tooltips.profile']()}</span>
		</a>
		<a
			href="/dashboard/manager"
			class="flex flex-col items-center gap-0.5 text-base-content hover:text-primary transition-colors p-2 min-w-0"
		>
			<Icon icon="material-symbols:bookmark-manager" width="22" height="22" />
			<span class="text-xs truncate">{m['tooltips.manage']()}</span>
		</a>
		{#if page.data.user?.role.includes('admin')}
			<a
				href="/dashboard/admin"
				class="flex flex-col items-center gap-0.5 text-base-content hover:text-primary transition-colors p-2 min-w-0"
			>
				<Icon icon="bx:bx-shield" width="22" height="22" />
				<span class="text-xs truncate">{m['tooltips.admin']()}</span>
			</a>
		{/if}
		<form action="/api/logout" method="POST">
			<button
				type="submit"
				class="flex flex-col items-center gap-0.5 text-base-content hover:text-primary transition-colors p-2 min-w-0"
			>
				<Icon icon="bx:bx-log-out" width="22" height="22" />
				<span class="text-xs truncate">{m['tooltips.logout']()}</span>
			</button>
		</form>
	</div>
</nav>
