<script lang="ts">
import {
	SiAmazons3,
	SiAnthropic,
	SiBun,
	SiCss3,
	SiDocker,
	SiDrizzle,
	SiExpo,
	SiFigma,
	SiFirebase,
	SiGit,
	SiHtml5,
	SiJavascript,
	SiMarkdown,
	SiMysql,
	SiNodedotjs,
	SiOpenai,
	SiPostgresql,
	SiPython,
	SiReact,
	SiSolid,
	SiStripe,
	SiSvelte,
	SiTailwindcss,
	SiTauri,
	SiTelegram,
	SiTypescript,
	SiWordpress,
} from '@icons-pack/svelte-simple-icons';
import ChevtonDownIcon from 'lucide-svelte/icons/chevron-down';
import ChevtonRightIcon from 'lucide-svelte/icons/chevron-right';
import FolderIcon from 'lucide-svelte/icons/folder';
import MailIcon from 'lucide-svelte/icons/mail';
import PhoneIcon from 'lucide-svelte/icons/phone';
import XIcon from 'lucide-svelte/icons/x';
import { marked } from 'marked';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { _, locale } from 'svelte-i18n';
import avatar from '$lib/assets/me.webp';
import CountUp from '$lib/components/bits/CountUp.svelte';
import FadeContent from '$lib/components/bits/FadeContent.svelte';
import SpotlightCard from '$lib/components/bits/SpotlightCard.svelte';
import CodeSnippetCard from '$lib/components/CodeSnippetCard.svelte';
import {
	type CodeSnippet,
	codeSnippets,
	contactItems,
	type PersonalInfoItemsType,
} from '$lib/data/personalInfo';
import { projectsData } from '$lib/data/projects';
import { skillCategories, skills } from '$lib/data/skills';

let anima = $state<HTMLElement>();
// Display label of the open tab (translated). Selection identity lives in
// activeItemKey/activeSubKey below: JSON keys stay English in all languages,
// only `text` and `content` are translated.
let activeDesktopTab = $state('my-bio');
let activeItemKey = $state('bio');
let activeSubKey: string | null = $state('myBio');
let showSkills = $state(false);
const isMyBio = $derived(
	!showSkills && activeItemKey === 'bio' && activeSubKey === 'myBio',
);
let openMobileAccordion = $state('');
let personalInfoEducationOpenDesktop = $state(true);
let contactsOpenDesktop = $state(true);
let shuffledSnippets = $state(shuffle([...codeSnippets]));
let PersonalInfoItems = $state({} as PersonalInfoItemsType);
let currentContent = $state(''); // Default content

let renderedBio = $state('');
let bioKey = $state(0);
let snippetsExpanded = $state(false);
const visibleSnippets = $derived(
	snippetsExpanded ? shuffledSnippets : shuffledSnippets.slice(0, 3),
);

async function loadTranslations() {
	let lang = 'en';
	const unsubscribe = locale.subscribe((value) => {
		if (value) {
			lang = value;
		}
	});
	unsubscribe();
	try {
		const response = await fetch(`/i18n/personalInfo/${lang}.json`);
		PersonalInfoItems = await response.json();
		currentContent = PersonalInfoItems.bio.subItems.myBio.content;
		showSkills = false;
		activeItemKey = 'bio';
		activeSubKey = 'myBio';
		activeDesktopTab = PersonalInfoItems.bio.subItems.myBio.text;
	} catch (error) {
		console.error('Error loading translations:', error);
		currentContent = 'Content not available.';
	}
}

async function renderBio() {
	renderedBio = await marked.parse(currentContent);
	bioKey += 1;
}

$effect(() => {
	const unsubscribe = locale.subscribe(async (lang) => {
		if (lang) {
			await loadTranslations();
			await renderBio();
		}
	});
	return unsubscribe;
});

