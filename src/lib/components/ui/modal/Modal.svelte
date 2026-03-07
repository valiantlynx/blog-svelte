<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface Props {
		open?: boolean;
		title?: string;
		class?: string;
		onClose?: () => void;
	}

	let { open = false, title, class: className = '', onClose }: Props = $props();

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget && onClose) {
			onClose();
		}
	}

	function handleEscapeKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open && onClose) {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleEscapeKey} />

{#if open}
	<!-- Backdrop -->
	<div class="fixed inset-0 bg-black bg-opacity-50 z-40" onclick={handleBackdropClick}></div>

	<!-- Modal -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
		<div
			class={`
				bg-[var(--base-100)]
				rounded-lg
				shadow-2xl
				max-w-lg
				w-full
				max-h-[90vh]
				overflow-y-auto
				border border-[var(--border)]
				pointer-events-auto
				${className}
			`}
		>
			{#if title}
				<div class="border-b border-[var(--border)] p-6">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-bold text-[var(--foreground)]">{title}</h2>
						{#if onClose}
							<button
								onclick={onClose}
								class="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
								aria-label="Close modal"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						{/if}
					</div>
				</div>
			{/if}

			<div class="p-6">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body.modal-open) {
		overflow: hidden;
	}
</style>
