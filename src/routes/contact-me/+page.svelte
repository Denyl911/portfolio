<script lang="ts">
import Prism from 'prismjs';
// biome-ignore lint/correctness/noUnusedImports: translations
import { _ } from 'svelte-i18n';
import 'prismjs/themes/prism-okaidia.css';
import {
	SiGithub,
	SiMastodon,
	SiYoutube,
} from '@icons-pack/svelte-simple-icons';
import { LinkedinIcon } from 'lucide-svelte';
import ChevronDown from 'lucide-svelte/icons/chevron-down';
import ChevronRight from 'lucide-svelte/icons/chevron-right';
import Mail from 'lucide-svelte/icons/mail';
import Phone from 'lucide-svelte/icons/phone';
import XIcon from 'lucide-svelte/icons/x';
import { tick } from 'svelte';
import { ID, tablesDB } from '$lib/appwrite';
import ElectricBorder from '$lib/components/bits/ElectricBorder.svelte';
import FadeContent from '$lib/components/bits/FadeContent.svelte';
import { contactFormStore } from '$lib/stores/contactForm';

let contactsOpenDesktop = $state(true);
let highlightedCode = $state('');
let highlightTimer: ReturnType<typeof setTimeout> | undefined;
const messageDate = new Date().toDateString();
let findMeAlsoInOpenDesktop = $state(true);
let openMobileAccordion: string | null = $state(null);

// Form state from store
let formData = $derived($contactFormStore.formData);
let errors = $derived($contactFormStore.errors);
let isSubmitting = $derived($contactFormStore.isSubmitting);
let formSubmitted = $derived($contactFormStore.formSubmitted);
let errorMessage = $derived($contactFormStore.errorMessage);

// Form state is read directly from the store (no mirror state to avoid sync loops).

// Simulated message content for the code snippet (date fixed to avoid re-render loop)
let simulatedCodeMessage = $derived(`
    const message = {
        name: "${formData.name || ''}",
        email: "${formData.email || ''}",
        message: \`${formData.message || ''}\`,
        date: "${messageDate}"
    };

    button.addEventListener('click', () => {
        form.send(message);
    });`);

$effect(() => {
	const code = simulatedCodeMessage;
	clearTimeout(highlightTimer);
	highlightTimer = setTimeout(() => {
		highlightedCode = Prism.highlight(code, Prism.languages.javascript, 'javascript');
	}, 250);
	return () => clearTimeout(highlightTimer);
});

const contactItems = [{ type: 'email', value: 'imdenyl@gmail.com' }];

const findMeAlsoInItems = [
	{ name: 'Youtube', link: 'https://www.youtube.com/@denilsondelarosa5649' },
	{ name: 'Mastodon', link: 'https://mastodon.social/@denyl' },
	{
		name: 'LinkedIn',
		link: 'https://www.linkedin.com/in/denilson-de-la-rosa-s%C3%A1nchez-7171281b9',
	},
	{ name: 'Github', link: 'https://github.com/Denyl911' },
];

function toggleMobileAccordion(section: string) {
	if (openMobileAccordion === section) {
		openMobileAccordion = null;
	} else {
		openMobileAccordion = section;
	}
}

async function handleSubmit(event: Event) {
	event.preventDefault();
	await contactFormStore.submitForm(async (data) => {
		await tablesDB.createRow({
			databaseId: '68c2305f0024382ed1b4',
			tableId: 'contact',
			rowId: ID.unique(),
			data: data,
		});
	});
}

function sendNewMessage() {
	contactFormStore.resetForm();
}

// Focus management
let successButton: HTMLButtonElement | undefined = $state();
$effect(() => {
	if (formSubmitted) {
		tick().then(() => successButton?.focus());
	}
});
</script>

<div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
<div
	class="flex-shrink-0 text-sm text-[#E5E9F0] lg:w-1/5 lg:border-r lg:border-[#1E2D3D]"
