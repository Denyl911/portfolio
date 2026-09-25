export type Skill = {
	name: string;
	icon: string; // Icon name from @icons-pack/svelte-simple-icons or lucide-svelte
	level: number; // 0-100
	category: string;
};

export const skills: Skill[] = [
	{
		name: 'JavaScript',
		icon: 'SiJavascript',
		level: 90,
		category: 'Programming Languages',
	},
	{
		name: 'TypeScript',
		icon: 'SiTypescript',
		level: 88,
		category: 'Programming Languages',
	},
	{
		name: 'Python',
		icon: 'SiPython',
		level: 78,
		category: 'Programming Languages',
	},
	{
		name: 'React',
		icon: 'SiReact',
		level: 88,
		category: 'Frameworks & Libraries',
	},
	{
		name: 'React Native',
		icon: 'SiReact',
		level: 84,
		category: 'Frameworks & Libraries',
	},
	{
		name: 'Svelte',
		icon: 'SiSvelte',
		level: 86,
		category: 'Frameworks & Libraries',
	},
	{
		name: 'SolidJS',
		icon: 'SiSolid',
		level: 74,
		category: 'Frameworks & Libraries',
	},
	{
		name: 'Node.js',
		icon: 'SiNodedotjs',
		level: 84,
		category: 'Frameworks & Libraries',
	},
	{
		name: 'Bun.js',
		icon: 'SiBun',
		level: 88,
		category: 'Backend & APIs',
	},
	{
		name: 'Elysia',
		icon: '',
		level: 87,
		category: 'Backend & APIs',
	},
	{
		name: 'Firebase',
		icon: 'SiFirebase',
		level: 78,
		category: 'Backend & APIs',
	},
	{
		name: 'PostgreSQL',
		icon: 'SiPostgresql',
		level: 84,
		category: 'Databases & ORMs',
	},
	{
		name: 'MySQL',
		icon: 'SiMysql',
		level: 82,
		category: 'Databases & ORMs',
	},
	{
		name: 'Drizzle ORM',
		icon: 'SiDrizzle',
		level: 86,
		category: 'Databases & ORMs',
	},
	{
		name: 'Expo',
		icon: 'SiExpo',
		level: 83,
		category: 'Mobile & Desktop',
	},
	{
		name: 'Tauri',
		icon: 'SiTauri',
		level: 78,
		category: 'Mobile & Desktop',
	},
	{
		name: 'Stripe',
		icon: 'SiStripe',
		level: 86,
		category: 'Payments & Automation',
	},
	{
		name: 'Telegram Bots',
		icon: 'SiTelegram',
		level: 82,
		category: 'Payments & Automation',
	},
	{
		name: 'OpenAI',
		icon: 'SiOpenai',
		level: 80,
		category: 'Payments & Automation',
	},
	{
		name: 'Anthropic',
		icon: 'SiAnthropic',
		level: 78,
		category: 'Payments & Automation',
	},
	{
		name: 'WordPress',
		icon: 'SiWordpress',
		level: 75,
		category: 'Payments & Automation',
	},
	{
		name: 'HTML',
		icon: 'SiHtml5',
		level: 95,
		category: 'Web Technologies',
	},
	{
		name: 'CSS',
		icon: 'SiCss3',
		level: 90,
		category: 'Web Technologies',
	},
	{
		name: 'Tailwind CSS',
		icon: 'SiTailwindcss',
		level: 88,
		category: 'Web Technologies',
	},
	{
		name: 'Git',
		icon: 'SiGit',
		level: 88,
		category: 'Tools',
	},
	{
		name: 'Docker',
		icon: 'SiDocker',
		level: 76,
		category: 'Tools',
	},
	{
		name: 'AWS S3',
		icon: 'SiAmazons3',
		level: 75,
		category: 'Tools',
	},
	{
		name: 'Figma',
		icon: 'SiFigma',
		level: 70,
		category: 'Design',
	},
];

export const skillCategories = [
	...new Set(skills.map((skill) => skill.category)),
];