async function selectContent(
	itemKey: string,
	subItemKey: string | null = null,
) {
	showSkills = false;
	activeItemKey = itemKey;
	activeSubKey = subItemKey;
	if (subItemKey && PersonalInfoItems[itemKey]?.subItems?.[subItemKey]) {
		if (subItemKey === 'skills') {
			showSkills = true;
			activeDesktopTab = PersonalInfoItems[itemKey].subItems[subItemKey].text;
			return;
		}
		currentContent = PersonalInfoItems[itemKey].subItems[subItemKey].content;
		activeDesktopTab = PersonalInfoItems[itemKey].subItems[subItemKey].text;
		await renderBio();
	} else if (itemKey === 'contacts') {
		currentContent = '## Contact \n\n';
		currentContent += contactItems
			.map((c) => `- ${c.type}: ${c.value}`)
			.join('\n\n');
		activeDesktopTab = get(_)('contacts');
		await renderBio();
	} else if (PersonalInfoItems[itemKey]?.content) {
		// Fallback if no subItems or direct item content
		currentContent = PersonalInfoItems[itemKey].content;
		activeDesktopTab = PersonalInfoItems[itemKey].text;
		await renderBio();
	}
	// Close mobile accordion after a selection (desktop ignores this state)
	if (subItemKey || itemKey === 'contacts') {
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

onMount(async () => {
	await loadTranslations();
	await renderBio();
});
</script>

<div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
	<div
		class="border-bluegray text-midnight flex-shrink-0 text-sm lg:w-1/6 lg:border-r"
	>
		<div class="hidden h-full overflow-y-auto lg:block">
			<div class="mb-4">
				<button
					type="button"
					data-interactive-cursor="dropdown"
					onclick={() => (personalInfoEducationOpenDesktop = !personalInfoEducationOpenDesktop)}
					class="hover:text-cwhite flex h-[42px] w-full items-center pl-4 {personalInfoEducationOpenDesktop ? 'text-cwhite' : ''} border-bluegray border-b"
				>
					{#if personalInfoEducationOpenDesktop}
						<ChevtonDownIcon
							class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
						/>
					{:else}
						<ChevtonRightIcon
							class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
						/>
					{/if}
					{$_('personalInfo')}
				</button>
				{#if personalInfoEducationOpenDesktop}
					<div class="pt-2">
						{#each Object.entries(PersonalInfoItems) as [key, item] (key)}
							{#if item.subItems}
								<button
									type="button"
									data-interactive-cursor="navitem"
									onclick={() => {
	item.isOpen = !item.isOpen;
}}
									class="hover:text-cwhite flex w-full items-center py-1 pl-3"
								>
									{#if item.isOpen}
										<ChevtonDownIcon
											class="mr-1 h-3 w-3 transition-transform duration-200"
										/>
									{:else}
										<ChevtonRightIcon
											class="mr-1 h-3 w-3 transition-transform duration-200"
										/>
									{/if}
									<FolderIcon
										class="mr-2 h-4 w-4 fill-current {item.iconColor}"
									/>
									{item.text}
								</button>
								{#if item.isOpen}
									<div class="pl-8">
										{#each Object.entries(item.subItems) as [subKey, subItem] (subKey)}
											<button
												type="button"
												data-interactive-cursor="navitem"
												onclick={() => selectContent(key, subKey)}
												class="hover:text-cwhite flex w-full items-center py-1 {activeDesktopTab === subItem.text ? 'text-cwhite' : ''}"
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
					type="button"
					class="hover:text-cwhite flex h-[42px] w-full items-center pl-4 {contactsOpenDesktop ? 'text-cwhite' : ''} border-bluegray border-y"
					onclick={() => (contactsOpenDesktop = !contactsOpenDesktop)}
					data-interactive-cursor="dropdown"
				>
					{#if contactsOpenDesktop}
						<ChevtonDownIcon
							class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
						/>
					{:else}
						<ChevtonRightIcon
							class="mr-2 h-3 w-3 fill-current transition-transform duration-200"
						/>
					{/if}
					{$_('contacts')}
				</button>
				{#if contactsOpenDesktop}
					<div class="pt-2 pl-8">
						{#each contactItems as contact (contact.value)}
							<button
								type="button"
								data-interactive-cursor="navitem"
								onclick={() => selectContent('contacts')}
								class="hover:text-cwhite flex w-full items-center pt-1 text-xs {activeDesktopTab === 'contacts' ? 'text-cwhite' : ''}"
							>
								{#if contact.type === 'email'}
									<MailIcon class="mr-2 h-3 w-3" />
								{/if}
								{#if contact.type === 'phone'}
									<PhoneIcon class="mr-2 h-3 w-3" />
								{/if}
								{contact.value}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div class="relative flex-shrink-0 lg:hidden">
			<div class="border-bluegray flex h-11 border-b text-sm">
				<button
					type="button"
					onclick={() => toggleMobileAccordion('personal-info')}
					aria-expanded={openMobileAccordion === 'personal-info'}
					class="border-bluegray flex min-h-[44px] flex-1 items-center justify-center gap-1.5 border-r px-2 {openMobileAccordion === 'personal-info' ? 'text-cwhite' : ''}"
				>
					{#if openMobileAccordion === 'personal-info'}
						<ChevtonDownIcon
							class="h-4 w-4 shrink-0 transition-transform duration-200"
						/>
					{:else}
						<ChevtonRightIcon
							class="h-4 w-4 shrink-0 transition-transform duration-200"
						/>
					{/if}
					<span class="truncate">{$_('personalInfo')}</span>
				</button>
				<button
					type="button"
					onclick={() => toggleMobileAccordion('contacts')}
					aria-expanded={openMobileAccordion === 'contacts'}
					class="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 px-2 {openMobileAccordion === 'contacts' ? 'text-cwhite' : ''}"
				>
					{#if openMobileAccordion === 'contacts'}
						<ChevtonDownIcon
							class="h-4 w-4 shrink-0 transition-transform duration-200"
						/>
					{:else}
						<ChevtonRightIcon
							class="h-4 w-4 shrink-0 transition-transform duration-200"
						/>
					{/if}
					<span class="truncate">{$_('contacts')}</span>
				</button>
			</div>
			{#if openMobileAccordion === 'personal-info'}
				<div
					class="border-bluegray absolute inset-x-0 top-full z-20 max-h-[50dvh] overflow-y-auto overscroll-contain border-b bg-[#011221]/95 shadow-xl backdrop-blur-lg"
				>
					{#each Object.entries(PersonalInfoItems) as [key, item] (key)}
						{#if item.subItems}
							<button
								type="button"
								onclick={() => (item.isOpen = !item.isOpen)}
								class="border-bluegray/50 hover:bg-bluegray/20 flex min-h-[44px] w-full items-center px-3 py-2.5 text-left"
							>
								{#if item.isOpen}
									<ChevtonDownIcon
										class="mr-1.5 h-3.5 w-3.5 shrink-0 transition-transform duration-200"
									/>
								{:else}
									<ChevtonRightIcon
										class="mr-1.5 h-3.5 w-3.5 shrink-0 transition-transform duration-200"
									/>
								{/if}
								<FolderIcon
									class="mr-2 h-4 w-4 shrink-0 fill-current {item.iconColor}"
								/>
								<span class="truncate">{item.text}</span>
							</button>
							{#if item.isOpen}
								{#each Object.entries(item.subItems) as [subKey, subItem] (subKey)}
									<button
										type="button"
										onclick={() => selectContent(key, subKey)}
										class="border-bluegray/30 hover:bg-bluegray/20 flex min-h-[44px] w-full items-center px-3 py-2.5 pl-9 text-left {activeDesktopTab === subItem.text ? 'text-cwhite' : ''}"
									>
										<SiMarkdown size={14} />
										<span class="ml-2 truncate">{subItem.text}</span>
									</button>
								{/each}
							{/if}
						{/if}
					{/each}
				</div>
			{:else if openMobileAccordion === 'contacts'}
				<div
					class="border-bluegray absolute inset-x-0 top-full z-20 max-h-[50dvh] overflow-y-auto overscroll-contain border-b bg-[#011221]/95 shadow-xl backdrop-blur-lg"
				>
					{#each contactItems as contact (contact.value)}
						<button
							type="button"
							onclick={() => selectContent('contacts')}
							class="border-bluegray/50 hover:bg-bluegray/20 flex min-h-[44px] w-full items-center px-3 py-2.5 text-left"
						>
							{#if contact.type === 'email'}
								<MailIcon class="mr-2 h-4 w-4 shrink-0" />
							{/if}
							{#if contact.type === 'phone'}
								<PhoneIcon class="mr-2 h-4 w-4 shrink-0" />
							{/if}
							<span class="truncate text-xs">{contact.value}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
		<div
			class="border-bluegray flex min-h-0 w-full flex-1 flex-col p-0 lg:flex-grow lg:border-r lg:border-b-0"
		>
			<div
				class="border-bluegray flex h-8 flex-shrink-0 items-center gap-2 border-b px-3 text-xs lg:hidden"
			>
				<span class="text-midnight truncate">// {activeDesktopTab}</span>
			</div>
			<div
				class="border-bluegray hidden h-[42px] flex-shrink-0 border-b lg:flex"
			>
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
				class="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 text-sm leading-relaxed break-words sm:p-6"
			>
				{#if isMyBio}
					<div
						class="border-bluegray mb-6 flex flex-col gap-4 rounded-xl bg-[#011221]/60 p-5 sm:flex-row sm:items-center sm:gap-5"
						data-interactive-cursor="text"
					>
						<img
							src={avatar}
							alt="Denilson De La Rosa"
							width={80}
							height={80}
							fetchpriority="high"
							decoding="async"
							class="h-20 w-20 shrink-0 rounded-full border-2 border-[#FEA55F]/60 object-cover"
						>
						<div class="min-w-0">
							<h2 class="text-cwhite text-xl font-bold">Denilson De La Rosa</h2>
							<p class="text-sm text-[#43D9AD]">
								{$_('fullStackDeveloper')}
								· Veracruz, México.
							</p>
							<div class="mt-3 flex flex-wrap gap-x-6 gap-y-2">
								<div>
									<span class="text-cwhite text-lg font-bold">2+</span>
									<span class="text-midnight ml-1 text-xs"
										>{$_('statExperience')}</span
									>
								</div>
								<div>
									<span class="text-cwhite text-lg font-bold"
										><CountUp to={projectsData.length} duration={1.5} /></span
									>
									<span class="text-midnight ml-1 text-xs"
										>{$_('statProjects')}</span
									>
								</div>
								<div>
									<span class="text-cwhite text-lg font-bold"
										><CountUp to={skills.length} duration={1.5} /></span
									>
									<span class="text-midnight ml-1 text-xs"
										>{$_('statSkills')}</span
									>
								</div>
							</div>
							<div class="mt-4 flex flex-wrap gap-2">
								<a
									href="/projects"
									data-interactive-cursor="btn"
									class="rounded-lg bg-gradient-to-r from-[#ffb86a] to-[#FEA55F] px-4 py-2 text-xs font-semibold text-[#020618] transition-all duration-300 hover:brightness-110"
								>
									{$_('viewProjects')}
								</a>
								<a
									href="/contact-me"
									data-interactive-cursor="btn"
									class="rounded-lg border border-[#1E2D3D] px-4 py-2 text-xs font-semibold text-[#E5E9F0] transition-colors duration-300 hover:border-[#E5E9F0]"
								>
									{$_('contact')}
								</a>
							</div>
						</div>
					</div>
				{/if}
				{#if showSkills}
					<div class="skills-section">
						<div class="mb-8 grid grid-cols-2 gap-4">
							<div
								class="rounded-lg border border-bluegray bg-[#011221] p-4 text-center"
							>
								<div class="text-cwhite text-2xl font-bold sm:text-3xl">
									<CountUp to={skills.length} duration={1.5} />
								</div>
								<div class="text-midnight text-xs">{$_('statSkills')}</div>
							</div>
							<div
								class="rounded-lg border border-bluegray bg-[#011221] p-4 text-center"
							>
								<div class="text-cwhite text-2xl font-bold sm:text-3xl">
									<CountUp to={projectsData.length} duration={1.5} />
								</div>
								<div class="text-midnight text-xs">{$_('statProjects')}</div>
							</div>
						</div>
						<h2 class="text-cwhite text-2xl mb-6">{$_('skillsTitle')}</h2>
						{#each skillCategories as category}
							<div class="mb-8">
								<h3 class="text-cwhite text-lg mb-4">{category}</h3>
								<div
									class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3"
								>
									{#each skills.filter((s) => s.category === category) as skill}
										<SpotlightCard
											spotlightColor="rgba(97, 95, 255, 0.3)"
											class="skill-item !rounded-lg !border-bluegray !bg-[#011221] !p-4"
										>
											<div class="flex items-center mb-2">
												{#if skill.icon === 'SiJavascript'}
													<span class="mr-2 text-yellow-400"
														><SiJavascript size={24} /></span
													>
												{:else if skill.icon === 'SiTypescript'}
													<span class="mr-2 text-blue-400"
														><SiTypescript size={24} /></span
													>
												{:else if skill.icon === 'SiPython'}
													<span class="mr-2 text-green-400"
														><SiPython size={24} /></span
													>
												{:else if skill.icon === 'SiReact'}
													<span class="mr-2 text-blue-300"
														><SiReact size={24} /></span
													>
												{:else if skill.icon === 'SiSvelte'}
													<span class="mr-2 text-orange-400"
														><SiSvelte size={24} /></span
													>
												{:else if skill.icon === 'SiNodedotjs'}
													<span class="mr-2 text-green-500"
														><SiNodedotjs size={24} /></span
													>
												{:else if skill.icon === 'SiBun'}
													<span class="mr-2 text-[#fbf0df]"
														><SiBun size={24} /></span
													>
												{:else if skill.icon === 'SiFirebase'}
													<span class="mr-2 text-orange-500"
														><SiFirebase size={24} /></span
													>
												{:else if skill.icon === 'SiPostgresql'}
													<span class="mr-2 text-blue-500"
														><SiPostgresql size={24} /></span
													>
												{:else if skill.icon === 'SiMysql'}
													<span class="mr-2 text-[#4479a1]"
														><SiMysql size={24} /></span
													>
												{:else if skill.icon === 'SiDrizzle'}
													<span class="mr-2 text-[#c5f74f]"
														><SiDrizzle size={24} /></span
													>
												{:else if skill.icon === 'SiExpo'}
													<span class="mr-2 text-white"
														><SiExpo size={24} /></span
													>
												{:else if skill.icon === 'SiTauri'}
													<span class="mr-2 text-cyan-300"
														><SiTauri size={24} /></span
													>
												{:else if skill.icon === 'SiSolid'}
													<span class="mr-2 text-blue-400"
														><SiSolid size={24} /></span
													>
												{:else if skill.icon === 'SiStripe'}
													<span class="mr-2 text-[#635bff]"
														><SiStripe size={24} /></span
													>
												{:else if skill.icon === 'SiTelegram'}
													<span class="mr-2 text-sky-400"
														><SiTelegram size={24} /></span
													>
												{:else if skill.icon === 'SiOpenai'}
													<span class="mr-2 text-gray-200"
														><SiOpenai size={24} /></span
													>
												{:else if skill.icon === 'SiAnthropic'}
													<span class="mr-2 text-[#d97757]"
														><SiAnthropic size={24} /></span
													>
												{:else if skill.icon === 'SiWordpress'}
													<span class="mr-2 text-sky-500"
														><SiWordpress size={24} /></span
													>
												{:else if skill.icon === 'SiAmazons3'}
													<span class="mr-2 text-green-500"
														><SiAmazons3 size={24} /></span
													>
												{:else if skill.icon === 'SiHtml5'}
													<span class="mr-2 text-orange-500"
														><SiHtml5 size={24} /></span
													>
												{:else if skill.icon === 'SiCss3'}
													<span class="mr-2 text-blue-500"
														><SiCss3 size={24} /></span
													>
												{:else if skill.icon === 'SiTailwindcss'}
													<span class="mr-2 text-cyan-400"
														><SiTailwindcss size={24} /></span
													>
												{:else if skill.icon === 'SiGit'}
													<span class="mr-2 text-red-500"
														><SiGit size={24} /></span
													>
												{:else if skill.icon === 'SiDocker'}
													<span class="mr-2 text-blue-600"
														><SiDocker size={24} /></span
													>
												{:else if skill.icon === 'SiFigma'}
													<span class="mr-2 text-purple-400"
														><SiFigma size={24} /></span
													>
												{/if}
												<span class="text-cwhite">{skill.name}</span>
											</div>
											<div
												class="progress-bar bg-bluegray rounded-full h-2 overflow-hidden"
											>
												<div
													class="progress-fill bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-[width] duration-1000 ease-out"
													style="width: {showSkills ? skill.level + '%' : '0%'}"
												></div>
											</div>
											<span class="text-xs text-midnight mt-1"
												><CountUp to={skill.level} duration={1.5} />%</span
											>
										</SpotlightCard>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					{#key bioKey}
						<FadeContent blur duration={700} threshold={0.2}>
							<article
								bind:this={anima}
								class="bio-article anima max-w-full overflow-x-hidden break-words"
							>
								{@html renderedBio}
							</article>
						</FadeContent>
					{/key}
				{/if}
				<div class="mt-8 lg:hidden">
					<div class="border-bluegray mb-10 border-t"></div>
					<h3 class="text-cwhite mb-4 text-lg">{$_('codeSnippetShowcase')}</h3>
					{#each visibleSnippets as snippet (snippet.code)}
						<div class="mb-6">
							<CodeSnippetCard {...snippet} />
						</div>
					{/each}
					{#if shuffledSnippets.length > 3}
						<button
							type="button"
							onclick={() => (snippetsExpanded = !snippetsExpanded)}
							class="w-full rounded-lg border border-[#1E2D3D] py-2.5 text-xs text-[#607B96] hover:border-[#E5E9F0] hover:text-[#E5E9F0]"
						>
							{snippetsExpanded
	? $_('showLess')
	: `${$_('showMore')} (+${shuffledSnippets.length - 3})`}
						</button>
					{/if}
				</div>
			</div>
		</div>

		<div class="hidden w-1/3 flex-shrink-0 overflow-y-auto p-4 lg:block">
			<h3 class="text-md text-midnight mb-4">{$_('codeSnippetShowcase')}</h3>
			{#each visibleSnippets as snippet (snippet.code)}
				<div class="mb-6">
					<CodeSnippetCard {...snippet} />
				</div>
			{/each}
			{#if shuffledSnippets.length > 3}
				<button
					type="button"
					onclick={() => (snippetsExpanded = !snippetsExpanded)}
					class="w-full rounded-lg border border-[#1E2D3D] py-2.5 text-xs text-[#607B96] hover:border-[#E5E9F0] hover:text-[#E5E9F0]"
				>
					{snippetsExpanded
	? $_('showLess')
	: `${$_('showMore')} (+${shuffledSnippets.length - 3})`}
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
/* Bio typography: bright body copy so the text wins over the snippets. */
.bio-article {
	color: #e5e9f0;
	font-size: 0.95rem;
	line-height: 1.8;
}
:global(.bio-article > p:first-of-type) {
	font-size: 1.08rem;
	line-height: 1.75;
	color: #ffffff;
}
:global(.bio-article h3) {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin: 0 0 1rem;
	font-size: 1.35rem;
	font-weight: 700;
	color: #ffffff;
}
:global(.bio-article h3::before) {
	content: "//";
	color: #43d9ad;
	font-weight: 600;
}
:global(.bio-article strong) {
	color: #fea55f;
	font-weight: 600;
}
:global(.bio-article a) {
	color: #7d8bff;
	text-decoration: underline;
	text-underline-offset: 3px;
}
:global(.bio-article a:hover) {
	color: #fea55f;
}
:global(.bio-article blockquote) {
	margin: 1.25rem 0;
	padding: 0.9rem 1.1rem;
	border-left: 3px solid #fea55f;
	border-radius: 0 0.5rem 0.5rem 0;
	background: rgba(254, 165, 95, 0.07);
	font-size: 1.05rem;
	line-height: 1.7;
	color: #ffffff;
}
:global(.bio-article blockquote p) {
	margin: 0;
}
:global(.bio-article ul) {
	list-style: none;
	padding-left: 0;
	margin: 0.75rem 0;
}
:global(.bio-article ul li) {
	position: relative;
	margin: 0.4rem 0;
	padding-left: 1.4rem;
}
:global(.bio-article ul li::before) {
	content: "\25B8";
	position: absolute;
	left: 0;
	color: #43d9ad;
}
:global(.bio-article p) {
	margin: 0 0 1rem;
}
</style>
