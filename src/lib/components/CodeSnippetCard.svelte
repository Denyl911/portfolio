<script>
	// @ts-ignore
	import Prism from 'prismjs';
	import 'prismjs/themes/prism-okaidia.css';
	import 'prismjs/components/prism-typescript.js';
	import 'prismjs/components/prism-sql';
	import 'prismjs/components/prism-jsx';
	import myAvatar from '$lib/assets/avatar.png';
	let {
		code,
		description,
		username = '@Denyl911',
		avatarUrl = myAvatar,
		createdTime = 'some time ago',
		lang = 'typescript',
		stars = 0
	} = $props();

	// SVG for Star icon
	const starIcon = `<svg class="w-4 h-4 fill-current text-midnight" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
	// SVG for Close X icon
	const closeIcon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
</script>

<div class="mb-6 rounded-lg border border-[#1E2D3D] bg-[#011221] p-4 text-sm">
	<div class="mb-3 flex items-center justify-between">
		<div class="flex items-center">
			<img src={avatarUrl} alt={username} class="mr-3 h-8 w-8 rounded-full" />
			<div>
				<p class="text-[#4D5BCE]">{username}</p>
				<p class="text-midnight text-xs">Created {createdTime}</p>
			</div>
		</div>
		<!-- <div class="flex items-center text-midnight">
			<button class="hover:text-[#E5E9F0]">{@html starIcon} {stars} stars</button>
		</div> -->
	</div>

	<div class="mb-3 overflow-x-auto rounded bg-[#010C15] p-3">
		<pre class="whitespace-pre-wrap"><code class="text-xs"
				>{@html Prism.highlight(code, Prism.languages[lang], lang)}</code
			></pre>
	</div>

	{#if description}
		<div class="flex items-start justify-between">
			<p class="text-midnight pr-2 text-xs">{description}</p>
			<!-- <button class="flex-shrink-0 text-midnight hover:text-[#E5E9F0]">{@html closeIcon}</button> -->
		</div>
	{/if}
</div>
