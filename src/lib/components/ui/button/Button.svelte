<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
		size?: 'sm' | 'md' | 'lg' | 'icon';
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		href?: string;
		class?: string;
		ariaLabel?: string;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		href,
		class: className = '',
		ariaLabel,
		...rest
	}: Props & Record<string, any> = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses: Record<string, string> = {
		primary:
			'bg-[var(--primary)] text-[var(--primary-content)] hover:bg-[var(--primary-dark)] active:scale-95',
		secondary:
			'bg-[var(--secondary)] text-[var(--secondary-content)] hover:bg-[var(--secondary-dark)] active:scale-95',
		outline:
			'border-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--base-200)] active:scale-95',
		ghost: 'text-[var(--foreground)] hover:bg-[var(--base-200)] active:scale-95',
		destructive: 'bg-[var(--error)] text-[var(--error-content)] hover:bg-red-700 active:scale-95'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-3 py-1.5 text-sm rounded-md',
		md: 'px-4 py-2 text-base rounded-lg',
		lg: 'px-6 py-3 text-lg rounded-lg',
		icon: 'w-10 h-10 p-0 rounded-lg'
	};

	const buttonClasses = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`);
	const isLink = $derived(!!href);
</script>

{#if isLink}
	<a
		href={href}
		class={buttonClasses}
		{...rest}
		aria-label={ariaLabel}
		aria-disabled={disabled}
	>
		{#if loading}
			<span class="inline-flex items-center gap-2">
				<span
					class="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"
				></span>
				<slot />
			</span>
		{:else}
			<slot />
		{/if}
	</a>
{:else}
	<button
		{type}
		{disabled}
		class={buttonClasses}
		{...rest}
		aria-label={ariaLabel}
		aria-busy={loading}
	>
		{#if loading}
			<span class="inline-flex items-center gap-2">
				<span
					class="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"
				></span>
				<slot />
			</span>
		{:else}
			<slot />
		{/if}
	</button>
{/if}

<style>
	:global(button, a) {
		cursor: inherit;
	}
</style>
