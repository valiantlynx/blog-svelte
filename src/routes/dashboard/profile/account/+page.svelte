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
					toast.success(m['messages.success_email_change_requested']());
					break;
				case 'error':
					toast.error(m['messages.error_email_update_failed']());
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
					toast.success(m['messages.success_username_updated']());
					break;
				case 'error':
					toast.error(m['messages.error_username_update_failed']());
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
					toast.success(m['messages.success_password_updated']());
					await invalidateAll();
					break;
				case 'error':
					toast.error(m['messages.error_password_update_failed']());
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>{m['profile.account.page_title']()}</title>
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
				{m['profile.account.page_heading']()}
			</h1>
			<p class="text-base-content/60 text-lg">
				{m['profile.account.page_description']()}
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
							{m['profile.account.email_section_heading']()}
						</h2>
						<i class="fas fa-lock text-primary/50 text-xl"></i>
					</div>

					<div class="space-y-4">
						<div class="bg-base-200 rounded-lg p-4 border border-base-300">
							<p class="text-sm text-base-content/60 mb-1">
								{m['profile.account.current_username_label']()}
							</p>
							<p class="text-lg font-semibold text-base-content flex items-center gap-2">
								<i class="fas fa-check-circle text-success"></i>
								@{$page.data?.user?.username}
							</p>
						</div>

						<Modal label="change-email" bind:open={emailModalOpen}>
							{#snippet trigger()}
								<Button variant="primary" class="w-full font-semibold">
									<i class="fas fa-edit mr-2"></i>
									{m['profile.account.change_email_button']()}
								</Button>
							{/snippet}
							{#snippet heading()}
								<div>
									<h3 class="text-2xl font-bold">
										{m['profile.account.change_email_modal_heading']()}
									</h3>
									<p class="text-sm text-base-content/60 mt-1">
										{m['profile.account.change_email_modal_description']()}
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
									label={m['profile.account.new_email_placeholder']()}
									placeholder={m['profile.account.new_email_placeholder']()}
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
										{m['profile.account.email_updating_button']()}
									{:else}
										<i class="fas fa-check mr-2"></i>
										{m['profile.account.email_update_button']()}
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
							{m['profile.account.username_section_heading']()}
						</h2>
					</div>

					<div class="space-y-4">
						<div class="bg-base-200 rounded-lg p-4 border border-base-300">
							<p class="text-sm text-base-content/60 mb-1">
								{m['profile.account.current_email_label']()}
							</p>
							<p
								class="text-lg font-semibold text-base-content flex items-center gap-2 line-clamp-1"
							>
								<i class="fas fa-check-circle text-success"></i>
								{$page.data?.user?.email}
							</p>
						</div>

						<Modal label="change-username" bind:open={usernameModalOpen}>
							{#snippet trigger()}
								<Button variant="primary" class="w-full font-semibold">
									<i class="fas fa-edit mr-2"></i>
									{m['profile.account.change_username_button']()}
								</Button>
							{/snippet}
							{#snippet heading()}
								<div>
									<h3 class="text-2xl font-bold">
										{m['profile.account.change_username_modal_heading']()}
									</h3>
									<p class="text-sm text-base-content/60 mt-1">
										{m['profile.account.change_username_modal_description']()}
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
									label={m['profile.account.new_username_label']()}
									placeholder={m['profile.account.new_username_placeholder']()}
									required={true}
									value={$page.form?.data?.username || ''}
									disabled={loading}
								/>
								<p class="text-xs text-base-content/50">
									<i class="fas fa-info-circle mr-1"></i>
									{m['profile.account.username_info_text']()}
								</p>
								<Button
									type="submit"
									variant="primary"
									class="w-full font-semibold"
									disabled={loading}
								>
									{#if loading}
										<i class="fas fa-spinner animate-spin mr-2"></i>
										{m['profile.account.username_updating_button']()}
									{:else}
										<i class="fas fa-check mr-2"></i>
										{m['profile.account.username_update_button']()}
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
							{m['profile.account.password_section_heading']()}
						</h2>
						<i class="fas fa-shield-alt text-warning text-xl"></i>
					</div>

					<div class="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
						<p class="text-sm text-warning flex items-center gap-2">
							<i class="fas fa-exclamation-triangle"></i>
							{m['profile.account.password_security_warning']()}
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
							label={m['profile.account.current_password_label']()}
							type="password"
							placeholder={m['profile.account.current_password_placeholder']()}
							required
							disabled={loading}
						/>

						<Input
							id="password"
							label={m['profile.account.new_password_label']()}
							type="password"
							placeholder={m['profile.account.new_password_placeholder']()}
							required
							disabled={loading}
						/>

						<Input
							id="passwordConfirm"
							label={m['profile.account.confirm_password_label']()}
							type="password"
							placeholder={m['profile.account.confirm_password_placeholder']()}
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
									{m['profile.account.password_updating_button']()}
								{:else}
									<i class="fas fa-save mr-2"></i>
									{m['profile.account.password_update_button']()}
								{/if}
							</Button>

							<a
								href="/forgot-password"
								class="block text-center text-primary hover:text-primary-focus hover:underline text-sm font-semibold"
							>
								<i class="fas fa-question-circle mr-1"></i>
								{m['profile.account.forgot_password_link']()}
							</a>
						</div>
					</form>
				</div>
			</div>

			<!-- Sidebar: Roles and Upgrade -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Current Roles -->
				<div class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
					<h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
						<i class="fas fa-shield-alt text-primary text-2xl"></i>
						{m['profile.account.your_roles_heading']()}
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
								{m['profile.account.want_more_features_text']()}
							</p>
							<p class="text-xs text-base-content/60 mb-4">
								{m['profile.account.upgrade_features_text']()}
							</p>
							<Button
								href="/pricing"
								variant="primary"
								class="w-full font-semibold text-sm"
								size="sm"
							>
								<i class="fas fa-rocket mr-2"></i>
								{m['profile.account.view_plans_button']()}
							</Button>
						</div>
					</div>
				</div>

				<!-- Session Info -->
				<div class="bg-base-100 rounded-2xl shadow-lg p-8">
					<h2 class="text-lg font-bold mb-4 flex items-center gap-2">
						<i class="fas fa-info-circle text-primary"></i>
						{m['profile.account.account_info_heading']()}
					</h2>

					<div class="space-y-3 text-sm">
						<div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
							<span class="text-base-content/60">{m['profile.account.account_type_label']()}</span>
							<span class="font-semibold capitalize">{$page.data?.user?.role?.[0] || 'User'}</span>
						</div>

						<div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
							<span class="text-base-content/60">{m['profile.account.email_verified_label']()}</span
							>
							<span class="flex items-center gap-2">
								<i class="fas fa-check-circle text-success"></i>
								<span class="font-semibold">{m['profile.account.email_verified_yes']()}</span>
							</span>
						</div>

						<div class="text-xs text-base-content/50 pt-2 text-center">
							{m['profile.account.support_contact_text']()}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
