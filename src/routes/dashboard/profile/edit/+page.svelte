<script>
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { site } from '$lib/utils/config';
	import toast from 'svelte-french-toast';
	import * as m from '$lib/paraglide/messages.js';

	let loading = $state(false);

	const showPreview = (event) => {
		const target = event.target;
		const files = target.files;

		if (files.length > 0) {
			const src = URL.createObjectURL(files[0]);
			const preview = document.getElementById('avatar-preview');
			preview.src = src;
		}
	};

	const submitUpdateProfile = () => {
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					toast.success('Profile updated successfully!');
					break;
				case 'error':
					toast.error('Failed to update profile');
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	const avatar = $page.data.user?.avatar
		? `${site.pocketbase}/api/files/${$page.data.user?.collectionId}/${$page.data.user?.id}/${$page.data.user?.avatar}`
		: `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${$page.data.user?.username}`;
</script>

<svelte:head>
	<title>Edit Profile</title>
</svelte:head>

<div
	class="w-full min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4 md:p-8"
>
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1
				class="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text "
			>
				Edit Your Profile
			</h1>
			<p class="text-base-content/60 text-lg">
				Update your personal information and profile details
			</p>
		</div>

		<!-- Main Form Container -->
		<form
			action="?/updateProfile"
			method="POST"
			class="space-y-8"
			enctype="multipart/form-data"
			use:enhance={submitUpdateProfile}
		>
			<!-- Avatar Section -->
			<div class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
				<h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
					<i class="fas fa-image text-primary text-2xl"></i>
					Profile Picture
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<!-- Avatar Display -->
					<div class="flex flex-col items-center justify-center space-y-4">
						<div
							class="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl shadow-xl overflow-hidden border-4 border-primary/20 hover:border-primary/50 transition-all bg-base-200"
						>
							<img
								src={avatar}
								alt="Profile Preview"
								id="avatar-preview"
								class="w-full h-full object-cover"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4"
							>
								<span class="text-white text-sm font-semibold">Click to change</span>
							</div>
						</div>
						<p class="text-center text-sm text-base-content/60">Current profile picture</p>
					</div>

					<!-- Upload Area -->
					<div class="flex flex-col justify-center">
						<label
							for="avatar"
							class="block border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
						>
							<div class="space-y-3">
								<div class="text-4xl text-primary">
									<i class="fas fa-cloud-upload-alt"></i>
								</div>
								<div>
									<p class="text-lg font-semibold text-base-content">Click or drag image</p>
									<p class="text-sm text-base-content/60">PNG, JPG, GIF up to 10MB</p>
								</div>
							</div>
							<input
								type="file"
								name="avatar"
								id="avatar"
								value=""
								accept="image/*"
								hidden
								onchange={showPreview}
								disabled={loading}
							/>
						</label>
					</div>
				</div>
			</div>

			<!-- Personal Information Section -->
			<div class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
				<h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
					<i class="fas fa-user text-primary text-2xl"></i>
					Personal Information
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="block text-sm font-semibold text-base-content mb-2">
							<i class="fas fa-at text-primary/60 mr-2"></i>
							Username
						</label>
						<div class="input input-bordered input-primary w-full bg-base-200 px-4 py-3 rounded-lg">
							{$page.data?.user?.username}
						</div>
						<p class="text-xs text-base-content/50 mt-2">Username is managed in account settings</p>
					</div>

					<div>
						<label for="title" class="block text-sm font-semibold text-base-content mb-2">
							<i class="fas fa-briefcase text-primary/60 mr-2"></i>
							Professional Title
						</label>
						<Input
							id="title"
							name="title"
							placeholder="e.g., Full Stack Developer"
							value={$page.data?.user?.title || ''}
							disabled={loading}
							class="input-primary"
						/>
					</div>

					<div>
						<label for="language" class="block text-sm font-semibold text-base-content mb-2">
							<i class="fas fa-globe text-primary/60 mr-2"></i>
							Language
						</label>
						<Input
							id="language"
							name="language"
							placeholder="e.g., English, Spanish"
							value={$page.data?.user?.language || ''}
							disabled={loading}
							class="input-primary"
						/>
					</div>

					<div>
						<label for="address" class="block text-sm font-semibold text-base-content mb-2">
							<i class="fas fa-map-marker-alt text-primary/60 mr-2"></i>
							Location
						</label>
						<Input
							type="text"
							id="address"
							name="address"
							placeholder="e.g., San Francisco, CA"
							value={$page.data?.user?.address || ''}
							disabled={loading}
							class="input-primary"
						/>
					</div>
				</div>
			</div>

			<!-- Bio Section -->
			<div class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
				<h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
					<i class="fas fa-pencil-alt text-primary text-2xl"></i>
					About Yourself
				</h2>

				<div>
					<label for="about" class="block text-sm font-semibold text-base-content mb-3">
						Bio
					</label>
					<textarea
						class="textarea textarea-primary w-full h-32 resize-none focus:outline-none rounded-xl"
						name="about"
						id="about"
						placeholder="Tell us a bit about yourself..."
						value={$page.data?.user?.about || ''}
						disabled={loading}
					></textarea>
					<p class="text-xs text-base-content/50 mt-2">
						Write a brief bio that will appear on your profile. Maximum 500 characters.
					</p>
				</div>
			</div>

			<!-- Roles and Permissions Section -->
			<div class="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
				<h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
					<i class="fas fa-shield-alt text-primary text-2xl"></i>
					Roles & Permissions
				</h2>

				{#if $page.data?.user?.role && $page.data.user.role.length > 0}
					<div class="flex flex-wrap gap-3">
						{#each $page.data.user.role as role}
							<Badge variant="primary" size="lg">
								<i class="fas fa-check-circle mr-2"></i>
								{role}
							</Badge>
						{/each}
					</div>
					<p class="text-sm text-base-content/60 mt-4">
						<i class="fas fa-info-circle mr-2"></i>
						Want to upgrade your permissions?
						<a href="/pricing" class="text-primary hover:underline font-semibold"
							>Check our pricing plans</a
						>
					</p>
				{:else}
					<p class="text-base-content/60">No roles assigned yet.</p>
				{/if}
			</div>

			<!-- Action Buttons -->
			<div
				class="flex flex-col md:flex-row gap-4 justify-between items-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20"
			>
				<div>
					<p class="text-lg font-semibold text-base-content mb-1">Save your changes</p>
					<p class="text-sm text-base-content/60">Your profile will be updated immediately</p>
				</div>
				<div class="flex gap-4 w-full md:w-auto">
					<Button
						type="button"
						variant="outline"
						class="flex-1 md:flex-none"
						href="/dashboard/profile/preview"
					>
						<i class="fas fa-times mr-2"></i>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						class="flex-1 md:flex-none font-semibold"
						disabled={loading}
					>
						{#if loading}
							<i class="fas fa-spinner animate-spin mr-2"></i>
							Saving...
						{:else}
							<i class="fas fa-save mr-2"></i>
							Save Changes
						{/if}
					</Button>
				</div>
			</div>
		</form>
	</div>
</div>
