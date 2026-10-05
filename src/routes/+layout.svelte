<script lang="ts">
	import type {
		ActiveDataValue,
		ScaleOnActiveElement
	} from '@lostisworld/svelte-interactive-cursor';
	import { fade } from 'svelte/transition';
	import '../app.css';
	import { onMount } from 'svelte';
	import { addMessages, init, locale } from 'svelte-i18n';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import en from '$lib/i18n/en.json';
	import es from '$lib/i18n/es.json';
	import fr from '$lib/i18n/fr.json';

	let { children } = $props();
	let showEffects = $state(false);

	addMessages('en', en);
	addMessages('es', es);
	addMessages('fr', fr);

	init({
		fallbackLocale: 'en',
		initialLocale: 'en'
	});

	onMount(() => {
		const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
		const smallScreen = window.matchMedia?.('(max-width: 1023px)').matches ?? false;
		isCoarsePointer = coarse || smallScreen;
		reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
		// Defer non-critical effects until idle: cursor, sparks, analytics.
		if (!isCoarsePointer && !reducedMotion) {
			const w = window as unknown as { requestIdleCallback?: typeof requestIdleCallback };
			if (typeof w.requestIdleCallback === 'function')
				w.requestIdleCallback(() => (showEffects = true), { timeout: 2500 });
			else setTimeout(() => (showEffects = true), 1200);
		}
		// Defer Vercel analytics off the critical path.
		const idle2 = (window as unknown as { requestIdleCallback?: typeof requestIdleCallback }).requestIdleCallback;
		const loadAnalytics = () => {
			import('@vercel/analytics/sveltekit').then(({ injectAnalytics }) => {
				import('$app/environment').then(({ dev }) => injectAnalytics({ mode: dev ? 'development' : 'production' }));
			});
		};
		if (typeof idle2 === 'function') idle2(() => loadAnalytics(), { timeout: 3000 });
		else setTimeout(loadAnalytics, 2000);
		const savedLocale = localStorage.getItem('locale');
		console.log('Saved Locale: ', savedLocale);
		if (savedLocale) {
			locale.set(savedLocale);
		}
		locale.subscribe((value) => {
			value && localStorage.setItem('locale', value);
		});
	});

	let currentCursorState: ActiveDataValue = $state({ activeDataName: '', activeDataElement: null });
	let reducedMotion = $state(false);
	let isCoarsePointer = $state(false);
	const scaleOnActive: ScaleOnActiveElement[] = [
		{ element: 'link', scaleMultiplicator: 1.2 },
		{ element: 'mixblend', scaleMultiplicator: 3 },
		{ element: 'code', scaleMultiplicator: 1.2 },
		{ element: 'content', scaleMultiplicator: 2 },
		{ element: 'prevslide', scaleMultiplicator: 2 },
		{ element: 'nextslide', scaleMultiplicator: 2 }
	];
	const customCursorProps: { data: string; content?: string; cursorClass?: string }[] = [
		{
			data: 'mixblend',
			cursorClass: 'bg-white mix-blend-difference'
		},
		{
			data: 'code',
			cursorClass: 'bg-white mix-blend-difference'
		},
		{
			data: 'content',
			cursorClass: 'bg-white mix-blend-difference'
		},
		{
			data: 'text',
			cursorClass: 'bg-white mix-blend-difference'
		},
		{
			data: 'prevslide',
			cursorClass: 'bg-white/25 backdrop-blur-sm text-gray-950 text-[6px]',
			content: `&#10094;`
		},
		{
			data: 'nextslide',
			cursorClass: 'bg-white/25 backdrop-blur-sm text-gray-950 text-[6px]',
			content: `&#10095;`
		},
		{
			data: 'hidden',
			cursorClass: 'bg-transparent'
		},
		{
			data: 'navitem',
			cursorClass: 'outline-2 outline-gray-300'
		},
		{
			data: 'dropdown',
			cursorClass: 'outline-2 outline-dashed outline-gray-300'
		},
		{
			data: 'btn',
			cursorClass: 'rounded-lg outline outline-cwhite outline-offset-4'
		},
		{
			data: 'input',
			cursorClass: 'outline-[#43D9AD] rounded-md outline-dashed outline-1  outline-offset-2'
		}
	];
</script>

<div
	class="flex min-h-dvh w-full items-center justify-center bg-[#0b0f19] p-0 sm:p-2"
	data-interactive-cursor-area
>
	<div
		class="flex h-dvh w-full flex-col overflow-hidden border-[#1E2D3D] bg-gradient-to-br from-[#011627] to-[#0a2442] font-['Fira_Code'] text-[#E5E9F0] sm:rounded-lg sm:border lg:h-[97vh] lg:w-[97vw]"
	>
		<Header />
		{#key page.url.pathname}
			<main class="flex min-h-0 flex-grow flex-col overflow-x-hidden overflow-y-auto lg:flex-row" in:fade={{ duration: 200 }}>
				{#if reducedMotion || isCoarsePointer || !showEffects}
					{@render children()}
				{:else}
					{#await import('$lib/components/bits/ClickSpark.svelte') then { default: ClickSpark }}
						<ClickSpark
							sparkColor="#ffb86a"
							sparkCount={8}
							sparkRadius={22}
							duration={400}
							class="flex flex-grow flex-col lg:flex-row"
						>
							{@render children()}
						</ClickSpark>
					{/await}
				{/if}
			</main>
		{/key}

		<Footer />
	</div>
</div>

{#if showEffects && !isCoarsePointer && !reducedMotion}
	{#await import('@lostisworld/svelte-interactive-cursor') then { default: InteractiveCursor }}
		<InteractiveCursor
	bind:activeDataValue={currentCursorState}
	useDataElementRect={['input', 'btn']}
	{scaleOnActive}
	defaultSize={24}
	class="flex items-center justify-center rounded-full [&>svg]:h-3 {currentCursorState.activeDataName ===
	''
		? 'bg-white text-black'
		: customCursorProps.find((state) => state.data === currentCursorState.activeDataName)
				?.cursorClass || 'bg-white text-black'}"
></InteractiveCursor>
	{/await}
{/if}

<style></style>
