import { audio } from '../audio/engine.svelte';
import { loadPersisted, savePersisted } from './persistence';

export type ScreenEffect = null | 'matrix' | 'retro';

class OsState {
	unlocked = $state(false);
	activeApp = $state<string | null>(null);
	miniplayerDismissed = $state(false);
	appState = $state<Record<string, unknown>>({});
	screenEffect = $state<ScreenEffect>(null);
	/** Interruptor manual "Reducir efectos" (además de la media query). */
	reduceMotion = $state(false);
	restored = $state(false);

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = loadPersisted();
			this.unlocked = saved.unlocked;
			// Sin autoplay: si ya se desbloqueó antes, se muestra la home/app
			// pero el audio solo arranca con gesto.
			this.activeApp = saved.unlocked ? 'music' : null;
			this.restored = true;
		}
	}

	async unlock(): Promise<void> {
		this.unlocked = true;
		this.miniplayerDismissed = false;
		this.activeApp = 'music';
		savePersisted({ unlocked: true });
		await audio.unlock();
		await audio.play();
	}

	openApp(id: string): void {
		this.activeApp = id;
		this.miniplayerDismissed = false;
	}

	goHome(): void {
		this.activeApp = null;
	}

	dismissMiniplayer(): void {
		this.miniplayerDismissed = true;
	}

	/** Al reanudar la reproducción se levanta el descarte manual. */
	notifyPlaying(): void {
		if (this.miniplayerDismissed) this.miniplayerDismissed = false;
	}

	saveAppState<T>(appId: string, state: T): void {
		this.appState = { ...this.appState, [appId]: state };
	}

	loadAppState<T>(appId: string): T | undefined {
		return this.appState[appId] as T | undefined;
	}
}

// Singleton. En dev, proteger de HMR con doble instancia.
const g = globalThis as unknown as { __portfolioOs?: OsState };
if (!g.__portfolioOs) g.__portfolioOs = new OsState();
export const os: OsState = g.__portfolioOs;
if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		/* el singleton sobrevive en globalThis */
	});
}
