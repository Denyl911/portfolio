<script lang="ts">
	import { Languages, Menu } from 'lucide-svelte';
	import XIcon from 'lucide-svelte/icons/x';
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import { page } from '$app/state';

	let mobileMenuOpen = $state(false);
	let selectedLang = $state('');
	function changeLanguage() {
		locale.set(selectedLang);
	}

	onMount(() => {
		selectedLang = localStorage.getItem('locale') || 'en';
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="sticky top-0 z-50 border-b border-white/20 bg-black/20 backdrop-blur-lg">
	<div class="flex">
		<a
			href="/"
			data-interactive-cursor="text"
			class="h-full border-[#1E2D3D] py-2 pl-4 text-lg font-semibold text-[#E5E9F0] md:border-r md:px-10 lg:px-16"
		>
			denilson-de-la-rosa
		</a>

		<nav class="hidden md:flex">
			<a
				data-interactive-cursor="navitem"
				href="/"
				class="hvr-underline-from-center flex h-full items-center border-r border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				class:active={page.url.pathname === '/'}>{$_('home')}</a
			>
			<a
				data-interactive-cursor="navitem"
				href="/about-me"
				class="hvr-underline-from-center flex h-full items-center border-r border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				class:active={page.url.pathname === '/about-me'}>{$_('about')}</a
			>
			<a
				data-interactive-cursor="navitem"
				href="/projects"
				class="hvr-underline-from-center flex h-full items-center border-r border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				class:active={page.url.pathname === '/projects'}>{$_('projects')}</a
			>
			<!-- <a
				data-interactive-cursor="navitem"
				href="/blog"
				class="hvr-underline-from-center flex h-full items-center border-r border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				class:active={page.url.pathname.startsWith('/blog')}>_blog</a
			> -->
		</nav>

		<nav class="hidden grow justify-end md:flex" data-interactive-cursor="navitem">
			<div class="mr-2 flex items-center">
				<div class="mr-2">
					<Languages size={16} class="text-[#607B96]" aria-hidden="true" />
				</div>
				<select
					data-interactive-cursor="btn"
					bind:value={selectedLang}
					onchange={(e) => changeLanguage()}
					class=" rounded border border-[#1E2D3D] px-1 py-0.5 text-xs text-[#607B96]"
					aria-label="Select language"
				>
					<option value="en">EN</option>
					<option value="es">ES</option>
					<option value="fr">FR</option>
				</select>
			</div>
			<a
				data-interactive-cursor="navitem"
				href="/contact-me"
				class="hvr-underline-from-center border-l border-[#1E2D3D] px-6 py-2 text-[#607B96] transition-colors duration-300 hover:text-[#E5E9F0]"
				>{$_('contact')}</a
			>
		</nav>

		<div class="mr-5 flex grow justify-end md:hidden">
			<div class="mr-2 flex items-center">
				<div class="mr-2">
					<Languages size={16} class="text-[#607B96]" aria-hidden="true" />
				</div>
				<select
					data-interactive-cursor="btn"
					bind:value={selectedLang}
					onchange={(e) => changeLanguage()}
					class="rounded border border-[#1E2D3D] px-1 py-0.5 text-xs text-[#607B96]"
					aria-label="Select language"
				>
					<option value="en">EN</option>
					<option value="es">ES</option>
					<option value="fr">FR</option>
				</select>
			</div>
			<button
				onclick={toggleMobileMenu}
				aria-label="Open menu"
				class="text-[#607B96] focus:outline focus:outline-2 focus:outline-indigo-500"
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
		class="fixed z-40 flex h-[97vh] w-[97vw] flex-col items-start rounded-lg border border-white/20 bg-black/20 p-1 pt-6 backdrop-blur-lg md:hidden"
	>
		<p class="text-midnight mt-6 w-full border-b border-[#1E2D3D] p-4 text-xl hover:text-[#4D5BCE]">
			{$_('navigate')}
		</p>
		<a
			href="/"
			onclick={() => (mobileMenuOpen = false)}
			class="w-full border-b border-[#1E2D3D] p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE]"
			>{$_('home')}</a
		>
		<a
			href="/about-me"
			onclick={() => (mobileMenuOpen = false)}
			class="w-full border-b border-[#1E2D3D] p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE]"
			>{$_('about')}</a
		>
		<a
			href="/projects"
			onclick={() => (mobileMenuOpen = false)}
			class="w-full border-b border-[#1E2D3D] p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE]"
			>{$_('projects')}</a
		>
		<!-- <a
			href="/blog"
			onclick={() => (mobileMenuOpen = false)}
			class="w-full border-b border-[#1E2D3D] p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE]"
			>_blog</a
		> -->
		<a
			href="/contact-me"
			onclick={() => (mobileMenuOpen = false)}
			class="w-full border-b border-[#1E2D3D] p-4 text-xl text-[#E5E9F0] hover:text-[#4D5BCE]"
			>{$_('contact')}</a
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
