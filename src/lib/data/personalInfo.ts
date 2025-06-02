export type SubItem = {
    name: string;
    text: string;
    content: string;
};

// Define el tipo para un item principal (que puede contener subItems o contenido directo)
export type PersonalInfoItem = {
    name: string;
    iconColor: string;
    text: string;
    isOpen: boolean;
    subItems: { [key: string]: SubItem }; 
    content?: string; 
};


export type PersonalInfoItems = {
    [key: string]: PersonalInfoItem;
};

export const personalInfoItems: PersonalInfoItems = {
	bio: {
		name: 'bio',
		iconColor: 'text-red-500',
		text: 'bio',
		isOpen: true,
		subItems: {
			myBio: {
				name: 'my-bio',
				text: 'my-bio',
				content: `
### About Me

Hi there! I'm Denilson De La Rosa, a **full-stack web developer** and a **Computer Systems Engineer**. I was born in 2001, right here in **Xalapa, Veracruz**.

My passion lies in crafting complete web solutions, from the intricate logic of the backend to the engaging experiences of the frontend. With my engineering background, I bring a comprehensive and structured approach to every project I undertake.

What kind of web development challenges can I help you with today?`
			},
			experience: {
				name: 'experience',
				text: 'experience',
				content: `
### My Freelance Journey & Development Expertise

For the past two years, I've been immersed in the dynamic world of **freelance web development**, tackling a variety of small-scale projects. My primary focus has been on **backend development with Node.js**, building robust and scalable server-side solutions. I'm also adept at working with various **SQL and NoSQL databases** to ensure efficient data management.

However, my skills aren't limited to the backend. I also have solid **frontend development experience**, ranging from foundational **HTML and CSS** to working with modern **frameworks and meta-frameworks**. I'm proficient in **Vue (with Nuxt.js)**, **Svelte (with SvelteKit)**, and **React**, allowing me to craft engaging and responsive user interfaces.

My technical toolkit extends to **mobile application development**, where I've gained hands-on experience with **React Native** through various academic projects. I'm also comfortable working with **Linux** environments, and have experience with **Docker** for containerization and **Nginx** for web serving and reverse proxying, ensuring robust deployment and infrastructure management. Additionally, I'm adept at working with **Content Management Systems (CMS) like WordPress**, providing versatile solutions for content-driven websites.

I'm always eager to take on new challenges and contribute to innovative projects. What kind of development challenges are you currently facing?`
			}
		}
	},
	education: {
		name: 'education',
		iconColor: 'text-blue-500',
		text: 'education',
		isOpen: true,
		subItems: {
			university: {
				name: 'university',
				text: 'university',
				content: `
### Education & Innovation

I hold a degree in **Computer Systems Engineering with a specialization in Software** from the **Instituto Tecnológico Superior de Xalapa**.

During my studies, I had the privilege of making a **distinguished participation in InnovaTecNM**, a national event dedicated to fostering research, technological development, innovation, and entrepreneurship. My project, **SCANTEATE**, advanced through both the regional and national phases, showcasing my commitment to impactful technological solutions. You can learn more about it at [scanteate.com](https://scanteate.com).

What kind of innovative projects are you passionate about?`
			},
			skills: {
				name: 'skills',
				text: 'skills',
				content: `
### Technical Skill Set

My expertise spans a wide array of modern technologies, enabling me to deliver comprehensive and robust solutions.

**Programming Languages:**
* **JavaScript**
* **TypeScript**
* **Python**
* **Go**

**Web Core Languages:**
* **HTML**
* **CSS**

**Database Query Language:**
* **SQL**

---

### Backend & Infrastructure Development

I build powerful and efficient server-side applications using:
* **Node.js (Express)**
* **Bun.js (Elysia)**

Beyond application logic, I'm adept at managing deployment environments, utilizing:
* **Linux**
* **Docker** for containerization
* **Nginx** for web serving and reverse proxying

    **Databases & ORMs:**
    Proficient in managing and interacting with various database systems:
    * **SQL (MySQL, PostgreSQL)**
    * **NoSQL (MongoDB)**
    * Utilizing **Sequelize** and **Drizzle** for efficient Object-Relational Mapping.

---

### Frontend Development

Crafting intuitive and dynamic user interfaces with:
* **Vue (Nuxt.js)**
* **Svelte (SvelteKit)**
* **React**

    **CSS Frameworks:**
    For rapid and responsive styling, I leverage:
    * **Tailwind CSS**
    * **Bulma**
    * **Bootstrap**

---

### Mobile Development

Developing cross-platform mobile applications using:
* **React Native (Expo)**

---

I'm always keen to explore new technologies and apply my skills to exciting challenges. What's your next big project?`
			},
			certificates: {
				name: 'certificates',
				text: 'certificates',
				content: 'Graduated from Tech High School.'
			}
		}
	},
	interests: {
		name: 'interests',
		iconColor: 'text-green-500',
		text: 'interests',
		isOpen: false,
		subItems: {
			hobbies: {
				name: 'hobbies',
				text: 'hobbies',
				content: `### My Passions & Pursuits

When I'm not immersed in the daily grind, you can find me diving into a variety of activities that fuel my mind, body, and soul.

There's nothing quite like the thrill of **volleyball**, whether I'm on the court bumping, setting, or spiking. It's a fantastic way to stay active and connect with others.

When I crave open air and scenic views, I love hitting the trails on my **bike**. There's a unique sense of freedom that comes with cycling, especially when exploring new paths. And for a true challenge, I enjoy **hiking up hills**. The ascent is always rewarding, offering breathtaking vistas and a profound sense of accomplishment at the summit.

Beyond physical activity, I find immense joy in the simple pleasure of **listening to music**. Whether it's setting the mood for a quiet evening or providing the soundtrack to a vigorous workout, music is a constant companion. To recenter myself and find inner calm, I dedicate time to **meditation**, a practice that helps me stay grounded and focused. And, of course, a good book is never far from reach. **Reading** allows me to explore new worlds, gain fresh perspectives, and continuously learn.

What are some of your favorite ways to unwind and recharge?`
			},
			music: {
				name: 'music',
				text: 'music',
				content: `
### My Musical Palette

My musical tastes are incredibly diverse, and I appreciate almost every genre. From the energetic beats of **rap, trap, house, and electronic music** to the rhythms of **reggaeton, salsa, and banda**, I enjoy it all. I also find pleasure in **pop, rock, and classical music**.

Check out **[My Spotify profile](https://open.spotify.com/user/31kh5r7bqtijcxty53zicctkosua?si=e1e2023c86bd4917)** to hear what I've been listening to!`
			}
		}
	}
};

export type ContactItem = {
    type: 'email' | 'phone';
    value: string;
};

export const contactItems: ContactItem[] = [
	{
		type: 'email',
		value: 'imdenyl@gmail.com'
	},
	{
		type: 'phone',
		value: '+522284096902'
	}
];

export const codeSnippets = [
		{
			
			createdTime: '5 months ago',
			stars: 3,
			code: `function initializeModelChunk<T>(chunk: ResolvedModelChunk): T {
  const value: T = parseModel(chunk.response, chunk.value);
  const initializedChunk = initializeChunk<T>(chunk);
  initializedChunk._status = INITIALIZED; 
  initializedChunk._value = value;
  return value;
}`,
			description:
				'My work here was 5 months ago. It was for the project called "...". Some other text can be placed here.'
		},
		{
			createdTime: '9 months ago',
			stars: 8,
			code: `export function parseModelTuple(
  response: Response,
  value: [key: string]: $ReadOnlyArray<JSONValue>,
): any {
  const tuple: [mixed, mixed, mixed] = (value: any);
  // ...
}`,
			description: 'Another snippet showcasing a different utility function.'
		}
	];
