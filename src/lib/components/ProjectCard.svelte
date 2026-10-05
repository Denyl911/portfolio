<script lang="ts">
import { onMount } from 'svelte';
// biome-ignore lint/correctness/noUnusedImports: transalations
import { _ } from 'svelte-i18n';
import GlareHover from '$lib/components/bits/GlareHover.svelte';
import SpotlightCard from '$lib/components/bits/SpotlightCard.svelte';
import {
	getProjectBadge,
	type Project,
	type ProjectBadge,
} from '$lib/data/projects';

let {
	project,
	openModal,
}: { project: Project; openModal: (project: Project) => void } = $props();

// Heavy pointer effects only on precise pointers; touch gets the flat card.
let reduceEffects = $state(true);
onMount(() => {
	reduceEffects =
		(window.matchMedia?.('(pointer: coarse)').matches ?? true) ||
		(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
});

const badge = $derived(getProjectBadge(project));
const visibleTechs = $derived((project.technologies ?? []).slice(0, 4));
const extraTechs = $derived(
	Math.max(0, (project.technologies ?? []).length - 4),
);

const badgeStyles: Record<ProjectBadge, string> = {
	Mobile: 'border-emerald-400/30 bg-emerald-950/70 text-emerald-300',
	API: 'border-sky-400/30 bg-sky-950/70 text-sky-300',
	Backend: 'border-violet-400/30 bg-violet-950/70 text-violet-300',
	Featured: 'border-amber-400/30 bg-amber-950/70 text-amber-300',
	CLI: 'border-slate-400/30 bg-slate-900/70 text-slate-300',
	Scraper: 'border-orange-400/30 bg-orange-950/70 text-orange-300',
	Desktop: 'border-cyan-400/30 bg-cyan-950/70 text-cyan-300',
	Web: 'border-cyan-400/30 bg-cyan-950/70 text-cyan-300',
};
</script>

{#snippet cardBody()}
	<div class="relative aspect-[16/10] overflow-hidden">
		<picture>
			<source srcset={project.imageUrl} type="image/webp">
			<img
				src={project.imageUrl.replace('.webp', '.png')}
				alt={project.title ?? 'Project preview'}
				width={800}
				height={500}
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			>
		</picture>
		{#if badge}
			<span
				class="absolute top-3 right-3 rounded-md border px-2 py-1 text-[11px] font-medium backdrop-blur-sm {badgeStyles[badge]}"
			>
				{badge}
			</span>
		{/if}
		<div
			class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90"
		></div>
	</div>
	<div
		class="flex flex-1 flex-col p-4 sm:p-5"
		data-interactive-cursor="navitem"
	>
		<h3 class="mb-2 text-lg font-semibold">
			<span class="font-bold text-[#615fff]">Project {project.id}</span>
			<span class="text-white">// {project.title}</span>
		</h3>
		<p
			class="mb-3 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-gray-300"
		>
			{project.description}
		</p>
		{#if visibleTechs.length > 0}
			<!-- biome-ignore lint/a11y/useAriaPropsSupportedByRole: <explanation> -->
			<div class="mb-4 flex flex-wrap gap-1.5" aria-label="Technologies">
				{#each visibleTechs as tech (tech)}
					<span
						class="rounded-md border border-white/10 bg-[#1E2D3D]/80 px-2 py-0.5 text-[11px] text-gray-300"
					>
						{tech}
					</span>
				{/each}
				{#if extraTechs > 0}
					<span
						class="rounded-md border border-white/10 bg-[#1E2D3D]/80 px-2 py-0.5 text-[11px] text-[#607B96]"
					>
						+{extraTechs}
					</span>
				{/if}
			</div>
		{/if}
		<button
			type="button"
			data-interactive-cursor="btn"
			onclick={() => openModal(project)}
			class="mt-auto flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#45556c]/60 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ffb86a] hover:to-[#FEA55F] hover:text-[#01080E] focus:outline focus:outline-2 focus:outline-[#ffb86a]"
		>
			{$_('viewProject')} <span aria-hidden="true">→</span>
		</button>
	</div>
{/snippet}

{#if reduceEffects}
	<article
		class="group flex h-full flex-col overflow-hidden rounded-xl border border-white/20 bg-black/20"
	>
		{@render cardBody()}
	</article>
{:else}
	<SpotlightCard
		spotlightColor="rgba(97, 95, 255, 0.25)"
		class="h-full !rounded-xl !border-white/20 !bg-black/20 !p-0 backdrop-blur-lg"
	>
		<GlareHover
			width="100%"
			height="100%"
			background="transparent"
			borderRadius="12px"
			borderColor="transparent"
			glareOpacity={0.25}
			transitionDuration={650}
			class="!border-0"
		>
			<article class="group flex h-full flex-col overflow-hidden rounded-xl">
				{@render cardBody()}
			</article>
		</GlareHover>
	</SpotlightCard>
{/if}
