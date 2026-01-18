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

	let { project, openModal }: { project: Project; openModal: (project: Project) => void } = $props();
</script>

<div class="overflow-hidden rounded-lg border border-[#1E2D3D] bg-[#020618] hvr-bob">
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
	<div class="p-4" data-interactive-cursor="navitem">
		<h3 class="mb-2 text-lg text-white">
			<span class="font-bold text-indigo-500">Project {project.id}</span> // _{project.title}
		</h3>
		<p class="mb-4 text-sm text-[#607B96]">
			{project.description}
		</p>
		<button
		    data-interactive-cursor="btn"
			class="cursor-pointer rounded-lg bg-slate-600 px-4 py-2 text-sm text-[#E5E9F0] transition-colors duration-300 hover:bg-[#ffb86a] hover:text-[#01080E]"
			onclick={() => openModal(project)}
		>
			{$_('viewProject')}
		</button>
	</div>
</div>

<style>
	@-webkit-keyframes hvr-bob {
  0% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
  }
  50% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
  }
  100% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
  }
}
@keyframes hvr-bob {
  0% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
  }
  50% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
  }
  100% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
  }
}
@-webkit-keyframes hvr-bob-float {
  100% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
  }
}
@keyframes hvr-bob-float {
  100% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
  }
}
.hvr-bob {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
}
.hvr-bob:hover, .hvr-bob:focus, .hvr-bob:active {
  -webkit-animation-name: hvr-bob-float, hvr-bob;
  animation-name: hvr-bob-float, hvr-bob;
  -webkit-animation-duration: .3s, 1.5s;
  animation-duration: .3s, 1.5s;
  -webkit-animation-delay: 0s, .3s;
  animation-delay: 0s, .3s;
  -webkit-animation-timing-function: ease-out, ease-in-out;
  animation-timing-function: ease-out, ease-in-out;
  -webkit-animation-iteration-count: 1, infinite;
  animation-iteration-count: 1, infinite;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-direction: normal, alternate;
  animation-direction: normal, alternate;
}

</style>
