<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		icon?: Snippet;
	}

	let { children, icon }: Props = $props();
</script>

<button class="btn btn-outline gap-2">
	{@render icon?.()}
	{@render children?.()}
</button>
