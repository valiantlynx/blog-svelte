<script lang="ts">
	import { browser } from '$app/environment';

	const themes = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter'
	];

	let currentTheme = $state('');

	if (browser) {
		currentTheme = localStorage.getItem('theme') || 'dark';
		document.documentElement.setAttribute('data-theme', currentTheme);
	}

	function changeTheme(event: Event) {
		const target = event.target as HTMLSelectElement;
		currentTheme = target.value;
		if (browser) {
			localStorage.setItem('theme', currentTheme);
			document.documentElement.setAttribute('data-theme', currentTheme);
		}
	}
</script>

<select class="select select-bordered select-sm w-24" onchange={changeTheme} value={currentTheme}>
	{#each themes as theme}
		<option value={theme}>{theme}</option>
	{/each}
</select>
