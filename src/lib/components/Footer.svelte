<script>
	import * as m from '$lib/paraglide/messages.js';
	import { site } from '$lib/utils/config';
	import Icon from '@iconify/svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
</script>

<footer class="footer footer-center p-10 bg-base-300 text-base-content rounded mt-auto">
	<div class="grid grid-flow-col gap-4">
		<a href="/about" class="link link-hover">{m['footer.about_us']()}</a>
		<a href="/contact" class="link link-hover">{m['footer.contact_us']()}</a>
		<a href="/privacy-policy" class="link link-hover">{m['footer.privacy_policy']()}</a>
		<a href="/pricing" class="link link-hover">{m['footer.terms']()}</a>
		<a href="/sitemap.xml" class="link link-hover">{m['footer.sitemap']()}</a>
	</div>
	<div>
		<div class="grid grid-flow-col gap-4">
			<a href="https://www.facebook.com/valiantlynx/" class="link link-hover hover:link-primary"
				><Icon icon="mdi:twitter" /></a
			>
			<a href="https://www.youtube.com/@valiantlynx/" class="link link-hover hover:link-primary"
				><Icon icon="mdi:youtube" /></a
			>
			<a href="https://www.facebook.com/valiantlynx/" class="link link-hover hover:link-primary"
				><Icon icon="mdi:facebook" /></a
			>
		</div>
	</div>
	<div class="flex flex-col gap-4">
		<p>{m['footer.copyright']()}</p>
		<div class="flex items-center justify-center gap-2">
			<span>{m['footer.language']()}:</span>
			<LanguageSwitcher />
		</div>
	</div>
</footer>
