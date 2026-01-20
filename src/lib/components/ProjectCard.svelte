<script lang="ts">
	import {
		SiBun,
		SiExpo,
		SiHtml5,
		SiIonic,
		SiNodedotjs,
		SiReact,
		SiSvelte,
		SiVuedotjs
	} from '@icons-pack/svelte-simple-icons';
	import { _ } from 'svelte-i18n';
	import { type Project } from '$lib/data/projects';

	let { project, openModal }: { project: Project; openModal: (project: Project) => void } =
		$props();
</script>

<div
	class="group hover:shadow-3xl flex h-full flex-col overflow-hidden rounded-xl border border-white/20 bg-black/20 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:scale-105"
>
	<div class="relative h-48 overflow-hidden">
		<picture>
			<source srcset={project.imageUrl} type="image/webp" />
			<img
				src={project.imageUrl.replace('.webp', '.png')}
				alt={project.title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
				loading="lazy"
			/>
		</picture>
		<div
			class="absolute top-3 right-3 rounded-lg border border-white/20 bg-black/50 p-2 backdrop-blur-sm"
		>
			{#if project.icon == 'html'}
				<SiHtml5 color="#bf5e2a" size={20} />
			{:else if project.icon == 'react'}
				<SiReact color="#53c1de" size={20} />
			{:else if project.icon == 'vue'}
				<SiVuedotjs color="#81c784" size={20} />
			{:else if project.icon == 'svelte'}
				<SiSvelte color="#fe3d00" size={20} />
			{:else if project.icon == 'react native'}
				<SiExpo color="#ffffff" size={20} />
			{:else if project.icon == 'nodejs'}
				<SiNodedotjs color="#268e45" size={20} />
			{:else if project.icon == 'bunjs'}
				<SiBun color="#dbd0be" size={20} />
			{:else if project.icon == 'ionic'}
				<SiIonic color="#4e8ff6" size={20} />
			{/if}
		</div>
		<div
			class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		></div>
	</div>
	<div class="p-6" data-interactive-cursor="navitem">
		<h3 class="text-cwhite mb-3 text-xl font-semibold transition-colors">
			<span class="font-bold text-[#615fff]">Project {project.id}</span>
			<span class="text-white transition-colors group-hover:text-[#607B96]">// {project.title}</span
			>
		</h3>
		<p class="mb-6 text-sm leading-relaxed text-gray-300">
			{project.description}
		</p>
		<button
			data-interactive-cursor="btn"
			class="w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#45556c] to-[#3a4658] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-[#ffb86a] hover:to-[#FEA55F] hover:shadow-lg focus:outline focus:outline-2 focus:outline-[#ffb86a]"
			onclick={() => openModal(project)}
		>
			{$_('viewProject')}
		</button>
	</div>
</div>