>
	<div class="hidden h-full overflow-y-auto lg:block">
		<div class="mb-4">
			<button
				type="button"
				data-interactive-cursor="dropdown"
				onclick={() => (contactsOpenDesktop = !contactsOpenDesktop)}
				class="flex h-[42px] w-full items-center pl-4 hover:text-[#C5C5C5] {contactsOpenDesktop
					? 'text-white'
					: ''} border-b border-[#1E2D3D]"
			>
				{#if contactsOpenDesktop}
					<ChevronDown
						class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
					/>
				{:else}
					<ChevronRight
						class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
					/>
				{/if}
				{$_('contacts')}
			</button>
			{#if contactsOpenDesktop}
				<div class="pt-2 pl-8">
					{#each contactItems as contact (contact.value)}
						<div
							data-interactive-cursor="navitem"
							class="flex items-center pt-1 text-xs"
						>
							{#if contact.type === 'email'}
								<Mail class="mr-2 h-3 w-3" />
							{:else if contact.type === 'phone'}
								<Phone class="mr-2 h-3 w-3" />
							{/if}
							{contact.value}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div>
			<button
				type="button"
				data-interactive-cursor="dropdown"
				onclick={() => (findMeAlsoInOpenDesktop = !findMeAlsoInOpenDesktop)}
				class="flex h-[42px] w-full items-center pl-4 hover:text-[#C5C5C5] {findMeAlsoInOpenDesktop
					? 'text-white'
					: ''} border-y border-[#1E2D3D]"
			>
				{#if findMeAlsoInOpenDesktop}
					<ChevronDown
						class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
					/>
				{:else}
					<ChevronRight
						class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
					/>
				{/if}
				{$_('findMeAlsoIn')}
			</button>
			{#if findMeAlsoInOpenDesktop}
				<div class="pt-2 pl-8">
					{#each findMeAlsoInItems as item (item.name)}
						<a
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center pt-1 text-xs hover:text-[#C5C5C5]"
							data-interactive-cursor="navitem"
						>
							{#if item.name === 'Youtube'}
								<SiYoutube size={12} />
							{/if}
							{#if item.name === 'Mastodon'}
								<SiMastodon size={12} />
							{/if}
							{#if item.name === 'LinkedIn'}
								<LinkedinIcon size={12} />
							{/if}
							{#if item.name === 'Github'}
								<SiGithub size={12} />
							{/if}
							<span class="ml-1">{item.name}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="relative flex-shrink-0 lg:hidden">
		<div class="flex h-11 border-b border-[#1E2D3D] text-sm">
			<button
				type="button"
				onclick={() => toggleMobileAccordion('contacts')}
				aria-expanded={openMobileAccordion === 'contacts'}
				class="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 border-r border-[#1E2D3D] px-2 {openMobileAccordion === 'contacts' ? 'text-white' : 'text-[#607B96]'}"
			>
				{#if openMobileAccordion === 'contacts'}
					<ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" />
				{:else}
					<ChevronRight class="h-4 w-4 shrink-0 transition-transform duration-200" />
				{/if}
				<span class="truncate">{$_('contacts')}</span>
			</button>
			<button
				type="button"
				onclick={() => toggleMobileAccordion('find-me-also-in')}
				aria-expanded={openMobileAccordion === 'find-me-also-in'}
				class="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 px-2 {openMobileAccordion === 'find-me-also-in' ? 'text-white' : 'text-[#607B96]'}"
			>
				{#if openMobileAccordion === 'find-me-also-in'}
					<ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" />
				{:else}
					<ChevronRight class="h-4 w-4 shrink-0 transition-transform duration-200" />
				{/if}
				<span class="truncate">{$_('findMeAlsoIn')}</span>
			</button>
		</div>
		{#if openMobileAccordion === 'contacts'}
			<div class="absolute inset-x-0 top-full z-20 max-h-[50dvh] overflow-y-auto overscroll-contain border-b border-[#1E2D3D] bg-[#011221]/95 shadow-xl backdrop-blur-lg">
				{#each contactItems as contact (contact.value)}
					<div class="flex min-h-[44px] items-center border-b border-[#1E2D3D]/50 px-3 py-2.5 text-left text-sm">
						{#if contact.type === 'email'}
							<Mail class="mr-2 h-4 w-4 shrink-0" />
						{:else if contact.type === 'phone'}
							<Phone class="mr-2 h-4 w-4 shrink-0" />
						{/if}
						<span class="truncate text-xs">{contact.value}</span>
					</div>
				{/each}
			</div>
		{:else if openMobileAccordion === 'find-me-also-in'}
			<div class="absolute inset-x-0 top-full z-20 max-h-[50dvh] overflow-y-auto overscroll-contain border-b border-[#1E2D3D] bg-[#011221]/95 shadow-xl backdrop-blur-lg">
				{#each findMeAlsoInItems as item (item.name)}
					<a
						href={item.link}
						target="_blank"
						rel="noopener noreferrer"
						class="flex min-h-[44px] items-center border-b border-[#1E2D3D]/50 px-3 py-2.5 text-left text-sm"
					>
						{#if item.name === 'Youtube'}
							<SiYoutube size={14} />
						{/if}
						{#if item.name === 'Mastodon'}
							<SiMastodon size={14} />
						{/if}
						{#if item.name === 'LinkedIn'}
							<LinkedinIcon size={14} />
						{/if}
						{#if item.name === 'Github'}
							<SiGithub size={14} />
						{/if}
						<span class="ml-2 truncate">{item.name}</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<div class="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
	<div
		class="flex min-h-0 w-full flex-1 flex-col p-0 lg:flex-grow lg:border-r lg:border-[#1E2D3D] lg:border-b-0"
	>
		<div class="flex h-8 flex-shrink-0 items-center border-b border-[#1E2D3D] px-3 text-xs lg:hidden">
			<span class="truncate text-[#607B96]">// {$_('contactMe')}</span>
		</div>
		<div
			class="hidden h-[42px] flex-shrink-0 border-b border-[#1E2D3D] lg:flex"
		>
			<div
				data-interactive-cursor="text"
				class="flex items-center border-r border-[#1E2D3D] px-4 text-white"
			>
				{$_('contactMe')}
				<XIcon class="ml-2 h-3 w-3 text-[#E5E9F0] hover:text-[#C5C5C5]" />
			</div>
		</div>
		<div
			class="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 text-sm leading-relaxed sm:p-6"
		>
			<div class="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center">
			{#if errorMessage}
				<div
					class="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-red-300 error-banner"
				>
					<p class="text-sm">{errorMessage}</p>
				</div>
			{/if}

			{#if formSubmitted}
				<FadeContent blur duration={500} threshold={0.3} class="w-full">
					<div class="text-center">
						<h2 class="mb-4 text-3xl text-white" data-interactive-cursor="code">
							{$_('thankYou')}
						</h2>
						<p class="mb-8 text-[#607B96]" data-interactive-cursor="text">
							{$_('messageAccepted')} <br>
							{$_('willReceiveAnswer')}
						</p>
						<button
							type="button"
							bind:this={successButton}
							data-interactive-cursor="btn"
							onclick={sendNewMessage}
							class="rounded-lg bg-[#FEA55F] px-6 py-3 text-sm font-semibold text-[#01080E] transition-colors duration-200 hover:bg-[#FFC08A]"
						>
							{$_('sendNewMessage')}
						</button>
					</div>
				</FadeContent>
			{:else}
				<form onsubmit={handleSubmit} class="mx-auto w-full max-w-lg space-y-5 px-1 sm:space-y-6">
					<div>
						<label for="name" class="mb-2 block text-sm text-[#607B96]"
							>{$_('name')}</label
						>
						<input
							type="text"
							id="name" name="name" autocomplete="name" enterkeyhint="next"
							value={formData.name}
							oninput={(e: Event) =>
								contactFormStore.updateField('name', (e.target as HTMLInputElement).value)}
							placeholder={$_('namePlaceholder')}
							class="w-full rounded-lg border border-[#1E2D3D] bg-[#011221] px-4 py-3 text-white focus:border-[#43D9AD] focus:outline-none {errors.name ? 'border-red-500' : ''}"
							required
							data-interactive-cursor="input"
						>
						{#if errors.name}
							<p class="mt-1 text-sm text-red-400 error-message">
								{errors.name}
							</p>
						{/if}
					</div>
					<div>
						<label for="email" class="mb-2 block text-sm text-[#607B96]"
							>{$_('email')}</label
						>
						<input
							type="email"
							id="email" name="email" autocomplete="email" enterkeyhint="next"
							value={formData.email}
							oninput={(e: Event) =>
								contactFormStore.updateField(
									'email',
									(e.target as HTMLInputElement).value
								)}
							placeholder={$_('emailPlaceholder')}
							class="w-full rounded-lg border border-[#1E2D3D] bg-[#011221] px-4 py-3 text-white focus:border-[#43D9AD] focus:outline-none {errors.email ? 'border-red-500' : ''}"
							required
							data-interactive-cursor="input"
						>
						{#if errors.email}
							<p class="mt-1 text-sm text-red-400 error-message">
								{errors.email}
							</p>
						{/if}
					</div>
					<div>
						<label for="message" class="mb-2 block text-sm text-[#607B96]"
							>{$_('message')}</label
						>
						<textarea
							id="message" name="message" autocomplete="off" enterkeyhint="send"
							value={formData.message}
							oninput={(e: Event) =>
								contactFormStore.updateField(
									'message',
									(e.target as HTMLTextAreaElement).value
								)}
							placeholder={$_('messagePlaceholder')}
							rows="4"
							class="w-full rounded-lg border border-[#1E2D3D] bg-[#011221] px-4 py-3 text-white focus:border-[#43D9AD] focus:outline-none {errors.message ? 'border-red-500' : ''}"
							data-interactive-cursor="input"
							maxlength="900"
						></textarea>
						{#if errors.message}
							<p class="mt-1 text-sm text-red-400 error-message">
								{errors.message}
							</p>
						{/if}
					</div>
					<ElectricBorder
						color="#43D9AD"
						borderRadius={8}
						speed={0.6}
						chaos={0.08}
						class="block w-full"
					>
						<button
							data-interactive-cursor="btn"
							disabled={isSubmitting}
							type="submit"
							class="min-h-[48px] w-full cursor-pointer rounded-lg bg-[#FEA55F] px-6 py-3.5 text-sm font-semibold text-[#01080E] transition-colors duration-200 hover:bg-[#FFC08A] disabled:cursor-not-allowed disabled:opacity-60"
						>
							{#if isSubmitting}
								{$_('sending')}
							{:else}
								{$_('submitMessage')}
							{/if}
						</button>
					</ElectricBorder>
				</form>
			{/if}
			<div class="mt-6 lg:hidden">
				<h3 class="text-md mb-3 text-[#607B96]">{$_('codeSnippet')}</h3>
				<div class="rounded-lg border border-[#1E2D3D] bg-[#011627] p-3 font-mono text-xs whitespace-pre-wrap break-words">
					<pre data-interactive-cursor="code" class="overflow-x-auto"><code
							>{@html highlightedCode}</code
						></pre>
				</div>
			</div>
			</div>
		</div>
	</div>

	<div class="hidden flex-shrink-0 overflow-y-auto p-4 lg:block lg:w-1/2">
		<h3 class="text-md mb-4 text-[#607B96]">{$_('codeSnippet')}</h3>
		<div
			class="rounded-lg border border-[#1E2D3D] bg-[#011627] p-4 font-mono text-sm whitespace-pre-wrap"
		>
			<pre data-interactive-cursor="code"><code
					>{@html highlightedCode}</code
				></pre>
		</div>
	</div>
</div>
</div>
