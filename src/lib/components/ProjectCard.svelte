<script lang="ts">
	import { type Project } from '$lib/data/projects';
	import {
		SiReact,
		SiVuedotjs,
		SiSvelte,
		SiHtml5,
		SiNodedotjs,
		SiBun,
		SiExpo,
		SiIonic
	} from '@icons-pack/svelte-simple-icons';

	let { project, openModal }: { project: Project; openModal: (project: Project) => void } =
		$props();
</script>

<div class="overflow-hidden rounded-lg border border-[#1E2D3D] bg-[#020618]">
	<div class="relative h-48 bg-gray-700">
		<img src={project.imageUrl} alt={project.title} class="h-full w-full object-cover" />
		<div class="absolute top-2 right-2 rounded-md border border-[#1E2D3D] bg-[#011627] p-1">
			{#if project.icon == 'html'}
				<SiHtml5 color="#bf5e2a" size={16} />
			{/if}
			{#if project.icon == 'react'}
				<SiReact color="#53c1de" size={16} />
			{/if}
			{#if project.icon == 'vue'}
				<SiVuedotjs color="#81c784" size={16} />
			{/if}
			{#if project.icon == 'svelte'}
				<SiSvelte color="#fe3d00" size={16} />
			{/if}
			{#if project.icon == 'react native'}
				<SiExpo color="#ffffff" size={16} />
			{/if}
			{#if project.icon == 'nodejs'}
				<SiNodedotjs color="#268e45" size={16} />
			{/if}
			{#if project.icon == 'bunjs'}
				<SiBun color="#dbd0be" size={16} />
			{/if}
			{#if project.icon == 'ionic'}
				<SiIonic color="#4e8ff6" size={16} />
			{/if}
		</div>
	</div>
	<div class="p-4">
		<h3 class="mb-2 text-lg text-white">
			<span class="font-bold text-indigo-500">Project {project.id}</span> // _{project.title}
		</h3>
		<p class="mb-4 text-sm text-[#607B96]">
			{project.description}
		</p>
		<button
			class="cursor-pointer rounded-lg bg-slate-600 px-4 py-2 text-sm text-[#E5E9F0] transition-colors duration-300 hover:bg-[#ffb86a] hover:text-[#01080E]"
			onclick={() => openModal(project)}
		>
			view-project
		</button>
	</div>
</div>
