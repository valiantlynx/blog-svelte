<script lang="ts">
	interface Props {
		accept?: string;
		multiple?: boolean;
		disabled?: boolean;
		class?: string;
		[key: string]: any;
	}

	let {
		accept,
		multiple = false,
		disabled = false,
		class: className = '',
		...rest
	}: Props = $props();

	let files: FileList | null = $state(null);
	let dragActive = $state(false);

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragActive = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragActive = false;
		if (e.dataTransfer?.files) {
			files = e.dataTransfer.files;
		}
	}

	const baseClasses =
		'w-full px-4 py-8 rounded-lg border-2 border-dashed transition-colors duration-200 cursor-pointer text-center';

	const dragClasses = dragActive
		? 'border-[var(--primary)] bg-[var(--primary-light)]'
		: 'border-[var(--border)] bg-[var(--base-100)] hover:border-[var(--primary)]';

	const containerClasses = `${baseClasses} ${dragClasses} ${className}`;
</script>

<div
	class={containerClasses}
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	ondragover={(e) => e.preventDefault()}
>
	<label class="cursor-pointer flex flex-col items-center gap-2">
		<svg
			class="w-8 h-8 text-[var(--muted-foreground)]"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
		<div>
			<p class="text-[var(--foreground)] font-medium">
				{#if files}
					{files.length} file(s) selected
				{:else}
					Drop files here or click to select
				{/if}
			</p>
			<p class="text-[var(--muted-foreground)] text-sm">
				{#if accept}
					{accept}
				{:else}
					Any file type
				{/if}
			</p>
		</div>
		<input type="file" {accept} {multiple} {disabled} class="hidden" bind:files {...rest} />
	</label>
</div>
