<script>
	import SnakeGame from '$lib/components/SnakeGame.svelte';

	const githubLink = 'https://github.com/Denyl911';
</script>

<div
	class="container mx-auto flex flex-grow flex-col items-center justify-center px-6 py-10 md:px-10 md:py-20 lg:flex-row lg:justify-between lg:px-16"
>
	<div class="mb-10 text-center lg:mb-0 lg:w-1/2 lg:text-left" data-interactive-cursor="text">
		<p class="text-c-white text-lg">Hi all. I am</p>
		<h1 class="text-c-white my-2 text-5xl font-bold md:text-5xl" data-interactive-cursor="mixblend">
			Denilson De La Rosa
		</h1>
		<p class="text-2xl font-medium text-[#4D5BCE]" data-interactive-cursor="code">
			> Full-Stack developer
		</p>

		<div class="text-midnight mt-10 text-left text-sm">
			<p class="mb-1">// complete the game to continue</p>
			<p class="mb-1">// find my profile on Github:</p>
			<div class="inline-block rounded-md bg-[#011221] p-3" data-interactive-cursor="code">
				<span class="text-[#4D5BCE]">const</span> <span class="text-[#43D9AD]">githubLink</span>
				= <span class="text-[#E99287]">"{githubLink}"</span>;
			</div>
		</div>
	</div>

	<SnakeGame />
</div>
