<script lang="ts">
import type { Snippet } from 'svelte';
import { onMount } from 'svelte';

// NOTE: gsap + ScrollTrigger are loaded via dynamic import inside onMount.
// Static `import { ScrollTrigger } from 'gsap/ScrollTrigger'` breaks SSR on
// Vercel (CJS named-export interop) and `registerPlugin` touches `window`.

type Props = {
	children: Snippet;
	container?: Element | string | null;
	blur?: boolean;
	duration?: number;
	ease?: string;
	delay?: number;
	threshold?: number;
	initialOpacity?: number;
	disappearAfter?: number;
	disappearDuration?: number;
	disappearEase?: string;
	onComplete?: () => void;
	onDisappearanceComplete?: () => void;
	class?: string;
};

let {
	children,
	container = null,
	blur = false,
	duration = 1000,
	ease = 'power2.out',
	delay = 0,
	threshold = 0.1,
	initialOpacity = 0,
	disappearAfter = 0,
	disappearDuration = 0.5,
	disappearEase = 'power2.in',
	onComplete,
	onDisappearanceComplete,
	class: className = '',
}: Props = $props();

let el: HTMLDivElement;

onMount(() => {
	let cleanup: (() => void) | undefined;
	let alive = true;

	(async () => {
		// Dynamic import: client-only, avoids SSR CJS named-export error.
		const gsapMod = await import('gsap');
		const stMod = await import('gsap/ScrollTrigger');
		if (!alive) return;
		const gsap =
			(gsapMod as unknown as { gsap?: typeof import('gsap').gsap }).gsap ??
			(gsapMod as unknown as { default: typeof import('gsap').gsap }).default;
		const ScrollTrigger =
			(stMod as unknown as { ScrollTrigger?: typeof import('gsap/ScrollTrigger').ScrollTrigger })
				.ScrollTrigger ??
			(stMod as unknown as { default: typeof import('gsap/ScrollTrigger').ScrollTrigger }).default;
		gsap.registerPlugin(ScrollTrigger);

		let scrollerTarget: Element | string | null =
			container || document.getElementById('snap-main-container') || null;
		if (typeof scrollerTarget === 'string') {
			scrollerTarget = document.querySelector(scrollerTarget);
		}

		const startPct = (1 - threshold) * 100;
		const getSeconds = (val: number) => (val > 10 ? val / 1000 : val);

		gsap.set(el, {
			autoAlpha: initialOpacity,
			filter: blur ? 'blur(10px)' : 'blur(0px)',
			willChange: 'opacity, filter, transform',
		});

		const tl = gsap.timeline({
			paused: true,
			delay: getSeconds(delay),
			onComplete: () => {
				onComplete?.();
				if (disappearAfter > 0) {
					gsap.to(el, {
						autoAlpha: initialOpacity,
						filter: blur ? 'blur(10px)' : 'blur(0px)',
						delay: getSeconds(disappearAfter),
						duration: getSeconds(disappearDuration),
						ease: disappearEase,
						onComplete: () => onDisappearanceComplete?.(),
					});
				}
			},
		});

		tl.to(el, {
			autoAlpha: 1,
			filter: 'blur(0px)',
			duration: getSeconds(duration),
			ease,
		});

		const st = ScrollTrigger.create({
			trigger: el,
			scroller: (scrollerTarget as Element) || window,
			start: `top ${startPct}%`,
			once: true,
			onEnter: () => tl.play(),
		});

		cleanup = () => {
			st.kill();
			tl.kill();
			gsap.killTweensOf(el);
		};
	})();

	return () => {
		alive = false;
		cleanup?.();
	};
});
</script>

<div bind:this={el} class={className}>
	{@render children()}
</div>
