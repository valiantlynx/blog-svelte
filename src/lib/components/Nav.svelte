<script>
	import Search from './Search.svelte';
	import ProfileModal from './ProfileModal.svelte';
	import { page } from '$app/stores';
	import { ThemeChanger } from '@valiantlynx/svelte-ui';
</script>

<!-- Small Devices Layout -->
<div>
	<div class="navbar bg-base-300 max-w-full sm:hidden">
		<div class="flex-1">
			<a class="btn btn-ghost normal-case text-xl" href="/">{$page.data.siteName}</a>
			<ThemeChanger />
		</div>
		<ProfileModal />
	</div>
	<!-- Show search bar only on pages other than search -->
	{#if $page.url.pathname !== '/search'}
		<div class="navbar bg-base-300 flex flex-col sm:hidden">
			<div class="flex-none sm:flex sm:gap-2">
				<Search type="small" />
			</div>
		</div>
	{/if}
</div>

<!-- Large Devices Layout -->
<div class="navbar bg-base-300 hidden sm:flex" id="title-bar">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl" href="/">{$page.data.siteName}</a>
		<ThemeChanger />
	</div>
	<div class="flex-none gap-2">
		<!-- Show search bar only on pages other than search -->
		{#if $page.url.pathname !== '/search'}
			<Search type="small" />
		{/if}
		<ProfileModal />
	</div>
</div>

<style>
	#title-bar {
		-webkit-app-region: drag;
	}
</style>
