<script>
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/Input.svelte';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';

	let emailModalOpen = $state(false);
	let usernameModalOpen = $state(false);
	let passwordModalOpen = $state(false);
	let loading = $state(false);

	const submitUpdateEmail = () => {
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					emailModalOpen = false;
					toast.success('Email change requested! Check your email for confirmation.');
					break;
				case 'error':
					toast.error('Failed to update email');
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	const submitUpdateUsername = () => {
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					usernameModalOpen = false;
					toast.success('Username updated successfully!');
					break;
				case 'error':
					toast.error('Failed to update username');
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	const submitUpdatePassword = () => {
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					toast.success('Password updated! Redirecting to login...');
					await invalidateAll();
					break;
				case 'error':
					toast.error('Failed to update password');
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Account Settings</title>
</svelte:head>

<div
	class="w-full min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4 md:p-8"
>
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1
				class="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
			>
				Account Settings
			</h1>
			<p class="text-base-content/60 text-lg">
				Manage your account security and authentication settings
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Main Settings Column -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Email Section -->
				<div class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-2xl md:text-3xl font-bold flex items-center gap-3">
							<i class="fas fa-envelope text-primary text-2xl"></i>
							Email Address
						</h2>
						<i class="fas fa-lock text-primary/50 text-xl"></i>
					</div>

					<div class="space-y-4">
						<div class="bg-base-200 rounded-lg p-4 border border-base-300">
							<p class="text-sm text-base-content/60 mb-1">Current Email</p>
							<p class="text-lg font-semibold text-base-content flex items-center gap-2">
								<i class="fas fa-check-circle text-success"></i>
								{$page.data?.user?.email}
							</p>
						</div>

						<Modal label="change-email" bind:open={emailModalOpen}>
							{#snippet trigger()}
								<Button variant="primary" class="w-full font-semibold">
									<i class="fas fa-edit mr-2"></i>
									Change Email
								</Button>
							{/snippet}
							{#snippet heading()}
								<div>
									<h3 class="text-2xl font-bold">Change Your Email</h3>
									<p class="text-sm text-base-content/60 mt-1">
										A confirmation email will be sent to verify the change
									</p>
								</div>
							{/snippet}
							<form
								action="?/updateEmail"
								method="POST"
								class="space-y-4"
								use:enhance={submitUpdateEmail}
							>
								<Input
									id="email"
									type="email"
									label="New Email Address"
									placeholder="your-new-email@example.com"
									required={true}
									value={$page.form?.data?.email || ''}
									disabled={loading}
								/>
								<Button
									type="submit"
									variant="primary"
									class="w-full font-semibold"
									disabled={loading}
								>
									{#if loading}
										<i class="fas fa-spinner animate-spin mr-2"></i>
										Updating...
									{:else}
										<i class="fas fa-check mr-2"></i>
										Change Email
									{/if}
								</Button>
							</form>
						</Modal>
					</div>
				</div>

				<!-- Username Section -->
				<div class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-2xl md:text-3xl font-bold flex items-center gap-3">
							<i class="fas fa-at text-primary text-2xl"></i>
							Username
						</h2>
					</div>

					<div class="space-y-4">
						<div class="bg-base-200 rounded-lg p-4 border border-base-300">
							<p class="text-sm text-base-content/60 mb-1">Current Username</p>
							<p class="text-lg font-semibold text-base-content flex items-center gap-2">
								<i class="fas fa-check-circle text-success"></i>
								@{$page.data?.user?.username}
							</p>
						</div>

						<Modal label="change-username" bind:open={usernameModalOpen}>
							{#snippet trigger()}
								<Button variant="primary" class="w-full font-semibold">
									<i class="fas fa-edit mr-2"></i>
									Change Username
								</Button>
							{/snippet}
							{#snippet heading()}
								<div>
									<h3 class="text-2xl font-bold">Change Your Username</h3>
									<p class="text-sm text-base-content/60 mt-1">
										Choose a unique username for your profile
									</p>
								</div>
							{/snippet}
							<form
								action="?/updateUsername"
								method="POST"
								class="space-y-4"
								use:enhance={submitUpdateUsername}
							>
								<Input
									id="username"
									type="text"
									label="New Username"
									placeholder="mynewusername"
									required={true}
									value={$page.form?.data?.username || ''}
									disabled={loading}
								/>
								<p class="text-xs text-base-content/50">
									<i class="fas fa-info-circle mr-1"></i>
									Usernames can contain letters, numbers, and underscores
								</p>
								<Button
									type="submit"
									variant="primary"
									class="w-full font-semibold"
									disabled={loading}
								>
									{#if loading}
										<i class="fas fa-spinner animate-spin mr-2"></i>
										Updating...
									{:else}
										<i class="fas fa-check mr-2"></i>
										Change Username
									{/if}
								</Button>
							</form>
						</Modal>
					</div>
				</div>

				<!-- Password Section -->
				<div
					class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-l-warning"
				>
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-2xl md:text-3xl font-bold flex items-center gap-3">
							<i class="fas fa-key text-primary text-2xl"></i>
							Password
						</h2>
						<i class="fas fa-shield-alt text-warning text-xl"></i>
					</div>

					<div class="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
						<p class="text-sm text-warning flex items-center gap-2">
							<i class="fas fa-exclamation-triangle"></i>
							For security, you'll be logged out after updating your password.
						</p>
					</div>

					<form
						action="?/updatePassword"
						method="POST"
						class="space-y-4"
						use:enhance={submitUpdatePassword}
					>
						<Input
							id="oldPassword"
							label="Current Password"
							type="password"
							placeholder="Enter your current password"
							required
							disabled={loading}
						/>

						<Input
							id="password"
							label="New Password"
							type="password"
							placeholder="Enter your new password"
							required
							disabled={loading}
						/>

						<Input
							id="passwordConfirm"
							label="Confirm New Password"
							type="password"
							placeholder="Confirm your new password"
							required
							disabled={loading}
						/>

						<div class="space-y-3 pt-2">
							<Button
								type="submit"
								variant="primary"
								class="w-full font-semibold"
								disabled={loading}
							>
								{#if loading}
									<i class="fas fa-spinner animate-spin mr-2"></i>
									Updating...
								{:else}
									<i class="fas fa-save mr-2"></i>
									Update Password
								{/if}
							</Button>

							<a
								href="/forgot-password"
								class="block text-center text-primary hover:text-primary-focus hover:underline text-sm font-semibold"
							>
								<i class="fas fa-question-circle mr-1"></i>
								Forgot your password?
							</a>
						</div>
					</form>
				</div>
			</div>

			<!-- Sidebar: Roles and Upgrade -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Current Roles -->
				<div
					class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow sticky top-8"
				>
					<h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
						<i class="fas fa-shield-alt text-primary text-2xl"></i>
						Your Roles
					</h2>

					{#if $page.data?.user?.role && $page.data.user.role.length > 0}
						<div class="space-y-3 mb-6">
							{#each $page.data.user.role as role}
								<div
									class="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20"
								>
									<i class="fas fa-check-circle text-primary"></i>
									<span class="font-semibold text-base-content">{role}</span>
								</div>
							{/each}
						</div>
					{/if}

					<div class="divider my-4"></div>

					<!-- Upgrade CTA -->
					<div class="space-y-4">
						<div
							class="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 border border-primary/20"
						>
							<p class="text-sm font-semibold text-base-content mb-2">
								<i class="fas fa-star text-warning mr-2"></i>
								Want more features?
							</p>
							<p class="text-xs text-base-content/60 mb-4">
								Upgrade to unlock premium features and advanced permissions.
							</p>
							<Button
								href="/pricing"
								variant="primary"
								class="w-full font-semibold text-sm"
								size="sm"
							>
								<i class="fas fa-rocket mr-2"></i>
								View Plans
							</Button>
						</div>
					</div>
				</div>

				<!-- Session Info -->
				<div class="bg-base-100 rounded-2xl shadow-lg p-8">
					<h2 class="text-lg font-bold mb-4 flex items-center gap-2">
						<i class="fas fa-info-circle text-primary"></i>
						Account Info
					</h2>

					<div class="space-y-3 text-sm">
						<div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
							<span class="text-base-content/60">Account Type</span>
							<span class="font-semibold capitalize">{$page.data?.user?.role?.[0] || 'User'}</span>
						</div>

						<div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
							<span class="text-base-content/60">Email Verified</span>
							<span class="flex items-center gap-2">
								<i class="fas fa-check-circle text-success"></i>
								<span class="font-semibold">Yes</span>
							</span>
						</div>

						<div class="text-xs text-base-content/50 pt-2 text-center">
							For additional security options, please contact support.
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
