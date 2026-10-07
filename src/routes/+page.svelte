<script lang="ts">
import {
	SiBun,
	SiReact,
	SiSvelte,
	SiTailwindcss,
	SiTypescript,
} from '@icons-pack/svelte-simple-icons';
import { onMount } from 'svelte';
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import BlurText from '$lib/components/bits/BlurText.svelte';
import DecryptedText from '$lib/components/bits/DecryptedText.svelte';
import ElectricBorder from '$lib/components/bits/ElectricBorder.svelte';
import TextType from '$lib/components/bits/TextType.svelte';

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

let isMobile = $state(false);
let showBg = $state(false);
let showPhone = $state(false);
let phoneWrap: HTMLElement | undefined = $state();

onMount(() => {
	isMobile =
		window.matchMedia?.('(pointer: coarse), (max-width: 1023px)').matches ??
		false;
	const reduced =
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	if (!reduced) {
		const w = window as unknown as {
			requestIdleCallback?: typeof requestIdleCallback;
		};
		if (typeof w.requestIdleCallback === 'function')
			w.requestIdleCallback(() => (showBg = true), { timeout: 2000 });
		else setTimeout(() => (showBg = true), 800);
	}
	if (!phoneWrap) {
		showPhone = true;
		return;
	}
	const io = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				showPhone = true;
				io.disconnect();
			}
		},
		{ rootMargin: '200px' },
	);
	io.observe(phoneWrap);
	return () => io.disconnect();
});
</script>

<div
	class="relative flex w-full flex-grow flex-col md:overflow-hidden bg-gradient-to-br from-[#012133] to-[#001526]"
>
	<div class="absolute inset-0 z-0">
		{#if showBg && !isMobile}
			{#await import('$lib/components/bits/FaultyTerminal.svelte') then { default: FaultyTerminal }}
				<FaultyTerminal
					scale={isMobile ? 1.2 : 2}
					digitSize={isMobile ? 0.9 : 1.2}
					timeScale={isMobile ? 0.25 : 0.5}
					scanlineIntensity={0.3}
					curvature={0.3}
					tint="#1a5fb4"
					mouseReact={!isMobile}
					mouseStrength={0.5}
					pageLoadAnimation={!isMobile}
					noiseAmp={1}
					brightness={0.6}
				/>
			{/await}
		{:else}
			<!-- Static poster for mobile / pre-hydration: zero GPU cost -->
			<div
				aria-hidden="true"
				class="absolute inset-0"
				style="background: radial-gradient(60% 50% at 50% 38%, rgba(26, 95, 180, 0.35), transparent 70%), radial-gradient(45% 35% at 18% 82%, rgba(26, 95, 180, 0.18), transparent 70%), radial-gradient(45% 35% at 82% 12%, rgba(67, 217, 173, 0.1), transparent 70%);"
			></div>
		{/if}
	</div>
	<!-- <Particles class="absolute inset-0 z-0" /> -->
	<div
		class="relative z-10 mx-auto flex w-full max-w-full flex-grow flex-col items-center justify-center gap-8 px-4 py-10 sm:px-6 lg:max-w-5/6 lg:flex-row lg:justify-between lg:py-0"
	>
		<div
			class="w-full py-6 text-center sm:py-10 lg:w-1/2 lg:py-0 lg:text-left"
			data-interactive-cursor="text"
		>
			<p class="text-c-white text-lg">{$_('hello')}. {$_('iAm')}</p>
			<div id="name" data-interactive-cursor="mixblend">
				<BlurText
					text="Denilson De La Rosa"
					delay={100}
					animateBy="words"
					class="my-2 justify-center text-4xl font-bold break-words text-[#fea55f] sm:text-5xl lg:justify-start"
				/>
			</div>
			<div
				class="mt-1 min-h-[2.5rem] text-xl font-medium break-words text-[#43d9ad] sm:text-2xl lg:mx-0"
			>
				<span data-interactive-cursor="code"> &gt; </span>
				<TextType
					text={[$_('fullStackDeveloper'), $_('degree'), $_('phrase')]}
					typingSpeed={75}
					pauseDuration={2700}
					deletingSpeed={50}
					showCursor={true}
					cursorCharacter="█"
					cursorBlinkDuration={0.9}
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
				class="text-midnight mt-8 w-full max-w-full rounded-md bg-[#011221] p-3 text-left text-xs sm:text-sm lg:mt-10"
			>
				<p class="mb-1">{$_('os.heroKicker')}</p>
				<p class="mb-1">{$_('findOnGithub')}</p>
				<div
					class="block max-w-full overflow-x-auto rounded-md bg-[#011221] p-3 break-all"
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
			<div class="mt-8 inline-block lg:mt-10">
				<ElectricBorder color="#ffb86a" borderRadius={8} speed={0.6}>
					<a
						href="/projects"
						class="block min-h-[48px] rounded-md bg-gradient-to-r from-[#ffb86a] to-[#FEA55F] px-8 py-3.5 text-center text-[#020618] transition-all duration-300 hover:from-[#FEA55F] hover:to-[#ffb86a]"
						data-interactive-cursor="navitem"
					>
						{$_('viewProjects')}
					</a>
				</ElectricBorder>
			</div>
		</div>

		<div
			id="os-anchor"
			bind:this={phoneWrap}
			class="game-enter relative z-10 flex w-full justify-center lg:w-auto lg:mr-13"
		>
			{#if showPhone}
				{#await import('$lib/os/components/Phone.svelte') then { default: Phone }}
					<Phone compact={isMobile} />
				{/await}
			{/if}
		</div>
	</div>
</div>

<style>
.game-enter {
	animation: game-enter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	will-change: transform, opacity;
}
@keyframes game-enter {
	from {
		opacity: 0;
		transform: scale(0.8) translateZ(0);
	}
	to {
		opacity: 1;
		transform: scale(1) translateZ(0);
	}
}
.marquee-track {
	animation: marquee 24s linear infinite;
	will-change: transform;
	transform: translateZ(0);
	backface-visibility: hidden;
	contain: layout style;
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
	.marquee-track,
	.game-enter {
		animation: none;
	}
}
</style>
