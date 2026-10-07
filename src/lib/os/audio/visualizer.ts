/**
 * Dibuja el espectro de barras en un canvas 2D. Función pura salvo el
 * contexto y el estado de normalización que recibe por parámetro.
 */
export type VisualizerOptions = {
	bars?: number;
	accent?: string;
	idle?: boolean;
	time?: number;
	reducedMotion?: boolean;
};

/**
 * Estado de la normalización dinámica (AGC). Uno por instancia de
 * visualizador: guarda el pico suavizado para escalar cada frame
 * respecto a la señal real en lugar de al máximo teórico (255).
 */
export type SpectrumNorm = {
	peak: number;
};

export function createSpectrumNorm(): SpectrumNorm {
	return { peak: 0 };
}

const GATE = 0.02;

export function drawSpectrum(
	ctx: CanvasRenderingContext2D,
	data: Uint8Array | null,
	width: number,
	height: number,
	opts: VisualizerOptions = {},
	norm?: SpectrumNorm,
): void {
	const bars = opts.bars ?? 32;
	const accent = opts.accent ?? '#43d9ad';
	const time = opts.time ?? 0;
	ctx.clearRect(0, 0, width, height);
	const gap = Math.max(1, Math.floor(width / bars / 6));
	const bw = width / bars;
	const bins = data ? data.length : 0;

	// 1. Valores crudos con mapeo logarítmico (más resolución en graves).
	const raw: number[] = new Array(bars).fill(0);
	if (data && !opts.idle && !opts.reducedMotion) {
		for (let i = 0; i < bars; i++) {
			const lo = Math.min(bins - 1, Math.floor(bins * (i / bars) ** 2));
			const hi = Math.min(
				bins,
				Math.max(lo + 1, Math.floor(bins * ((i + 1) / bars) ** 2)),
			);
			let peak = 0;
			for (let b = lo; b < hi; b++) peak = Math.max(peak, data[b]);
			// Máximo (no promedio): un armónico aislado no se diluye
			// entre los bins vacíos de su banda. Realce fuerte de agudos
			// para compensar su menor energía natural.
			raw[i] = (peak / 255) * (1 + 3 * (i / bars) ** 2);
		}
	}

	// 2. Normalización dinámica: ataque rápido, liberación lenta.
	let scale = 1;
	let gated = false;
	if (norm && data && !opts.idle && !opts.reducedMotion) {
		const peak = Math.max(...raw);
		norm.peak += (peak - norm.peak) * (peak > norm.peak ? 0.5 : 0.06);
		if (norm.peak < GATE) {
			gated = true;
		} else {
			scale = 1 / norm.peak;
		}
	}

	for (let i = 0; i < bars; i++) {
		let v: number;
		if (opts.reducedMotion) {
			// Barras estáticas deterministas
			v = 0.18 + 0.1 * Math.abs(Math.sin(i * 1.7));
		} else if (opts.idle || !data || gated) {
			// Respiración suave sintética cuando no hay audio (o silencio)
			v = 0.1 + 0.06 * (0.5 + 0.5 * Math.sin(time / 900 + i * 0.55));
		} else {
			v = Math.min(1, raw[i] * scale) ** 0.8;
			// Suelo mínimo con respiración leve para que ninguna barra
			// quede totalmente plana mientras suena música.
			v = Math.max(
				v,
				0.04 + 0.03 * (0.5 + 0.5 * Math.sin(time / 700 + i * 0.5)),
			);
		}
		const h = Math.max(2, v * height);
		const x = i * bw + gap / 2;
		ctx.fillStyle = accent;
		ctx.globalAlpha = 0.55 + 0.45 * v;
		ctx.fillRect(x, height - h, bw - gap, h);
	}
	ctx.globalAlpha = 1;
}
