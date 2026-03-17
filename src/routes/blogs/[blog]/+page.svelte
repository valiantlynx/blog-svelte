<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LikeButton from '$lib/components/blog/LikeButton.svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import Share from '$lib/components/share/Share.svelte';
	import { site } from '$lib/utils/config';
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';

	const blog = page.data.blog;

	// Load rich text component
	let ValiantRichText = $state<any>(null);
	let isSaving = $state(false);
	let isPublishing = $state(false);
	let isLoading = $state(true);

	$effect(() => {
		import('@mythrantic/svelte-rich-text')
			.then((module) => {
				ValiantRichText = module.ValiantRichText;
			})
			.catch((err) => {
				console.error('Failed to load rich text editor:', err);
			})
			.finally(() => {
				isLoading = false;
			});
	});

	// Handle content_object - parse it if it's a string
	let content = $derived.by(() => {
		const co = blog?.content_object;
		if (!co) return {};
		if (typeof co === 'string') {
			try {
				return JSON.parse(co);
			} catch {
				return {};
			}
		}
		return co;
	});

	let editor = $state<any>();
	let contentJson = $state('');

	function onUpdate() {
		if (editor?.getJSON) {
			const json = editor.getJSON();
			contentJson = JSON.stringify(json);
		}
	}

	// Initialize contentJson when content changes
	$effect(() => {
		if (content && typeof content === 'object') {
			contentJson = JSON.stringify(content);
		}
	});
</script>

