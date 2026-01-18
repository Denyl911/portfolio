import { locale } from 'svelte-i18n';
import cloudstorage from '$lib/assets/cloudstorage.png';
import crm from '$lib/assets/crm.png';
import ex1 from '$lib/assets/ex1.png';
import ex2 from '$lib/assets/ex2.png';
import ex3 from '$lib/assets/ex3.png';
import excelencia from '$lib/assets/excelencia-login.png';
import kid1 from '$lib/assets/kid1.png';
import kid2 from '$lib/assets/kid2.png';
import kid3 from '$lib/assets/kid3.png';
import kid4 from '$lib/assets/kid4.png';
import kidcash from '$lib/assets/kidcash.png';
import port1 from '$lib/assets/port1.png';
import port2 from '$lib/assets/port2.png';
import port3 from '$lib/assets/port3.png';
import portfolio from '$lib/assets/portfolio.png';
import scan1 from '$lib/assets/scan1.webp';
import scan2 from '$lib/assets/scan2.webp';
import scan3 from '$lib/assets/scan3.webp';
import scan4 from '$lib/assets/scan4.webp';
import scan5 from '$lib/assets/scan5.webp';
import scan6 from '$lib/assets/scan6.webp';
import scanteate from '$lib/assets/scanteate.png';
import trust from '$lib/assets/trust-login.png';
import trust1 from '$lib/assets/trust1.png';
import trust2 from '$lib/assets/trust2.png';
import trust3 from '$lib/assets/trust3.png';

export type Project = {
	id: number;
	title?: string;
	description?: string;
	longDescription?: string;
	imageUrl: string;
	icon:
		| 'html'
		| 'react native'
		| 'nodejs'
		| 'react'
		| 'vue'
		| 'bunjs'
		| 'svelte'
		| 'ionic';
	categories: string[];
	galleryImages?: string[];
	technologies: string[];
	projectLink?: string;
	githubLink?: string;
};

export const projectsData: Project[] = [
	{
		id: 1,
		imageUrl: trust,
		icon: 'vue',
		categories: ['HTML', 'Vue'],
		technologies: ['Vue.js', 'Nuxt', 'Bulma', 'Node.js', 'Express'],
		galleryImages: [trust, trust1, trust2, trust3],
	},
	{
		id: 2,
		imageUrl: scanteate,
		icon: 'react',
		categories: ['React', 'React Native', 'HTML'],
		technologies: [
			'React',
			'React Native',
			'NativeWind',
			'Expo',
			'Bun.js',
			'Elysia',
			'Anthropic AI',
		],
		githubLink: 'https://github.com/Denyl911/scanteate',
		projectLink: 'https://scanteate.com',
		galleryImages: [scan1, scan2, scan3, scan4, scan5, scan6],
	},
	{
		id: 3,
		imageUrl: excelencia,
		icon: 'html',
		categories: ['HTML', 'NodeJs'],
		technologies: ['HTML', 'CSS', 'Bootstrap', 'Node.js', 'Express'],
		galleryImages: [excelencia, ex1, ex2, ex3],
	},
	{
		id: 4,
		imageUrl: kidcash,
		icon: 'ionic',
		categories: ['Vue', 'HTML'],
		technologies: ['Vue.js', 'Maz-UI', 'Nuxt', 'Ionic', 'Capacitor'],
		githubLink: 'https://github.com/Denyl911/kidcash-web',
		galleryImages: [kidcash, kid4, kid3, kid2, kid1],
	},
	{
		id: 5,
		imageUrl: cloudstorage,
		icon: 'bunjs',
		categories: ['BunJs'],
		technologies: ['Bun.js', 'Elysia', 'TypeScript', 'Drizzle', 'Postgres'],
		galleryImages: [cloudstorage],
	},
	{
		id: 6,
		imageUrl: crm,
		icon: 'nodejs',
		categories: ['NodeJs'],
		technologies: ['Node.js', 'Express', 'JavaScript', 'Sequelize', 'MySQL'],
		galleryImages: [crm],
	},
	{
		id: 7,
		imageUrl: portfolio,
		icon: 'svelte',
		categories: ['Svelte', 'HTML'],
		technologies: ['Svelte', 'SvelteKit', 'Tailwindcss', 'TypeScript'],
		galleryImages: [portfolio, port2, port3, port1],
		githubLink: 'https://github.com/Denyl911/portfolio',
		projectLink: 'https://denyl.xyz/',
	},
];

export async function loadProjectsTranslations() {
	let lang = 'en';
	const unsubscribe = locale.subscribe((value) => {
		if (value) {
			lang = value;
		}
	});
	unsubscribe();

	try {
		const response = await fetch(`i18n/projects/${lang}.json`);
		const data = await response.json();

		// Merge the translated data with the static data
		return projectsData.map((project) => {
			const translatedProject = data.projects.find(
				(p: Project) => p.id === project.id,
			);
			return {
				...project,
				...translatedProject,
			};
		});
	} catch (error) {
		console.error('Error loading projects translations:', error);
		return projectsData;
	}
}
