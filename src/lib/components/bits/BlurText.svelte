<script lang="ts">
	type AnimSnap = Record<string, string | number>;

	type Props = {
		text?: string;
		delay?: number;
		class?: string;
		animateBy?: 'words' | 'letters';
		direction?: 'top' | 'bottom';
		threshold?: number;
		rootMargin?: string;
		animationFrom?: AnimSnap;
		animationTo?: AnimSnap[];
		easing?:
			| string
			| number[]
			| ((t: number) => number);
		onAnimationComplete?: () => void;
		stepDuration?: number;
	};

	let {
		text = '',
		delay = 200,
		class: className = '',
		animateBy = 'words',
		direction = 'top',
		threshold = 0.1,
		rootMargin = '0px',
		animationFrom,
		animationTo,
		easing = (t: number) => t,
		onAnimationComplete,
		stepDuration = 0.35
	}: Props = $props();

	const elements = $derived(animateBy === 'words' ? text.split(' ') : text.split(''));

	let inView = $state(false);
	let containerEl: HTMLParagraphElement | undefined = $state();
	let spanEls: (HTMLSpanElement | undefined)[] = $state([]);

	$effect(() => {
		if (!containerEl) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					inView = true;
					if (containerEl) observer.unobserve(containerEl);
				}
			},
			{ threshold, rootMargin }
		);
		observer.observe(containerEl);
		return () => observer.disconnect();
	});

	const defaultFrom = $derived<AnimSnap>(
		direction === 'top'
			? { filter: 'blur(10px)', opacity: 0, y: -50 }
			: { filter: 'blur(10px)', opacity: 0, y: 50 }
	);

	const defaultTo = $derived<AnimSnap[]>([
		{ filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
		{ filter: 'blur(0px)', opacity: 1, y: 0 }
	]);

	const fromSnapshot = $derived<AnimSnap>(animationFrom ?? defaultFrom);
	const toSnapshots = $derived<AnimSnap[]>(animationTo ?? defaultTo);

	function toCssValue(prop: string, v: string | number): string {
		if (prop === 'y') return `translateY(${typeof v === 'number' ? v + 'px' : v})`;
		if (prop === 'x') return `translateX(${typeof v === 'number' ? v + 'px' : v})`;
		return String(v);
	}

	function easeFn(t: number): number {
		if (typeof easing === 'function') return (easing as (t: number) => number)(t);
		return t;
	}

	function applyInitial(el: HTMLElement, snap: AnimSnap) {
		const props: Record<string, string> = {};
		for (const [k, v] of Object.entries(snap)) {
			if (k === 'y') {
				props.transform = `translateY(${typeof v === 'number' ? v + 'px' : v})`;
			} else if (k === 'x') {
				props.transform = `${props.transform ?? ''} translateX(${typeof v === 'number' ? v + 'px' : v})`.trim();
			} else if (k === 'filter') {
				props.filter = String(v);
			} else if (k === 'opacity') {
				props.opacity = String(v);
			} else {
				(el.style as unknown as Record<string, string>)[k] = String(v);
			}
		}
		if (props.transform) el.style.transform = props.transform;
		if (props.filter !== undefined) el.style.filter = props.filter;
		if (props.opacity !== undefined) el.style.opacity = props.opacity;
	}

	// Set initial styles immediately on mount
	$effect(() => {
		// re-run when snapshots change
		void fromSnapshot;
		spanEls.forEach((el) => el && applyInitial(el, fromSnapshot));
	});

	$effect(() => {
		if (!inView) return;
		// Reduced motion: snap to final state, no animation.
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
			spanEls.forEach((el) => {
				if (!el) return;
				const last = toSnapshots[toSnapshots.length - 1] ?? {};
				const final = { ...fromSnapshot, ...last };
				for (const [k, v] of Object.entries(final)) {
					if (k === 'y') el.style.transform = toCssValue(k, v);
					else if (k === 'x')
						el.style.transform = `${el.style.transform ?? ''} ${toCssValue(k, v)}`.trim();
					else if (k === 'filter') el.style.filter = String(v);
					else if (k === 'opacity') el.style.opacity = String(v);
				}
			});
			onAnimationComplete?.();
			return;
		}

		const stepCount = toSnapshots.length + 1;
		const totalDuration = stepDuration * (stepCount - 1);
		const times = Array.from({ length: stepCount }, (_, i) =>
			stepCount === 1 ? 0 : i / (stepCount - 1)
		);

		const animations: Array<{ stop: () => void }> = [];

		spanEls.forEach((el, index) => {
			if (!el) return;

			// WAAPI keyframes: transform-only + opacity (composited). Filter
			// animates on the compositor in Chromium but can fall back to
			// paint; keep it to 2 steps to bound cost.
			const frames: Keyframe[] = [{ ...mapSnap(fromSnapshot) }];
			for (const snap of toSnapshots) frames.push(mapSnap({ ...fromSnapshot, ...snap }));

			const anim = el.animate(frames, {
				duration: totalDuration * 1000,
				delay: index * delay,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
				fill: 'both'
			});

			void easeFn;
			void times;

			if (index === elements.length - 1 && onAnimationComplete) {
				anim.finished.then(() => onAnimationComplete?.()).catch(() => {});
			}

			animations.push({ stop: () => anim.cancel() });
		});

		return () => {
			animations.forEach((a) => a.stop());
		};
	});

	function mapSnap(snap: AnimSnap): Keyframe {
		const out: Record<string, string> = {};
		let transform = '';
		for (const [k, v] of Object.entries(snap)) {
			if (k === 'y' || k === 'x') transform += ` ${toCssValue(k, v)}`;
			else if (k === 'filter') out.filter = String(v);
			else if (k === 'opacity') out.opacity = String(v);
		}
		if (transform.trim()) out.transform = transform.trim();
		return out;
	}
</script>

<p bind:this={containerEl} class="blur-text {className} flex flex-wrap">
	{#each elements as segment, index (index)}
		<span
			bind:this={spanEls[index]}
			style:display="inline-block"
			style:will-change="transform, filter, opacity"
		>
			{segment === ' ' ? '\u00A0' : segment}{animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
		</span>
	{/each}
</p>
