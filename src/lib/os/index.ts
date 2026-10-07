export { apps, enabledApps, getApp } from './apps/registry';
export type { OsApp } from './apps/types';
export { audio, type MusicTheme, type Track } from './audio/engine.svelte';
export { THEMES, TRACKS, themeAccent, tracksByTheme } from './audio/tracks';
export { drawSpectrum } from './audio/visualizer';
export { os, type ScreenEffect } from './state/os.svelte';
