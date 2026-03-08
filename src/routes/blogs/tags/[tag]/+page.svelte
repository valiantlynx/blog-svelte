<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import BlogCards from '$lib/components/BlogCards.svelte';
	import MasonryGrid from '$lib/components/MasonryGrid.svelte';
	import Icon from '@iconify/svelte';
	let { data } = $props();

	const tag = data.tag;

	console.log('data', data.blogs);
</script>

<div class="w-full mt-4 p-4">
	<h2 class="text-3xl font-bold mb-6">My Blogs</h2>
	<Icon icon="mdi:emoticon-sad-outline" width="40" height="40" class="mx-auto" />
	<p class="text-center text-3xl">would you like to make a blog blogs.</p>
	<Button href="/blogs/new" variant="primary" class="max-w-md mt-4">Add One</Button>
</div>

<div class="w-full mt-4 p-4">
	<h2 class="text-3xl font-bold mb-6">
		All Blogs with tag: <p class="text-accent text-3xl">{tag.name}</p>
	</h2>
	{#if data.blogs && data.blogs.length > 0}
		<MasonryGrid items={data.blogs} columnCount={4} gap="gap-4">
			{#snippet children({ item: blog })}
				<BlogCards {blog} />
			{/snippet}
		</MasonryGrid>
	{/if}
</div>

<svelte:head>
	<title>{tag} | valiantlynx</title>
	<!-- Canonical Link -->
	<link rel="canonical" href="https://{$page.data.siteName}/" />
	<!-- Author Meta Tag -->
	<meta name="author" content={$page.data.siteName} />
	<!--OWN STUFF-->
	<link rel="dns-prefetch" href="https://{$page.data.siteName}" />

	<meta name="apple-mobile-web-app-title" content={$page.data.siteName} />

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<meta name="description" content="blogs containing the {tag} tag in valiantlynx.com" />
	<!-- Keywords Meta Tag -->
	<meta name="keywords" content="blogs containing the {tag} tag in valiantlynx.com" />

	<meta name="mobile-web-app-capable" content="yes" />

	<!-- Open Graph Meta Tags (for social media sharing) -->
	<meta property="og:title" content={tag} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin} />
	<!--meta property="og:image" content="/twitter-image.png" /-->
	<meta property="og:image:alt" content="{$page.data.siteName} Logo" />
	<meta property="og:site_name" content={$page.data.siteName} />

	<!-- Twitter Meta Tags (for social media sharing) -->
	<meta name="twitter:title" content={tag} />
	<meta name="twitter:description" content="blogs containing the {tag} tag in valiantlynx.com" />
	<!--meta name="twitter:image" content="/twitter-image.png" /-->

	<!-- Google / Search Engine Tags -->
	<meta itemprop="name" content={tag} />

	<!-- Facebook Meta Tags -->
	<meta property="fb:app_id" content={$page.data.siteName} />
	<meta property="fb:admins" content={$page.data.siteName} />
	<meta property="fb:page_id" content={$page.data.siteName} />
	<meta property="fb:site_name" content={$page.data.siteName} />
	<meta property="article:publisher" content={$page.data.siteName} />
	<meta property="article:author" content={$page.data.siteName} />
	<meta property="article:section" content={$page.data.siteName} />

	<meta property="article:tag" content={tag} />

	<meta property="article:published_time" content={$page.data.siteName} />
	<meta property="article:modified_time" content={$page.data.siteName} />
	<meta property="article:author:first_name" content={$page.data.siteName} />
	<meta property="article:author:last_name" content={$page.data.siteName} />
	<meta property="article:author:username" content={$page.data.siteName} />

	<!-- Schema.org Meta Tags (for SEO) -->
	<meta itemprop="headline" content={tag} />
	<meta itemprop="description" content="blogs containing the {tag} tag in valiantlynx.com" />
	<!--meta itemprop="image" content="/twitter-image.png" /-->

	{#if $page.data.sites}
		{@html `<script type="text/javascript">
			(function (c, l, a, r, i, t, y) {
				c[a] =
					c[a] ||
					function () {
						(c[a].q = c[a].q || []).push(arguments);
					};
				t = l.createElement(r);
				t.async = 1;
				t.src = 'https://www.clarity.ms/tag/' + i;
				y = l.getElementsByTagName(r)[0];
				y.parentNode.insertBefore(t, y);
			})(window, document, 'clarity', 'script', '${$page.data.sites.clarity_tag}');
		</script>`}

		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id={$page.data.sites.google_tag}"
		></script>
		{@html `<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());

			gtag('config', '${$page.data.sites.google_tag}');
		</script>`}

		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={$page.data.sites
				.google_ads_client}"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>
