<script>
	import { Button } from '$lib/components/ui/button';
	import Search from './Search.svelte';
	import ProfileModal from './ProfileModal.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { page } from '$app/state';
	import ThemeChanger from './ThemeChanger.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let mobileMenuOpen = $state(false);

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<!-- Desktop Layout -->
<nav
	class="sticky top-0 z-40 hidden md:flex items-center justify-between bg-base-100 border-b border-base-300 px-8 py-4 gap-6 shadow-sm"
	id="title-bar"
>
	<!-- Brand Section -->
	<Button
		href="/"
		variant="ghost"
		class="font-bold text-2xl tracking-tight text-base-content hover:text-primary transition-colors duration-200 flex-shrink-0 -ml-3"
	>
		✨ {page.data.siteName}
	</Button>

	<!-- Center: Search Bar (Desktop Only) -->
	{#if page.url.pathname !== '/search'}
		<div class="flex-1 max-w-xl">
			<Search type="small" />
		</div>
	{/if}

	<!-- Right Section: Actions -->
	<div class="flex items-center gap-4 flex-shrink-0">
		<ThemeChanger />
		<LanguageSwitcher />
		<ProfileModal />
	</div>
</nav>

<!-- Mobile Header -->
<div class="sticky top-0 z-40 md:hidden bg-base-100 border-b border-base-300 shadow-sm">
	<div class="flex items-center justify-between px-4 py-3">
		<!-- Brand -->
		<Button
			href="/"
			variant="ghost"
			class="font-bold text-xl tracking-tight text-base-content hover:text-primary transition-colors duration-200 flex-shrink-0 -ml-2"
		>
			✨ {page.data.siteName}
		</Button>

		<!-- Right Section: Hamburger + Login -->
		<div class="flex items-center gap-2">
			<!-- Hamburger Menu Button -->
			<button
				onclick={toggleMenu}
				class="flex items-center justify-center w-10 h-10 rounded-lg text-base-content hover:bg-base-200 transition-colors"
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
				type="button"
			>
				{#if mobileMenuOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				{/if}
			</button>

			<!-- Login Button (Hidden when menu is open) -->
			{#if !mobileMenuOpen && page.data.user}
				<ProfileModal />
			{:else if !mobileMenuOpen && !page.data.user}
				<Button href="/login" variant="primary" class="text-xs sm:text-sm"
					>{m['navigation.login']()}</Button
				>
			{/if}
		</div>
	</div>

	<!-- Mobile Menu Dropdown -->
	{#if mobileMenuOpen}
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 bg-black/20 z-30 md:hidden shadow-lg pointer-events-auto"
			onclick={closeMenu}
			aria-label="Close menu"
		></button>

		<!-- Menu Content -->
		<div
			class="absolute top-full left-0 right-0 bg-base-100 border-b border-base-300 md:hidden relative z-40"
		>
			<!-- Search Bar -->
			{#if page.url.pathname !== '/search'}
				<div class="border-b border-base-300 px-4 py-3">
					<Search type="small" />
				</div>
			{/if}

			<!-- Menu Items -->
			<div class="flex flex-col gap-2 p-4">
				<!-- Theme Switcher -->
				<div class="flex items-center justify-between py-2 border-b border-base-300 pb-3">
					<span class="text-sm font-medium text-base-content">Theme</span>
					<ThemeChanger />
				</div>

				<!-- Language Switcher -->
				<div class="flex items-center justify-between py-2 border-b border-base-300 pb-3">
					<span class="text-sm font-medium text-base-content">Language</span>
					<LanguageSwitcher />
				</div>

				<!-- Auth Buttons -->
				<div class="flex gap-3 pt-4">
					<Button href="/login" variant="outline" class="flex-1">{m['navigation.login']()}</Button>
					<Button href="/signup" variant="primary" class="flex-1">{m['navigation.signup']()}</Button
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	#title-bar {
		-webkit-app-region: drag;
	}
</style>
