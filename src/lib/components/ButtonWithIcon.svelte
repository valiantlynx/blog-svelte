<!-- <<tobeeditedbyhumanlater>> Temporary placeholder for @valiantlynx/svelte-ui ButtonWithIcon -->
<script>
	let { icon, label, onclick = () => {}, children, ...rest } = $props();
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
