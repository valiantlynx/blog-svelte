<script>
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import Input from './Input.svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';
	let loading = $state(false);
	let email = $state('');

	const submitResetPassword = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(m['messages.error_email_sent']());
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

<div class="flex flex-col items-center h-full py-10 w-full">
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		{m['forms.password_reset_title']()}
	</h2>
	<p class="text-center mt-1">{m['forms.password_reset_description']()}</p>
	<form
		action="?/reset"
		method="POST"
		class="flex flex-col items-center space-y-2 w-full pt-4"
		use:enhance={submitResetPassword}
	>
		<Input
			type="email"
			id="email"
			label={m['forms.email']()}
			bind:value={email}
			disabled={loading}
			errors={page.form?.errors?.email}
		/>
		<div class="w-full max-w-md pt-2">
			<Button type="submit" variant="primary" class="w-full" disabled={loading}
				>{m['buttons.request_password_reset']()}</Button
			>
		</div>
	</form>
</div>
