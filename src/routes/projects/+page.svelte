<script lang="ts">
import {
	SiBun,
	SiExpo,
	SiHtml5,
	SiNodedotjs,
	SiReact,
	SiSolid,
	SiStripe,
	SiSvelte,
	SiTauri,
	SiVuedotjs,
} from '@icons-pack/svelte-simple-icons';
import CheckSquare from 'lucide-svelte/icons/check-square';
import ChevronDown from 'lucide-svelte/icons/chevron-down';
import ChevronRight from 'lucide-svelte/icons/chevron-right';
import SparklesIcon from 'lucide-svelte/icons/sparkles';
import Square from 'lucide-svelte/icons/square';
import XIcon from 'lucide-svelte/icons/x';
// biome-ignore lint/correctness/noUnusedImports: translation
import { _, locale } from 'svelte-i18n';
import Particles from '$lib/components/Particles.svelte';
import ProjectCard from '$lib/components/ProjectCard.svelte';
import ProjectModal from '$lib/components/ProjectModal.svelte';
import { loadProjectsTranslations, type Project } from '$lib/data/projects';

let showProjectModal: boolean = $state(false);
let selectedProject: Project | null = $state(null);

// Reactive state for desktop sidebar
let personalInfoOpenDesktop: boolean = $state(true);

// Reactive state for mobile sidebar
let openMobileAccordion: string | null = $state('');

const categories = [
	'Svelte',
	'React',
	'Vue',
	'Solid',
	'React Native',
	'Tauri',
	'NodeJs',
	'BunJs',
	'AI',
	'Stripe',
	'HTML',
];

// Project filtering logic: start with everything visible so no project
// is hidden on first load. Empty selection also means "show all".
let selectedCategories: string[] = $state([...categories]);

// Projects data
let projects = $state<Project[]>([]);

async function loadProjects() {
	projects = await loadProjectsTranslations();
}

function toggleCategory(category: string) {
	if (selectedCategories.includes(category)) {
		selectedCategories = selectedCategories.filter((cat) => cat !== category);
	} else {
		selectedCategories = [...selectedCategories, category];
	}
}
const filteredProjects = $derived(
	projects.filter((project) => {
		if (selectedCategories.length === 0) {
			return true;
		}
		return project.categories.some((category) =>
			selectedCategories.includes(category),
		);
	}),
);

// Stable key for the grid: re-animate only when the visible set changes,
// not when the selection order changes.
const filteredKey = $derived(filteredProjects.map((p) => p.id).join(','));

// Per-category counts (0 until translations load).
const categoryCounts = $derived(
	Object.fromEntries(
		categories.map((category) => [
			category,
			projects.filter((p) => p.categories.includes(category)).length,
		]),
	) as Record<string, number>,
);

const allSelected = $derived(selectedCategories.length === categories.length);

function toggleAll() {
	selectedCategories = allSelected ? [] : [...categories];
}

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

$effect(() => {
	const unsubscribe = locale.subscribe(async (lang) => {
		if (lang) {
			await loadProjects();
		}
	});
	return unsubscribe;
});
</script>

