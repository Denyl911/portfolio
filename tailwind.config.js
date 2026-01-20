/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['Fira Code', 'monospace'],
			},
			typography: () => ({
				pinky: {
					css: {
						'--tw-prose-body': 'var(--color-midnight)',
						'--tw-prose-headings': '#979fae',
						'--tw-prose-lead': 'var(--color-white-700)',
						'--tw-prose-links': 'var(--color-white-900)',
						'--tw-prose-bold': 'var(--color-white-900)',
						'--tw-prose-counters': 'var(--color-white-600)',
						'--tw-prose-bullets': 'var(--color-white-400)',
						'--tw-prose-hr': 'var(--color-white-300)',
						'--tw-prose-quotes': 'var(--color-white-900)',
						'--tw-prose-quote-borders': 'var(--color-white-300)',
						'--tw-prose-captions': 'var(--color-white-700)',
						'--tw-prose-code': 'var(--color-white-900)',
						'--tw-prose-pre-code': 'var(--color-white-100)',
						'--tw-prose-pre-bg': 'var(--color-white-900)',
						'--tw-prose-th-borders': 'var(--color-white-300)',
						'--tw-prose-td-borders': 'var(--color-white-200)',
						'--tw-prose-invert-body': 'var(--color-white-200)',
						'--tw-prose-invert-headings': 'var(--color-white)',
						'--tw-prose-invert-lead': 'var(--color-white-300)',
						'--tw-prose-invert-links': 'var(--color-white)',
						'--tw-prose-invert-bold': 'var(--color-white)',
						'--tw-prose-invert-counters': 'var(--color-white-400)',
						'--tw-prose-invert-bullets': 'var(--color-white-600)',
						'--tw-prose-invert-hr': 'var(--color-white-700)',
						'--tw-prose-invert-quotes': 'var(--color-white-100)',
						'--tw-prose-invert-quote-borders': 'var(--color-white-700)',
						'--tw-prose-invert-captions': 'var(--color-white-400)',
						'--tw-prose-invert-code': 'var(--color-white)',
						'--tw-prose-invert-pre-code': 'var(--color-white-300)',
						'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
						'--tw-prose-invert-th-borders': 'var(--color-white-600)',
						'--tw-prose-invert-td-borders': 'var(--color-white-700)'
					}
				}
			})
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
