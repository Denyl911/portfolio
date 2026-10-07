<script lang="ts">
import { BatteryMedium, ChevronLeft, Home, Signal, Wifi } from 'lucide-svelte';
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import { getApp } from '../apps/registry';
import { os } from '../state/os.svelte';
import LockScreen from './LockScreen.svelte';

let { compact = false }: { compact?: boolean } = $props();

let clock = $state('');

$effect(() => {
	const tick = () =>
		(clock = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		}));
	tick();
	const id = setInterval(tick, 10000);
	return () => clearInterval(id);
});

const activeApp = $derived(os.activeApp ? getApp(os.activeApp) : undefined);
const effectClass = $derived(
	os.screenEffect === 'matrix'
		? 'os-fx-matrix'
		: os.screenEffect === 'retro'
			? 'os-fx-retro'
			: '',
);
</script>

<section
	class={compact
		? 'mx-auto w-full max-w-[340px]'
		: 'w-[300px] shrink-0 rounded-[2.6rem] border border-[#1E2D3D] bg-[#020810] p-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]'}
	aria-label={$_('os.phoneLabel')}
>
	<!-- Pantalla con relación de aspecto fija 9:19.5: idéntica en todas las apps -->
	<div
		class="relative flex w-full flex-col overflow-hidden bg-[#011627] {compact
			? 'mx-auto aspect-[9/19.5] max-w-[calc(72dvh*0.4615)] rounded-2xl border border-[#1E2D3D]'
			: 'aspect-[9/19.5] rounded-[2rem]'} {effectClass}"
	>
		<!-- Isla dinámica superpuesta: no ocupa espacio en el layout -->
		<div
			class="absolute top-1.5 left-1/2 z-10 h-[22px] w-24 -translate-x-1/2 rounded-full bg-black"
			aria-hidden="true"
		>
			<div
				class="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b1622]"
			></div>
		</div>

		<!-- Barra de estado fija para todos los estados -->
		<div
			class="flex h-7 shrink-0 items-center justify-between px-5 pt-1 text-[11px] font-medium text-white"
			aria-hidden="true"
		>
			<span class="w-14 tabular-nums">{clock}</span>
			<span class="flex items-center gap-1">
				<Signal size={12} />
				<Wifi size={12} />
				<BatteryMedium size={15} />
			</span>
		</div>
		{#if !os.unlocked}
			<LockScreen />
		{:else if activeApp}
			<!-- Barra de la app -->
			<div
				class="flex shrink-0 items-center gap-1 border-b border-white/10 px-2"
			>
				<button
					type="button"
					onclick={() => os.goHome()}
					aria-label={$_('os.home')}
					class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
				>
					<ChevronLeft size={18} />
				</button>
				<p
					class="flex-1 truncate text-center text-xs font-medium text-slate-200"
				>
					{activeApp.name}
				</p>
				<span class="w-9" aria-hidden="true"></span>
			</div>
			<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
				{#await activeApp.component() then { default: App }}
					<App />
				{:catch}
					<p class="p-4 text-center text-xs text-red-300">
						{$_('os.loadError')}
					</p>
				{/await}
			</div>
			<div class="flex shrink-0 justify-center border-t border-white/10 py-1.5">
				<button
					type="button"
					onclick={() => os.goHome()}
					aria-label={$_('os.home')}
					class="flex h-8 w-24 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
				>
					<Home size={15} />
				</button>
			</div>
		{:else}
			<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
				{#await import('./HomeScreen.svelte') then { default: HomeScreen }}
					<HomeScreen />
				{/await}
			</div>
		{/if}
	</div>
</section>

<style>
.os-fx-matrix {
	filter: hue-rotate(80deg) saturate(1.4);
}
.os-fx-retro {
	filter: contrast(1.2) sepia(0.4);
}
</style>
