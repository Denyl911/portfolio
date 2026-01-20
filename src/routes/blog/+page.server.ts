import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';

export interface Post {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	image: string;
	content: string;
}

function parseFrontmatter(content: string): {
	frontmatter: Record<string, string>;
	body: string;
} {
	const lines = content.split('\n');
	if (lines[0] !== '---') return { frontmatter: {}, body: content };
	const endIndex = lines.slice(1).findIndex((line) => line === '---') + 1;
	if (endIndex === 0) return { frontmatter: {}, body: content };
	const frontmatterLines = lines.slice(1, endIndex);
	const body = lines.slice(endIndex + 1).join('\n');
	const frontmatter: Record<string, string> = {};
	frontmatterLines.forEach((line) => {
		const [key, ...value] = line.split(':');
		if (key && value.length) {
			frontmatter[key.trim()] = value.join(':').trim();
		}
	});
	return { frontmatter, body };
}

export async function load() {
	const postsDir = join(process.cwd(), 'static', 'blog');
	const files = readdirSync(postsDir).filter((file) => file.endsWith('.md'));
	const posts: Post[] = files
		.map((file) => {
			const slug = file.replace('.md', '');
			const content = readFileSync(join(postsDir, file), 'utf-8');
			const { frontmatter, body } = parseFrontmatter(content);
			return {
				slug,
				title: frontmatter.title || slug,
				date: frontmatter.date || '',
				excerpt: frontmatter.excerpt || '',
				image: frontmatter.image || '',
				content: body,
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
}
