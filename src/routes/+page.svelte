<script lang="ts">
import {
	SiBun,
	SiReact,
	SiSvelte,
	SiTailwindcss,
	SiTypescript,
} from '@icons-pack/svelte-simple-icons';
import { gsap } from 'gsap';
import { onMount } from 'svelte';
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import BlurText from '$lib/components/bits/BlurText.svelte';
import DecryptedText from '$lib/components/bits/DecryptedText.svelte';
import ElectricBorder from '$lib/components/bits/ElectricBorder.svelte';
import FaultyTerminal from '$lib/components/bits/FaultyTerminal.svelte';
import TextType from '$lib/components/bits/TextType.svelte';
import SnakeGame from '$lib/components/SnakeGame.svelte';

const githubLink = 'https://github.com/Denyl911/portfolio';

const techs = [
	{
		href: 'https://www.typescriptlang.org/',
		hover: 'hover:text-[#3178C6]',
		Icon: SiTypescript,
		label: 'TypeScript',
	},
	{
		href: 'https://bun.sh/',
		hover: 'hover:text-[#FFFFFF]',
		Icon: SiBun,
		label: 'Bun',
	},
	{
		href: 'https://svelte.dev/',
		hover: 'hover:text-[#FF3E00]',
		Icon: SiSvelte,
		label: 'Svelte',
	},
	{
		href: 'https://react.dev/',
		hover: 'hover:text-[#61DAFB]',
		Icon: SiReact,
		label: 'React',
	},
	{
		href: 'https://tailwindcss.com/',
		hover: 'hover:text-[#06B6D4]',
		Icon: SiTailwindcss,
		label: 'Tailwind',
	},
];

onMount(() => {
	gsap.from('#game', {
		opacity: 0,
		scale: 0.8,
		duration: 1,
		ease: 'back.out(1.7)',
	});
});
</script>

<div
	class="relative flex w-full flex-grow flex-col overflow-hidden bg-gradient-to-br from-[#012133] to-[#001526]"
>
	<div class="absolute inset-0 z-0">
		<FaultyTerminal
			scale={2}
			digitSize={1.2}
			timeScale={0.5}
			scanlineIntensity={0.3}
			curvature={0.3}
			tint="#1a5fb4"
			mouseReact={true}
			mouseStrength={0.5}
			pageLoadAnimation={true}
			noiseAmp={1}
			brightness={0.6}
		/>
	</div>
	<!-- <Particles class="absolute inset-0 z-0" /> -->
	<div
		class="relative z-10 mx-auto flex w-full max-w-5/6 flex-grow flex-col items-center justify-center  lg:flex-row lg:justify-between"
	>
		<div
			class="py-40 text-center lg:w-1/2 lg:py-0 lg:text-left"
			data-interactive-cursor="text"
		>
			<p class="text-c-white text-lg">{$_('hello')}. {$_('iAm')}</p>
			<div id="name" data-interactive-cursor="mixblend">
				<BlurText
					text="Denilson De La Rosa"
					delay={100}
					animateBy="words"
					class="my-2 justify-center text-5xl font-bold text-[#fea55f] md:text-5xl lg:justify-start"
				/>
			</div>
			<div class="mt-1 lg:mx-0 text-2xl font-medium text-[#43d9ad]">
				<span data-interactive-cursor="code"> &gt; </span>
				<TextType
					text={[$_('fullStackDeveloper'), $_('degree'), $_('phrase')]}
					typingSpeed={75}
					pauseDuration={2700}
					deletingSpeed={50}
					showCursor={true}
					cursorCharacter="█"
					cursorBlinkDuration={0.5}
				/>
			</div>

			<div
				class="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
				aria-hidden="true"
			>
				<div
					class="marquee-track flex w-max items-center gap-8 pr-8 text-gray-400"
				>
					{#each techs as t (t.label)}
						<span class="flex items-center gap-2 text-sm"
							><t.Icon size={18} />{t.label}</span
						>
					{/each}
					{#each techs as t ('loop-' + t.label)}
						<span class="flex items-center gap-2 text-sm"
							><t.Icon size={18} />{t.label}</span
						>
					{/each}
				</div>
			</div>

			<div
				class="text-midnight mt-10 rounded-md bg-[#011221] p-3 text-left text-sm"
			>
				<p class="mb-1">{$_('completeTheGame')}</p>
				<p class="mb-1">{$_('findOnGithub')}</p>
				<div
					class="inline-block rounded-md bg-[#011221] p-3"
					data-interactive-cursor="code"
				>
					<span class="text-[#4D5BCE]">const</span>
					<span class="text-[#43D9AD]">githubLink</span>
					=
					<a
						href={githubLink}
						target="_blank"
						rel="noopener noreferrer"
						class="text-[#E99287]"
						id="ghlink"
						>"<DecryptedText
							text={githubLink}
							animateOn="view"
							speed={40}
						/>"</a
					>;
				</div>
			</div>
			<div class="mt-10 inline-block">
				<ElectricBorder color="#ffb86a" borderRadius={8} speed={0.6}>
					<a
						href="/projects"
						class="block rounded-md bg-gradient-to-r from-[#ffb86a] to-[#FEA55F] px-6 py-3 text-[#020618] transition-all duration-300 hover:from-[#FEA55F] hover:to-[#ffb86a]"
						data-interactive-cursor="navitem"
					>
						{$_('viewProjects')}
					</a>
				</ElectricBorder>
			</div>
		</div>

		<div id="game" class="relative z-10">
			<SnakeGame />
		</div>
	</div>
</div>

<style>
.marquee-track {
	animation: marquee 24s linear infinite;
}
.marquee-track:hover {
	animation-play-state: paused;
}
@keyframes marquee {
	to {
		transform: translateX(-50%);
	}
}
@media (prefers-reduced-motion: reduce) {
	.marquee-track {
		animation: none;
	}
}
</style>
