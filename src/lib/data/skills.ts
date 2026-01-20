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
		category: 'Programming Languages'
	},
	{
		name: 'TypeScript',
		icon: 'SiTypescript',
		level: 85,
		category: 'Programming Languages'
	},
	{
		name: 'Python',
		icon: 'SiPython',
		level: 80,
		category: 'Programming Languages'
	},
	{
		name: 'React',
		icon: 'SiReact',
		level: 88,
		category: 'Frameworks & Libraries'
	},
	{
		name: 'Svelte',
		icon: 'SiSvelte',
		level: 85,
		category: 'Frameworks & Libraries'
	},
	{
		name: 'Node.js',
		icon: 'SiNodedotjs',
		level: 82,
		category: 'Frameworks & Libraries'
	},
	{
		name: 'HTML',
		icon: 'SiHtml5',
		level: 95,
		category: 'Web Technologies'
	},
	{
		name: 'CSS',
		icon: 'SiCss3',
		level: 90,
		category: 'Web Technologies'
	},
	{
		name: 'Tailwind CSS',
		icon: 'SiTailwindcss',
		level: 85,
		category: 'Web Technologies'
	},
	{
		name: 'Git',
		icon: 'SiGit',
		level: 88,
		category: 'Tools'
	},
	{
		name: 'Docker',
		icon: 'SiDocker',
		level: 75,
		category: 'Tools'
	},
	{
		name: 'Figma',
		icon: 'SiFigma',
		level: 70,
		category: 'Design'
	}
];

export const skillCategories = [...new Set(skills.map(skill => skill.category))];