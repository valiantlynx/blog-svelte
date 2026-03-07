<script lang="ts">
	let { label, checked, trigger, heading, children, actions } = $props();
</script>

<label for={label}>
	{@render trigger?.()}
</label>

<input type="checkbox" id={label} class="hidden" bind:checked />
{#if checked}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-40" onclick={() => (checked = false)}></div>

	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			class="bg-[var(--base-100)] rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[var(--border)]"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="border-b border-[var(--border)] p-6">
				<div class="font-bold text-xl text-center">
					{@render heading?.()}
				</div>
			</div>
			<div class="p-6 my-2">
				{@render children?.()}
			</div>
			<div class="border-t border-[var(--border)] p-6 flex justify-center gap-2">
				{@render actions?.()}
			</div>
		</div>
	</div>
{/if}
