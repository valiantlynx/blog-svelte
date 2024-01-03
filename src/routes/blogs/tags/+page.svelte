<script>
    import { page } from '$app/stores';
	export let data;
</script>

<div class="container mx-auto px-4 md:px-8 lg:px-12 py-4 md:py-8 lg:py-12">
	<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"> All Tags</h1>
	<div class="flex flex-wrap mt-8">
		{#each data.tags as tag}
		<a
			href="/blogs/tags/{tag.id}"
			class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full mr-2 mb-2"
		>
			{tag.name}
		</a>
		{/each}
	</div>
</div>


<svelte:head>
	<title>tags| valiantlynx</title>
	<!-- Canonical Link -->
	<link rel="canonical" href="https://{$page.data.siteName}/" />
	<!-- Author Meta Tag -->
	<meta name="author" content="{$page.data.siteName}" />
	<!--OWN STUFF-->
	<link rel="dns-prefetch" href="https://{$page.data.siteName}" />

	<meta name="apple-mobile-web-app-title" content={$page.data.siteName} />

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<meta
		name="description"
		content={data.tags.map((tag) => tag.name)}
		/>
			<!-- Keywords Meta Tag -->
	<meta name="keywords" content="{data.tags.map((tag) => tag)}" />

	<meta name="mobile-web-app-capable" content="yes" />

	<!-- Open Graph Meta Tags (for social media sharing) -->
	<meta property="og:title" content="tags"/>

	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin} />
	<!--meta property="og:image" content="/twitter-image.png" /-->
	<meta property="og:image:alt" content="{$page.data.siteName} Logo" />
	<meta property="og:site_name" content={$page.data.siteName} />

	<!-- Twitter Meta Tags (for social media sharing) -->
	<meta name="twitter:title" content="tags"/>
	<!--meta name="twitter:image" content="/twitter-image.png" /-->

	<!-- Google / Search Engine Tags -->
	<meta itemprop="name" content="tags"/>

	<!-- Facebook Meta Tags (for social media sharing) -->
	<meta property="fb:app_id" content={$page.data.siteName} />
	<meta property="fb:admins" content={$page.data.siteName} />
	<meta property="fb:page_id" content={$page.data.siteName} />
	<meta property="fb:site_name" content={$page.data.siteName} />
	<meta property="article:publisher" content={$page.data.siteName} />
	<meta property="article:author" content={$page.data.siteName} />
	<meta property="article:section" content={$page.data.siteName} />
	{#each data.tags as tag}
<meta property="article:tag" content={tag.name} />
	{/each}
	<meta property="article:published_time" content={$page.data.siteName} />
	<meta property="article:modified_time" content={$page.data.siteName} />
	<meta property="article:author:first_name" content={$page.data.siteName} />
	<meta property="article:author:last_name" content={$page.data.siteName} />
	<meta property="article:author:username" content={$page.data.siteName} />

	<!-- Schema.org Meta Tags (for SEO) -->
	<meta itemprop="headline" content="tags"/>
	<meta itemprop="description" content={data.tags.map((tag) => tag.name)} />
	<!--meta itemprop="image" content="/twitter-image.png" /-->

	{#if $page.data.sites}
		<!-- clarity there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead-->
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

		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
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

		<!-- Google Adsense -->
		<!-- Google Adsense -->
		<!-- Google Adsense -->
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={$page.data.sites
				.google_ads_client}"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>

