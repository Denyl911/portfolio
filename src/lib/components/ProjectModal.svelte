<script lang="ts">
import XIcon from 'lucide-svelte/icons/x';
import { _ } from 'svelte-i18n';
import FadeContent from '$lib/components/bits/FadeContent.svelte';
import type { Project } from '$lib/data/projects';

let {
	project,
	showModal,
	onClose,
}: { project: Project | null; showModal: boolean; onClose: () => void } =
	$props();

import { onMount } from 'svelte';

let currentImageIndex: number = $state(0);

$effect(() => {
	if (typeof document === 'undefined') return;
	if (showModal) {
		document.body.style.overflow = 'hidden';
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKey);
		};
	}
});

function navigateGallery(direction: 'next' | 'prev') {
	if (!project?.galleryImages || project.galleryImages.length === 0)
		return;

	if (direction === 'next') {
		currentImageIndex = (currentImageIndex + 1) % project.galleryImages.length;
	} else {
		currentImageIndex =
			(currentImageIndex - 1 + project.galleryImages.length) %
			project.galleryImages.length;
	}
}

// Reset image index when project changes or modal opens/closes
$effect(() => {
	if (showModal) {
		currentImageIndex = 0;
	}
});
</script>

{#if showModal && project}
	<div
		data-interactive-cursor="navitem"
		class="fixed inset-0 z-90 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-4"
	>
		<FadeContent
			blur={false}
			duration={300}
			threshold={0.5}
			class="relative max-h-[92dvh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-xl border border-[#1E2D3D] bg-[#020618] px-4 pt-10 pb-6 shadow-lg sm:rounded-lg sm:px-6 sm:pt-8"
		>
			<button
				type="button"
				class="absolute top-3 right-3 z-91 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center text-white hover:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-500"
				onclick={onClose}
				aria-label="Close modal"
				data-interactive-cursor="btn"
			>
				<XIcon />
			</button>

			<div class="flex flex-col gap-6 md:flex-row">
				<div class="space-y-4 text-[#E5E9F0] md:w-1/3">
					<h2 class="text-3xl font-bold text-indigo-400">{project.title}</h2>
					<p class="text-sm text-[#607B96]">
						{project.longDescription || project.description}
					</p>

					<div>
						<h4 class="mb-2 text-lg font-semibold">{$_('technologies')}</h4>
						<ul class="flex flex-wrap gap-2">
							{#each project.technologies as tech}
								<li
									class="rounded-md bg-slate-700 px-3 py-1 text-sm text-white"
								>
									{tech}
								</li>
							{/each}
						</ul>
					</div>

					{#if project.projectLink || project.githubLink}
						<div>
							<h4 class="mb-2 text-lg font-semibold">{$_('links')}</h4>
							<div class="flex flex-col space-y-2">
								{#if project.githubLink}
									<a
										href={project.githubLink}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-400 hover:underline"
									>
										GitHub
									</a>
								{/if}
								{#if project.projectLink}
									<a
										href={project.projectLink}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-400 hover:underline"
									>
										More Info
									</a>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<div class="flex flex-col items-center md:w-2/3">
					{#if project.galleryImages && project.galleryImages.length > 0}
						<div
							class="relative mb-4 h-56 w-full overflow-hidden rounded-md bg-gray-800/50 sm:h-80"
						>
							<picture>
								<source
									srcset={project.galleryImages[currentImageIndex]}
									type="image/webp"
								>
								<img
									src={project.galleryImages[currentImageIndex].replace('.webp', '.png')}
									alt="Screenshot {currentImageIndex + 1} of {project.title}"
									class="h-full w-full object-contain"
									loading="lazy"
								>
							</picture>
							{#if project.galleryImages.length > 1}
								<button
									type="button"
									data-interactive-cursor="prevslide"
									class="absolute top-1/2 left-2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-2 text-white hover:bg-black/75 focus:outline focus:outline-2 focus:outline-indigo-500"
									onclick={() => navigateGallery('prev')}
									aria-label="Previous image"
								>
									&#10094;
								</button>
								<button
									type="button"
									data-interactive-cursor="nextslide"
									class="absolute top-1/2 right-2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-2 text-white hover:bg-black/75 focus:outline focus:outline-2 focus:outline-indigo-500"
									onclick={() => navigateGallery('next')}
									aria-label="Next image"
								>
									&#10095;
								</button>
							{/if}
						</div>
						<div class="flex flex-wrap justify-center gap-2">
							{#each project.galleryImages as image, i}
								<button
									type="button"
									class="focus:outline focus:outline-2 focus:outline-indigo-500 rounded-sm"
									onclick={() => (currentImageIndex = i)}
									aria-label="View image {i + 1} of {project.title}"
								>
									<picture>
										<source srcset={image} type="image/webp">
										<img
											src={image.replace('.webp', '.png')}
											alt="Thumbnail {i + 1} of {project.title}"
											class="h-16 w-20 cursor-pointer rounded-sm object-cover ring-2 ring-transparent transition-all duration-200 hover:ring-indigo-500 {i === currentImageIndex ? 'ring-indigo-500' : ''}"
											loading="lazy"
										>
									</picture>
								</button>
							{/each}
						</div>
					{:else}
						<p class="text-center text-gray-500">{$_('noImagesAvailable')}</p>
					{/if}
				</div>
			</div>
			<div class="mt-6 flex justify-center">
				<button
					type="button"
					data-interactive-cursor="btn"
					class="min-h-[44px] cursor-pointer rounded-lg bg-slate-600 px-8 py-3 text-sm text-[#E5E9F0] transition-colors duration-300 hover:bg-[#ffb86a] hover:text-[#01080E] focus:outline focus:outline-2 focus:outline-indigo-500"
					onclick={onClose}
					aria-label="Close modal"
				>
					{$_('close')}
				</button>
			</div>
		</FadeContent>
	</div>
{/if}
