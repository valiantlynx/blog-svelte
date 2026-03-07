<script lang="ts">
	import ButtonWithIcon from '../ButtonWithIcon.svelte';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		title?: any;
		url?: any;
		text?: string;
		hashtags?: string;
		image?: any;
	}

	let {
		title = page.data.siteName,
		url = page.url.origin,
		text = 'Check out this manga website. it tracks your reading progress!',
		hashtags = 'manga',
		image = `${page.url.origin}/api/logo?width=280&height=280&color=black`
	}: Props = $props();

	let twitterUrl = $derived(
		`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}&image=${image}`
	);
	let facebookUrl = $derived(
		`https://www.facebook.com/sharer/sharer.php?u=${url}&image=${image}&title=${title}&description=${text}`
	);
	let linkedinUrl = $derived(
		`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${text}&source=${url}&image=${image}`
	);
	let emailUrl = $derived(`mailto:?subject=${title}&body=${text} ${url}&image=${image}`);
</script>

<div class="flex flex-wrap justify-center py-2 w-full gap-2">
	<a href={facebookUrl} target="_blank">
		<ButtonWithIcon>
			{#snippet icon()}
				<i class="fa fa-facebook text-blue-600"></i>
			{/snippet}

			{m['labels.facebook']?.()}
		</ButtonWithIcon>
	</a>

	<a href={twitterUrl} target="_blank">
		<ButtonWithIcon>
			{#snippet icon()}
				<i class="fa fa-twitter text-blue-600"></i>
			{/snippet}
			{m['labels.twitter']?.()}
		</ButtonWithIcon>
	</a>
	<a href={linkedinUrl} target="_blank">
		<ButtonWithIcon>
			{#snippet icon()}
				<i class="fa fa-linkedin text-blue-600"></i>
			{/snippet}

			{m['labels.linkedin']?.()}
		</ButtonWithIcon>
	</a>
	<a href={emailUrl} target="_blank">
		<ButtonWithIcon>
			{#snippet icon()}
				<i class="fa fa-envelope text-warning"></i>
			{/snippet}

			{m['labels.email']?.()}
		</ButtonWithIcon>
	</a>
</div>
