<script lang="ts">
import {
	Ellipsis,
	Heart,
	ListMusic,
	Palette,
	Pause,
	Play,
	Quote,
	SkipBack,
	SkipForward,
	Volume1,
	Volume2,
} from 'lucide-svelte';
import { onMount } from 'svelte';
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import { audio } from '../../audio/engine.svelte';
import { THEMES, themeAccent } from '../../audio/tracks';
import { os } from '../../state/os.svelte';
import Playlist from './Playlist.svelte';
import Spectrum from './Spectrum.svelte';
import ThemeSelector from './ThemeSelector.svelte';

const FAVS_KEY = 'portfolio-os:favs';

let panel = $state<'none' | 'queue' | 'options'>('none');
let showCredits = $state(false);
let favs = $state<string[]>([]);
let accent = $derived(themeAccent(audio.theme));

const isFav = $derived(favs.includes(audio.track.id));
const pct = $derived(
	audio.duration > 0
		? Math.min(100, (audio.currentTime / audio.duration) * 100)
		: 0,
);
const volPct = $derived((audio.muted ? 0 : audio.volume) * 100);

onMount(() => {
	try {
		const raw = localStorage.getItem(FAVS_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed))
				favs = parsed.filter((x) => typeof x === 'string');
		}
	} catch {
		/* ignorar */
	}
});

function toggleFav() {
	const id = audio.track.id;
	favs = isFav ? favs.filter((f) => f !== id) : [...favs, id];
	try {
		localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
	} catch {
		/* ignorar */
	}
}

function openOptions(credits: boolean) {
	showCredits = credits;
	panel = panel === 'options' && showCredits === credits ? 'none' : 'options';
	if (credits) showCredits = true;
}

function fmt(s: number): string {
	if (!Number.isFinite(s) || s < 0) return '0:00';
	const m = Math.floor(s / 60);
	const sec = Math.floor(s % 60);
	return `${m}:${sec.toString().padStart(2, '0')}`;
}

function onSeek(e: Event) {
	audio.seek(Number((e.target as HTMLInputElement).value));
}

let scroller: HTMLDivElement | null = $state(null);
let canUp = $state(false);
let canDown = $state(false);

function updateFades() {
	const el = scroller;
	if (!el) return;
	canUp = el.scrollTop > 8;
	canDown = el.scrollHeight - el.scrollTop - el.clientHeight > 8;
}

// Recalcular al cambiar el contenido (panel cola/opciones, pista, etc.)
$effect(() => {
	void panel;
	void showCredits;
	void audio.track.id;
	requestAnimationFrame(() => updateFades());
});
</script>

<div
	bind:this={scroller}
	onscroll={updateFades}
	class="os-scroll flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3 text-white"
