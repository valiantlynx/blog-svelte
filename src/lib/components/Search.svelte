<script lang="ts">
	import { run } from 'svelte/legacy';
	import { page } from '$app/state';
	import { site } from '$lib/utils/config';

	import { goto } from '$app/navigation';
	import BigSearchResults from '$lib/components/BigSearchResults.svelte';
	import SmallSearchResults from '$lib/components/SmallSearchResults.svelte';
	import { metaKeywords, searchQuery } from '$lib/utils/stores';
	import { pb, getImageURL, getAvatarURL } from '$lib/utils/api';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		type?: string;
	}

	let { type = 'small' }: Props = $props();

	let searchResults = $state<any[]>([]);
	let searchTerm = $state('');
	let selectedOption = $state(m['header.blogs']?.());
	let selectedSearchFunction: () => Promise<void> = searchBlogs;
	let debouncedSearch = $state<NodeJS.Timeout | undefined>();
	let lastSearchTerm = $state('');

	async function searchBlogs() {
		if (searchTerm.trim() === '') {
			searchResults = [];
			return;
		}

		try {
			const filter = `title~'${searchTerm}' || summary~'${searchTerm}'`;
			const response = await pb.collection('blogs').getList(1, 10, {
				filter: filter,
				expand: 'author',
				fields: 'id,title,slug,image,summary,author,collectionId,expand'
			});

			searchResults = response.items.map((blog: any) => {
				const authorName = blog.expand?.author?.username || 'Unknown Author';

				const authorAvatar = blog.expand?.author?.avatar
					? `${site.pocketbase}/api/files/${blog.expand.author.collectionId}/${blog.expand.author.id}/${blog.expand.author.avatar}`
					: `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${blog.expand.author.username}`;

				const imageUrl = blog.image
					? getImageURL(blog.collectionId, blog.id, blog.image)
					: 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(blog.title);

				return {
					title: blog.title,
					img: imageUrl,
					src: '/blogs/' + blog.slug,
					author: authorName,
					authorAvatar: authorAvatar,
					slug: blog.slug
				};
			});
		} catch (error) {
			console.error('Blog search error:', error);
		}
	}

	async function searchProjects() {
		if (searchTerm.trim() === '') {
			searchResults = [];
			return;
		}

		try {
			const filter = `name~'${searchTerm}' || description~'${searchTerm}'`;
			const response = await pb.collection('projects_valiantlynx').getList(1, 10, {
				filter: filter,
				fields: 'id,name,slug,thumbnail,description,expand'
			});

			searchResults = response.items.map((project: any) => ({
				title: project.name,
				img:
					project.thumbnail ||
					'https://via.placeholder.com/300x200?text=' + encodeURIComponent(project.name),
				src: '/projects/' + project.slug,
				author: project.name,
				authorAvatar: '',
				slug: project.slug
			}));
		} catch (error) {
			console.error('Project search error:', error);
		}
	}

	/**
	 * @param {any} event
	 */
	function handleSearch(event) {
		searchTerm = event.target.value;
		searchQuery.set(searchTerm);
	}

	/**
	 * @param {any} url
	 */
	async function handleClick(url) {
		await goto(url);
		searchTerm = '';
	}

	function executeSelectedSearch() {
		if (searchTerm.trim() === '') {
			searchResults = [];
			return;
		}

		try {
			switch (selectedOption) {
				case m['header.blogs']?.():
					selectedSearchFunction = searchBlogs;
					break;
				case m['header.projects']?.():
					selectedSearchFunction = searchProjects;

				default:
					selectedSearchFunction = searchBlogs; // Default to 'searchBlogs'
					break;
			}

			selectedSearchFunction();
		} catch (error) {
			console.error(error);
		}
	}
	run(() => {
		if (searchTerm !== lastSearchTerm) {
			if (debouncedSearch) {
				clearTimeout(debouncedSearch);
			}
			debouncedSearch = setTimeout(executeSelectedSearch, 300);
			lastSearchTerm = searchTerm;
		}
	});

	// Re-run search when selected option changes
	$effect(() => {
		// Reference selectedOption to create dependency
		if (searchTerm.trim() !== '') {
			executeSelectedSearch();
		}
		selectedOption;
	});

	run(() => {
		if (searchResults.length > 0) {
			const keywords = searchResults.map((result) => result.title).join(', ');
			metaKeywords.set(keywords);
		}
	});
</script>

<div class="max-w-screen mx-auto w-full">
	<div class="relative w-full">
		<div
			class="flex flex-nowrap items-stretch gap-0 bg-base-100 border border-base-300 rounded-lg overflow-hidden shadow-sm"
		>
			<input
				type="text"
				value={$searchQuery && type === 'big' ? $searchQuery : ''}
				placeholder={m['placeholders.search']()}
				oninput={handleSearch}
				class="flex-1 min-w-0 bg-base-100 text-base-content placeholder-base-content/50 px-4 py-2 focus:outline-none border-0"
			/>
			<div
				class="border-l border-base-300 bg-base-200 hover:bg-base-300 transition-colors duration-200"
			>
				<select
					class="bg-base-200 text-base-content border-0 px-3 py-2 focus:outline-none cursor-pointer font-medium"
					bind:value={selectedOption}
				>
					<option value={m['header.blogs']?.()}>{m['header.blogs']?.()}</option>
					<option value={m['header.projects']?.()}>{m['header.projects']?.()}</option>
				</select>
			</div>

			<button
				type="button"
				onclick={() => goto('/search')}
				class="border-l border-base-300 bg-base-200 hover:bg-base-300 transition-colors duration-200 px-4 py-2 text-base-content hover:text-primary font-medium flex items-center gap-2 flex-shrink-0"
			>
				{m['buttons.search']?.()}
			</button>
		</div>

		{#if type === 'small' && searchResults.length > 0}
			<div
				class="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
			>
				<SmallSearchResults {searchResults} {handleClick} />
			</div>
		{:else if type === 'big' && searchResults.length > 0}
			<div class="mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg overflow-y-auto">
				<BigSearchResults {searchResults} {handleClick} />
			</div>
		{/if}
	</div>
</div>
