<script>
	import { page } from '$app/state';
	import { Menu } from 'lucide-svelte';
	import XIcon from 'lucide-svelte/icons/x';

	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="sticky top-0 z-50 border-b border-[#1E2D3D] bg-[#011627]/80 backdrop-blur-md">
	<div class="flex">
		<div
			data-interactive-cursor="text"
			class="h-full border-[#1E2D3D] py-2 pl-4 text-lg font-semibold text-[#E5E9F0] md:border-r md:px-10 lg:px-16"
		>
			denilson-de-la-rosa
		</div>

		<nav class="hidden md:flex">
			<a
				data-interactive-cursor="navitem"
				href="/"
				class="hvr-underline-from-center flex h-full items-center border-r border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				class:active={page.url.pathname === '/'}>_hello</a
			>
			<a
				data-interactive-cursor="navitem"
				href="/about-me"
				class="hvr-underline-from-center flex h-full items-center border-r border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				class:active={page.url.pathname === '/about-me'}>_about-me</a
			>
			<a
				data-interactive-cursor="navitem"
				href="/projects"
				class="hvr-underline-from-center flex h-full items-center border-r border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				class:active={page.url.pathname === '/projects'}>_projects</a
			>
		</nav>

		<nav class="hidden grow justify-end md:flex">
			<a
				data-interactive-cursor="navitem"
				href="/contact-me"
				class="hvr-underline-from-center border-l border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				>_contact-me</a
			>
		</nav>

		<div class="mr-5 flex grow justify-end md:hidden">
			<button
				onclick={toggleMobileMenu}
				aria-label="Open menu"
				class="text-[#607B96] focus:outline-none"
			>
				{#if mobileMenuOpen}
					<XIcon />
				{:else}
					<Menu />
				{/if}
			</button>
		</div>
	</div>
</header>

{#if mobileMenuOpen}
	<div
		class="fixed h-[97vh] w-[97vw] rounded-lg p-1 border border-[#1E2D3D] z-40 flex flex-col items-start bg-[#011627] pt-6 md:hidden"
	>
		<p class="mt-6 p-4 text-xl text-midnight hover:text-[#4D5BCE] border-b border-[#1E2D3D] w-full">
			# navigate:
		</p>
		<a
			href="/"
			onclick={() => (mobileMenuOpen = false)}
			class="p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE] border-b border-[#1E2D3D] w-full">_hello</a
		>
		<a
			href="/about-me"
			onclick={() => (mobileMenuOpen = false)}
			class="p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE] border-b border-[#1E2D3D] w-full">_about-me</a
		>
		<a
			href="/projects"
			onclick={() => (mobileMenuOpen = false)}
			class="p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE] border-b border-[#1E2D3D] w-full">_projects</a
		>
		<a
			href="/contact-me"
			onclick={() => (mobileMenuOpen = false)}
			class="p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE] border-b border-[#1E2D3D] w-full">_contact-me</a
		>
	</div>
{/if}

<style>
	.hvr-underline-from-center {
		display: inline-block;
		vertical-align: middle;
		-webkit-transform: perspective(1px) translateZ(0);
		transform: perspective(1px) translateZ(0);
		box-shadow: 0 0 1px rgba(0, 0, 0, 0);
		position: relative;
		overflow: hidden;
	}
	.hvr-underline-from-center:before {
		content: '';
		position: absolute;
		z-index: -1;
		left: 51%;
		right: 51%;
		bottom: 0;
		background: #ffb86a;
		height: 2px;
		-webkit-transition-property: left, right;
		transition-property: left, right;
		-webkit-transition-duration: 0.3s;
		transition-duration: 0.3s;
		-webkit-transition-timing-function: ease-out;
		transition-timing-function: ease-out;
	}
	.hvr-underline-from-center:hover:before,
	.hvr-underline-from-center:focus:before,
	.hvr-underline-from-center:active:before {
		left: 0;
		right: 0;
	}
	.hvr-underline-from-center.active {
		color: #e5e9f0;
	}
	.hvr-underline-from-center.active:before {
		left: 0;
		right: 0;
	}
</style>
