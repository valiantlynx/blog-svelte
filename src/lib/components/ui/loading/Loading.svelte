<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		label?: string;
		class?: string;
	}

	let { size = 'md', label, class: className = '' }: Props = $props();

	const sizeClasses: Record<string, string> = {
		sm: 'w-4 h-4 border-2',
		md: 'w-8 h-8 border-2',
		lg: 'w-12 h-12 border-3'
	};

	const containerClasses: Record<string, string> = {
		sm: 'gap-2',
		md: 'gap-3',
		lg: 'gap-4'
	};
</script>

<div class={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
	<div
		class={`
			${sizeClasses[size]}
			border-[var(--primary)]
			border-r-transparent
			rounded-full
			animate-spin
		`}
		role="status"
		aria-label={label || 'Loading'}
	></div>
	{#if label}
		<p class="text-[var(--muted-foreground)] text-sm">{label}</p>
	{/if}
</div>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	:global(.animate-spin) {
		animation: spin 1s linear infinite;
	}
</style>
