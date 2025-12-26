<script>
	import LikeButton from '$lib/components/blog/LikeButton.svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import Share from '$lib/components/share/Share.svelte';
	import { site } from '$lib/utils/config';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	const blog = page.data.blog;
	
	// Dynamically import ValiantRichText only on client side to avoid SSR issues
	// TODO: there a a lucide icon bug in the svelte-rich text . For a permanent fix, you need to edit the source code at svelte-rich-text. The issue is likely in a file that's importing from @lucide/svelte. Here's what you should look for:

	// Find files importing @lucide/svelte in the source project
	// Replace import { Icon } from '@lucide/svelte'
	// With one of these options:
	// Use lucide-svelte if it provides compatible exports
	// Import specific icon components rather than the base Icon
	// Add proper bundling configuration to transpile .svelte files in the build output

	let ValiantRichText = $state();
	let isSaving = $state(false);
	
	// Load rich text component on mount
	onMount(() => {
		import('@mythrantic/svelte-rich-text').then((module) => {
			ValiantRichText = module.ValiantRichText;
		});
	});

	// Editor states
	let content = $state(blog?.content_object);
	let editor = $state();
	let contentJson = $state('');

	function onUpdate() {
		content = editor?.getJSON();
		contentJson = JSON.stringify(content);
	}
</script>

