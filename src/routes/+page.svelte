<script lang="ts">
	import {
		SiBun,
		SiReact,
		SiSvelte,
		SiTailwindcss,
		SiTypescript,
	} from '@icons-pack/svelte-simple-icons';
	import { gsap } from 'gsap';
	import { SplitText } from "gsap/dist/SplitText";
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import SnakeGame from '$lib/components/SnakeGame.svelte';

	gsap.registerPlugin(SplitText);

	const githubLink = 'https://github.com/Denyl911/portfolio';

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
		split?.revert();
		linkSpl?.revert();
		tl?.revert();
	});
</script>

<div
	class="container mx-auto flex flex-grow flex-col items-center justify-center px-6 py-10 md:px-10 md:py-20 lg:flex-row lg:justify-between lg:px-16 bg-gradient-to-br from-[#011627] to-[#0a2442]"
>
	<div class="py-40 text-center lg:w-1/2 lg:py-0 lg:text-left" data-interactive-cursor="text">
		<p class="text-c-white text-lg">{$_('hello')}. {$_('iAm')}</p>
		<h1
			id="name"
			class="text-c-white anim my-2 text-5xl font-bold md:text-5xl"
			data-interactive-cursor="mixblend"
		>
			Denilson De La Rosa
		</h1>
		<p class="anim text-2xl font-medium text-[#4D5BCE]" data-interactive-cursor="code">
			> {$_('fullStackDeveloper')}
		</p>
		<div class="mt-4 flex justify-center space-x-4 lg:justify-start text-gray-400">
			<a
				href="https://www.typescriptlang.org/"
				target="_blank"
				rel="noopener noreferrer"
				class="transition-all duration-300 hover:scale-110 hover:text-[#3178C6]"
				data-interactive-cursor="navitem"
			>
				<SiTypescript size={24}  />
			</a>
			<a
				href="https://bun.sh/"
				target="_blank"
				rel="noopener noreferrer"
				class="transition-all duration-300 hover:scale-110 hover:text-[#FFFFFF]"
				data-interactive-cursor="navitem"
			>
				<SiBun size={24} />
			</a>
			<a
				href="https://svelte.dev/"
				target="_blank"
				rel="noopener noreferrer"
				class="transition-all duration-300 hover:scale-110 hover:text-[#FF3E00]"
				data-interactive-cursor="navitem"
			>
				<SiSvelte size={24} />
			</a>
			<a
				href="https://react.dev/"
				target="_blank"
				rel="noopener noreferrer"
				class="transition-all duration-300 hover:scale-110 hover:text-[#61DAFB]"
				data-interactive-cursor="navitem"
			>
				<SiReact size={24} />
			</a>
			<a
				href="https://tailwindcss.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="transition-all duration-300 hover:scale-110 hover:text-[#06B6D4]"
				data-interactive-cursor="navitem"
			>
				<SiTailwindcss size={24}  />
			</a>


		</div>

		<div class="text-midnight mt-10 text-left text-sm bg-[#011221] p-3 rounded-md">
			<p class="mb-1">{$_('completeTheGame')}</p>
			<p class="mb-1">{$_('findOnGithub')}</p>
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
		<div class="mt-8">
			<a
				href="/projects"
				class="relative inline-block overflow-hidden rounded-md bg-gradient-to-r from-[#4D5BCE] to-[#3A49A5] px-6 py-3 text-white transition-all duration-300 hover:from-[#3A49A5] hover:to-[#4D5BCE] group"
				data-interactive-cursor="btn"
			>
				<span class="relative z-10">{$_('viewProjects')}</span>
				<span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
			</a>
		</div>
	</div>

	<div id="game">
		<SnakeGame />
	</div>
</div>
