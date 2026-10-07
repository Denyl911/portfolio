export type MusicTheme = 'synthwave' | 'lofi' | 'chiptune';

export type Track = {
	id: string;
	title: string;
	artist: string;
	theme: MusicTheme;
	src: string;
	cover: string;
	license: string;
	attribution?: string;
	duration?: number;
};

export const THEMES: { id: MusicTheme; name: string; accent: string }[] = [
	{ id: 'synthwave', name: 'Synthwave', accent: '#fe53bb' },
	{ id: 'lofi', name: 'Lofi', accent: '#43d9ad' },
	{ id: 'chiptune', name: 'Chiptune', accent: '#fea55f' },
];

// Pistas procedurales CC0 generadas para el MVP (ver scripts/generate-os-audio.py).
// Desviación documentada del plan (§7): 2 pistas por tema (6 en total) en WAV
// en lugar de 3 por tema en Opus/MP3, hasta conseguir licencias externas reales.
const CC0 = 'CC0';
const ATTR =
	'Pista procedural generada para este portafolio (dominio público).';

export const TRACKS: Track[] = [
	{
		id: 'neon-drive',
		title: 'Neón Nocturno',
		artist: 'Circuito Fantasma',
		theme: 'synthwave',
		src: '/audio/neon-drive.wav',
		cover: '/audio/covers/neon-drive.svg',
		license: CC0,
		attribution: ATTR,
	},
	{
		id: 'midnight-grid',
		title: 'Rejilla Medianoche',
		artist: 'Circuito Fantasma',
		theme: 'synthwave',
		src: '/audio/midnight-grid.wav',
		cover: '/audio/covers/midnight-grid.svg',
		license: CC0,
		attribution: ATTR,
	},
	{
		id: 'cafe-lluvia',
		title: 'Café y Lluvia',
		artist: 'Taza Rota',
		theme: 'lofi',
		src: '/audio/cafe-lluvia.wav',
		cover: '/audio/covers/cafe-lluvia.svg',
		license: CC0,
		attribution: ATTR,
	},
	{
		id: 'ventana-abierta',
		title: 'Ventana Abierta',
		artist: 'Taza Rota',
		theme: 'lofi',
		src: '/audio/ventana-abierta.wav',
		cover: '/audio/covers/ventana-abierta.svg',
		license: CC0,
		attribution: ATTR,
	},
	{
		id: 'pixel-quest',
		title: 'Misión Píxel',
		artist: 'Chip Casero',
		theme: 'chiptune',
		src: '/audio/pixel-quest.wav',
		cover: '/audio/covers/pixel-quest.svg',
		license: CC0,
		attribution: ATTR,
	},
	{
		id: 'jefe-final',
		title: 'Jefe Final',
		artist: 'Chip Casero',
		theme: 'chiptune',
		src: '/audio/jefe-final.wav',
		cover: '/audio/covers/jefe-final.svg',
		license: CC0,
		attribution: ATTR,
	},
];

export function tracksByTheme(theme: MusicTheme): Track[] {
	return TRACKS.filter((t) => t.theme === theme);
}

export function themeAccent(theme: MusicTheme): string {
	return THEMES.find((t) => t.id === theme)?.accent ?? '#43d9ad';
}
