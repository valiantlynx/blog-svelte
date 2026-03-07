<script lang="ts">
	interface Props {
		open?: boolean;
		align?: 'left' | 'right' | 'center';
		class?: string;
	}

	let { open = false, align = 'left', class: className = '' }: Props = $props();

	let dropdownRef: HTMLDivElement;
	let triggerRef: HTMLElement;

	function handleClickOutside(e: MouseEvent) {
		if (
			dropdownRef &&
			!dropdownRef.contains(e.target as Node) &&
			!triggerRef?.contains(e.target as Node)
		) {
			open = false;
		}
	}

	function handleEscapeKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			open = false;
		}
	}

	const alignClasses = {
		left: 'left-0',
		right: 'right-0',
		center: 'left-1/2 -translate-x-1/2'
	};
</script>

<svelte:document onclick={handleClickOutside} onkeydown={handleEscapeKey} />

<div class={`relative inline-block ${className}`}>
	<div bind:this={triggerRef} onclick={() => (open = !open)}>
		<slot name="trigger" />
	</div>

	{#if open}
		<div
			bind:this={dropdownRef}
			class={`
				absolute top-full mt-2 min-w-max
				bg-[var(--base-100)]
				border border-[var(--border)]
				rounded-lg
				shadow-lg
				z-50
				${alignClasses[align]}
			`}
		>
			<slot />
		</div>
	{/if}
</div>
