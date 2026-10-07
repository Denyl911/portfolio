import { browser } from '$app/environment';
import { loadPersisted, savePersisted } from '../state/persistence';
import { type MusicTheme, TRACKS, type Track, tracksByTheme } from './tracks';

export type { MusicTheme, Track };

const FFT_SIZE = 2048;

class AudioEngine {
	playing = $state(false);
	currentTime = $state(0);
	duration = $state(0);
	volume = $state(0.7);
	muted = $state(false);
	trackIndex = $state(0);
	theme = $state<MusicTheme>('synthwave');
	ready = $state(false);
	hasSpectrum = $state(false);
	error = $state<string | null>(null);

	private el: HTMLAudioElement | null = null;
	private ctx: AudioContext | null = null;
	private analyser: AnalyserNode | null = null;
	private gain: GainNode | null = null;
	private source: MediaElementAudioSourceNode | null = null;
	private skipCount = 0;
	private pendingTime: number | null = null;
	private saveTimer: ReturnType<typeof setTimeout> | null = null;
	private restored = false;

	get playlist(): Track[] {
		return tracksByTheme(this.theme);
	}

	/** Nº de bins del analizador (fftSize / 2). Para dimensionar el Uint8Array. */
	get binCount(): number {
		return this.analyser?.frequencyBinCount ?? FFT_SIZE / 2;
	}

	get track(): Track {
		const list = this.playlist;
		if (list.length === 0) return TRACKS[0];
		return list[Math.min(this.trackIndex, list.length - 1)];
	}

	/** Llamado una vez por OsAudioHost al montar el <audio> persistente. */
	attach(el: HTMLAudioElement): void {
		if (this.el === el) return;
		this.detach();
		this.el = el;
		el.preload = 'metadata';
		el.crossOrigin = 'anonymous';
		el.volume = this.muted ? 0 : this.volume;

		if (!this.restored) {
			this.restored = true;
			const saved = loadPersisted();
			this.volume = saved.volume;
			this.muted = saved.muted;
			this.theme = saved.theme;
			el.volume = this.muted ? 0 : this.volume;
			const list = this.playlist;
			const idx = saved.trackId
				? list.findIndex((t) => t.id === saved.trackId)
				: 0;
			this.trackIndex = idx >= 0 ? idx : 0;
			this.pendingTime = saved.time > 0 ? saved.time : null;
			if (!el.src) el.src = this.track.src;
		} else if (!el.src) {
			el.src = this.track.src;
		}

		el.ontimeupdate = () => {
			this.currentTime = el.currentTime ?? 0;
			this.scheduleSave();
		};
		el.ondurationchange = () => {
			this.duration = Number.isFinite(el.duration) ? el.duration : 0;
		};
		el.onloadedmetadata = () => {
			this.duration = Number.isFinite(el.duration) ? el.duration : 0;
			if (this.pendingTime != null) {
				try {
					el.currentTime = Math.min(
						this.pendingTime,
						Math.max(0, (el.duration || 1) - 1),
					);
				} catch {
					/* seek no soportado aún */
				}
				this.pendingTime = null;
			}
		};
		el.onplay = () => {
			this.playing = true;
			this.error = null;
		};
		el.onpause = () => {
			this.playing = false;
			this.persistNow();
		};
		el.onended = () => this.next();
		el.onerror = () => {
			this.error = 'No se pudo cargar la pista';
			// Saltar una vez por pista; si la siguiente también falla, detenerse.
			if (this.skipCount < 1) {
				this.skipCount++;
				this.next(true);
			} else {
				this.playing = false;
			}
		};
		el.onwaiting = () => {
			/* buffering: se mantiene el último frame del visualizador */
		};
		this.updateMediaSession();
	}

	detach(): void {
		if (this.el) {
			this.el.ontimeupdate = null;
			this.el.ondurationchange = null;
			this.el.onloadedmetadata = null;
			this.el.onplay = null;
			this.el.onpause = null;
			this.el.onended = null;
			this.el.onerror = null;
			this.el.onwaiting = null;
			this.el = null;
		}
	}

	/** Crea/reanuda el AudioContext. Solo llamar desde un gesto de usuario. */
	async unlock(): Promise<void> {
		if (!browser || !this.el) return;
		if (!this.ctx) {
			const AC =
				window.AudioContext ??
				(window as unknown as { webkitAudioContext?: typeof AudioContext })
					.webkitAudioContext;
			if (!AC) {
				this.hasSpectrum = false;
				this.ready = true;
				return;
			}
			this.ctx = new AC();
			this.analyser = this.ctx.createAnalyser();
			this.analyser.fftSize = FFT_SIZE;
			this.analyser.smoothingTimeConstant = 0.8;
			this.gain = this.ctx.createGain();
			this.gain.gain.value = this.muted ? 0 : this.volume;
			// createMediaElementSource: una sola vez por elemento.
			this.source = this.ctx.createMediaElementSource(this.el);
			this.source.connect(this.analyser);
			this.analyser.connect(this.gain);
			this.gain.connect(this.ctx.destination);
			this.hasSpectrum = true;
		}
		if (this.ctx.state === 'suspended') {
			try {
				await this.ctx.resume();
			} catch {
				/* reintentar en el próximo gesto */
			}
		}
		this.ready = true;
	}

