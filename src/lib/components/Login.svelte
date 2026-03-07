<script>
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
					toast.error('Invalid credentials');
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

<div class="relative flex flex-col items-center justify-center h-auto overflow-hidden mt-10 mx-6">
	<div class="w-full p-6 border-t-4 rounded-md shadow-md border-primary lg:max-w-lg">
		<h1 class="text-3xl font-semibold text-center">{page.data.siteName} | login</h1>
		<form
			action="/login?/login"
			method="POST"
			class="flex flex-col items-center space-y-4 w-full pt-4"
			use:enhance={submitLogin}
		>
			<FormControl label="Email" required>
				<Input
					type="email"
					id="email"
					placeholder="Enter your email"
					value={page.form?.data?.email ?? ''}
					error={!!page.form?.errors?.email}
					disabled={loading}
				/>
				{#if page.form?.errors?.email}
					<p class="text-xs text-[var(--error)]">{page.form.errors.email}</p>
				{/if}
			</FormControl>

			<FormControl label="Password" required>
				<Input
					type="password"
					id="password"
					minlength="8"
					placeholder="Enter your password"
					error={!!page.form?.errors?.password}
					disabled={loading}
				/>
				{#if page.form?.errors?.password}
					<p class="text-xs text-[var(--error)]">{page.form.errors.password}</p>
				{/if}
			</FormControl>

			<div class="flex flex-row justify-between w-full">
				<a href="/signup" class="text-sm text-[var(--primary)] hover:underline"
					>Not registered? Signup</a
				>
				<a href="/forgot-password" class="text-sm text-[var(--primary)] hover:underline"
					>Forgot password</a
				>
			</div>

			<div class="w-full pt-2">
				<Button type="submit" variant="primary" class="w-full" {loading}>Login</Button>
			</div>
		</form>
		<p class="text-center text-[var(--muted-foreground)] my-4">or</p>
		<Oauth2 />
	</div>
</div>
