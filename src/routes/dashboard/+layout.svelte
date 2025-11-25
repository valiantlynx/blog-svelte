<script lang="ts">
	import SideBar from '$lib/components/SideBar.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex">
	<SideBar />
	{@render children?.()}
</div>
