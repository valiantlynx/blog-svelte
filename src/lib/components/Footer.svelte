<script>
	import { site } from '@valiantlynx/general-config';
	import Icon from '@iconify/svelte';
</script>

<footer class="footer footer-center p-10 bg-base-300 text-base-content rounded mt-auto">
	<div class="grid grid-flow-col gap-4">
		<a href="/about" class="link link-hover">About us</a>
		<a href="/contact" class="link link-hover">Contact</a>
		<a href="/privacy-policy" class="link link-hover">Privacy</a>
		<a href="/pricing" class="link link-hover">Pricing</a>
		<a href="/sitemap.xml" class="link link-hover">Sitemap</a>
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
	<div>
		<p>Copyright © 2023 - All right reserved by {site.site.company}</p>
	</div>
</footer>
