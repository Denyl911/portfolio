<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
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
	class="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-[#0a2442] via-[#011627] to-[#01080e] px-4 pt-3 pb-5 text-center text-white"
	ontouchstart={onTouchStart}
	ontouchend={onTouchEnd}
>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 opacity-60"
	>
		<div
			class="absolute -top-10 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full blur-3xl"
			style="background: {themeAccent(audio.theme)}33"
		></div>
	</div>

	<p class="relative text-5xl font-bold tracking-tight tabular-nums">{time}</p>
	<p class="relative mt-1 text-xs text-slate-300 capitalize">{date}</p>

	<div class="relative mt-4 w-full px-2 opacity-80">
		<Spectrum bars={32} accent={themeAccent(audio.theme)} height={48} />
	</div>

	<div class="relative mt-auto flex w-full flex-col items-center gap-2">
		<button
			type="button"
			onclick={unlock}
			onkeydown={onKey}
			disabled={unlocking}
			aria-label={$_('os.unlock')}
			class="w-full min-h-[48px] cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#43d9ad] disabled:opacity-60"
		>
			<span class="unlock-hint inline-block">
				{unlocking ? '…' : $_('os.unlockHint')}
			</span>
		</button>
		<p class="text-[11px] text-slate-400">{$_('os.unlockSub')}</p>
	</div>
</div>

<style>
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