>
	<div
		aria-hidden="true"
		class="pointer-events-none sticky -top-3 z-10 -mb-8 h-8 shrink-0 bg-gradient-to-b from-[#011627] to-transparent transition-opacity duration-200"
		style="opacity: {canUp ? 1 : 0}"
	></div>
	<p class="sr-only" role="status" aria-live="polite">
		{audio.playing ? $_('os.nowPlaying') : $_('os.paused')}:
		{audio.track.title}
		— {audio.track.artist}
	</p>

	<!-- Carátula grande con espectro superpuesto -->
	<div class="relative shrink-0 overflow-hidden rounded-xl">
		<img
			src={audio.track.cover}
			alt=""
			width={256}
			height={256}
			class="aspect-square w-full object-cover"
			style="box-shadow: 0 8px 32px {accent}44"
		>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 pt-6"
		>
			<Spectrum bars={48} {accent} height={36} />
		</div>
	</div>

	<!-- Título / artista / acciones -->
	<div class="flex items-center gap-2 px-1 pt-2">
		<div class="min-w-0 flex-1">
			<p class="truncate text-lg leading-tight font-semibold">
				{audio.track.title}
			</p>
			<p class="truncate text-sm" style="color: {accent}">
				{audio.track.artist}
			</p>
		</div>
		<button
			type="button"
			onclick={() => openOptions(false)}
			aria-label={$_('os.moreOptions')}
			aria-expanded={panel === 'options'}
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
		>
			<Ellipsis size={20} />
		</button>
		<button
			type="button"
			onclick={toggleFav}
			aria-label={isFav ? $_('os.removeFav') : $_('os.addFav')}
			aria-pressed={isFav}
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
		>
			<Heart
				size={19}
				fill={isFav ? '#fa2d48' : 'none'}
				color={isFav ? '#fa2d48' : '#fff'}
			/>
		</button>
	</div>

	<!-- Scrubber -->
	<div class="px-1 pt-1">
		<label class="block">
			<span class="sr-only">{$_('os.seek')}</span>
			<input
				type="range"
				min={0}
				max={Math.max(1, audio.duration)}
				step={0.5}
				value={audio.currentTime}
				oninput={onSeek}
				aria-label={$_('os.seek')}
				class="am-range am-scrub w-full"
				style="--p: {pct}%"
			>
		</label>
		<div
			class="mt-0.5 flex justify-between text-[11px] tabular-nums text-white/60"
		>
			<span>{fmt(audio.currentTime)}</span>
			<span>{fmt(audio.duration)}</span>
		</div>
		{#if audio.error}
			<p
				role="alert"
				class="mt-1 rounded-md bg-red-500/15 px-2 py-1 text-center text-[11px] text-red-200"
			>
				{$_('os.loadError')}
			</p>
		{/if}
	</div>

	<!-- Controles principales -->
	<fieldset class="flex items-center justify-between px-6 pb-1">
		<legend class="sr-only">{$_('os.playbackControls')}</legend>
		<button
			type="button"
			onclick={() => audio.prev()}
			aria-label={$_('os.prev')}
			class="flex h-12 w-12 items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
		>
			<SkipBack size={38} fill="currentColor" />
		</button>
		<button
			type="button"
			onclick={() => audio.toggle()}
			aria-label={audio.playing ? $_('os.pause') : $_('os.play')}
			class="flex h-14 w-14 items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
		>
			{#if audio.playing}
				<Pause size={46} fill="currentColor" />
			{:else}
				<Play size={46} fill="currentColor" />
			{/if}
		</button>
		<button
			type="button"
			onclick={() => audio.next()}
			aria-label={$_('os.next')}
			class="flex h-12 w-12 items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
		>
			<SkipForward size={38} fill="currentColor" />
		</button>
	</fieldset>

	<!-- Volumen -->
	<div class="flex items-center gap-2 px-1">
		<button
			type="button"
			onclick={() => audio.setMuted(!audio.muted)}
			aria-label={audio.muted ? $_('os.unmute') : $_('os.mute')}
			aria-pressed={audio.muted}
			class="flex h-9 w-9 shrink-0 items-center justify-center text-white/50 hover:text-white"
		>
			<Volume1 size={17} />
		</button>
		<label class="flex-1">
			<span class="sr-only">{$_('os.volume')}</span>
			<input
				type="range"
				min={0}
				max={1}
				step={0.05}
				value={audio.muted ? 0 : audio.volume}
				oninput={(e) => {
					const v = Number((e.target as HTMLInputElement).value);
					if (v > 0 && audio.muted) audio.setMuted(false);
					audio.setVolume(v);
				}}
				aria-label={$_('os.volume')}
				class="am-range am-vol w-full"
				style="--p: {volPct}%"
			>
		</label>
		<span
			class="flex h-9 w-9 shrink-0 items-center justify-center text-white/50"
			aria-hidden="true"
		>
			<Volume2 size={18} />
		</span>
	</div>

	<!-- Barra inferior -->
	<div
		class="mt-auto flex items-center justify-between border-t border-white/10 px-2 pt-2"
		role="toolbar"
		aria-label={$_('os.moreOptions')}
	>
		<button
			type="button"
			onclick={() => (panel = panel === 'queue' ? 'none' : 'queue')}
			aria-label={$_('os.queue')}
			aria-expanded={panel === 'queue'}
			aria-pressed={panel === 'queue'}
			class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors {panel === 'queue' ? 'text-white' : 'text-white/50 hover:text-white'}"
			style={panel === 'queue' ? `background: ${accent}33` : ''}
		>
			<ListMusic size={21} />
		</button>
		<button
			type="button"
			onclick={() => {
				const order = THEMES.map((t) => t.id);
				audio.setTheme(order[(order.indexOf(audio.theme) + 1) % order.length]);
			}}
			aria-label={`${$_('os.theme')}: ${audio.theme}`}
			title={audio.theme}
			class="flex h-10 items-center gap-1.5 rounded-full bg-white/15 px-3.5 text-white transition-colors hover:bg-white/25"
		>
			<Palette size={17} />
			<span
				class="h-2.5 w-2.5 rounded-full"
				style="background: {accent}"
				aria-hidden="true"
			></span>
		</button>
		<button
			type="button"
			onclick={() => openOptions(true)}
			aria-label={$_('os.credits')}
			aria-expanded={panel === 'options'}
			class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors {panel === 'options' ? 'text-white' : 'text-white/50 hover:text-white'}"
			style={panel === 'options' ? `background: ${accent}33` : ''}
		>
			<Quote size={20} />
		</button>
	</div>

	{#if panel === 'queue'}
		<div class="rounded-xl bg-white/8 p-2">
			<Playlist {accent} />
		</div>
	{:else if panel === 'options'}
		<div class="flex flex-col gap-2 rounded-xl bg-white/8 p-2.5">
			<ThemeSelector />
			<button
				type="button"
				onclick={() => (os.reduceMotion = !os.reduceMotion)}
				aria-pressed={os.reduceMotion}
				class="rounded-lg border border-white/15 px-2 py-1.5 text-[11px] text-slate-200 hover:text-white"
			>
				{$_('os.reduceEffects')}: {os.reduceMotion ? $_('os.on') : $_('os.off')}
			</button>
			{#if showCredits}
				<ul class="flex flex-col gap-1 text-[11px] text-slate-300">
					{#each audio.playlist as t (t.id)}
						<li class="flex justify-between gap-2">
							<span class="truncate">{t.title} — {t.artist}</span>
							<span class="shrink-0 text-slate-500">{t.license}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
	{#if !audio.hasSpectrum && audio.ready}
		<p
			class="rounded-md bg-white/5 px-2 py-1 text-center text-[11px] text-slate-400"
		>
			{$_('os.noSpectrum')}
		</p>
	{/if}
	<div
		aria-hidden="true"
		class="pointer-events-none sticky -bottom-3 z-10 -mt-8 h-8 shrink-0 bg-gradient-to-t from-[#011627] to-transparent transition-opacity duration-200"
		style="opacity: {canDown ? 1 : 0}"
	></div>
</div>

<style>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
.am-range {
	-webkit-appearance: none;
	appearance: none;
	height: 20px;
	background: transparent;
	cursor: pointer;
}
.am-range::-webkit-slider-runnable-track {
	height: 5px;
	border-radius: 999px;
	background: linear-gradient(
		to right,
		rgba(255, 255, 255, 0.9) var(--p, 0%),
		rgba(255, 255, 255, 0.25) var(--p, 0%)
	);
}
.am-range::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	margin-top: -3.5px;
	height: 12px;
	width: 12px;
	border-radius: 999px;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}
.am-range::-moz-range-track {
	height: 5px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.25);
}
.am-range::-moz-range-progress {
	height: 5px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.9);
}
.am-range::-moz-range-thumb {
	height: 12px;
	width: 12px;
	border: none;
	border-radius: 999px;
	background: #fff;
}
.am-vol::-webkit-slider-runnable-track {
	height: 4px;
}
.am-vol::-webkit-slider-thumb {
	margin-top: -4px;
}
@media (prefers-reduced-motion: reduce) {
	.am-range {
		transition: none;
	}
}
</style>
