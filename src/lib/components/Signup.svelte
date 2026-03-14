<script>
	import * as m from '$lib/paraglide/messages.js';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import Input from './Input.svelte';
	import Oauth2 from '$lib/components/oauth/Oauth2.svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	let loading = $state(false);

	const submitSignup = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(m['messages.success_registered']());
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

<div class="relative flex flex-col items-center justify-center h-full overflow-hidden m-4 text-base-content">
	<div
		class="w-full p-6 bg-base-200 border-t-4 border-primary rounded-md shadow-md border-top lg:max-w-lg"
	>
		<h1 class="text-3xl font-semibold text-center">
			{page.data.siteName} | {m['navigation.signup']()}
		</h1>
		<Oauth2 />
	</div>
</div>
