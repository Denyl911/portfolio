import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

const defaultTheme: Theme = 'light';

const initialTheme = browser ? (localStorage.getItem('theme') as Theme) || defaultTheme : defaultTheme;

export const theme = writable<Theme>(initialTheme);

if (browser) {
    theme.subscribe((value) => {
        localStorage.setItem('theme', value);
        document.documentElement.classList.toggle('dark', value === 'dark');
    });
}