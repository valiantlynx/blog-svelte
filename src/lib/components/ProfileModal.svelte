<script>
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Dropdown } from '$lib/components/ui/dropdown';
	import { page } from '$app/state';
	import { site } from '$lib/utils/config';
	import * as m from '$lib/paraglide/messages.js';
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';

	const avatar = $derived(
		page.data.user?.avatar
			? `${site.pocketbase}/api/files/${page.data.user?.collectionId}/${page.data.user?.id}/${page.data.user?.avatar}`
			: `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${page.data.user?.username}`
	);

	let dropdownOpen = $state(false);

	let loading = false;

	const submitOauth = () => {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Successfully registered');
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

<!-- profile-->
{#if !page.data.user}
	<form method="POST" action="/login?/oauth2samletnorge" use:enhance={submitOauth}>
		<Button type="submit"  variant="primary"><img src="https://avatars.githubusercontent.com/u/177398145?s=200&v=4" alt={`samletnorge sign in`} class="w-6 h-6 m-2" /> {m['navigation.login']()}</Button>
		<Button type="submit"  variant="secondary"><img src="https://avatars.githubusercontent.com/u/177398145?s=200&v=4" alt={`samletnorge sign up`} class="w-6 h-6 m-2" /> {m['navigation.signup']()}</Button>
	</form>

{:else}
	<Dropdown align="right" bind:open={dropdownOpen}>
		<svelte:fragment slot="trigger">
			<button class="avatar cursor-pointer">
				<div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
					<img
						class="rounded-full h-10 w-10 object-cover"
						src={avatar}
						alt={`${page.data.user.username} profile picture on ${site.title}, ${
							site.protocol + site.domain
						}`}
					/>
				</div>
			</button>
		</svelte:fragment>

		<div class="py-2 bg-base-200 text-base-content transition-colors">
			<a
				href="/dashboard/profile/preview"
				class="block px-4 py-2 hover:bg-[var(--primary)] hover:text-[var(--primary-content)]"
				onclick={() => (dropdownOpen = false)}
			>
				<div class="flex items-center justify-between gap-2">
					<span>{m['navigation.profile']()}</span>
					<Badge>{m['labels.new']()}</Badge>
				</div>
			</a>
			<a
				href="/"
				class="block px-4 py-2 hover:bg-[var(--primary)] hover:text-[var(--primary-content)]"
				onclick={() => (dropdownOpen = false)}
			>
				{m['header.home']()}
			</a>
			<a
				href="/pricing"
				class="block px-4 py-2 hover:bg-[var(--primary)] hover:text-[var(--primary-content)]"
				onclick={() => (dropdownOpen = false)}
			>
				<div class="flex items-center justify-between gap-2">
					<span>{m['header.pricing']()}</span>
				</div>
			</a>
			<a
				href="/dashboard"
				class="block px-4 py-2 hover:bg-[var(--primary)] hover:text-[var(--primary-content)]"
				onclick={() => (dropdownOpen = false)}
			>
				<div class="flex items-center justify-between gap-2">
					<span>{m['navigation.dashboard']()}</span>
					<Badge>{m['labels.new']()}</Badge>
				</div>
			</a>
			<hr class="my-2 border-[var(--border)]" />
			<form action="/api/logout" method="POST" class="px-2 py-1">
				<button
					type="submit"
					class="w-full px-4 py-2 text-start bg-[var(--primary)] text-[var(--primary-content)] hover:opacity-90 rounded transition-all flex items-center justify-between"
					onclick={() => (dropdownOpen = false)}
				>
					<span class="font-bold">{m['navigation.logout']()}</span>
					<i class="fa fa-sign-out-alt"></i>
				</button>
			</form>
		</div>
	</Dropdown>
{/if}