<!-- Blog Container -->
<div class="container mx-auto px-4 md:px-8 lg:px-12 py-4 md:py-8 lg:py-12 text-base-content">
	<!-- Blog Header -->
	<div class="mb-8">
		<div class="flex items-start justify-between gap-4 mb-4">
			<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold">{blog?.title}</h1>
			{#if !blog?.published && page.data.user && blog?.author && page.data.user.id === blog.author}
				<div class="badge badge-warning mt-2">{m['blog.status.draft']()}</div>
			{/if}
		</div>

		<div class="flex items-center gap-4 mb-4">
			<!-- Author Avatar -->
			<div class="shrink-0">
				<img
					src={blog?.expand?.author?.avatar
						? `${site.pocketbase}/api/files/${blog?.expand?.author?.collectionId}/${blog?.expand?.author?.id}/${blog?.expand?.author?.avatar}`
						: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=' +
							blog?.expand?.author?.username}
					alt={'Author ' + blog?.expand?.author?.username}
					class="w-12 h-12 rounded-full shadow-lg"
				/>
			</div>

			<!-- Author & Metadata -->
			<div class="flex flex-col md:flex-row gap-2 md:gap-4 text-sm">
				<p class="font-semibold">By: {blog?.expand?.author?.username}</p>
				<p>Published: {new Date(blog?.created).toLocaleDateString()}</p>
				<p>Updated: {new Date(blog?.updated).toLocaleDateString()}</p>
			</div>
		</div>

		<!-- Like Button -->
		<LikeButton />
	</div>

	<!-- Blog Image -->
	{#if blog?.image}
		<img src={blog?.image} alt={blog?.title} class="w-full h-auto rounded-lg mb-6" />
	{/if}

	<!-- Blog Content -->
	<div class="text-base-content">
		{#if page.data.user && blog?.author && page.data.user.id === blog.author}
			{#if isLoading}
				<div class="border p-4 rounded bg-base-200">
					<p class="text-sm">Loading editor...</p>
				</div>
			{:else if ValiantRichText}
				<form
					method="POST"
					action="?/updateBlog"
					use:enhance={() => {
						isSaving = true;
						return async ({ result, update }) => {
							isSaving = false;
							if (result.type === 'success') {
								toast.success(m['messages.success_changes_saved']());
							} else if (result.type === 'error') {
								toast.error(result.error?.message || 'Failed to update blog');
							}
							await update();
						};
					}}
				>
					<input type="hidden" name="blogId" value={blog?.id} />
					<input type="hidden" name="content_object" bind:value={contentJson} />

					<ValiantRichText bind:editor {content} {onUpdate} editable={true} theme="inherit" />

					<div class="flex gap-3 items-center mt-4">
						<Button type="submit" variant="primary" disabled={isSaving}>
							{isSaving ? 'Saving...' : m['buttons.save']()}
						</Button>
						<Button
							type="button"
							variant={blog?.published ? 'ghost' : 'primary'}
							disabled={isPublishing}
							onclick={() => {
								const form = new FormData();
								form.append('blogId', blog?.id);

								const submitForm = async () => {
									isPublishing = true;
									try {
										const response = await fetch('?/togglePublish', {
											method: 'POST',
											body: form
										});

										if (response.ok) {
											const data = await response.json();
											if (data.type === 'success') {
												toast.success(data.data.message);
												// Reload page to update UI
												window.location.reload();
											} else {
												toast.error(data.error?.message || m['blog.update_error']());
											}
										} else {
											toast.error(m['blog.update_error']());
										}
									} catch (err) {
										console.error('Error:', err);
										toast.error(m['blog.update_error']());
									} finally {
										isPublishing = false;
									}
								};

								submitForm();
							}}
						>
							{isPublishing
								? 'Updating...'
								: blog?.published
									? m['blog.unpublish']()
									: m['blog.publish']()}
						</Button>
					</div>
				</form>
			{:else}
				<div class="border p-4 rounded bg-base-200">
					<p class="text-sm text-error">Failed to load editor. Please refresh the page.</p>
				</div>
			{/if}
		{:else if ValiantRichText && content}
			<ValiantRichText {content} editable={false} theme="inherit" />
		{:else}
			<!-- Fallback: show plain text if no rich content -->
			<div class="prose max-w-none">
				<p>{blog?.summary || 'No content available.'}</p>
			</div>
		{/if}
	</div>

	<!-- Blog Tags -->
	{#if blog?.expand?.tags?.length}
		<div class="flex flex-wrap mt-8">
			{#each blog.expand.tags as tag}
				<a
					href="/blogs/tags/{tag.id}"
					class="bg-base-200 hover:bg-base-300 font-semibold py-2 px-4 rounded-full mr-2 mb-2"
				>
					{tag.name}
				</a>
			{/each}
		</div>
	{/if}

	<Share
		title={blog?.title + ' ' + blog?.expand?.author?.username}
		url={page.url.href}
		image={blog?.image}
		text={`read ${blog?.title} by ${blog?.expand?.author?.username} at ${page.url.hostname} free online, high quality`}
		hashtags={blog?.expand?.tags?.map((tag) => tag.name)}
	/>
</div>

<svelte:head>
	<title>{blog?.title} | valiantlynx</title>
	<link rel="canonical" href="https://{page.data.siteName}/" />
	<meta name="author" content={page.data.siteName} />
	<link rel="dns-prefetch" href="https://{page.data.siteName}" />
	<meta name="apple-mobile-web-app-title" content={page.data.siteName} />
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<meta name="description" content={blog?.summary} />
	<meta name="keywords" content={blog?.expand?.tags?.map((tag) => tag.name)} />
	<meta name="mobile-web-app-capable" content="yes" />

	<!-- Open Graph -->
	<meta property="og:title" content={blog?.title} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.origin} />
	<meta property="og:image" content={blog?.image} />
	<meta property="og:image:alt" content="{page.data.siteName} Logo" />
	<meta property="og:site_name" content={page.data.siteName} />

	<!-- Twitter -->
	<meta name="twitter:card" content={blog?.image} />
	<meta name="twitter:title" content={blog?.title} />
	<meta name="twitter:description" content={blog?.summary} />
	<meta name="twitter:image" content={blog?.image} />

	<!-- Facebook -->
	<meta property="fb:image" content={blog?.image} />
	<meta property="fb:app_id" content={page.data.siteName} />

	{#if page.data.sites}
		{@html `<script type="text/javascript">
			(function (c, l, a, r, i, t, y) {
				c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
				t = l.createElement(r);
				t.async = 1;
				t.src = 'https://www.clarity.ms/tag/' + i;
				y = l.getElementsByTagName(r)[0];
				y.parentNode.insertBefore(t, y);
			})(window, document, 'clarity', 'script', '${page.data.sites.clarity_tag}');
		</script>`}
		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id={page.data.sites.google_tag}"
		></script>
		{@html `<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() { dataLayer.push(arguments); }
			gtag('js', new Date());
			gtag('config', '${page.data.sites.google_tag}');
		</script>`}
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={page.data.sites
				.google_ads_client}"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>
