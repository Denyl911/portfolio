<script lang="ts">
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let cards: HTMLElement[] = $state([]);

	// Ensure cards array is properly sized
	$effect(() => {
		if (data.posts && cards.length !== data.posts.length) {
			cards = new Array(data.posts.length).fill(null);
		}
	});

	onMount(() => {
		console.log('Cards array:', cards);
		if (cards.length > 0) {
			gsap.from(cards, {
				y: 50,
				opacity: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: 'power2.out'
			});
		}
	});
</script>

<svelte:head>
	<title>Blog - {$_('siteTitle')}</title>
</svelte:head>

<div
	class="text-cwhite relative flex-grow bg-gradient-to-br from-[#011627] to-[#0a2442]"
>
	<!-- Particles background -->
	<div class="absolute inset-0 z-0">
		<div class="particles-container">
			{#each Array(30) as _, i}
				<div
					class="particle"
					style="left: {Math.random() * 100}%; top: {Math.random() *
						100}%; animation-delay: {Math.random() * 10}s;"
				></div>
			{/each}
		</div>
	</div>

	<div class="relative z-10 container mx-auto flex-grow px-4 py-16">
		<h1
			class="mb-12 text-cyan-400 text-center text-5xl font-bold"
		>
			Blog
		</h1>
		<div class="grid flex-grow gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each data.posts as post, i}
				<a
					bind:this={cards[i]}
					href="/blog/{post.slug}"
					class="group hover:shadow-3xl block overflow-hidden rounded-xl border border-white/20 bg-black/20 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:scale-105"
					data-interactive-cursor="card"
				>
					{#if post.image}
						<div class="aspect-video overflow-hidden">
							<img
								src={post.image}
								alt={post.title}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
								loading="lazy"
							/>
						</div>
					{/if}
					<div class="p-6">
						<h2 class="mb-2 text-xl font-semibold transition-colors group-hover:text-cyan-400">
							{post.title}
						</h2>
						<p class="mb-3 text-sm text-gray-400">{post.date}</p>
						<p class="leading-relaxed text-gray-300">{post.excerpt}</p>
						<div
							class="mt-4 flex items-center text-cyan-400 transition-colors group-hover:text-cyan-300"
						>
							<span class="text-sm font-medium">Read more</span>
							<svg
								class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								></path>
							</svg>
						</div>
					</div>
				</a>
			{/each}
		</div>
		{#if data.posts.length === 0}
			<div class="py-16 text-center">
				<p class="text-lg text-gray-400">No posts yet. Check back soon!</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.particles-container {
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.particle {
		position: absolute;
		width: 2px;
		height: 2px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		animation: float 10s infinite linear;
	}

	@keyframes float {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateY(-100vh) rotate(360deg);
			opacity: 0;
		}
	}
</style>
