import type { Track } from '../audio/tracks';

export const STORAGE_KEY = 'portfolio-os:v1';
export const STORAGE_VERSION = 1;

export type PersistedOs = {
	version: number;
	volume: number;
	muted: boolean;
	theme: Track['theme'];
	trackId: string | null;
	time: number;
	unlocked: boolean;
};

const defaults: PersistedOs = {
	version: STORAGE_VERSION,
	volume: 0.7,
	muted: false,
	theme: 'synthwave',
	trackId: null,
	time: 0,
	unlocked: false,
};

export function loadPersisted(): PersistedOs {
	if (typeof localStorage === 'undefined') return { ...defaults };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...defaults };
		const parsed = JSON.parse(raw) as Partial<PersistedOs>;
		if (parsed.version !== STORAGE_VERSION) return { ...defaults };
		return {
			version: STORAGE_VERSION,
			volume:
				typeof parsed.volume === 'number'
					? Math.min(1, Math.max(0, parsed.volume))
					: defaults.volume,
			muted: parsed.muted === true,
			theme:
				parsed.theme === 'lofi' || parsed.theme === 'chiptune'
					? parsed.theme
					: 'synthwave',
			trackId: typeof parsed.trackId === 'string' ? parsed.trackId : null,
			time:
				typeof parsed.time === 'number' && Number.isFinite(parsed.time)
					? Math.max(0, parsed.time)
					: 0,
			unlocked: parsed.unlocked === true,
		};
	} catch {
		return { ...defaults };
	}
}

export function savePersisted(partial: Partial<PersistedOs>): void {
	if (typeof localStorage === 'undefined') return;
	try {
		const current = loadPersisted();
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ ...current, ...partial, version: STORAGE_VERSION }),
		);
	} catch {
		// almacenamiento lleno o bloqueado: ignorar
	}
}
