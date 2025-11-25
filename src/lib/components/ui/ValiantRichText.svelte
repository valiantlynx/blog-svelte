<script lang="ts">
	import { marked } from 'marked';

	interface Props {
		initialData?: any;
		viewMode?: boolean;
	}

	let { initialData, viewMode = false }: Props = $props();

	// Store the data in a module-level variable for getData
	let currentData = $state(initialData);

	// Render blocks as HTML
	function renderBlocks(blocks: any[]): string {
		if (!blocks || !Array.isArray(blocks)) return '';
		
		return blocks.map(block => {
			if (!block || !block.type) return '';
			
			switch (block.type) {
				case 'header':
					const level = block.data?.level || 1;
					return `<h${level}>${block.data?.text || ''}</h${level}>`;
				case 'paragraph':
					return `<p>${block.data?.text || ''}</p>`;
				case 'list':
					const listTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
					const items = (block.data?.items || []).map((item: string) => `<li>${item}</li>`).join('');
					return `<${listTag}>${items}</${listTag}>`;
				case 'image':
					return `<figure><img src="${block.data?.file?.url || block.data?.url || ''}" alt="${block.data?.caption || ''}" class="w-full rounded-lg" />${block.data?.caption ? `<figcaption class="text-center text-sm mt-2">${block.data.caption}</figcaption>` : ''}</figure>`;
				case 'code':
					return `<pre class="bg-base-200 p-4 rounded-lg overflow-x-auto"><code>${block.data?.code || ''}</code></pre>`;
				case 'quote':
					return `<blockquote class="border-l-4 border-primary pl-4 italic">${block.data?.text || ''}</blockquote>`;
				case 'delimiter':
					return '<hr class="my-8" />';
				case 'embed':
					return `<div class="embed-responsive">${block.data?.embed || ''}</div>`;
				case 'table':
					const rows = (block.data?.content || []).map((row: string[]) => 
						`<tr>${row.map(cell => `<td class="border px-4 py-2">${cell}</td>`).join('')}</tr>`
					).join('');
					return `<table class="table w-full">${rows}</table>`;
				default:
					return `<p>${JSON.stringify(block.data)}</p>`;
			}
		}).join('');
	}

	let htmlContent = $derived(renderBlocks(initialData?.blocks || initialData || []));
</script>

{#if viewMode}
	<div class="prose max-w-none">
		{@html htmlContent}
	</div>
{:else}
	<div class="prose max-w-none">
		{@html htmlContent}
	</div>
	<p class="text-sm text-base-content/60 mt-4">
		Note: Editing mode requires full editor support. Content displayed in view-only mode.
	</p>
{/if}
