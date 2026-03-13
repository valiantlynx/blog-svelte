<script lang="ts">
	import SideBar from '$lib/components/SideBar.svelte';
	import SideBarIcon from '$lib/components/SideBarIcon.svelte';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex text-base-content min-h-screen">
	<SideBar />
	<main class="flex-1 min-w-0 pb-16 md:pb-0">
		{@render children?.()}
	</main>
</div>

<!-- Mobile Bottom Navigation -->
<nav
	class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-base-200 border-t border-base-300 flex items-center justify-around py-1 shadow-lg"
>
	<a href="/" aria-label={m['tooltips.home']()}>
		<SideBarIcon tooltip={m['tooltips.home']()} icon="bx:bx-home" />
	</a>
	<a href="/dashboard/profile" aria-label={m['tooltips.profile']()}>
		<SideBarIcon tooltip={m['tooltips.profile']()} icon="iconoir:profile-circle" />
	</a>
	<a href="/dashboard/manager" aria-label={m['tooltips.manage']()}>
		<SideBarIcon tooltip={m['tooltips.manage']()} icon="material-symbols:bookmark-manager" />
	</a>
	{#if page.data.user?.role?.includes('admin')}
		<a href="/dashboard/admin" aria-label={m['tooltips.admin']()}>
			<SideBarIcon tooltip={m['tooltips.admin']()} icon="bx:bx-shield" />
		</a>
	{/if}
	<form action="/api/logout" method="POST">
		<button type="submit" aria-label={m['tooltips.logout']()}>
			<SideBarIcon tooltip={m['tooltips.logout']()} icon="bx:bx-log-out" />
		</button>
	</form>
</nav>
