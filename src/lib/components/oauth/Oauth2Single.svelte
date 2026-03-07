<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { pb } from '$lib/utils/api';
	import { page } from '$app/stores';
	let { provider, logo, active } = $props();

	async function oauth() {
		await pb.collection('users').authWithOAuth2({ provider: provider });
		// send to dashboard
		window.location.href = '/dashboard';
	}
</script>

<Button variant="primary" class="w-full" disabled={active} onclick={oauth}>
	<img src={logo} alt={`${provider} sign in`} class="w-10 h-10" />
	{#if $page.url.pathname == '/login'}
		Login with {provider}
	{:else if $page.url.pathname == '/signup'}
		Signup with {provider}
	{/if}
</Button>
