<script lang="ts">
	interface Props {
		src?: string;
		alt?: string;
		initials?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
	}

	let { src, alt = '', initials, size = 'md', class: className = '' }: Props = $props();

	const sizeClasses: Record<string, string> = {
		xs: 'w-6 h-6 text-xs',
		sm: 'w-8 h-8 text-sm',
		md: 'w-10 h-10 text-base',
		lg: 'w-12 h-12 text-lg',
		xl: 'w-16 h-16 text-xl'
	};

	const baseClasses = `inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0 ${sizeClasses[size]}`;
	const containerClasses = `${baseClasses} ${className}`;
	const bgClasses = 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]';
	const textClasses = 'text-[var(--primary-content)]';
</script>

<div class={`${containerClasses} ${bgClasses} ${textClasses} overflow-hidden`}>
	{#if src}
		<img {src} {alt} class="w-full h-full object-cover" />
	{:else if initials}
		<span>{initials.slice(0, 2).toUpperCase()}</span>
	{:else}
		<svg
			class="w-full h-full"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
		</svg>
	{/if}
</div>
