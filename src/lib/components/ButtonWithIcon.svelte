<!-- <<tobeeditedbyhumanlater>> Temporary placeholder for @valiantlynx/svelte-ui ButtonWithIcon -->
<script>
	let { icon = '', label = '', onclick = () => {}, ...rest } = $props();
</script>

<button {onclick} class="btn btn-sm gap-2" {...rest}>
	{#if icon}
		<span>{icon}</span>
	{/if}
	{label}
</button>
