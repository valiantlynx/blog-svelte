<script>
	import * as m from '$lib/paraglide/messages.js';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { FormControl } from '$lib/components/ui/form-control';
	import Oauth2 from '$lib/components/oauth/Oauth2.svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	let loading = $state(false);

	const submitLogin = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					await update();
					break;
				case 'invalid':
					toast.error(m['messages.error_invalid_credentials']());
					await update();
					break;
				case 'error':
					toast.error(result.error.message);
					break;
				default:
					await update();
			}
			loading = false;
		};
	};
</script>

<div class="relative flex flex-col items-center justify-center h-auto overflow-hidden mt-10 mx-6 text-base-content">
	<div class="w-full p-6 border-t-4 rounded-md shadow-md border-primary lg:max-w-lg">
		<h1 class="text-3xl font-semibold text-center">
			{page.data.siteName} | {m['navigation.login']()}
		</h1>
		<Oauth2 />
	</div>
</div>
