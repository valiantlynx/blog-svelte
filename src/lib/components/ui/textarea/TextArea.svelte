<script lang="ts">
	interface Props {
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		error?: boolean;
		required?: boolean;
		rows?: number;
		class?: string;
		autoResize?: boolean;
		[key: string]: any;
	}

	let {
		placeholder = '',
		value = '',
		disabled = false,
		error = false,
		required = false,
		rows = 4,
		class: className = '',
		autoResize = true,
		...rest
	}: Props = $props();

	let textareaElement: HTMLTextAreaElement;

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		value = target.value;

		if (autoResize) {
			target.style.height = 'auto';
			target.style.height = `${target.scrollHeight}px`;
		}
	}

	const baseClasses =
		'w-full px-4 py-2 rounded-lg border-2 transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-none';

	const borderClasses = $derived(
		error
			? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]'
			: 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]'
	);

	const bgClasses = 'bg-[var(--base-100)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]';

	const textareaClasses = $derived(`${baseClasses} ${borderClasses} ${bgClasses} ${className}`);
</script>

<textarea
	bind:this={textareaElement}
	{placeholder}
	{rows}
	{disabled}
	{required}
	class={textareaClasses}
	aria-invalid={error}
	oninput={handleInput}
	{...rest}
	value={value ?? ''}
/>
