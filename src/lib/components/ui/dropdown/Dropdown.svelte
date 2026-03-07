<script lang="ts">
	interface Props {
		open?: boolean;
		align?: 'left' | 'right' | 'center';
		direction?: 'down' | 'up' | 'auto';
		class?: string;
	}

	let { open = false, align = 'left', direction = 'auto', class: className = '' }: Props = $props();

	let dropdownRef: HTMLDivElement;
	let triggerRef: HTMLElement;
	let computedDirection = $state<'up' | 'down'>('down');
	let dropdownPosition = $state<{ top?: string; bottom?: string; left?: string; right?: string }>(
		{}
	);

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

	function detectDirection() {
		if (direction !== 'auto') {
			computedDirection = direction;
			return;
		}

		if (!triggerRef) {
			computedDirection = 'down';
			return;
		}

		const rect = triggerRef.getBoundingClientRect();
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;

		// If less than 200px space below and more space above, go up
		computedDirection = spaceBelow < 200 && spaceAbove > 200 ? 'up' : 'down';
	}

	function calculatePosition() {
		if (!triggerRef) return;

		const rect = triggerRef.getBoundingClientRect();
		const newPosition: typeof dropdownPosition = {};

		// Calculate vertical position
		if (computedDirection === 'down') {
			newPosition.top = `${rect.bottom + 8}px`;
		} else {
			newPosition.bottom = `${window.innerHeight - rect.top + 8}px`;
		}

		// Calculate horizontal position
		if (align === 'right') {
			newPosition.right = `${window.innerWidth - rect.right}px`;
		} else if (align === 'center') {
			newPosition.left = `${rect.left + rect.width / 2}px`;
		} else {
			newPosition.left = `${rect.left}px`;
		}

		dropdownPosition = newPosition;
	}

	$effect(() => {
		if (open) {
			detectDirection();
		}
	});

	$effect(() => {
		if (open) {
			calculatePosition();
			// Recalculate on scroll or resize
			window.addEventListener('scroll', calculatePosition, true);
			window.addEventListener('resize', calculatePosition);

			return () => {
				window.removeEventListener('scroll', calculatePosition, true);
				window.removeEventListener('resize', calculatePosition);
			};
		}
	});

	const alignClasses = {
		left: '',
		right: '',
		center: '-translate-x-1/2'
	};
</script>

<svelte:document onclick={handleClickOutside} onkeydown={handleEscapeKey} />

<div class={`inline-block ${className}`}>
	<div bind:this={triggerRef} onclick={() => (open = !open)}>
		<slot name="trigger" />
	</div>

	{#if open}
		<div
			bind:this={dropdownRef}
			class={`
				fixed min-w-max
				bg-[var(--base-100)]
				border border-[var(--border)]
				rounded-lg
				shadow-lg
				z-50
				${alignClasses[align]}
			`}
			style={`
				top: ${dropdownPosition.top ?? 'auto'};
				bottom: ${dropdownPosition.bottom ?? 'auto'};
				left: ${dropdownPosition.left ?? 'auto'};
				right: ${dropdownPosition.right ?? 'auto'};
			`}
		>
			<slot />
		</div>
	{/if}
</div>
