<!-- <<tobeeditedbyhumanlater>> Temporary placeholder for @valiantlynx/svelte-rich-text -->
<script>
	let { content = '', editable = false, onsave = () => {} } = $props();
	
	export function getData() {
		return content;
	}
</script>

<div class="prose max-w-none">
	{#if editable}
		<div contenteditable="true" class="border p-4 rounded">
			{@html content}
		</div>
		<button class="btn btn-primary mt-4" onclick={() => onsave(content)}>Save</button>
	{:else}
		{@html content}
	{/if}
</div>
