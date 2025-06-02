import trust from '$lib/assets/trust-login.png';
import trust1 from '$lib/assets/trust1.png';
import trust2 from '$lib/assets/trust2.png';
import trust3 from '$lib/assets/trust3.png';
import ex1 from '$lib/assets/ex1.png';
import ex2 from '$lib/assets/ex2.png';
import ex3 from '$lib/assets/ex3.png';
import kid1 from '$lib/assets/kid1.png';
import kid2 from '$lib/assets/kid2.png';
import kid3 from '$lib/assets/kid3.png';
import kid4 from '$lib/assets/kid4.png';
import scan1 from '$lib/assets/scan1.webp';
import scan2 from '$lib/assets/scan2.webp';
import scan3 from '$lib/assets/scan3.webp';
import scan4 from '$lib/assets/scan4.webp';
import scan5 from '$lib/assets/scan5.webp';
import scan6 from '$lib/assets/scan6.webp';
import port1 from '$lib/assets/port1.png';
import port2 from '$lib/assets/port2.png';
import port3 from '$lib/assets/port3.png';
import excelencia from '$lib/assets/excelencia-login.png';
import scanteate from '$lib/assets/scanteate.png';
import portfolio from '$lib/assets/portfolio.png';
import kidcash from '$lib/assets/kidcash.png';
import cloudstorage from '$lib/assets/cloudstorage.png';
import crm from '$lib/assets/crm.png';

export type Project = {
	id: number;
	title: string;
	description: string;
	longDescription?: string;
	imageUrl: string;
	icon: 'html' | 'react native' | 'nodejs' | 'react' | 'vue' | 'bunjs' | 'svelte' | 'ionic'; // Extend as needed
	categories: string[];
	galleryImages?: string[];
	technologies: string[];
	projectLink?: string; // Optional link to the live project
	githubLink?: string; // Optional link to the GitHub repository
};

export const projectsData: Project[] = [
	{
		id: 1,
		title: 'trust-generator',
		description: 'Policyholder management system.',
		longDescription:
			'TrustGenerator is an insured management system whose front-end is developed in Vue.js and the back-end in nodejs with Express.',
		imageUrl: trust,
		icon: 'vue',
		categories: ['HTML', 'Vue'],
		technologies: ['Vue.js', 'Nuxt', 'Bulma', 'Node.js', 'Express'],
		galleryImages: [trust, trust1, trust2, trust3]
	},
	{
		id: 2,
		title: 'scanteate',
		description: 'Mobile app to support the socio-emotional development of children with autism.',
		longDescription: `SCANTEATE is a mobile app to support the socio-emotional development of children with autism. Its main strength is its versatility and combination of tools, as it has a live emotional detection system; just click a button and the emotion will be present.`,
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
			'Anthropic AI'
		],
		githubLink: 'https://github.com/Denyl911/scanteate',
		projectLink: 'https://scanteate.com',
		galleryImages: [scan1, scan2, scan3, scan4, scan5, scan6]
	},
	{
		id: 3,
		title: 'la-excelencia-joyeria',
		description: 'Point of sale system.',
		longDescription:
			'A point of sale that is responsible for recording sales, managing inventory, processing payments, generating reports, and much more.',
		imageUrl: excelencia,
		icon: 'html',
		categories: ['HTML', 'NodeJs'],
		technologies: ['HTML', 'CSS', 'Bootstrap', 'Node.js', 'Express'],
		galleryImages: [excelencia, ex1, ex2, ex3]
	},
	{
		id: 4,
		title: 'kidcash',
		description: 'Mobile app to promote good financial health in children.',
		longDescription:
			'Mobile app to promote good financial health in children. It has activities, reminders and a user-friendly interface.',
		imageUrl: kidcash,
		icon: 'ionic',
		categories: ['Vue', 'HTML'],
		technologies: ['Vue.js', 'Maz-UI', 'Nuxt', 'Ionic', 'Capacitor'],
		githubLink: 'https://github.com/Denyl911/kidcash-web',
		galleryImages: [kidcash, kid4, kid3, kid2, kid1]
	},
	{
		id: 5,
		title: 'cloud-storage',
		description: 'Cloud File Management API.',
		longDescription:
			'Drive-style cloud file management API developed with innovative technologies.',
		imageUrl: cloudstorage,
		icon: 'bunjs',
		categories: ['BunJs'],
		technologies: ['Bun.js', 'Elysia', 'TypeScript', 'Drizzle', 'Postgres'],
		galleryImages: [cloudstorage]
	},
	{
		id: 6,
		title: 'crm-api',
		description: 'Customer Relationship Management API',
		longDescription:
			'Customer Relationship Management API with contact management, project management, analytics and reporting, etc.',
		imageUrl: crm,
		icon: 'nodejs',
		categories: ['NodeJs'],
		technologies: ['Node.js', 'Express', 'JavaScript', 'Sequelize', 'MySQL'],
		galleryImages: [crm]
	},
	{
		id: 7,
		title: 'portfolio',
		description: 'This portfolio.',
		longDescription: 'This portfolio features a distinct design concept, developed in Svelte',
		imageUrl: portfolio,
		icon: 'svelte',
		categories: ['Svelte', 'HTML'],
		technologies: ['Svelte', 'SvelteKit', 'Tailwindcss', 'TypeScript'],
		galleryImages: [portfolio, port2, port3, port1],
		githubLink: 'https://github.com/Denyl911/portfolio',
		projectLink: 'https://portfolio-ten-pi-fy8ulyawlq.vercel.app/'
	}
];
