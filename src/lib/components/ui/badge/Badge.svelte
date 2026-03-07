<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { variant = 'primary', size = 'md', class: className = '' }: Props = $props();

	const variantClasses: Record<string, string> = {
		primary: 'bg-[var(--primary)] text-[var(--primary-content)]',
		secondary: 'bg-[var(--secondary)] text-[var(--secondary-content)]',
		success: 'bg-[var(--success)] text-[var(--success-content)]',
		warning: 'bg-[var(--warning)] text-[var(--warning-content)]',
		error: 'bg-[var(--error)] text-[var(--error-content)]',
		info: 'bg-[var(--info)] text-[var(--info-content)]'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-2 py-1 text-xs font-medium',
		md: 'px-3 py-1.5 text-sm font-medium',
		lg: 'px-4 py-2 text-base font-medium'
	};

	const badgeClasses = `inline-flex items-center justify-center rounded-full font-semibold transition-all ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
</script>

<span class={badgeClasses}>
	<slot />
</span>
