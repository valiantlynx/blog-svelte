<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { TextArea } from '$lib/components/ui/textarea';
	import { Badge } from '$lib/components/ui/badge';
	import { Loading } from '$lib/components/ui/loading';
	import { Divider } from '$lib/components/ui/divider';
	import { FileInput } from '$lib/components/ui/file-input';
	import { themes } from '$lib/components/ui/styles/themes';

	let currentTheme = $state('default-light');
	let inputValue = $state('');
	let textareaValue = $state('');

	function setTheme(themeId: string) {
		currentTheme = themeId;
		document.documentElement.setAttribute('data-theme', themeId);
		localStorage.setItem('theme', themeId);
	}

	$effect(() => {
		document.documentElement.setAttribute('data-theme', currentTheme);
	});
</script>

<svelte:head>
	<title>Components Demo</title>
</svelte:head>

<div class="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-4xl font-bold mb-8">UI Components Demo</h1>

		<div class="mb-12">
			<h2 class="text-2xl font-bold mb-4">Themes</h2>
			<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
				{#each themes as theme (theme.id)}
					<Button
						variant={currentTheme === theme.id ? 'primary' : 'outline'}
						size="sm"
						onclick={() => setTheme(theme.id)}
						class="w-full"
					>
						{theme.label}
					</Button>
				{/each}
			</div>
		</div>

		<Divider label="Buttons" class="my-8" />

		<div class="space-y-8">
			<div>
				<h3 class="text-lg font-semibold mb-4">Variants:</h3>
				<div class="flex flex-wrap gap-4">
					<Button variant="primary">Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="destructive">Destructive</Button>
				</div>
			</div>

			<div>
				<h3 class="text-lg font-semibold mb-4">Sizes:</h3>
				<div class="flex flex-wrap gap-4">
					<Button size="sm" variant="primary">Small</Button>
					<Button size="md" variant="primary">Medium</Button>
					<Button size="lg" variant="primary">Large</Button>
					<Button size="icon" variant="primary">→</Button>
				</div>
			</div>

			<div>
				<h3 class="text-lg font-semibold mb-4">States:</h3>
				<div class="flex flex-wrap gap-4">
					<Button disabled>Disabled</Button>
					<Button loading>Loading</Button>
				</div>
			</div>
		</div>

		<Divider label="Form Elements" class="my-8" />

		<div class="space-y-6">
			<div>
				<label class="block text-sm font-medium mb-2">Input:</label>
				<Input placeholder="Enter text..." bind:value={inputValue} />
			</div>

			<div>
				<label class="block text-sm font-medium mb-2">Textarea:</label>
				<TextArea placeholder="Enter message..." bind:value={textareaValue} />
			</div>

			<div>
				<label class="block text-sm font-medium mb-2">File Input:</label>
				<FileInput accept=".pdf,.doc" />
			</div>
		</div>

		<Divider label="Badges" class="my-8" />

		<div class="space-y-4">
			<div class="flex flex-wrap gap-2">
				<Badge variant="primary">Primary</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="success">Success</Badge>
				<Badge variant="warning">Warning</Badge>
				<Badge variant="error">Error</Badge>
			</div>
		</div>

		<Divider label="Loading" class="my-8" />

		<div class="flex gap-8">
			<Loading size="sm" />
			<Loading size="md" />
			<Loading size="lg" />
		</div>
	</div>
</div>
