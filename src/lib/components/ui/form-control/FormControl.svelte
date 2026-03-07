<script lang="ts">
	interface Props {
		label?: string;
		error?: string;
		hint?: string;
		required?: boolean;
		class?: string;
	}

	let { label, error, hint, required = false, class: className = '' }: Props = $props();
</script>

<div class={`space-y-2 ${className}`}>
	{#if label}
		<label class="block text-sm font-medium text-[var(--foreground)]">
			{label}
			{#if required}
				<span class="text-[var(--error)]">*</span>
			{/if}
		</label>
	{/if}

	<slot />

	{#if error}
		<p class="text-xs font-medium text-[var(--error)]">{error}</p>
	{:else if hint}
		<p class="text-xs text-[var(--muted-foreground)]">{hint}</p>
	{/if}
</div>
