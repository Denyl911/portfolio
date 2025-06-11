<script lang="ts">
	import InteractiveCursor, {
		type ScaleOnActiveElement,
		type ActiveDataValue
	} from '@lostisworld/svelte-interactive-cursor';
	import { fade } from 'svelte/transition';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { children } = $props();
	let isMobile = $state(false);
	injectAnalytics({ mode: dev ? 'development' : 'production' });

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

	onMount(() => {
		isMobile = window.innerWidth < 1024;
	});
</script>

<div
	class="flex min-h-screen items-center justify-center bg-[#020618]"
	data-interactive-cursor-area={isMobile}
>
	<div
		class="flex h-[97vh] w-[97vw] flex-col overflow-y-auto rounded-lg border border-[#1E2D3D] bg-[#011627] font-['Fira_Code',_monospace] text-[#E5E9F0]"
	>
		<Header />
		{#key page.url.pathname}
			<main class="flex flex-grow flex-col overflow-hidden lg:flex-row" in:fade={{duration:500}}>
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

<style>
	@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');
</style>
