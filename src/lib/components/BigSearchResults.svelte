<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { searchQuery } from '$lib/utils/stores';
	interface Props {
		searchResults?: any;
		handleClick: any;
	}

	let { searchResults = [], handleClick }: Props = $props();

	// Helper to get initials from author name
	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	// Array of gradient colors for avatar backgrounds
	const avatarGradients = [
		'from-blue-500 to-cyan-500',
		'from-purple-500 to-pink-500',
		'from-green-500 to-emerald-500',
		'from-orange-500 to-red-500',
		'from-indigo-500 to-purple-500',
		'from-teal-500 to-cyan-500'
	];

	// Get consistent gradient for an author
	function getAvatarGradient(authorName: string): string {
		const hash = authorName.charCodeAt(0) % avatarGradients.length;
		return avatarGradients[hash];
	}
</script>

<ul
	class="bg-base-100 w-full text-base-content rounded-box overflow-y-auto -z-0"
	hidden={$searchQuery === ''}
>
	{#if searchResults.length > 0}
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 w-full p-4"
		>
			{#each searchResults as result}
				<li>
					<button
						onclick={handleClick(result.src)}
						aria-label={'Go to ' + result.title + ' page'}
						class="group block w-full h-full"
					>
						<!-- Card Container -->
						<div
							class="h-full flex flex-col bg-gradient-to-br from-base-200 to-base-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-base-300 hover:border-primary/50"
						>
							<!-- Image Container -->
							<div class="relative w-full h-56 overflow-hidden bg-base-100">
								<img
									src={result.img}
									alt={result.title}
									class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
									style="opacity: 0.9; transition: opacity 0.3s"
								/>
								<!-- Overlay Gradient -->
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
								/>
							</div>

							<!-- Content Container -->
							<div class="flex-1 p-4 flex flex-col justify-between">
								<!-- Title -->
								<div>
									<h3
										class="text-lg font-bold line-clamp-2 text-base-content group-hover:text-primary transition-colors duration-200"
									>
										{result.title}
									</h3>
								</div>

								<!-- Author Section -->
								<div class="flex items-center gap-3 mt-4 pt-3 border-t border-base-content/10">
									<!-- Author Avatar -->
									{#if result.authorAvatar}
										<div class="avatar placeholder flex-shrink-0">
											<div class="w-10 rounded-full ring ring-primary ring-offset-base-100">
												<img src={result.authorAvatar} alt={result.author} class="object-cover" />
											</div>
										</div>
									{:else}
										<div class="avatar placeholder flex-shrink-0">
											<div
												class="w-10 rounded-full ring ring-primary ring-offset-base-100 bg-gradient-to-br {getAvatarGradient(
													result.author
												)} text-white text-sm font-semibold flex items-center justify-center"
											>
												{getInitials(result.author)}
											</div>
										</div>
									{/if}

									<!-- Author Name -->
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium text-base-content truncate">
											{result.author}
										</p>
										<p class="text-xs text-base-content/60">
											{result.slug}
										</p>
									</div>
								</div>
							</div>
						</div>
					</button>
				</li>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<div class="text-5xl mb-4 opacity-50">🔍</div>
			<p class="text-lg font-medium text-base-content/70">
				{m['messages.no_search_results']()}
			</p>
			<p class="text-sm text-base-content/50 mt-2">Try adjusting your search terms</p>
		</div>
	{/if}
</ul>

<style>
	:global(.avatar.placeholder div) {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
