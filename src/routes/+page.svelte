<script lang="ts">
	import {
		SiBun,
		SiReact,
		SiSvelte,
		SiTailwindcss,
		SiTypescript
	} from '@icons-pack/svelte-simple-icons';
	import { gsap } from 'gsap';
	import { SplitText } from 'gsap/dist/SplitText';
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import Particles from '$lib/components/Particles.svelte';
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
				scale: 0.8,
				duration: 0.7,
				ease: 'back',
				stagger: 0.1
			},
			0
		);

		tl.from(
			'#game',
			{
				opacity: 0,
				scale: 0.8,
				duration: 1,
				ease: 'back.out(1.7)'
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
	class="container mx-auto flex flex-grow flex-col items-center justify-center bg-gradient-to-br from-[#011627] to-[#0a2442] px-6 py-10 md:px-10 md:py-20 lg:flex-row lg:justify-between lg:px-16"
>
	<Particles class="absolute inset-0 z-0" />
	<div
		class="relative z-10 py-40 text-center lg:w-1/2 lg:py-0 lg:text-left"
		data-interactive-cursor="text"
	>
		<p class="text-c-white text-lg">{$_('hello')}. {$_('iAm')}</p>
		<h1
			id="name"
			class="anim my-2 text-5xl font-bold text-[#ffb86a] md:text-5xl"
			data-interactive-cursor="mixblend"
		>
			Denilson De La Rosa
		</h1>
		<p
			class="anim bg-gradient-to-r from-[#4d5bce] to-[#6a7bff] bg-clip-text text-2xl font-medium text-transparent"
			data-interactive-cursor="code"
		>
			> {$_('fullStackDeveloper')}
		</p>
		<div class="mt-4 flex justify-center space-x-4 text-gray-400 lg:justify-start">
			<a
				href="https://www.typescriptlang.org/"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-[#3178C6]"
				data-interactive-cursor="navitem"
				on:mouseenter={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 12,
						scale: 1.1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
				on:mouseleave={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 0,
						scale: 1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
			>
				<SiTypescript size={24} />
			</a>
			<a
				href="https://bun.sh/"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-[#FFFFFF]"
				data-interactive-cursor="navitem"
				on:mouseenter={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 12,
						scale: 1.1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
				on:mouseleave={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 0,
						scale: 1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
			>
				<SiBun size={24} />
			</a>
			<a
				href="https://svelte.dev/"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-[#FF3E00]"
				data-interactive-cursor="navitem"
				on:mouseenter={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 12,
						scale: 1.1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
				on:mouseleave={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 0,
						scale: 1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
			>
				<SiSvelte size={24} />
			</a>
			<a
				href="https://react.dev/"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-[#61DAFB]"
				data-interactive-cursor="navitem"
				on:mouseenter={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 12,
						scale: 1.1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
				on:mouseleave={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 0,
						scale: 1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
			>
				<SiReact size={24} />
			</a>
			<a
				href="https://tailwindcss.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-[#06B6D4]"
				data-interactive-cursor="navitem"
				on:mouseenter={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 12,
						scale: 1.1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
				on:mouseleave={(e) =>
					gsap.to(e.currentTarget, {
						rotationY: 0,
						scale: 1,
						duration: 0.3,
						ease: 'power2.out',
						transformOrigin: 'center center'
					})}
			>
				<SiTailwindcss size={24} />
			</a>
		</div>

		<div class="text-midnight mt-10 rounded-md bg-[#011221] p-3 text-left text-sm">
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
				class="group relative inline-block overflow-hidden rounded-md bg-gradient-to-r from-[#ffb86a] to-[#FEA55F] px-6 py-3 text-[#020618] transition-all duration-300 hover:from-[#FEA55F] hover:to-[#ffb86a]"
				data-interactive-cursor="btn"
			>
				<span class="relative z-10">{$_('viewProjects')}</span>
				<span
					class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				></span>
			</a>
		</div>
	</div>

	<div id="game" class="relative z-10">
		<SnakeGame />
	</div>
</div>
