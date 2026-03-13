<script>
	import * as m from '$lib/paraglide/messages.js';
	import SideBarIcon from '$lib/components/SideBarIcon.svelte';
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
