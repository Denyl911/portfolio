import { readFileSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';
import type { Post } from '../+page.server';

function parseFrontmatter(content: string): { frontmatter: Record<string, string>, body: string } {
	const lines = content.split('\n');
	if (lines[0] !== '---') return { frontmatter: {}, body: content };
	const endIndex = lines.slice(1).findIndex(line => line === '---') + 1;
	if (endIndex === 0) return { frontmatter: {}, body: content };
	const frontmatterLines = lines.slice(1, endIndex);
	const body = lines.slice(endIndex + 1).join('\n');
	const frontmatter: Record<string, string> = {};
	frontmatterLines.forEach(line => {
		const [key, ...value] = line.split(':');
		if (key && value.length) {
			frontmatter[key.trim()] = value.join(':').trim();
		}
	});
	return { frontmatter, body };
}

export async function load({ params }) {
	const { slug } = params;
	const filePath = join(process.cwd(), 'static', 'blog', `${slug}.md`);
	try {
		const content = readFileSync(filePath, 'utf-8');
		const { frontmatter, body } = parseFrontmatter(content);
		const post: Post = {
			slug,
			title: frontmatter.title || slug,
			date: frontmatter.date || '',
			excerpt: frontmatter.excerpt || '',
			image: frontmatter.image || '',
			content: await marked(body)
		};
		return { post };
	} catch (error) {
		throw new Error('Post not found');
	}
}