<script lang="ts">
	import { SiMarkdown } from '@icons-pack/svelte-simple-icons';
	import { gsap } from 'gsap';
	import { SplitText } from "gsap/dist/SplitText";
	import ChevtonDownIcon from 'lucide-svelte/icons/chevron-down';
	import ChevtonRightIcon from 'lucide-svelte/icons/chevron-right';
	import FolderIcon from 'lucide-svelte/icons/folder';
	import MailIcon from 'lucide-svelte/icons/mail';
	import PhoneIcon from 'lucide-svelte/icons/phone';
	import XIcon from 'lucide-svelte/icons/x';
	import { marked } from 'marked';
	import { onDestroy, onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import CodeSnippetCard from '$lib/components/CodeSnippetCard.svelte';
	import {
		type CodeSnippet,
		codeSnippets,
		contactItems,
		type PersonalInfoItemsType,
		personalInfoItems
	} from '$lib/data/personalInfo';
	import { skills, skillCategories } from '$lib/data/skills';
	import {
		SiJavascript,
		SiTypescript,
		SiPython,
		SiReact,
		SiSvelte,
		SiNodedotjs,
		SiHtml5,
		SiCss3,
		SiTailwindcss,
		SiGit,
		SiDocker,
		SiFigma
	} from '@icons-pack/svelte-simple-icons';

	gsap.registerPlugin(SplitText);
	let animation: gsap.core.Tween;
	let split: globalThis.SplitText;
	let anima = $state<Element>();
	let activeDesktopTab = $state('my-bio');
	let openMobileAccordion = $state('');
	let personalInfoEducationOpenDesktop = $state(true);
	let contactsOpenDesktop = $state(true);
	let shuffledSnippets = $state(shuffle(codeSnippets));
	let PersonalInfoItems = $state({} as PersonalInfoItemsType);
	let currentContent = $state(''); // Default content
	let showSkills = $state(false);

	async function loadTranslations() {
		let lang = 'en';
		const unsubscribe = locale.subscribe((value) => {
			if (value) {
				lang = value;
			}
		});
		unsubscribe();
		try {
			const response = await fetch(`i18n/personalInfo/${lang}.json`);
			PersonalInfoItems = await response.json();
			currentContent = PersonalInfoItems.bio.subItems.myBio.content;
		} catch (error) {
			console.error('Error loading translations:', error);
			currentContent = 'Content not available.';
		}
	}

	$effect(() => {
		const unsubscribe = locale.subscribe(async (lang) => {
			if (lang) {
				await loadTranslations();
				anima.innerHTML = await marked.parse(currentContent);
				split?.revert();
				animation?.revert();
				split = SplitText.create(anima, {
					type: 'lines',
					deepSlice: false,
				});
				animation = gsap.from(split.lines, {
					rotationX: -100,
					transformOrigin: '50% 50% -160px',
					opacity: 0,
					duration: 0.7,
					ease: 'power3',
					stagger: 0.25
				});
			}
		});
		return unsubscribe;
	});

	async function selectContent(itemKey: string, subItemKey: string | null = null) {
		showSkills = false;
		if (
			subItemKey &&
			PersonalInfoItems[itemKey] &&
			PersonalInfoItems[itemKey].subItems &&
			PersonalInfoItems[itemKey].subItems[subItemKey]
		) {
			if (subItemKey === 'skills') {
				showSkills = true;
				activeDesktopTab = PersonalInfoItems[itemKey].subItems[subItemKey].text;
				return;
			}
			split?.revert();
			animation?.revert();
			currentContent = PersonalInfoItems[itemKey].subItems[subItemKey].content;
			activeDesktopTab = PersonalInfoItems[itemKey].subItems[subItemKey].text;
			anima.innerHTML = await marked.parse(currentContent);
			split = SplitText.create(anima, {
				type: 'lines',
				deepSlice: false,
			});
			animation = gsap.from(split.lines, {
				rotationX: -100,
				transformOrigin: '50% 50% -160px',
				opacity: 0,
				duration: 0.7,
				ease: 'power3',
				stagger: 0.25
			});
		} else if (itemKey === 'contacts') {
			currentContent = '## Contact \n\n';
			currentContent += contactItems.map((c) => `- ${c.type}: ${c.value}`).join('\n\n');
			activeDesktopTab = 'contacts';
			anima.innerHTML = await marked.parse(currentContent);
			split = SplitText.create(anima, {
				type: 'lines',
				deepSlice: false,
			});
			animation = gsap.from(split.lines, {
				rotationX: -100,
				transformOrigin: '50% 50% -160px',
				opacity: 0,
				duration: 0.7,
				ease: 'power3',
				stagger: 0.25
			});
		} else if (PersonalInfoItems[itemKey]?.content) {
			// Fallback if no subItems or direct item content
			currentContent = PersonalInfoItems[itemKey].content;
			activeDesktopTab = PersonalInfoItems[itemKey].text;
		}
		// For mobile, only close the main accordion if a content selection is made from a sub-item
		if (window.innerWidth < 1024 && subItemKey) {
			openMobileAccordion = '';
		} else if (window.innerWidth < 1024 && itemKey === 'contacts') {
			openMobileAccordion = '';
		}
	}

	function toggleMobileAccordion(section: string) {
		openMobileAccordion = openMobileAccordion === section ? '' : section;
	}

	function shuffle(array: CodeSnippet[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	function animateProgress(node: HTMLElement, level: number) {
		gsap.fromTo(node, { width: '0%' }, { width: `${level}%`, duration: 1.5, ease: 'power2.out' });
		return {
			update(newLevel: number) {
				gsap.to(node, { width: `${newLevel}%`, duration: 1.5, ease: 'power2.out' });
			}
		};
	}

	onMount(async () => {
		await loadTranslations();
		anima.innerHTML = await marked.parse(currentContent);
		split = SplitText.create(anima, {
			type: 'lines',
			deepSlice: false,
		});
		animation = gsap.from(split.lines, {
			rotationX: -100,
			transformOrigin: '50% 50% -160px',
			opacity: 0,
			duration: 0.7,
			ease: 'power3',
			stagger: 0.25
		});
	});
	onDestroy(() => {
		animation?.revert();
		split?.revert();
	});
</script>

<div
	class="border-bluegray text-midnight flex-shrink-0 border-b text-sm lg:w-1/5 lg:border-r lg:border-b-0"
>
	<div class="hidden h-full overflow-y-auto lg:block">
		<div class="mb-4">
			<button
				data-interactive-cursor="dropdown"
				onclick={() => (personalInfoEducationOpenDesktop = !personalInfoEducationOpenDesktop)}
				class="hover:text-cwhite flex h-[42px] w-full items-center pl-4 {personalInfoEducationOpenDesktop
					? 'text-cwhite'
					: ''} border-bluegray border-b"
			>
				{#if personalInfoEducationOpenDesktop}
					<ChevtonDownIcon class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{:else}
					<ChevtonRightIcon class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{/if}
				{$_('personalInfo')}
			</button>
			{#if personalInfoEducationOpenDesktop}
				<div class="pt-2">
					{#each Object.entries(PersonalInfoItems) as [key, item] (key)}
						{#if item.subItems}
							<button
								data-interactive-cursor="navitem"
								onclick={() => {
									item.isOpen = !item.isOpen;
								}}
								class="hover:text-cwhite flex w-full items-center py-1 pl-3"
							>
								{#if item.isOpen}
									<ChevtonDownIcon class="mr-1 h-3 w-3 transition-transform duration-200" />
								{:else}
									<ChevtonRightIcon class="mr-1 h-3 w-3 transition-transform duration-200" />
								{/if}
								<FolderIcon class="mr-2 h-4 w-4 fill-current {item.iconColor}" />
								{item.text}
							</button>
							{#if item.isOpen}
								<div class="pl-8">
									{#each Object.entries(item.subItems) as [subKey, subItem] (subKey)}
										<button
											data-interactive-cursor="navitem"
											onclick={() => selectContent(key, subKey)}
											class="hover:text-cwhite flex w-full items-center py-1 {activeDesktopTab ===
											subItem.text
												? 'text-cwhite'
												: ''}"
										>
											<SiMarkdown size={14} />
											<span class="ml-2">{subItem.text}</span>
										</button>
									{/each}
								</div>
							{/if}
						{/if}
					{/each}
				</div>
			{/if}
		</div>
		<div>
			<button
				class="hover:text-cwhite flex h-[42px] w-full items-center pl-4 {contactsOpenDesktop
					? 'text-cwhite'
					: ''} border-bluegray border-y"
				onclick={() => (contactsOpenDesktop = !contactsOpenDesktop)}
				data-interactive-cursor="dropdown"
			>
				{#if contactsOpenDesktop}
					<ChevtonDownIcon class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{:else}
					<ChevtonRightIcon class="mr-2 h-3 w-3 fill-current transition-transform duration-200" />
				{/if}
				{$_('contacts')}
			</button>
			{#if contactsOpenDesktop}
				<div class="pt-2 pl-8">
					{#each contactItems as contact (contact.value)}
						<button
							data-interactive-cursor="navitem"
							onclick={() => selectContent('contacts')}
							class="hover:text-cwhite flex w-full items-center pt-1 text-xs {activeDesktopTab ===
							'contacts'
								? 'text-cwhite'
								: ''}"
						>
							{#if contact.type == 'email'}
								<MailIcon class="mr-2 h-3 w-3" />
							{/if}
							{#if contact.type == 'phone'}
								<PhoneIcon class="mr-2 h-3 w-3" />
							{/if}
							{contact.value}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="lg:hidden">
		<div class="border-bluegray border-b p-4">
			<h2 class="text-cwhite text-lg">{$_('aboutMe')}</h2>
		</div>
		<div>
			<button
				onclick={() => toggleMobileAccordion('personal-info')}
				class="border-bluegray hover:bg-bluegray/30 flex w-full items-center justify-between border-b p-4"
			>
				<span class="text-cwhite flex items-center">
					{#if openMobileAccordion === 'personal-info'}
						<ChevtonDownIcon class="mr-2 h-4 w-4 transition-transform duration-200" />
					{:else}
						<ChevtonRightIcon class="mr-2 h-4 w-4 transition-transform duration-200" />
					{/if}
					{$_('personalInfo')}
				</span>
			</button>
			{#if openMobileAccordion === 'personal-info'}
				<div class="bg-[#011221] text-sm">
					{#each Object.entries(PersonalInfoItems) as [key, item] (key)}
						{#if item.subItems}
							<button
								onclick={() => (item.isOpen = !item.isOpen)}
								class="border-bluegray/50 hover:bg-bluegray/20 flex w-full items-center justify-between border-b p-3 pl-6"
							>
								<span class="flex items-center">
									{#if item.isOpen}
										<ChevtonDownIcon class="mr-1 h-3 w-3 transition-transform duration-200" />
									{:else}
										<ChevtonRightIcon class="mr-1 h-3 w-3 transition-transform duration-200" />
									{/if}
									<FolderIcon class="mr-2 h-4 w-4 fill-current {item.iconColor}" />
									{item.text}
								</span>
							</button>
							{#if item.isOpen}
								<div class="pl-8">
									{#each Object.entries(item.subItems) as [subKey, subItem] (subKey)}
										<button
											onclick={() => selectContent(key, subKey)}
											class="border-bluegray/30 hover:bg-bluegray/20 flex w-full items-center border-b p-3 pl-5 text-left"
										>
											<SiMarkdown size={14} />
											<span class="ml-2">{subItem.text}</span>
										</button>
									{/each}
								</div>
							{/if}
						{/if}
					{/each}
				</div>
			{/if}

			<button
				onclick={() => toggleMobileAccordion('contacts')}
				class="border-bluegray hover:bg-bluegray/30 flex w-full items-center justify-between border-b p-4"
			>
				<span class="text-cwhite flex items-center">
					{#if openMobileAccordion === 'contacts'}
						<ChevtonDownIcon class="mr-2 h-4 w-4 transition-transform duration-200" />
					{:else}
						<ChevtonRightIcon class="mr-2 h-4 w-4 transition-transform duration-200" />
					{/if}
					{$_('contacts')}
				</span>
			</button>
			{#if openMobileAccordion === 'contacts'}
				<div class="bg-[#011221] text-sm">
					{#each contactItems as contact (contact.value)}
						<button
							onclick={() => selectContent('contacts')}
							class="border-bluegray/50 hover:bg-bluegray/20 flex w-full items-center border-b p-3 pl-6 text-left"
						>
							{#if contact.type == 'email'}
								<MailIcon class="mr-2 h-4 w-4" />
							{/if}
							{#if contact.type == 'phone'}
								<PhoneIcon class="mr-2 h-4 w-4" />
							{/if}
							{contact.value}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
				</div>

<div class="flex flex-grow flex-col overflow-auto lg:flex-row">
	<div
		class="border-bluegray flex w-full flex-col border-b p-0 lg:flex-grow lg:border-r lg:border-b-0"
	>
		<div class="border-bluegray hidden h-[42px] flex-shrink-0 border-b lg:flex">
			<div
				data-interactive-cursor="text"
				class="border-bluegray text-cwhite flex items-center border-r px-4"
			>
				{activeDesktopTab}
				<XIcon class="text-midnight hover:text-cwhite ml-2 h-3 w-3" />
			</div>
		</div>
		<div
			data-interactive-cursor="content"
			class="flex-grow overflow-y-auto p-6 text-sm leading-relaxed"
		>
			{#if showSkills}
				<div class="skills-section">
					<h2 class="text-cwhite text-2xl mb-6">Technical Skills</h2>
					{#each skillCategories as category}
						<div class="mb-8">
							<h3 class="text-cwhite text-lg mb-4">{category}</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{#each skills.filter(s => s.category === category) as skill}
									<div class="skill-item bg-[#011221] p-4 rounded-lg border border-bluegray">
										<div class="flex items-center mb-2">
											{#if skill.icon === 'SiJavascript'}
												<span class="mr-2 text-yellow-400"><SiJavascript size={24} /></span>
											{:else if skill.icon === 'SiTypescript'}
												<span class="mr-2 text-blue-400"><SiTypescript size={24} /></span>
											{:else if skill.icon === 'SiPython'}
												<span class="mr-2 text-green-400"><SiPython size={24} /></span>
											{:else if skill.icon === 'SiReact'}
												<span class="mr-2 text-blue-300"><SiReact size={24} /></span>
											{:else if skill.icon === 'SiSvelte'}
												<span class="mr-2 text-orange-400"><SiSvelte size={24} /></span>
											{:else if skill.icon === 'SiNodedotjs'}
												<span class="mr-2 text-green-500"><SiNodedotjs size={24} /></span>
											{:else if skill.icon === 'SiHtml5'}
												<span class="mr-2 text-orange-500"><SiHtml5 size={24} /></span>
											{:else if skill.icon === 'SiCss3'}
												<span class="mr-2 text-blue-500"><SiCss3 size={24} /></span>
											{:else if skill.icon === 'SiTailwindcss'}
												<span class="mr-2 text-cyan-400"><SiTailwindcss size={24} /></span>
											{:else if skill.icon === 'SiGit'}
												<span class="mr-2 text-red-500"><SiGit size={24} /></span>
											{:else if skill.icon === 'SiDocker'}
												<span class="mr-2 text-blue-600"><SiDocker size={24} /></span>
											{:else if skill.icon === 'SiFigma'}
												<span class="mr-2 text-purple-400"><SiFigma size={24} /></span>
											{/if}
											<span class="text-cwhite">{skill.name}</span>
										</div>
										<div class="progress-bar bg-bluegray rounded-full h-2">
											<div
												class="progress-fill bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
												style="width: 0%"
												use:animateProgress={skill.level}
											></div>
										</div>
										<span class="text-xs text-midnight mt-1">{skill.level}%</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<article bind:this={anima} class="prose prose-pinky anima"></article>
			{/if}
			<div class="mt-8 lg:hidden">
				<div class="border-bluegray mb-10 border-t"></div>
				<h3 class="text-cwhite mb-4 text-lg">{$_('codeSnippetShowcase')}</h3>
				{#each shuffledSnippets as snippet (snippet.code)}
					<CodeSnippetCard {...snippet} />
				{/each}
			</div>
		</div>
	</div>

	<div class="hidden flex-shrink-0 overflow-y-auto p-4 lg:block lg:w-4/9">
		<h3 class="text-md text-midnight mb-4">{$_('codeSnippetShowcase')}</h3>
		{#each shuffledSnippets as snippet (snippet.code)}
			<CodeSnippetCard {...snippet} />
		{/each}
	</div>
				</div>
