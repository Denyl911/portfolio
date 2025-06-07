<script lang="ts">
	// @ts-ignore
	import Prism from 'prismjs';
	import 'prismjs/themes/prism-okaidia.css';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Mail from 'lucide-svelte/icons/mail';
	import Phone from 'lucide-svelte/icons/phone';
	import { SiInstagram, SiYoutube, SiGithub } from '@icons-pack/svelte-simple-icons';
	import XIcon from 'lucide-svelte/icons/x';
	import { LinkedinIcon } from 'lucide-svelte';
	import { supabase } from '$lib/supabase';

	let contactsOpenDesktop = $state(true);
	let findMeAlsoInOpenDesktop = $state(true);
	let openMobileAccordion: string | null = $state(null);

	// Form data
	let name: string = $state('');
	let email: string = $state('');
	let message: string = $state('');
	let formSubmitted: boolean = $state(false);
	let isLoading: boolean = $state(false);

	// Simulated message content for the code snippet
	let simulatedCodeMessage = $derived(`
    const message = {
        name: "${name || ''}",
        email: "${email || ''}",
        message: \`${message || ''}\`,
        date: "${new Date().toDateString()}"
    };

    button.addEventListener('click', () => {
        form.send(message);
    });`);

	const contactItems = [{ type: 'email', value: 'imdenyl@gmail.com' }];

	const findMeAlsoInItems = [
		{ name: 'Youtube', link: 'https://www.youtube.com/@denilsondelarosa5649' },
		{ name: 'Instagram', link: 'https://www.instagram.com/denilson_drs' },
		{
			name: 'LinkedIn',
			link: 'https://www.linkedin.com/in/denilson-de-la-rosa-s%C3%A1nchez-7171281b9'
		},
		{ name: 'Github', link: 'https://github.com/Denyl911' }
	];

	function toggleMobileAccordion(section: string) {
		if (openMobileAccordion === section) {
			openMobileAccordion = null;
		} else {
			openMobileAccordion = section;
		}
	}

	async function handleSubmit() {
		isLoading = true;
		try {
			const { error } = await supabase.from('contact').insert([{ name, email, message }]);

			if (error) {
				throw error;
			}
			formSubmitted = true;
			console.log('Form Submitted:', { name, email, message });
		} catch (error: any) {
			console.error('Error al enviar el mensaje:', error.error || error.message);
		} finally {
			isLoading = false;
		}
	}

	function sendNewMessage() {
		formSubmitted = false;
		name = '';
		email = '';
		message = '';
	}
</script>

<div
	class="flex-shrink-0 border-b border-[#1E2D3D] text-sm text-[#E5E9F0] lg:w-1/5 lg:border-r lg:border-b-0"
