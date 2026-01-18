<script lang="ts">
	import InteractiveCursor, {
		type ActiveDataValue,
		type ScaleOnActiveElement
	} from '@lostisworld/svelte-interactive-cursor';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { fade } from 'svelte/transition';
	import { dev } from '$app/environment';
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
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	addMessages('en', en);
	addMessages('es', es);
	addMessages('fr', fr);

	init({
		fallbackLocale: 'en',
		initialLocale: 'en'
	});

	onMount(()=>{
     	const savedLocale = localStorage.getItem('locale');
     	console.log('Saved Locale: ',savedLocale)
     	if (savedLocale) {
      		locale.set(savedLocale);
     	}
     	locale.subscribe(value => {
      		value && localStorage.setItem('locale', value);
     	});
	})


	let currentCursorState: ActiveDataValue = $state({ activeDataName: '', activeDataElement: null });
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
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020618] to-[#0a1a2f]"
	data-interactive-cursor-area
>
	<div
		class="flex h-[97vh] w-[97vw] flex-col rounded-lg border border-[#1E2D3D] bg-gradient-to-br from-[#011627] to-[#0a2442] font-['Fira_Code'] text-[#E5E9F0]"
	>
		<Header />
		{#key page.url.pathname}
			<main class="flex flex-grow flex-col overflow-auto lg:flex-row" in:fade={{ duration: 500 }}>
				{@render children()}
			</main>
		{/key}

		<Footer />
	</div>
</div>

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

<style></style>