	async play(): Promise<void> {
		if (!browser || !this.el) return;
		if (!this.ready) await this.unlock();
		this.error = null;
		try {
			await this.el.play();
		} catch {
			// play() rechazado (p. ej. sin gesto): se mantiene pausado.
			this.playing = false;
		}
	}

	pause(): void {
		this.el?.pause();
		this.playing = false;
		this.persistNow();
	}

	async toggle(): Promise<void> {
		if (this.playing) this.pause();
		else await this.play();
	}

	next(silent = false): void {
		const list = this.playlist;
		if (list.length === 0) return;
		const wasPlaying = this.playing || silent;
		this.trackIndex = (this.trackIndex + 1) % list.length;
		this.loadCurrent(wasPlaying);
	}

	prev(): void {
		const list = this.playlist;
		if (list.length === 0) return;
		// Como los reproductores clásicos: si pasó de 3 s, reinicia la pista.
		if (this.el && this.el.currentTime > 3) {
			this.seek(0);
			return;
		}
		const wasPlaying = this.playing;
		this.trackIndex = (this.trackIndex - 1 + list.length) % list.length;
		this.loadCurrent(wasPlaying);
	}

	select(index: number): void {
		if (index === this.trackIndex) {
			void this.play();
			return;
		}
		this.trackIndex = index;
		this.loadCurrent(true);
	}

	seek(seconds: number): void {
		if (!this.el) return;
		try {
			this.el.currentTime = Math.max(
				0,
				Math.min(seconds, this.duration || seconds),
			);
			this.currentTime = this.el.currentTime;
		} catch {
			/* ignorar */
		}
		this.scheduleSave();
	}

	setVolume(v: number): void {
		this.volume = Math.min(1, Math.max(0, v));
		if (this.el) this.el.volume = this.muted ? 0 : this.volume;
		if (this.gain && this.ctx)
			this.gain.gain.value = this.muted ? 0 : this.volume;
		savePersisted({ volume: this.volume });
	}

	setMuted(m: boolean): void {
		this.muted = m;
		if (this.el) this.el.volume = m ? 0 : this.volume;
		if (this.gain && this.ctx) this.gain.gain.value = m ? 0 : this.volume;
		savePersisted({ muted: m });
	}

	setTheme(t: MusicTheme): void {
		if (t === this.theme) return;
		const wasPlaying = this.playing;
		const currentId = this.track.id;
		this.theme = t;
		const list = this.playlist;
		// Conservar la pista si existe en el nuevo tema; si no, empezar en 0.
		const idx = list.findIndex((tr) => tr.id === currentId);
		this.trackIndex = idx >= 0 ? idx : 0;
		this.loadCurrent(wasPlaying);
		savePersisted({ theme: t, trackId: this.track.id });
	}

	getFrequencyData(out: Uint8Array): void {
		if (this.analyser && this.playing) {
			this.analyser.getByteFrequencyData(out as Uint8Array<ArrayBuffer>);
		} else {
			out.fill(0);
		}
	}

	private loadCurrent(autoplay: boolean): void {
		const el = this.el;
		if (!el) return;
		this.skipCount = 0;
		this.error = null;
		this.currentTime = 0;
		this.duration = 0;
		el.src = this.track.src;
		try {
			el.load();
		} catch {
			/* ignorar */
		}
		savePersisted({ trackId: this.track.id, time: 0 });
		this.updateMediaSession();
		if (autoplay) void this.play();
	}

	private scheduleSave(): void {
		if (this.saveTimer) return;
		this.saveTimer = setTimeout(() => {
			this.saveTimer = null;
			this.persistNow();
		}, 1000);
	}

	private persistNow(): void {
		savePersisted({
			volume: this.volume,
			muted: this.muted,
			theme: this.theme,
			trackId: this.track.id,
			time: this.currentTime,
		});
	}

	private updateMediaSession(): void {
		if (!browser || !('mediaSession' in navigator)) return;
		try {
			const t = this.track;
			navigator.mediaSession.metadata = new MediaMetadata({
				title: t.title,
				artist: t.artist,
				artwork: [{ src: t.cover, sizes: '256x256', type: 'image/svg+xml' }],
			});
			navigator.mediaSession.setActionHandler('play', () => void this.play());
			navigator.mediaSession.setActionHandler('pause', () => this.pause());
			navigator.mediaSession.setActionHandler('previoustrack', () =>
				this.prev(),
			);
			navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
		} catch {
			/* Media Session no disponible */
		}
	}
}

const g = globalThis as unknown as { __portfolioAudio?: AudioEngine };
if (!g.__portfolioAudio) g.__portfolioAudio = new AudioEngine();
export const audio: AudioEngine = g.__portfolioAudio;
