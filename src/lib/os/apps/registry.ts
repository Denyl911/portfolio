import type { OsApp } from './types';

export const apps: OsApp[] = [
	{
		id: 'music',
		name: 'Música',
		icon: 'music',
		enabled: true,
		keepAlive: true,
		component: () => import('./music/MusicApp.svelte'),
	},
	{
		id: 'terminal',
		name: 'Terminal',
		icon: 'terminal',
		enabled: false,
		component: () => import('./ComingSoon.svelte'),
	},
	{
		id: 'games',
		name: 'Juegos',
		icon: 'games',
		enabled: false,
		keepAlive: true,
		component: () => import('./ComingSoon.svelte'),
	},
	{
		id: 'messages',
		name: 'Mensajes',
		icon: 'messages',
		enabled: false,
		component: () => import('./ComingSoon.svelte'),
	},
	// Las apps futuras sustituyen su component por su import() real
	// sin tocar Phone.svelte ni OsHost: solo cambian enabled y component.
];

export function getApp(id: string): OsApp | undefined {
	return apps.find((a) => a.id === id);
}

export function enabledApps(): OsApp[] {
	return apps.filter((a) => a.enabled);
}
