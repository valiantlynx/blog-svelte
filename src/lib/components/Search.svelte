<script>
	import { run } from 'svelte/legacy';

	import { goto } from '$app/navigation';
	import BigSearchResults from '$lib/components/BigSearchResults.svelte';
	import SmallSearchResults from '$lib/components/SmallSearchResults.svelte';
	import { metaKeywords, searchQuery } from '$lib/utils/stores';
	import { getPocketbase } from '$lib/utils/api';
	import * as m from '$lib/paraglide/messages.js';

	/**
	 * @typedef {Object} Props
	 * @property {string} [type]
	 */

	/** @type {Props} */
	let { type = 'small' } = $props();

	/**
	 * @type {any[]}
	 */
	let searchResults = $state([]);
	let searchTerm = $state('');
	let selectedOption = $state('Drivstoffpris');
	let selectedSearchFunction = searchBlogs; // Initialize with the default search function

	async function searchBlogs() {
		if (searchTerm.trim() === '') {
			searchResults = [];
			return;
		}

		try {
			const dataPb = {
				filter: `name~'${searchTerm}'`
			};
			const drivstoffpriser = await getPocketbase('norway_city', dataPb);
			searchResults = drivstoffpriser.items;
		} catch (error) {
			console.error(error);
		}
	}

	async function searchProjects() {
		if (searchTerm.trim() === '') {
			searchResults = [];
			return;
		}

		try {
			const dataPb = {
				filter: `station~'${searchTerm}'`
			};
			const drivstoffpriser = await getPocketbase('norway_stations', dataPb);
			searchResults = drivstoffpriser.items;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * @type {number | undefined}
	 */
	let debouncedSearch = $state();
	let lastSearchTerm = $state('');

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
		window.location.reload();
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
					class="bg-transparent text-base-content border-0 px-3 py-2 focus:outline-none cursor-pointer font-medium"
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
			<div
				class="mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-96 overflow-y-auto"
			>
				<BigSearchResults {searchResults} {handleClick} />
			</div>
		{/if}
	</div>
</div>
