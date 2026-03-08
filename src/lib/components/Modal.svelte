<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		heading?: Snippet;
		actions?: Snippet;
		children?: Snippet;
	}

	let { open = $bindable(false), heading, actions, children }: Props = $props();
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 bg-black bg-opacity-50 z-40" onclick={() => (open = false)}></div>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
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
