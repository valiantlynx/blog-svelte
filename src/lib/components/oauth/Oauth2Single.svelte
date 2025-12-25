<script lang="ts">
	import { pb } from '$lib/utils/api';
	import { page } from '$app/stores';
	let { provider, logo, active } = $props();

	async function oauth() {
		await pb.collection('users').authWithOAuth2({ provider: provider });
		// send to dashboard
		window.location.href = '/dashboard';
	}
</script>

<button onclick={oauth} class="w-full block hover:cursor-not-allowed" disabled={active}>
	<div>
		<div class="btn btn-block btn-primary" type="submit" disabled={active}>
			<img src={logo} alt={`${provider} sign in`} class="w-10 h-10" />
			{#if $page.url.pathname == '/login'}
				Login with {provider}
			{:else if $page.url.pathname == '/signup'}
				Signup with {provider}
			{/if}
		</div>
	</div>
</button>