<!-- Blog Container -->
<div class="container mx-auto px-4 md:px-8 lg:px-12 py-4 md:py-8 lg:py-12">
	<!-- Blog Header -->
	<div class="mb-8">
		<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{blog?.title}</h1>

		<div class="flex items-center gap-4 mb-4">
			<!-- Author Avatar -->
			<div class="shrink-0">
				<img
					src={blog?.expand?.author.avatar
						? `${site.pocketbase}/api/files/${blog?.expand?.author?.collectionId}/${blog?.expand?.author?.id}/${blog?.expand?.author?.avatar}`
						: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=' +
							blog?.expand?.author?.username}
					alt={'Author' + blog?.expand?.author?.username}
					class="w-12 h-12 rounded-full shadow-lg"
				/>
			</div>

			<!-- Author & Metadata -->
			<div class="flex flex-col md:flex-row gap-2 md:gap-4 text-sm">
				<p class="font-semibold">By: {blog?.expand?.author.username}</p>
				<p>Published: {new Date(blog?.created).toLocaleDateString()}</p>
				<p>Updated: {new Date(blog?.updated).toLocaleDateString()}</p>
			</div>
		</div>

		<!-- Like Button and Form -->
		<LikeButton />

		<!-- Animated Scroll Down Indicator (Optional) -->
		<div class="animate-bounce mt-4 flex">
			<span class="text-xs flex mt-1">Scroll to read</span>
			<i class="material-icons text-lg">expand_more</i>
		</div>
	</div>

	<!-- Blog Image -->
	<img src={blog?.image} alt={blog?.title} class="w-full h-auto rounded-lg mb-6" />

	<!-- Blog Content -->
	<div class="text-base-content">
		{#if page.data.user}
			{#if page.data.user.id === blog?.author}
				{#if ValiantRichText}
					<form 
						method="POST" 
						action="?/updateBlog"
						use:enhance={() => {
							isSaving = true;
							return async ({ result, update }) => {
								isSaving = false;
								if (result.type === 'success') {
									toast.success('Blog post updated successfully');
								} else if (result.type === 'error') {
									toast.error(result.error?.message || 'Failed to update blog');
								}
								await update();
							};
						}}
					>
						<input type="hidden" name="blogId" value={blog?.id} />
						<input type="hidden" name="content_object" bind:value={contentJson} />
						
						<ValiantRichText bind:editor {content} {onUpdate} editable={true} />
						
						<button 
							type="submit" 
							class="btn btn-primary mt-4"
							disabled={isSaving}
						>
							{isSaving ? 'Saving...' : 'Save'}
						</button>
					</form>
				{/if}
			{:else}
				<h3 class="text-xl text-accent md:text-2xl lg:text-3xl font-bold mb-4">
					you can not edit this blog post. as you are not the author of this blog post. Create your
					own blog post <a href="/blogs/new" class="link link-primary">here</a>
				</h3>
				{#if ValiantRichText}
					<ValiantRichText {content} editable={false} />
				{/if}
			{/if}
		{:else}
			<h3 class="text-xl text-accent md:text-2xl lg:text-3xl font-bold mb-4">
				It is possible to edit this blog post. Please <a href="/login" class="link link-primary"
					>login</a
				> to edit.
			</h3>
			{#if ValiantRichText}
				<ValiantRichText {content} editable={false} />
			{/if}
		{/if}
	</div>

	<!-- Blog Tags loop through blog?.expand?.tags and display the name-->
	<div class="flex flex-wrap mt-8">
		{#each blog?.expand?.tags as tag}
			<a
				href="/blogs/tags/{tag.id}"
				class="bg-base-200 hover:bg-base-300 font-semibold py-2 px-4 rounded-full mr-2 mb-2"
			>
				{tag.name}
			</a>
		{/each}
	</div>

	<Share
		title={blog?.title + ' ' + blog?.expand?.author?.username}
		url={page.url.href}
		image={blog?.image}
		text={`read ${blog?.title} by ${blog?.expand?.author?.username} at ${page.url.hostname} free online, high quality`}
		hashtags={blog?.expand?.tags.map((tag) => tag.name)}
	/>
	<!-- Chat Component -->
	<!-- <Chat class="mt-8" /> -->
</div>

<svelte:head>
	<title>{blog?.title} | valiantlynx</title>
	<!-- Canonical Link -->
	<link rel="canonical" href="https://{page.data.siteName}/" />
	<!-- Author Meta Tag -->
	<meta name="author" content={page.data.siteName} />
	<!--OWN STUFF-->
	<link rel="dns-prefetch" href="https://{page.data.siteName}" />

	<meta name="apple-mobile-web-app-title" content={page.data.siteName} />

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<meta name="description" content={blog?.summary} />
	
	<!-- Keywords Meta Tag -->
	<meta name="keywords" content={blog?.expand?.tags.map((tag) => tag.name)} />

	<meta name="mobile-web-app-capable" content="yes" />

	<!-- Open Graph Meta Tags (for social media sharing) -->
	<meta property="og:title" content={blog?.title} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.origin} />
	<meta property="og:image" content={blog?.image} />
	<meta property="og:image:alt" content="{page.data.siteName} Logo" />
	<meta property="og:site_name" content={page.data.siteName} />

	<!-- Twitter Meta Tags (for social media sharing) -->
	<meta name="twitter:card" content={blog?.image} />
	<meta name="twitter:title" content={blog?.title} />
	<meta name="twitter:description" content={blog?.summary} />
	<meta name="twitter:image" content={blog?.image} />

	<!-- Google / Search Engine Tags -->
	<meta itemprop="name" content={blog?.title} />
	<meta itemprop="description" content={blog?.summary} />

	<!-- Facebook Meta Tags (for social media sharing) -->
	<meta property="fb:image" content={blog?.image} />
	<meta property="fb:app_id" content={page.data.siteName} />
	<meta property="fb:admins" content={page.data.siteName} />
	<meta property="fb:page_id" content={page.data.siteName} />
	<meta property="fb:site_name" content={page.data.siteName} />
	<meta property="article:publisher" content={page.data.siteName} />
	<meta property="article:author" content={page.data.siteName} />
	<meta property="article:section" content={page.data.siteName} />
	{#each blog?.expand?.tags as tag}
		<meta property="article:tag" content={tag.name} />
	{/each}
	<meta property="article:published_time" content={page.data.siteName} />
	<meta property="article:modified_time" content={page.data.siteName} />
	<meta property="article:author:first_name" content={page.data.siteName} />
	<meta property="article:author:last_name" content={page.data.siteName} />
	<meta property="article:author:username" content={page.data.siteName} />

	<!-- Schema.org Meta Tags (for SEO) -->
	<meta itemprop="headline" content={blog?.title} />
	<meta itemprop="image" content={blog?.image} />

	{#if page.data.sites}
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
			})(window, document, 'clarity', 'script', '${page.data.sites.clarity_tag}');
		</script>`}

		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<!-- Google tag (gtag.js) there is abug in svelte where inside the svript tags i cannot access the variables //! https://stackoverflow.com/questions/63419284/svelte-substitution-in-script-within-sveltehead -->
		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id={page.data.sites.google_tag}"
		></script>
		{@html `<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());

			gtag('config', '${page.data.sites.google_tag}');
		</script>`}

		<!-- Google Adsense -->
		<!-- Google Adsense -->
		<!-- Google Adsense -->
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={page.data.sites
				.google_ads_client}"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>
