<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		checked?: boolean;
		trigger?: Snippet;
		heading?: Snippet;
		actions?: Snippet;
	}

	let { label, checked = $bindable(false), trigger, heading, actions }: Props = $props();
</script>

<label for={label} class="cursor-pointer">
	{@render trigger?.()}
</label>

<input type="checkbox" id={label} class="modal-toggle" bind:checked />
<div class="modal" role="dialog">
	<div class="modal-box">
		{@render heading?.()}
		<div class="modal-action">
			{@render actions?.()}
		</div>
	</div>
	<label class="modal-backdrop" for={label}>Close</label>
</div>
