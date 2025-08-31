<script lang="ts">
	import { gsap } from 'gsap';
	import { SplitText } from 'gsap/SplitText';
	import SnakeGame from '$lib/components/SnakeGame.svelte';
	import { onDestroy, onMount } from 'svelte';

	const githubLink = 'https://github.com/Denyl911/portfolio';

	gsap.registerPlugin(SplitText);
	let tl: gsap.core.Timeline;
	let split: globalThis.SplitText;
	let linkSpl: globalThis.SplitText;
	onMount(() => {
		tl = gsap.timeline();
		split = SplitText.create('.anim', {
			type: 'words'
		});
		linkSpl = SplitText.create('#ghlink', { type: 'chars' });
		tl.from(
			split.words,
			{
				y: -100,
				opacity: 0,
				rotation: 'random(-80, 80)',
				duration: 0.7,
				ease: 'back',
				stagger: 0.15
			},
			0
		);

		tl.from(
			'#game',
			{
				y: -100,
				opacity: 0.5,
				rotation: 30,
				duration: 0.8
			},
			0
		);
		tl.from(
			linkSpl.chars,
			{
				x: -100,
				opacity: 0,
				ease: 'back',
				duration: 0.5,
				stagger: 0.02
			},
			0.1
		);
	});
	onDestroy(() => {
		split && split.revert();
		linkSpl && linkSpl.revert();
		tl && tl.revert();
	});
</script>

<div
	class="container mx-auto flex flex-grow flex-col items-center justify-center px-6 py-10 md:px-10 md:py-20 lg:flex-row lg:justify-between lg:px-16"
>
	<div class="py-40 text-center lg:w-1/2 lg:py-0 lg:text-left" data-interactive-cursor="text">
		<p class="text-c-white text-lg">Hi all. I am</p>
		<h1
			id="name"
			class="text-c-white anim my-2 text-5xl font-bold md:text-5xl"
			data-interactive-cursor="mixblend"
		>
			Denilson De La Rosa
		</h1>
		<p class="anim text-2xl font-medium text-[#4D5BCE]" data-interactive-cursor="code">
			> Full-Stack developer
		</p>

		<div class="text-midnight mt-10 text-left text-sm">
			<p class="mb-1">// complete the game to continue</p>
			<p class="mb-1">// find this portfolio on Github:</p>
			<div class="inline-block rounded-md bg-[#011221] p-3" data-interactive-cursor="code">
				<span class="text-[#4D5BCE]">const</span> <span class="text-[#43D9AD]">githubLink</span>
				=
				<a
					href={githubLink}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#E99287]"
					id="ghlink">"{githubLink}"</a
				>;
			</div>
		</div>
	</div>

	<div id="game">
		<SnakeGame />
	</div>
</div>
