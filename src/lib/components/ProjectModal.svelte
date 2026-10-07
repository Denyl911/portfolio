<script lang="ts">
import { SiGithub } from '@icons-pack/svelte-simple-icons';
import ChevronLeft from 'lucide-svelte/icons/chevron-left';
import ChevronRight from 'lucide-svelte/icons/chevron-right';
import ExternalLink from 'lucide-svelte/icons/external-link';
import Images from 'lucide-svelte/icons/images';
import XIcon from 'lucide-svelte/icons/x';
import { untrack } from 'svelte';
// biome-ignore lint/correctness/noUnusedImports: translations
import { _ } from 'svelte-i18n';
import {
	getProjectBadge,
	type Project,
	type ProjectBadge,
} from '$lib/data/projects';

let {
	project,
	showModal,
	onClose,
}: { project: Project | null; showModal: boolean; onClose: () => void } =
	$props();

let dialogEl = $state<HTMLDialogElement | null>(null);
let currentImageIndex = $state(0);

const badge = $derived(project ? getProjectBadge(project) : null);
const images = $derived(project?.galleryImages ?? []);
const hasGallery = $derived(images.length > 0);
const hasMultiple = $derived(images.length > 1);

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

function navigateGallery(direction: 'next' | 'prev') {
	if (images.length < 2) return;
	currentImageIndex =
		direction === 'next'
			? (currentImageIndex + 1) % images.length
			: (currentImageIndex - 1 + images.length) % images.length;
}

// Keep the native dialog in sync with the `showModal` prop.
$effect(() => {
	if (!dialogEl) return;
	if (showModal && project) {
		if (!dialogEl.open) dialogEl.showModal();
	} else if (dialogEl.open) {
		dialogEl.close();
	}
});

// Reset the gallery every time the modal is opened.
$effect(() => {
	if (showModal) untrack(() => (currentImageIndex = 0));
});

// Arrow keys drive the gallery while the dialog is open.
// Escape / focus trapping are handled natively by <dialog>.
$effect(() => {
	if (!showModal) return;
	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			navigateGallery('next');
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			navigateGallery('prev');
		}
	};
	window.addEventListener('keydown', onKey);
	return () => window.removeEventListener('keydown', onKey);
});

// The dialog stretches across the viewport, so a click that lands on the
// dialog itself (not the inner card) is a backdrop click.
function handleBackdropClick(e: MouseEvent) {
	if (e.target === dialogEl) onClose();
}

// Fires on Escape and on programmatic close — mirror it to the parent.
function handleClose() {
	if (showModal) onClose();
}
</script>

<!-- biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click is pointer-only; Escape closes natively via <dialog> -->
<dialog
	bind:this={dialogEl}
	aria-labelledby="project-modal-title"
	aria-describedby="project-modal-desc"
	onclick={handleBackdropClick}
	onclose={handleClose}
