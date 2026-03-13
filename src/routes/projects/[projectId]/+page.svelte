<script lang="ts">
	import { getImageURL } from '$lib/utils/api';
	let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8 md:py-12 text-base-content">
	<div class="max-w-4xl mx-auto">
		<!-- Project Header -->
		<div class="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
			<div class="flex-shrink-0">
				<div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg bg-base-200">
					<img
						src={data.project?.thumbnail
							? getImageURL(data.project.collectionId, data.project.id, data.project.thumbnail)
							: `https://via.placeholder.com/200/4506CB/FFFFFF/?text=${data.project.name}`}
						alt="project thumbnail"
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
			<div class="flex-1 min-w-0">
				<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
					{data.project.name}
				</h1>
				<p class="text-lg md:text-xl font-light text-base-content/70 mb-4">{data.project.tagline}</p>
				<p class="text-base-content/80 leading-relaxed">{data.project.description}</p>
			</div>
		</div>
	</div>
</div>
