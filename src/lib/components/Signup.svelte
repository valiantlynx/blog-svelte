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

<div class="relative flex flex-col items-center justify-center h-full overflow-hidden m-4">
	<div
		class="w-full p-6 bg-base-200 border-t-4 border-primary rounded-md shadow-md border-top lg:max-w-lg"
	>
		<h1 class="text-3xl font-semibold text-center">
			{page.data.siteName} | {m['navigation.signup']()}
		</h1>
		<form
			action="?/signup"
			method="POST"
			class="flex flex-col items-center space-y-2 w-full pt-4"
			use:enhance={submitSignup}
		>
			<Input
				id="name"
				label={m['forms.name']()}
				value={page.form?.data?.name}
				errors={page.form?.errors?.name}
				disabled={loading}
			/>
			<Input
				type="email"
				id="email"
				label={m['forms.email']()}
				value={page.form?.data?.email}
				errors={page.form?.errors?.email}
				disabled={loading}
			/>
			<Input
				type="password"
				id="password"
				label={m['forms.password']()}
				errors={page.form?.errors?.password}
				disabled={loading}
			/>
			<Input
				type="password"
				id="passwordConfirm"
				label={m['forms.password_confirm']()}
				errors={page.form?.errors?.passwordConfirm}
				disabled={loading}
			/>
			<br />
			<a href="/login" class=" link link-hover font-bold text-1xl underline"
				>{m['forms.already_have_account']()} {m['buttons.login']()} ({m['forms.click_here']()})</a
			>
			<div class="w-full max-w-lg pt-2">
				<Button type="submit" variant="primary" class="w-full" disabled={loading}
					>{m['buttons.register']()}</Button
				>
			</div>
		</form>
		<center class="text-center my-4"> or </center>
		<Oauth2 />
	</div>
</div>