>
	{#if project}
		<div
			class="modal-card flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-[#1E2D3D] bg-[#020618] shadow-2xl sm:max-h-full sm:rounded-2xl"
		>
			<header
				class="flex flex-none items-start justify-between gap-4 border-b border-[#1E2D3D] px-5 py-4 sm:px-6"
			>
				<div class="min-w-0">
					<div class="mb-1.5 flex items-center gap-2">
						{#if badge}
							<span
								class="rounded-md border px-2 py-0.5 text-[11px] font-medium {badgeStyles[
									badge
								]}"
							>
								{badge}
							</span>
						{/if}
						<span class="font-mono text-xs text-[#607B96]">
							project-{String(project.id).padStart(2, '0')}
						</span>
					</div>
					<h2
						id="project-modal-title"
						class="text-lg font-bold leading-tight text-white sm:text-2xl"
					>
						{project.title ?? `Project ${project.id}`}
					</h2>
				</div>
				<button
					type="button"
					onclick={onClose}
					aria-label={$_('close')}
					class="-mr-2 -mt-1 flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-lg text-[#607B96] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb86a]"
				>
					<XIcon size={20} />
				</button>
			</header>

			<div class="scrollbar-thin flex-1 overflow-y-auto overscroll-contain">
				<div class="grid gap-6 p-5 sm:p-6 md:grid-cols-5">
					<div class="order-2 space-y-6 md:order-1 md:col-span-2">
						<p
							id="project-modal-desc"
							class="text-sm leading-relaxed text-[#a8b5c4]"
						>
							{project.longDescription || project.description || ''}
						</p>

						{#if project.technologies?.length}
							<section>
								<h3
									class="mb-2 font-mono text-xs uppercase tracking-wider text-[#607B96]"
								>
									{$_('technologies')}
								</h3>
								<ul class="flex flex-wrap gap-1.5">
									{#each project.technologies as tech (tech)}
										<li
											class="rounded-md border border-white/10 bg-[#1E2D3D]/80 px-2.5 py-1 text-xs text-[#E5E9F0]"
										>
											{tech}
										</li>
									{/each}
								</ul>
							</section>
						{/if}

						{#if project.projectLink || project.githubLink}
							<section>
								<h3
									class="mb-2 font-mono text-xs uppercase tracking-wider text-[#607B96]"
								>
									{$_('links')}
								</h3>
								<div class="flex flex-col gap-2">
									{#if project.githubLink}
										<a
											href={project.githubLink}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-2 rounded-lg border border-[#1E2D3D] bg-white/[0.02] px-4 py-2.5 text-sm text-[#E5E9F0] transition-colors hover:border-[#ffb86a]/60 hover:text-[#ffb86a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb86a]"
										>
											<SiGithub size={16} />
											<span>{$_('sourceCode')}</span>
											<ExternalLink size={14} class="ml-auto opacity-60" />
										</a>
									{/if}
									{#if project.projectLink}
										<a
											href={project.projectLink}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-2 rounded-lg border border-[#1E2D3D] bg-white/[0.02] px-4 py-2.5 text-sm text-[#E5E9F0] transition-colors hover:border-[#ffb86a]/60 hover:text-[#ffb86a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb86a]"
										>
											<ExternalLink size={16} />
											<span>{$_('liveDemo')}</span>
											<ExternalLink size={14} class="ml-auto opacity-60" />
										</a>
									{/if}
								</div>
							</section>
						{/if}
					</div>

					<div class="order-1 md:order-2 md:col-span-3">
						{#if hasGallery}
							<div
								class="relative overflow-hidden rounded-xl border border-[#1E2D3D] bg-[#0b1622]"
							>
								<div
									class="flex max-h-[50vh] min-h-[200px] items-center justify-center"
								>
									<picture>
										<source
											srcset={images[currentImageIndex]}
											type="image/webp"
										>
										<img
											src={images[currentImageIndex].replace('.webp', '.png')}
											alt="{project.title ?? `Project ${project.id}`} — {$_(
													'screenshot'
												)} {currentImageIndex + 1}/{images.length}"
											class="max-h-[50vh] w-auto max-w-full object-contain"
											loading="lazy"
											decoding="async"
										>
									</picture>
								</div>

								{#if hasMultiple}
									<span
										class="pointer-events-none absolute top-3 right-3 rounded-md bg-black/60 px-2 py-0.5 font-mono text-xs text-[#E5E9F0] backdrop-blur-sm"
									>
										{currentImageIndex + 1}
										/ {images.length}
									</span>
									<button
										type="button"
										onclick={() => navigateGallery('prev')}
										aria-label={$_('previousImage')}
										class="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb86a]"
									>
										<ChevronLeft size={20} />
									</button>
									<button
										type="button"
										onclick={() => navigateGallery('next')}
										aria-label={$_('nextImage')}
										class="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb86a]"
									>
										<ChevronRight size={20} />
									</button>
								{/if}
							</div>

							{#if hasMultiple}
								<div
									class="scrollbar-hide mt-3 flex justify-center gap-2 overflow-x-auto pb-1"
								>
									{#each images as image, i (image)}
										<button
											type="button"
											onclick={() => (currentImageIndex = i)}
											aria-label="{$_('screenshot')} {i + 1} / {images.length}"
											aria-current={i === currentImageIndex}
											class="flex-none cursor-pointer overflow-hidden rounded-md ring-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb86a] {i ===
											currentImageIndex
												? 'ring-[#ffb86a]'
												: 'opacity-60 ring-transparent hover:opacity-100'}"
										>
											<picture>
												<source srcset={image} type="image/webp">
												<img
													src={image.replace('.webp', '.png')}
													alt=""
													class="h-14 w-20 object-cover"
													loading="lazy"
													decoding="async"
												>
											</picture>
										</button>
									{/each}
								</div>
							{/if}
						{:else}
							<div
								class="flex max-h-[50vh] min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E2D3D] bg-[#0b1622] text-[#607B96]"
							>
								<Images size={28} />
								<p class="text-sm">{$_('noImagesAvailable')}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</dialog>

<style>
/* The native dialog spans the viewport and only paints the ::backdrop;
	   the visible card is the inner element. */
dialog {
	inset: 0;
	width: auto;
	height: auto;
	max-width: none;
	max-height: none;
	margin: 0;
	padding: 0;
	border: none;
	background: transparent;
	overflow: hidden;
}

dialog[open] {
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

@media (min-width: 640px) {
	dialog[open] {
		align-items: center;
		padding: 1rem;
	}
}

dialog::backdrop {
	background-color: rgb(0 0 0 / 0.6);
	backdrop-filter: blur(3px);
	-webkit-backdrop-filter: blur(3px);
}

@media (prefers-reduced-motion: no-preference) {
	dialog[open] .modal-card {
		animation: modal-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
	}
	dialog[open]::backdrop {
		animation: backdrop-in 250ms ease-out;
	}
}

@keyframes modal-in {
	from {
		opacity: 0;
		transform: translateY(24px) scale(0.98);
	}
}

@keyframes backdrop-in {
	from {
		opacity: 0;
	}
}
</style>
