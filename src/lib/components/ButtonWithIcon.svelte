<script>
	let { icon = undefined, label = undefined, onclick = () => {}, children = undefined, ...rest } = $props();
</script>

<button {onclick} class="btn btn-sm gap-2" {...rest}>
	{#if icon}
		{@render icon()}
	{/if}
	{#if children}
		{@render children()}
	{:else if label}
		{label}
	{/if}
</button>