>
	<div class="hidden h-full overflow-y-auto lg:block">
		<div class="mb-4">
			<button
				data-interactive-cursor="dropdown"
				onclick={() => (contactsOpenDesktop = !contactsOpenDesktop)}
				class="flex h-[42px] w-full items-center pl-4 hover:text-[#C5C5C5] {contactsOpenDesktop
					? 'text-white'
					: ''} border-b border-[#1E2D3D]"
			>
				{#if contactsOpenDesktop}
					<ChevronDown class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{:else}
					<ChevronRight class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{/if}
				_contacts
			</button>
			{#if contactsOpenDesktop}
				<div class="pt-2 pl-8">
					{#each contactItems as contact (contact.value)}
						<div data-interactive-cursor="navitem" class="flex items-center pt-1 text-xs">
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
				data-interactive-cursor="dropdown"
				onclick={() => (findMeAlsoInOpenDesktop = !findMeAlsoInOpenDesktop)}
				class="flex h-[42px] w-full items-center pl-4 hover:text-[#C5C5C5] {findMeAlsoInOpenDesktop
					? 'text-white'
					: ''} border-y border-[#1E2D3D]"
			>
				{#if findMeAlsoInOpenDesktop}
					<ChevronDown class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{:else}
					<ChevronRight class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{/if}
				_find-me-also-in
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
							{#if item.name == 'Youtube'}
								<SiYoutube size={12} />
							{/if}
							{#if item.name == 'Instagram'}
								<SiInstagram size={12} />
							{/if}
							{#if item.name == 'LinkedIn'}
								<LinkedinIcon size={12} />
							{/if}
							{#if item.name == 'Github'}
								<SiGithub size={12} />
							{/if}
							<span class="ml-1">{item.name}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="lg:hidden">
		<div class="border-b border-[#1E2D3D] p-4">
			<h2 class="text-lg text-white">_contact-me</h2>
		</div>
		<div>
			<button
				onclick={() => toggleMobileAccordion('contacts')}
				class="flex w-full items-center justify-between border-b border-[#1E2D3D] p-4 hover:bg-[#1E2D3D]/30"
			>
				<span class="flex items-center text-white">
					{#if openMobileAccordion === 'contacts'}
						<ChevronDown class="mr-2 h-4 w-4 transition-transform duration-200" />
					{:else}
						<ChevronRight class="mr-2 h-4 w-4 transition-transform duration-200" />
					{/if}
					_contacts
				</span>
			</button>
			{#if openMobileAccordion === 'contacts'}
				<div class="bg-[#011221] pl-6 text-sm">
					{#each contactItems as contact (contact.value)}
						<div class="flex items-center border-b border-[#1E2D3D]/50 p-3 text-left">
							{#if contact.type === 'email'}
								<Mail class="mr-2 h-4 w-4" />
							{:else if contact.type === 'phone'}
								<Phone class="mr-2 h-4 w-4" />
							{/if}
							{contact.value}
						</div>
					{/each}
				</div>
			{/if}

			<button
				onclick={() => toggleMobileAccordion('find-me-also-in')}
				class="flex w-full items-center justify-between border-b border-[#1E2D3D] p-4 hover:bg-[#1E2D3D]/30"
			>
				<span class="flex items-center text-white">
					{#if openMobileAccordion === 'find-me-also-in'}
						<ChevronDown class="mr-2 h-4 w-4 transition-transform duration-200" />
					{:else}
						<ChevronRight class="mr-2 h-4 w-4 transition-transform duration-200" />
					{/if}
					_find-me-also-in
				</span>
			</button>
			{#if openMobileAccordion === 'find-me-also-in'}
				<div class="bg-[#011221] pl-6 text-sm">
					{#each findMeAlsoInItems as item (item.name)}
						<a
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center border-b border-[#1E2D3D]/50 p-3 text-left"
						>
							{#if item.name == 'Youtube'}
								<SiYoutube size={12} />
							{/if}
							{#if item.name == 'Instagram'}
								<SiInstagram size={12} />
							{/if}
							{#if item.name == 'LinkedIn'}
								<LinkedinIcon size={12} />
							{/if}
							{#if item.name == 'Github'}
								<SiGithub size={12} />
							{/if}
							<span class="ml-1">{item.name}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<div class="flex flex-grow flex-col overflow-hidden lg:flex-row">
	<div
		class="flex w-full flex-col border-b border-[#1E2D3D] p-0 lg:flex-grow lg:border-r lg:border-b-0"
	>
		<div class="hidden h-[42px] flex-shrink-0 border-b border-[#1E2D3D] lg:flex">
			<div
				data-interactive-cursor="text"
				class="flex items-center border-r border-[#1E2D3D] px-4 text-white"
			>
				_contact-me
				<XIcon class="ml-2 h-3 w-3 text-[#E5E9F0] hover:text-[#C5C5C5]" />
			</div>
		</div>
		<div
			class="flex flex-grow items-center justify-center overflow-y-auto p-6 text-sm leading-relaxed"
		>
			{#if formSubmitted}
				<div class="text-center">
					<h2 class="mb-4 text-3xl text-white" data-interactive-cursor="code">Thank you! 👋</h2>
					<p class="mb-8 text-[#607B96]" data-interactive-cursor="text">
						Your message has been accepted.<br />
						You will receive answer soon!
					</p>
					<button
						data-interactive-cursor="btn"
						onclick={sendNewMessage}
						class="rounded-lg bg-[#FEA55F] px-6 py-3 text-sm font-semibold text-[#01080E] transition-colors duration-200 hover:bg-[#FFC08A]"
					>
						send-new-message
					</button>
				</div>
			{:else}
				<form onsubmit={handleSubmit} class="mx-auto w-full max-w-lg space-y-6">
					<div>
						<label for="name" class="mb-2 block text-sm text-[#607B96]">_name:</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							placeholder="your name here"
							class="w-full rounded-lg border border-[#1E2D3D] bg-[#011221] px-4 py-3 text-white focus:border-[#43D9AD] focus:outline-none"
							required
							data-interactive-cursor="input"
						/>
					</div>
					<div>
						<label for="email" class="mb-2 block text-sm text-[#607B96]">_email:</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							placeholder="yor email here"
							class="w-full rounded-lg border border-[#1E2D3D] bg-[#011221] px-4 py-3 text-white focus:border-[#43D9AD] focus:outline-none"
							required
							data-interactive-cursor="input"
						/>
					</div>
					<div>
						<label for="message" class="mb-2 block text-sm text-[#607B96]">_message:</label>
						<textarea
							id="message"
							bind:value={message}
							placeholder="your message here ..."
							rows="6"
							class="w-full rounded-lg border border-[#1E2D3D] bg-[#011221] px-4 py-3 text-white focus:border-[#43D9AD] focus:outline-none"
							required
							data-interactive-cursor="input"
						></textarea>
					</div>
					<button
						data-interactive-cursor="btn"
						disabled={isLoading}
						type="submit"
						class="w-full cursor-pointer rounded-lg bg-[#FEA55F] px-6 py-3 text-sm font-semibold text-[#01080E] transition-colors duration-200 hover:bg-[#FFC08A]"
					>
						{#if isLoading}
							Sending...
						{:else}
							submit-message
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="hidden flex-shrink-0 overflow-y-auto p-4 lg:block lg:w-1/2">
		<h3 class="text-md mb-4 text-[#607B96]">// Code snippet:</h3>
		<div
			class="rounded-lg border border-[#1E2D3D] bg-[#011627] p-4 font-mono text-sm whitespace-pre-wrap"
		>
			<pre data-interactive-cursor="code">
                    <code
					>{@html Prism.highlight(
						simulatedCodeMessage,
						Prism.languages.javascript,
						'javascript'
					)}</code
				>
                    </pre>
		</div>
	</div>
</div>
