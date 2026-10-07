import type { Component } from 'svelte';

export type OsApp = {
	id: string;
	name: string;
	/** Componente o nombre de icono. En MVP: string con nombre de icono lucide. */
	icon: string;
	component: () => Promise<{ default: Component }>;
	enabled: boolean;
	keepAlive?: boolean;
};
