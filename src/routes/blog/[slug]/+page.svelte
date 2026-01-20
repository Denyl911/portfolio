<script lang="ts">
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let article: HTMLElement;
	let image: HTMLElement | undefined = $state();
	let content: HTMLElement;

	onMount(() => {
		const tl = gsap.timeline();
		if (image) {
			tl.from(image, { scale: 1.1, opacity: 0, duration: 1, ease: 'power2.out' })
		}
		tl.from(article, { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, image ? '-=0.5' : 0)
		  .from(content, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
	});
</script>

<svelte:head>
	<title>{data.post.title} - Blog - {$_('siteTitle')}</title>
</svelte:head>

<div class="text-cwhite relative flex-grow bg-gradient-to-br from-[#011627] to-[#0a2442]">
	<!-- Particles background -->
	<div class="absolute inset-0 z-0">
		<div class="particles-container">
			{#each Array(20) as _, i}
				<div
					class="particle"
					style="left: {Math.random() * 100}%; top: {Math.random() * 100}%; animation-delay: {Math.random() * 10}s;"
				></div>
			{/each}
		</div>
	</div>

	<div class="container mx-auto flex-grow px-4 py-16 relative z-10">
		<a
			href="/blog"
			class="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors group"
			data-interactive-cursor="navitem"
		>
			<svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
			</svg>
			Back to _blog
		</a>

		{#if data.post.image}
			<div bind:this={image} class="mb-8 rounded-xl overflow-hidden shadow-2xl">
				<img
					src="{data.post.image}"
					alt="{data.post.title}"
					class="w-full h-64 md:h-96 object-cover"
				/>
			</div>
		{/if}

		<article bind:this={article} class="bg-black/20 backdrop-blur-lg border border-white/20 rounded-xl p-8 md:p-12 shadow-2xl overflow-auto">
			<header class="mb-8">
				<h1 class="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">
					{data.post.title}
				</h1>
				<p class="text-gray-400 text-lg">{data.post.date}</p>
			</header>

			<div
				bind:this={content}
				class="prose prose-lg prose-invert max-w-none prose-headings:text-cyan-300 prose-p:text-gray-300 prose-a:text-cyan-400 prose-a:hover:text-cyan-300 prose-strong:text-cwhite prose-code:text-yellow-400 prose-pre:bg-[#011221] prose-pre:border prose-pre:border-cyan-500/30"
			>
				{@html data.post.content}
			</div>
		</article>
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
		width: 1px;
		height: 1px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 50%;
		animation: float 15s infinite linear;
	}

	@keyframes float {
		0% { transform: translateY(0) rotate(0deg); opacity: 0; }
		10% { opacity: 0.5; }
		90% { opacity: 0.5; }
		100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
	}
</style>