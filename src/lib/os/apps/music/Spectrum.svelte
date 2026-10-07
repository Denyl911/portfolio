<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { audio } from '../../audio/engine.svelte';
import { createSpectrumNorm, drawSpectrum } from '../../audio/visualizer';

type Props = {
	bars?: number;
	accent?: string;
	height?: number;
	throttleFps?: number;
};

let {
	bars = 32,
	accent = '#43d9ad',
	height = 64,
	throttleFps = 60,
}: Props = $props();

let canvas: HTMLCanvasElement | null = $state(null);
let reduceMotion = $state(false);
let data: Uint8Array | null = null;
// Normalización dinámica propia de esta instancia (pico suavizado).
let norm = createSpectrumNorm();
let raf = 0;
let lastFrame = 0;
let visible = true;
let io: IntersectionObserver | null = null;

function frame(t: number) {
	raf = 0;
	if (!canvas || !visible || document.visibilityState === 'hidden') {
		raf = requestAnimationFrame(frame);
		return;
	}
	const minGap = 1000 / throttleFps;
	if (t - lastFrame < minGap && throttleFps < 60) {
		raf = requestAnimationFrame(frame);
		return;
	}
	lastFrame = t;
	const ctx = canvas.getContext('2d');
	if (ctx) {
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const w = canvas.clientWidth * dpr;
		const h = canvas.clientHeight * dpr;
		if (canvas.width !== Math.round(w) || canvas.height !== Math.round(h)) {
			canvas.width = Math.round(w);
			canvas.height = Math.round(h);
		}
		if (!data || data.length !== audio.binCount) {
			data = new Uint8Array(audio.binCount);
		}
		audio.getFrequencyData(data);
		ctx.save();
		ctx.scale(dpr, dpr);
		drawSpectrum(
			ctx,
			data,
			canvas.clientWidth,
			canvas.clientHeight,
			{
				bars,
				accent,
				idle: !audio.playing,
				time: t,
				reducedMotion: reduceMotion,
			},
			norm,
		);
		ctx.restore();
	}
	raf = requestAnimationFrame(frame);
}

onMount(() => {
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	reduceMotion = mq.matches;
	const onChange = (e: MediaQueryListEvent) => (reduceMotion = e.matches);
	mq.addEventListener?.('change', onChange);
	if (canvas && 'IntersectionObserver' in window) {
		io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{ threshold: 0.05 },
		);
		io.observe(canvas);
	}
	// Un solo frame estático si hay movimiento reducido
	if (reduceMotion && canvas) {
		const ctx = canvas.getContext('2d');
		if (ctx) {
			drawSpectrum(ctx, null, canvas.clientWidth || 280, height, {
				bars,
				accent,
				reducedMotion: true,
			});
		}
	} else {
		raf = requestAnimationFrame(frame);
	}
	return () => {
		mq.removeEventListener?.('change', onChange);
	};
});

onDestroy(() => {
	if (raf) cancelAnimationFrame(raf);
	io?.disconnect();
});
</script>

<canvas
	bind:this={canvas}
	aria-hidden="true"
	class="w-full"
	style="height: {height}px"
></canvas>
