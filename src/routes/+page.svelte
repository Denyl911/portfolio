<script>
	import SnakeGame from '$lib/components/SnakeGame.svelte';

	const githubLink = 'https://github.com/Denyl911';
</script>

<main
	class="container mx-auto flex flex-grow flex-col items-center justify-center px-6 py-10 md:px-10 md:py-20 lg:flex-row lg:justify-between lg:px-16"
>
	<div class="mb-10 text-center lg:mb-0 lg:w-1/2 lg:text-left">
		<p class="text-lg text-c-white">Hi all. I am</p>
		<h1 class="my-2 text-5xl font-bold text-c-white md:text-5xl">Denilson De La Rosa</h1>
		<p class="text-2xl font-medium text-[#4D5BCE]">> Full-Stack developer</p>

		<div class="mt-10 text-left text-sm text-midnight">
			<p class="mb-1">// complete the game to continue</p>
			<p class="mb-1">// find my profile on Github:</p>
			<div class="inline-block rounded-md bg-[#011221] p-3">
				<span class="text-[#4D5BCE]">const</span> <span class="text-[#43D9AD]">githubLink</span>
				= <span class="text-[#E99287]">"{githubLink}"</span>;
			</div>
		</div>
	</div>

	<SnakeGame />
</main>