{#snippet showCategoryIcon(category: string)}
	{#if category === 'HTML'}
		<SiHtml5 size={16} />
	{/if}
	{#if category === 'React'}
		<SiReact size={16} />
	{/if}
	{#if category === 'Vue'}
		<SiVuedotjs size={16} />
	{/if}
	{#if category === 'Svelte'}
		<SiSvelte size={16} />
	{/if}
	{#if category === 'React Native'}
		<SiExpo size={16} />
	{/if}
	{#if category === 'NodeJs'}
		<SiNodedotjs size={16} />
	{/if}
	{#if category === 'BunJs'}
		<SiBun size={16} />
	{/if}
	{#if category === 'Solid'}
		<SiSolid size={16} />
	{/if}
	{#if category === 'Tauri'}
		<SiTauri size={16} />
	{/if}
	{#if category === 'Stripe'}
		<SiStripe size={16} />
	{/if}
	{#if category === 'AI'}
		<SparklesIcon size={16} />
	{/if}
{/snippet}

<div
	class="text-cwhite relative flex-grow bg-gradient-to-br from-[#011627] to-[#0a2442]"
>
	<div
		class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
		aria-hidden="true"
	>
		<Particles />
	</div>

	<div class="flex h-screen relative z-10">
		<div
			class="flex-shrink-0 border-b border-white/20 text-sm text-[#E5E9F0] lg:w-1/7 lg:border-r lg:border-b-0 bg-black/20 backdrop-blur-lg"
		>
			<div class="hidden h-full overflow-y-auto lg:block">
				<div class="mb-4">
					<button
						type="button"
						data-interactive-cursor="dropdown"
						onclick={() => (personalInfoOpenDesktop = !personalInfoOpenDesktop)}
						class="flex h-[42px] w-full items-center pl-4 hover:text-[#C5C5C5] {personalInfoOpenDesktop
					? 'text-white'
					: ''} border-b border-[#1E2D3D]"
					>
						{#if personalInfoOpenDesktop}
							<ChevronDown
								class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
							/>
						{:else}
							<ChevronRight
								class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
							/>
						{/if}
						{$_('_technologies')}
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
									>
									{#if selectedCategories.includes(category)}
										<CheckSquare class="mr-2 h-4 w-4 text-[#41d5aa]" />
									{:else}
										<Square class="mr-2 h-4 w-4" />
									{/if}
									{@render showCategoryIcon(category)}
									<span class="ml-1">{category}</span>
									<span class="ml-auto pr-4 text-xs text-[#607B96]"
										>{categoryCounts[category] ?? 0}</span
									>
								</label>
							{/each}
							<button
								type="button"
								data-interactive-cursor="btn"
								onclick={toggleAll}
								class="mt-2 cursor-pointer pr-4 text-xs text-[#607B96] hover:text-cwhite"
							>
								{allSelected ? $_('clearAll') : $_('selectAll')}
							</button>
						</div>
					{/if}
				</div>
			</div>

			<div class="lg:hidden">
				<div class="border-b border-[#1E2D3D] p-4">
					<h2 class="text-lg text-white">_categories</h2>
				</div>
				<div>
					<button
						type="button"
						onclick={() => toggleMobileAccordion('projects')}
						class="flex w-full items-center justify-between border-b border-[#1E2D3D] p-4 hover:bg-[#1E2D3D]/30"
					>
						<span class="flex items-center text-white">
							{#if openMobileAccordion === 'projects'}
								<ChevronDown
									class="mr-2 h-4 w-4 transition-transform duration-200"
								/>
							{:else}
								<ChevronRight
									class="mr-2 h-4 w-4 transition-transform duration-200"
								/>
							{/if}
							{$_('projects')}
						</span>
					</button>
					{#if openMobileAccordion === 'projects'}
						<div class="bg-[#011221] pl-4 text-sm">
							{#each categories as category (category)}
								<label
									class="flex cursor-pointer items-center py-2 hover:text-[#C5C5C5]"
								>
									<input
										type="checkbox"
										class="hidden"
										checked={selectedCategories.includes(category)}
										onchange={() => toggleCategory(category)}
									>
									{#if selectedCategories.includes(category)}
										<CheckSquare class="mr-2 h-4 w-4 text-[#41d5aa]" />
									{:else}
										<Square class="mr-2 h-4 w-4" />
									{/if}
									{@render showCategoryIcon(category)}
									<span class="ml-1">{category}</span>
									<span class="ml-auto pr-4 text-xs text-[#607B96]"
										>{categoryCounts[category] ?? 0}</span
									>
								</label>
							{/each}
							<button
								type="button"
								onclick={toggleAll}
								class="w-full py-2 pr-4 text-left text-xs text-[#607B96] hover:text-[#C5C5C5]"
							>
								{allSelected ? $_('clearAll') : $_('selectAll')}
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex flex-grow flex-col overflow-hidden">
			<div
				class="hidden h-[42px] flex-shrink-0 border-b border-[#1E2D3D] lg:flex"
			>
				{#if selectedCategories.length > 0 && !allSelected}
					<div
						data-interactive-cursor="text"
						class="flex items-center border-r border-[#1E2D3D] px-4 text-white"
					>
						{selectedCategories.join(', ')}
						<button
							type="button"
							class="ml-1 cursor-pointer"
							data-interactive-cursor="btn"
							onclick={() => (selectedCategories = [])}
						>
							<XIcon class=" h-3 w-3 text-[#E5E9F0] hover:text-[#C5C5C5]" />
						</button>
					</div>
				{:else}
					<div
						class="flex items-center border-r border-[#1E2D3D] px-4 text-white"
					>
						{$_('allProjects')}
					</div>
				{/if}
			</div>

			<div class="flex-grow overflow-y-auto p-4 lg:p-6">
				{#key filteredKey}
					{#if filteredProjects.length === 0}
						<p class="text-center text-sm text-[#607B96]">
							{$_('noProjects')}
						</p>
					{:else}
						<div
							class="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
						>
							{#each filteredProjects as project, i (project.id)}
								<div
									class="card-enter h-full"
									style="animation-delay: {Math.min(i, 8) * 50}ms"
								>
									<ProjectCard {project} openModal={openProjectModal} />
								</div>
							{/each}
						</div>
					{/if}
				{/key}
			</div>
		</div>
		<ProjectModal
			project={selectedProject}
			showModal={showProjectModal}
			onClose={closeProjectModal}
		/>
	</div>
</div>

<style>
input[type="checkbox"] {
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
}

.card-enter {
	animation: card-enter 0.6s ease both;
	will-change: opacity, transform;
}

@keyframes card-enter {
	from {
		opacity: 0;
		transform: translateY(16px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@media (prefers-reduced-motion: reduce) {
	.card-enter {
		animation: none;
	}
}
</style>
