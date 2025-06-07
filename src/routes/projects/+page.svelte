<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Square from 'lucide-svelte/icons/square';
	import CheckSquare from 'lucide-svelte/icons/check-square';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectModal from '$lib/components/ProjectModal.svelte';
	import { projectsData, type Project } from '$lib/data/projects';
	import XIcon from 'lucide-svelte/icons/x';
	import {
		SiReact,
		SiVuedotjs,
		SiSvelte,
		SiHtml5,
		SiNodedotjs,
		SiBun,
		SiExpo
	} from '@icons-pack/svelte-simple-icons';

	let showProjectModal: boolean = $state(false);
	let selectedProject: Project | null = $state(null);

	// Reactive state for desktop sidebar
	let personalInfoOpenDesktop: boolean = $state(true);

	// Reactive state for mobile sidebar
	let openMobileAccordion: string | null = $state('');

	// Project filtering logic
	let selectedCategories: string[] = $state(['HTML', 'React Native', 'BunJs']);

	function toggleCategory(category: string) {
		if (selectedCategories.includes(category)) {
			selectedCategories = selectedCategories.filter((cat) => cat !== category);
		} else {
			selectedCategories = [...selectedCategories, category];
		}
	}
	const filteredProjects = $derived(
		projectsData.filter((project) => {
			if (selectedCategories.length === 0) {
				return true;
			}
			return project.categories.some((category) => selectedCategories.includes(category));
		})
	);

	const categories = ['HTML', 'React', 'Vue', 'Svelte', 'React Native', 'NodeJs', 'BunJs'];

	function toggleMobileAccordion(section: string) {
		if (openMobileAccordion === section) {
			openMobileAccordion = null;
		} else {
			openMobileAccordion = section;
		}
	}

	function openProjectModal(project: Project) {
		selectedProject = project;
		showProjectModal = true;
	}

	function closeProjectModal() {
		showProjectModal = false;
		selectedProject = null; // Clear selected project when closing
	}
</script>

{#snippet showCategoryIcon(category: string)}
	{#if category == 'HTML'}
		<SiHtml5 size={16} />
	{/if}
	{#if category == 'React'}
		<SiReact size={16} />
	{/if}
	{#if category == 'Vue'}
		<SiVuedotjs size={16} />
	{/if}
	{#if category == 'Svelte'}
		<SiSvelte size={16} />
	{/if}
	{#if category == 'React Native'}
		<SiExpo size={16} />
	{/if}
	{#if category == 'NodeJs'}
		<SiNodedotjs size={16} />
	{/if}
	{#if category == 'BunJs'}
		<SiBun size={16} />
	{/if}
{/snippet}

<div
	class="flex-shrink-0 border-b border-[#1E2D3D] text-sm text-[#E5E9F0] lg:w-1/5 lg:border-r lg:border-b-0"
>
	<div class="hidden h-full overflow-y-auto lg:block">
		<div class="mb-4">
			<button
				data-interactive-cursor="dropdown"
				onclick={() => (personalInfoOpenDesktop = !personalInfoOpenDesktop)}
				class="flex h-[42px] w-full items-center pl-4 hover:text-[#C5C5C5] {personalInfoOpenDesktop
					? 'text-white'
					: ''} border-b border-[#1E2D3D]"
			>
				{#if personalInfoOpenDesktop}
					<ChevronDown class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{:else}
					<ChevronRight class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{/if}
				_projects
			</button>
			{#if personalInfoOpenDesktop}
				<div class="pt-2 pl-4">
					{#each categories as category (category)}
						<label
							data-interactive-cursor="navitem"
							class="flex cursor-pointer items-center py-1 {selectedCategories.includes(category)
								? 'text-cwhite'
								: 'text-midnight'}  hover:text-cwhite"
						>
							<input
								type="checkbox"
								class="hidden"
								checked={selectedCategories.includes(category)}
								onchange={() => toggleCategory(category)}
							/>
							{#if selectedCategories.includes(category)}
								<CheckSquare class="mr-2 h-4 w-4 text-[#43D9AD]" />
							{:else}
								<Square class="mr-2 h-4 w-4" />
							{/if}
							{@render showCategoryIcon(category)} <span class="ml-1">{category}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="lg:hidden">
		<div class="border-b border-[#1E2D3D] p-4">
			<h2 class="text-lg text-white">_projects</h2>
		</div>
		<div>
			<button
				onclick={() => toggleMobileAccordion('projects')}
				class="flex w-full items-center justify-between border-b border-[#1E2D3D] p-4 hover:bg-[#1E2D3D]/30"
			>
				<span class="flex items-center text-white">
					{#if openMobileAccordion === 'projects'}
						<ChevronDown class="mr-2 h-4 w-4 transition-transform duration-200" />
					{:else}
						<ChevronRight class="mr-2 h-4 w-4 transition-transform duration-200" />
					{/if}
					_projects
				</span>
			</button>
			{#if openMobileAccordion === 'projects'}
				<div class="bg-[#011221] pl-4 text-sm">
					{#each categories as category (category)}
						<label class="flex cursor-pointer items-center py-2 hover:text-[#C5C5C5]">
							<input
								type="checkbox"
								class="hidden"
								checked={selectedCategories.includes(category)}
								onchange={() => toggleCategory(category)}
							/>
							{#if selectedCategories.includes(category)}
								<CheckSquare class="mr-2 h-4 w-4 text-[#43D9AD]" />
							{:else}
								<Square class="mr-2 h-4 w-4" />
							{/if}
							{category}
						</label>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<div class="flex flex-grow flex-col overflow-hidden">
	<div class="hidden h-[42px] flex-shrink-0 border-b border-[#1E2D3D] lg:flex">
		{#if selectedCategories.length > 0}
			<div
				data-interactive-cursor="text"
				class="flex items-center border-r border-[#1E2D3D] px-4 text-white"
			>
				{selectedCategories.join(', ')}
				<button
					class="ml-1 cursor-pointer"
					data-interactive-cursor="btn"
					onclick={() => (selectedCategories = [])}
				>
					<XIcon class=" h-3 w-3 text-[#E5E9F0] hover:text-[#C5C5C5]" />
				</button>
			</div>
		{:else}
			<div class="flex items-center border-r border-[#1E2D3D] px-4 text-white">All Projects</div>
		{/if}
	</div>

	<div class="flex-grow overflow-y-auto p-4 lg:p-6">
		<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
			{#each filteredProjects as project (project.id)}
				<ProjectCard {project} openModal={openProjectModal} />
			{/each}
		</div>
	</div>
</div>
<ProjectModal project={selectedProject} showModal={showProjectModal} onClose={closeProjectModal} />

<style>
	input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}
</style>
