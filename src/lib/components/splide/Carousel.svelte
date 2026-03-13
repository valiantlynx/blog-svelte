<script>
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import '@splidejs/svelte-splide/css';
	import './splide-override.css';
	import { page } from '$app/state';

	const blogs = page.data.blogs;

	// set up placeholder images
	let images = [];
	const url = 'https://picsum.photos/800/450?random=';
	for (let i = 1; i <= 10; i++) {
		images.push(url + i);
	}

	// set up carousel config
	const mainOptions = {
		pagination: true,
		type: 'loop',
		autoplay: true
	};
	const thumbsOptions = {
		arrows: false,
		focus: 'center',
		gap: 5,
		isNavigation: true,
		pagination: false,
		perMove: 1,
		perPage: 4,
		type: 'loop',
		updateOnMove: true
	};

	// sync carousels
	let main = $state();
	let thumbs = $state();
	onMount(() => {
		if (main && thumbs) {
			main.sync(thumbs.splide);
		}
	});
</script>

<div class="gallery">
	<div class="gallery--main">
		<Splide bind:this={main} options={mainOptions}>
			{#each blogs.items as blog (blog.id)}
				<SplideSlide>
					<a
						href="/blogs/{blog?.slug}"
						class="hover:cursor-pointer hover:underline hover:text-secondary"
					>
						<div class="blog-hero">
							<img class="brightness-50" src={blog?.image} alt={blog?.alt} />
							<div
								class=" absolute p-4 md:p-10 bg-secondary text-secondary-content bg-opacity-75 bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 rounded-md"
							>
								<h2 class="text-lg md:text-2xl font-bold text-secondary-content">
									{blog?.title}
								</h2>
								<p class="text-sm font-normal text-secondary-content my-2 md:my-4 line-clamp-2">
									{blog?.summary}
								</p>
								<Button variant="primary">Read More</Button>
							</div>
						</div>
					</a>
				</SplideSlide>
			{/each}
		</Splide>
	</div>

	<div class="gallery--thumbs">
		<Splide id="gallery--thumbs" bind:this={thumbs} options={thumbsOptions}>
			{#each blogs.items as blog (blog.id)}
				<SplideSlide>
					<img src={blog?.image} alt={blog?.alt} />
				</SplideSlide>
			{/each}
		</Splide>
	</div>
</div>

<style>
	.gallery {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		justify-content: center;
		margin: 0 auto;
		max-width: 115rem;
		min-height: 200px;
	}

	.blog-hero {
		position: relative;
	}

	.blog-hero img {
		width: 100%;
		height: 220px;
		object-fit: cover;
	}

	@media (min-width: 640px) {
		.blog-hero img {
			height: 340px;
		}
	}

	@media (min-width: 768px) {
		.blog-hero img {
			height: 420px;
		}
	}

	@media (min-width: 1024px) {
		.blog-hero img {
			height: 520px;
		}
	}
</style>
