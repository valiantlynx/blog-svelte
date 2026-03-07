<script lang="ts">
	interface Props {
		direction?: 'horizontal' | 'vertical';
		label?: string;
		class?: string;
	}

	let { direction = 'horizontal', label, class: className = '' }: Props = $props();
</script>

{#if direction === 'horizontal'}
	{#if label}
		<div class={`flex items-center gap-4 ${className}`}>
			<div class="flex-1 border-t-2 border-[var(--border)]"></div>
			<span class="text-[var(--muted-foreground)] text-sm font-medium px-2">{label}</span>
			<div class="flex-1 border-t-2 border-[var(--border)]"></div>
		</div>
	{:else}
		<div class={`border-t-2 border-[var(--border)] ${className}`}></div>
	{/if}
{:else}
	{#if label}
		<div class={`flex items-center gap-4 h-full ${className}`}>
			<div class="flex-1 border-l-2 border-[var(--border)]"></div>
			<span class="text-[var(--muted-foreground)] text-sm font-medium py-2 rotate-90 whitespace-nowrap">{label}</span>
			<div class="flex-1 border-l-2 border-[var(--border)]"></div>
		</div>
	{:else}
		<div class={`border-l-2 border-[var(--border)] h-full ${className}`}></div>
	{/if}
{/if}
