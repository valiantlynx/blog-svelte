<script>
	import * as m from '$lib/paraglide/messages.js';
	import { site } from '$lib/utils/config';
	import Icon from '@iconify/svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
</script>

<footer class="bg-base-100 text-base-content border-t border-base-300">
	<div class="container mx-auto px-6 py-12 md:py-16">
		<!-- Main Footer Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
			<!-- Branding Section -->
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-2 mb-2">
					<div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
						<img src="/logo.svg" alt="Logo" class="w-8 h-8" />
					</div>
					<span class="text-xl font-bold text-primary">Valiant Lynx</span>
				</div>
				<p class="text-sm text-base-content/75 leading-relaxed">
					Sharing ideas, code, and creativity with the world.
				</p>
				<div class="flex gap-3 pt-2">
					<a
						href="https://twitter.com/valiantlynx42"
						target="_blank"
						rel="noopener noreferrer"
						class="w-10 h-10 rounded-full bg-base-300 hover:bg-primary hover:text-primary-content flex items-center justify-center transition-all duration-300 hover:scale-110"
						title="Twitter"
					>
						<Icon icon="mdi:twitter" width="20" height="20" />
					</a>
					<a
						href="https://www.youtube.com/@valiantlynx/"
						target="_blank"
						rel="noopener noreferrer"
						class="w-10 h-10 rounded-full bg-base-300 hover:bg-error hover:text-error-content flex items-center justify-center transition-all duration-300 hover:scale-110"
						title="YouTube"
					>
						<Icon icon="mdi:youtube" width="20" height="20" />
					</a>
					<a
						href="https://twitter.com/valiantlynx42/"
						target="_blank"
						rel="noopener noreferrer"
						class="w-10 h-10 rounded-full bg-base-300 hover:bg-info hover:text-info-content flex items-center justify-center transition-all duration-300 hover:scale-110"
						title="Facebook"
					>
						<Icon icon="mdi:facebook" width="20" height="20" />
					</a>
				</div>
			</div>

			<!-- Links Section -->
			<div class="flex flex-col gap-4">
				<h3 class="text-lg font-semibold text-base-content flex items-center gap-2">
					<div class="w-1 h-1 rounded-full bg-primary"></div>
					Navigation
				</h3>
				<nav class="flex flex-col gap-3">
					<a
						href="/about"
						class="text-sm text-base-content/75 hover:text-primary transition-colors duration-200 flex items-center gap-2"
					>
						<Icon icon="mdi:chevron-right" width="16" height="16" />
						{m['footer.about_us']()}
					</a>
					<a
						href="/contact"
						class="text-sm text-base-content/75 hover:text-primary transition-colors duration-200 flex items-center gap-2"
					>
						<Icon icon="mdi:chevron-right" width="16" height="16" />
						{m['footer.contact_us']()}
					</a>
					<a
						href="/pricing"
						class="text-sm text-base-content/75 hover:text-primary transition-colors duration-200 flex items-center gap-2"
					>
						<Icon icon="mdi:chevron-right" width="16" height="16" />
						{m['footer.terms']()}
					</a>
					<a
						href="/privacy-policy"
						class="text-sm text-base-content/75 hover:text-primary transition-colors duration-200 flex items-center gap-2"
					>
						<Icon icon="mdi:chevron-right" width="16" height="16" />
						{m['footer.privacy_policy']()}
					</a>
					<a
						href="/sitemap.xml"
						class="text-sm text-base-content/75 hover:text-primary transition-colors duration-200 flex items-center gap-2"
					>
						<Icon icon="mdi:chevron-right" width="16" height="16" />
						{m['footer.sitemap']()}
					</a>
				</nav>
			</div>

			<!-- Settings Section -->
			<div class="flex flex-col gap-4">
				<h3 class="text-lg font-semibold text-base-content flex items-center gap-2">
					<div class="w-1 h-1 rounded-full bg-primary"></div>
					Settings
				</h3>
				<div class="flex flex-col gap-4">
					<div
						class="flex items-center justify-between p-3 bg-base-300 rounded-lg hover:bg-base-100 transition-colors duration-200"
					>
						<div class="flex items-center gap-2">
							<Icon icon="mdi:globe" width="18" height="18" class="text-primary" />
							<span class="text-sm font-medium text-base-content">{m['footer.language']()}</span>
						</div>
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</div>

		<!-- Divider -->
		<div class="h-px bg-base-300 my-8"></div>

		<!-- Bottom Footer -->
		<div
			class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-base-content/60"
		>
			<p class="flex items-center gap-2">
				<Icon icon="mdi:copyright" width="16" height="16" />
				{m['footer.copyright']()}
			</p>
			<p class="text-xs">
				Crafted with <Icon icon="mdi:heart" width="14" height="14" class="text-error inline" /> by Valiant
				Lynx
			</p>
		</div>
	</div>
</footer>
