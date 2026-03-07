<script>
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/Input.svelte';
	import { page } from '$app/stores';

	let emailModalOpen = $state(false);
	let usernameModalOpen = $state(false);
	let loading = $state(false);

	const submitUpdateEmail = () => {
		loading = true;
		emailModalOpen = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					emailModalOpen = false;
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	const submitUpdateUsername = () => {
		loading = true;
		usernameModalOpen = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					usernameModalOpen = false;
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="flex flex-col sm:w-1/2 h-full space-y-12 ml-5">
	<div class="w-full">
		<h3 class="text-2xl font-medium">Change Email</h3>
		<div class="divider"></div>
		<Modal label="change-email" checked={emailModalOpen}>
			{#snippet trigger()}
				<Button variant="primary">Change Email</Button>
			{/snippet}
			{#snippet heading()}
				<h3>Change Your Email</h3>
			{/snippet}
			<form action="?/updateEmail" method="POST" class="space-y-2" use:enhance={submitUpdateEmail}>
				<Input
					id="email"
					type="email"
					label="Enter your new email address"
					required={true}
					value={$page.form?.data?.email}
					disabled={loading}
				/>
				<Button type="submit" variant="primary" class="w-full" disabled={loading}
					>Change my email</Button
				>
			</form>
		</Modal>
	</div>
	<div class="w-full">
		<h3 class="text-2xl font-medium">Change Username</h3>
		<div class="divider mb-0.5"></div>
		<Input id="username" label="Username" value={$page.data?.user?.username} disabled />
		<Modal label="change-username" checked={usernameModalOpen}>
			{#snippet trigger()}
				<Button variant="primary">Change Username</Button>
			{/snippet}
			{#snippet heading()}
				<h3>Change Your Username</h3>
			{/snippet}
			<form
				action="?/updateUsername"
				method="POST"
				class="space-y-2"
				use:enhance={submitUpdateUsername}
			>
				<Input
					id="username"
					type="text"
					label="Enter your new username"
					required={true}
					value={$page.form?.data?.username}
					disabled={loading}
				/>
				<Button type="submit" variant="primary" class="w-full" disabled={loading}
					>Change my username</Button
				>
			</form>
		</Modal>
	</div>
	<div class="w-full">
		<form action="?/updatePassword" method="POST" class="flex flex-col space-y-2 w-full">
			<h3 class="text-2xl font-medium">Change Password</h3>
			<div class="divider"></div>
			<Input id="oldPassword" label="Old Password" type="password" required />
			<Input id="password" label="New Password" type="password" required />
			<Input id="passwordConfirm" label="Confirm New Password" type="password" required />
			<a href="/forgot-password" class="text-primary hover:cursor-point hover:underline">
				I forgot my password</a
			>
			<div class="w-full max-w-lg pt-3">
				<Button type="submit" variant="primary" class="w-full max-w-lg">Update Password</Button>
			</div>
		</form>
	</div>
</div>
<div class="flex flex-col sm:w-1/2 h-full space-y-12 ml-5">
	<!-- Permissions Display -->
	<div class="w-full md:w-1/2">
		<div class="bg-base-300 text-base-content p-6 rounded-lg shadow-md">
			<h2 class="text-2xl font-medium mb-4">Roles and Permissions</h2>
			<ul class="list-inside list-disc">
				{#each $page.data?.user?.role as role}
					<Badge class="m-3 inline-flex" size="lg">
						{role}
					</Badge>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Upgrade Section -->
	<div class="w-full md:w-1/2">
		<div class="bg-base-300 text-base-content p-6 rounded-lg shadow-md">
			<h2 class="text-2xl font-medium mb-4">Upgrade Your Role</h2>
			<p class="mb-4">
				Enhance your experience by upgrading to a higher role. Unlock additional features and
				privileges.
			</p>
			<Button href="/pricing" variant="primary" class="w-full" alt="pricing page">
				Upgrade Now
			</Button>
		</div>
	</div>
</div>
