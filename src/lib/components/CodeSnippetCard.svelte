<script>
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-jsx';
import myAvatar from '$lib/assets/me-dither.webp';

let {
	code,
	description,
	username = '@Denyl911',
	avatarUrl = myAvatar,
	createdTime = 'some time ago',
	lang = 'typescript',
} = $props();
</script>

<div class="w-full rounded-lg border border-[#1E2D3D] bg-[#011221] p-4 text-sm">
	<div class="mb-3 flex items-center justify-between">
		<div class="flex items-center">
			<picture>
				<source srcset={avatarUrl} type="image/webp">
				<img
					src={avatarUrl.replace('.webp', '.png')}
					alt={username}
					class="mr-3 h-8 w-8 rounded-full"
					loading="lazy"
				>
			</picture>
			<div>
				<p class="text-[#4D5BCE]">{username}</p>
				<p class="text-midnight text-xs">Created {createdTime}</p>
			</div>
		</div>
	</div>

	<div class="mb-3 overflow-x-auto rounded bg-[#010C15] p-3">
		<pre
			class="whitespace-pre-wrap"
			data-interactive-cursor="code"
		><code class="text-xs"
				>{@html Prism.highlight(code, Prism.languages[lang], lang)}</code
			></pre>
	</div>

	{#if description}
		<div class="flex items-start justify-between">
			<p class="text-midnight pr-2 text-xs">{description}</p>
		</div>
	{/if}
</div>
