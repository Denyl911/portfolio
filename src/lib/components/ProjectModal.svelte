<script lang="ts">
	import { type Project } from '$lib/data/projects';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import XIcon from 'lucide-svelte/icons/x';

	let {
		project,
		showModal,
		onClose
	}: { project: Project | null; showModal: boolean; onClose: () => void } = $props();

	let currentImageIndex: number = $state(0);

	function navigateGallery(direction: 'next' | 'prev') {
		if (!project || !project.galleryImages || project.galleryImages.length === 0) return;

		if (direction === 'next') {
			currentImageIndex = (currentImageIndex + 1) % project.galleryImages.length;
		} else {
			currentImageIndex =
				(currentImageIndex - 1 + project.galleryImages.length) % project.galleryImages.length;
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
		class="fixed inset-0 z-90 flex items-center justify-center bg-black/40  backdrop-blur-xs"
		transition:fade={{ duration: 150 }}
	>
		<div
			class="relative w-full max-w-5xl rounded-lg border border-[#1E2D3D] bg-[#020618] px-6 py-8 shadow-lg"
            transition:slide="{{ duration: 300, easing: quintOut }}"
		>
			<button
				class="absolute top-3 right-3 z-91 text-white hover:text-gray-400 cursor-pointer"
				onclick={onClose}
				aria-label="Close modal"
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
						<h4 class="mb-2 text-lg font-semibold">Technologies:</h4>
						<ul class="flex flex-wrap gap-2">
							{#each project.technologies as tech}
								<li class="rounded-md bg-slate-700 px-3 py-1 text-sm text-white">
									{tech}
								</li>
							{/each}
						</ul>
					</div>

					{#if project.projectLink || project.githubLink}
						<div>
							<h4 class="mb-2 text-lg font-semibold">Links:</h4>
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
						<div class="relative mb-4 h-80 w-full overflow-hidden rounded-md bg-gray-800/50">
							<img
								src={project.galleryImages[currentImageIndex]}
								alt="Project screenshot {currentImageIndex + 1}"
								class="h-full w-full object-contain"
							/>
							{#if project.galleryImages.length > 1}
								<button
									class=" hover:bg-black/75 absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
									onclick={() => navigateGallery('prev')}
								>
									&#10094;
								</button>
								<button
									class=" hover:bg-black/75 absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
									onclick={() => navigateGallery('next')}
								>
									&#10095;
								</button>
							{/if}
						</div>
						<div class="flex flex-wrap justify-center gap-2">
							{#each project.galleryImages as image, i}
								<img
									src={image}
									alt="Thumbnail {i + 1}"
									class="h-16 w-20 cursor-pointer rounded-sm object-cover ring-2 ring-transparent transition-all duration-200 hover:ring-indigo-500 {i ===
									currentImageIndex
										? 'ring-indigo-500'
										: ''}"
									onclick={() => (currentImageIndex = i)}
								/>
							{/each}
						</div>
					{:else}
						<p class="text-center text-gray-500">No hay imágenes disponibles para este proyecto.</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
