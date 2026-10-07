<script lang="ts">
import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-svelte';
import { onDestroy } from 'svelte';
import { fade, scale } from 'svelte/transition';
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import { goto } from '$app/navigation';
import Spectrum from '../apps/music/Spectrum.svelte';
import { audio } from '../audio/engine.svelte';
import { themeAccent } from '../audio/tracks';
import { os } from '../state/os.svelte';

let {
	visible = false,
	variant = 'island',
}: { visible?: boolean; variant?: 'island' | 'dock' } = $props();

let graceActive = $state(false);
let graceTimer: ReturnType<typeof setTimeout> | null = null;
let wasPlaying = $state(false);

$effect(() => {
	if (audio.playing) {
		wasPlaying = true;
		graceActive = false;
		if (graceTimer) {
			clearTimeout(graceTimer);
			graceTimer = null;
		}
		os.notifyPlaying();
	} else if (wasPlaying && visible) {
		// Pausado fuera de _hello: gracia de 8 s
		graceActive = true;
		if (graceTimer) clearTimeout(graceTimer);
		graceTimer = setTimeout(() => {
			graceActive = false;
			graceTimer = null;
		}, 8000);
	}
	if (!audio.playing && !visible) wasPlaying = false;
});

function poke() {
	if (graceActive) {
		if (graceTimer) clearTimeout(graceTimer);
		graceTimer = setTimeout(() => {
			graceActive = false;
			graceTimer = null;
		}, 8000);
	}
}

function close() {
	audio.pause();
	os.dismissMiniplayer();
	if (graceTimer) {
		clearTimeout(graceTimer);
		graceTimer = null;
	}
	graceActive = false;
}

function goHome() {
	void goto('/');
}

const show = $derived(
	visible && (audio.playing || graceActive) && !os.miniplayerDismissed,
);
const accent = $derived(themeAccent(audio.theme));

onDestroy(() => {
	if (graceTimer) clearTimeout(graceTimer);
});
</script>

{#if show}
	{#if variant === 'dock'}
		<!-- Dock al fondo del sidebar (solo desktop: el sidebar solo existe en lg+) -->
		<section
			class="hidden shrink-0 border-t border-white/10 bg-black/30 px-2 py-2 lg:block"
			aria-label={$_('os.miniplayerLabel')}
			in:fade={{ duration: 150 }}
			out:fade={{ duration: 150 }}
			onpointerdown={poke}
		>
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={goHome}
					aria-label={$_('os.backToPhone')}
					class="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg text-left"
				>
					<img
						src={audio.track.cover}
						alt=""
						width={34}
						height={34}
						class="h-[34px] w-[34px] shrink-0 rounded-md"
					>
					<span class="min-w-0 flex-1">
						<span class="block truncate text-xs font-medium text-white"
							>{audio.track.title}</span
						>
						<span class="block overflow-hidden" aria-hidden="true"
							><Spectrum
								bars={12}
								{accent}
								height={22}
								throttleFps={30}
							/></span
						>
					</span>
				</button>
				<button
					type="button"
					onclick={close}
					aria-label={$_('os.closeMiniplayer')}
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-white"
				>
					<X size={15} />
				</button>
			</div>
			<fieldset class="mt-1 flex items-center justify-center gap-1">
				<legend class="sr-only">{$_('os.playbackControls')}</legend>
				<button
					type="button"
					onclick={() => audio.prev()}
					aria-label={$_('os.prev')}
					class="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:text-white"
				>
					<SkipBack size={16} fill="currentColor" />
				</button>
				<button
					type="button"
					onclick={() => audio.toggle()}
					aria-label={audio.playing ? $_('os.pause') : $_('os.play')}
					class="flex h-9 w-9 items-center justify-center rounded-full text-[#020618]"
					style="background: {accent}"
				>
					{#if audio.playing}
						<Pause size={16} />
					{:else}
						<Play size={16} />
					{/if}
				</button>
				<button
					type="button"
					onclick={() => audio.next()}
					aria-label={$_('os.next')}
					class="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:text-white"
				>
					<SkipForward size={16} fill="currentColor" />
				</button>
			</fieldset>
		</section>
	{:else}
		<!-- Móvil/tablet: Dynamic Island (el dock solo existe en lg+) -->
		<section
			class="os-mini-island"
			aria-label={$_('os.miniplayerLabel')}
			in:scale={{ duration: 180, start: 0.9 }}
			out:fade={{ duration: 150 }}
		>
			<div
				class="mx-auto flex w-[min(92vw,380px)] items-center gap-1.5 rounded-full border border-white/15 bg-black/90 py-1.5 pr-1.5 pl-2 shadow-2xl backdrop-blur"
				onpointerdown={poke}
			>
				<button
					type="button"
					onclick={goHome}
					aria-label={$_('os.backToPhone')}
					class="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-full text-left"
				>
					<img
						src={audio.track.cover}
						alt=""
						width={28}
						height={28}
						class="h-7 w-7 shrink-0 rounded-full"
					>
					<span class="block min-w-0 flex-1 truncate text-xs text-white"
						>{audio.track.title}</span
					>
				</button>
				<button
					type="button"
					onclick={() => audio.toggle()}
					aria-label={audio.playing ? $_('os.pause') : $_('os.play')}
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#020618]"
					style="background: {accent}"
				>
					{#if audio.playing}
						<Pause size={15} />
					{:else}
						<Play size={15} />
					{/if}
				</button>
				<button
					type="button"
					onclick={() => audio.next()}
					aria-label={$_('os.next')}
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-300 hover:text-white"
				>
					<SkipForward size={15} fill="currentColor" />
				</button>
				<button
					type="button"
					onclick={close}
					aria-label={$_('os.closeMiniplayer')}
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-white"
				>
					<X size={15} />
				</button>
			</div>
		</section>
	{/if}
{/if}

<style>
.os-mini-island {
	display: block;
	position: fixed;
	top: calc(env(safe-area-inset-top, 0px) + 12px);
	left: 0;
	right: 0;
	z-index: 60;
	pointer-events: auto;
}
@media (min-width: 1024px) {
	.os-mini-island {
		display: none;
	}
}
@media (prefers-reduced-motion: reduce) {
	.os-mini-island {
		animation: none;
	}
}
</style>
