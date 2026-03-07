<!-- <<tobeeditedbyhumanlater>> Temporary placeholder for @valiantlynx/svelte-rich-text -->
<script>
	import { Button } from '$lib/components/ui/button';
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
		<Button variant="primary" class="mt-4" onclick={() => onsave(content)}>Save</Button>
	{:else}
		{@html content}
	{/if}
</div>
