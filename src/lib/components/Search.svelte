<script>
	import { run } from 'svelte/legacy';

	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
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

<div class="max-w-screen mx-auto">
	<div class="join">
		<div class="w-full">
			<Input
				class="join-item w-full"
				value={$searchQuery && type === 'big' ? $searchQuery : ''}
				placeholder={m['placeholders.search']()}
				oninput={handleSearch}
			/>
		</div>
		<select
			class="select select-bordered select-primary join-item w-1/3"
			bind:value={selectedOption}
		>
			<option value={m['header.blogs']?.()}>{m['header.blogs']?.()}</option>
			<option value={m['header.projects']?.()}>{m['header.projects']?.()}</option>
		</select>

		<Button href="/search" variant="primary" class="join-item w-1/5"
			>{m['buttons.search']?.()}</Button
		>
	</div>

	{#if type === 'small'}
		<SmallSearchResults {searchResults} {handleClick} />
	{:else if type === 'big'}
		<BigSearchResults {searchResults} {handleClick} />
	{/if}
</div>
