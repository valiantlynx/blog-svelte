<script lang="ts">
	interface Props {
		type?: string;
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		error?: boolean;
		required?: boolean;
		class?: string;
		[key: string]: any;
	}

	let {
		type = 'text',
		placeholder = '',
		value = '',
		disabled = false,
		error = false,
		required = false,
		class: className = '',
		...rest
	}: Props = $props();

	const baseClasses =
		'w-full px-4 py-2 rounded-lg border-2 transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

	const borderClasses = $derived(
		error
			? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]'
			: 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]'
	);

	const bgClasses =
		'bg-[var(--base-100)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]';

	const inputClasses = $derived(`${baseClasses} ${borderClasses} ${bgClasses} ${className}`);
</script>

<input
	{type}
	{placeholder}
	bind:value
	{disabled}
	{required}
	class={inputClasses}
	aria-invalid={error}
	{...rest}
/>
