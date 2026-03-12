<script lang="ts">
	import { page } from '$app/stores';
	import { site } from '$lib/utils/config';
	import * as m from '$lib/paraglide/messages.js';

	interface Blog {
		id: string;
		title: string;
		slug: string;
		image: string;
		summary: string;
		published: boolean;
		author: string;
		expand?: {
			author: {
				id: string;
				username: string;
				avatar?: string;
				collectionId: string;
			};
		};
	}

	interface Props {
		blog: Blog;
	}

	let { blog } = $props();

	function shareButtonClick(blog: Blog) {
		if (navigator.share) {
			navigator
				.share({
					title: blog?.title,
					url: $page.url.origin + '/blogs/' + blog?.slug,
					text: blog?.summary
				})
				.then(() => {
					console.dir('Thanks for sharing!');
				})
				.catch((err) => {
					console.dir('Error while using Web share API:');
					console.error(err);
				});
		} else {
			alert(m['messages.browser_not_support_api']?.() || "Browser doesn't support this API !");
		}
	}
</script>

<div
	class="bg-primary border rounded-lg p-4 shadow-md hover:shadow-lg text-primary-content h-full relative"
>
	{#if !blog?.published && $page.data.user && blog?.author && $page.data.user.id === blog.author}
		<div class="absolute top-4 right-4 z-10">
			<div class="badge badge-warning">{m['blog.status.draft']()}</div>
		</div>
	{/if}

	<img src={blog?.image} alt={blog?.title} class="w-full h-48 object-cover rounded-lg" />
	<h2 class="text-xl font-bold mt-4">
		<a href="/blogs/{blog?.slug}" class="hover:cursor-pointer hover:underline hover:text-warning">
			{blog?.title}
		</a>
	</h2>
	<p class="text-sm mt-2">{blog?.summary}</p>
	<div class="flex items-center justify-between mt-4">
		<div class="flex items-center">
			<img
				src={blog?.expand?.author.avatar
					? `${site.pocketbase}/api/files/${blog?.expand?.author?.collectionId}/${blog?.expand?.author?.id}/${blog?.expand?.author?.avatar}`
					: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=' +
						blog?.expand?.author?.username}
				alt={blog?.expand?.author?.username}
				class="w-8 h-8 rounded-full object-cover"
			/>
			<a href="/" class="ml-2 text-sm hover:underline hover:text-warning"
				>{blog?.expand?.author?.username
					? blog?.expand?.author?.username
					: m['labels.anonymous']?.()}</a
			>
		</div>
		<div class="flex items-center">
			<a
				href="/blogs/{blog?.slug}"
				class="block font-bold hover:cursor-pointer hover:underline hover:text-warning"
				>{m['buttons.read_more']?.()}</a
			>
		</div>
		<div class="flex items-center">
			<ul class="flex justify-end mt-4">
				<li class="inline pr-2">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<i
						class="fa fa-envelope-o fa-lg hover:text-warning"
						onclick={() => shareButtonClick(blog)}
					></i>
				</li>
				<li class="inline">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<i class="fa fa-share-alt fa-lg hover:text-warning" onclick={() => shareButtonClick(blog)}
					></i>
				</li>
			</ul>
		</div>
	</div>
</div>
