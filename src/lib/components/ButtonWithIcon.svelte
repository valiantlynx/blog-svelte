<script>
	import { Button } from '$lib/components/ui/button';
	let {
		icon = undefined,
		label = undefined,
		onclick = () => {},
		children = undefined,
		...rest
	} = $props();
</script>

<Button {onclick} size="sm" class="gap-2" {...rest}>
	{#if icon}
		{@render icon()}
	{/if}
	{#if children}
		{@render children()}
	{:else if label}
		{label}
	{/if}
</Button>
