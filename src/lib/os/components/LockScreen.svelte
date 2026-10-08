<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import wallpaper from '$lib/assets/ada-lock.webp';
import Spectrum from '../apps/music/Spectrum.svelte';
import { audio } from '../audio/engine.svelte';
import { themeAccent } from '../audio/tracks';
import { os } from '../state/os.svelte';

let now = $state(new Date());
let unlocking = $state(false);
let touchY: number | null = $state(null);

$effect(() => {
	const id = setInterval(() => (now = new Date()), 15000);
	return () => clearInterval(id);
});

const time = $derived(
	now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
);
const date = $derived(
	now.toLocaleDateString([], {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	}),
);

async function unlock() {
	if (unlocking) return;
	unlocking = true;
	try {
		await os.unlock();
	} finally {
		unlocking = false;
	}
}

function onTouchStart(e: TouchEvent) {
	touchY = e.touches[0].clientY;
}
function onTouchEnd(e: TouchEvent) {
	if (touchY == null) return;
	const dy = touchY - e.changedTouches[0].clientY;
	touchY = null;
	if (dy > 40) void unlock();
}
function onKey(e: KeyboardEvent) {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		void unlock();
	}
}
</script>

<div
	class="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden bg-[#011627] px-4 pt-3 pb-5 text-center text-white"
	ontouchstart={onTouchStart}
	ontouchend={onTouchEnd}
>
	<!-- Fondo: retrato de Ada Lovelace en monocromo dithered con scanlines -->
	<img
		src={wallpaper}
		alt=""
		aria-hidden="true"
		width={420}
		height={840}
		loading="lazy"
		decoding="async"
		class="absolute inset-0 h-full w-full object-cover opacity-90"
	>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#011627]/70 via-transparent to-[#011627]/85"
	></div>
	<div
		aria-hidden="true"
		class="os-scanlines pointer-events-none absolute inset-0 opacity-60"
	></div>
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div
			class="absolute top-[22%] left-1/2 h-44 w-60 -translate-x-1/2 rounded-full blur-3xl"
			style="background: {themeAccent(audio.theme)}1f"
		></div>
	</div>

	<p
		class="relative text-5xl font-bold tracking-tight text-white tabular-nums [text-shadow:0_2px_16px_rgba(1,22,39,0.9)]"
	>
		{time}
	</p>
	<p class="relative mt-1 text-xs text-slate-200 capitalize">{date}</p>

	<div class="relative mt-auto w-full">
		<div class="mb-3 px-2 opacity-80">
			<Spectrum bars={32} accent={themeAccent(audio.theme)} height={40} />
		</div>
		<div class="flex w-full flex-col items-center gap-2">
			<button
				type="button"
				onclick={unlock}
				onkeydown={onKey}
				disabled={unlocking}
				aria-label={$_('os.unlock')}
				class="min-h-[48px] w-full cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#43d9ad] disabled:opacity-60"
			>
				<span class="unlock-hint inline-block">
					{unlocking ? '…' : $_('os.unlockHint')}
				</span>
			</button>
			<p class="text-[11px] text-slate-300">{$_('os.unlockSub')}</p>
		</div>
	</div>
</div>

<style>
.os-scanlines {
	background: repeating-linear-gradient(
		to bottom,
		transparent 0 2px,
		rgba(1, 8, 14, 0.22) 2px 4px
	);
}
.unlock-hint {
	animation: nudge 2.4s ease-in-out infinite;
}
@keyframes nudge {
	0%,
	100% {
		transform: translateY(0);
		opacity: 0.85;
	}
	50% {
		transform: translateY(-3px);
		opacity: 1;
	}
}
@media (prefers-reduced-motion: reduce) {
	.unlock-hint {
		animation: none;
	}
}
</style>
