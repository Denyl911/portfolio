<script lang="ts">
import { Gamepad2, MessageCircle, Music, SquareTerminal } from 'lucide-svelte';
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import wallpaper from '$lib/assets/la-creacion.png';
import { apps } from '../apps/registry';
import { os } from '../state/os.svelte';

const icons = {
	music: Music,
	terminal: SquareTerminal,
	games: Gamepad2,
	messages: MessageCircle,
} as const;

let now = $state(new Date());

$effect(() => {
	const id = setInterval(() => (now = new Date()), 10000);
	return () => clearInterval(id);
});

const time = $derived(
	now
		.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
		.replace(/\s?[AP]M/i, ''),
);
const date = $derived(
	now
		.toLocaleDateString([], {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
		.replaceAll(',', '')
		.replaceAll('/', ' '),
);
</script>

<div class="relative min-h-0 flex-1 overflow-hidden bg-[#011627]">
	<!-- Fondo: La Creación (dominio público, Miguel Ángel) en monocromo dithered -->
	<img
		src={wallpaper}
		alt=""
		aria-hidden="true"
		width={560}
		height={284}
		loading="lazy"
		decoding="async"
		class="absolute top-[42%] left-1/2 w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-90"
	>
	<!-- Viñetas para legibilidad del reloj y las apps -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#011627] via-transparent to-[#011627]"
	></div>

	<div class="relative flex h-full flex-col px-3 pt-5 pb-3">
		<p
			class="text-center text-sm font-medium tracking-wide text-white/80 capitalize"
		>
			{date}
		</p>
		<p
			class="text-center text-[64px] leading-none font-bold tracking-tight text-white/90 tabular-nums"
		>
			{time}
		</p>

		<div class="mt-auto">
			<ul
				class="grid list-none grid-cols-4 gap-1.5 p-0"
				aria-label={$_('os.appsLabel')}
			>
				{#each apps.slice(0, 4) as app (app.id)}
					{@const Icon = icons[app.icon as keyof typeof icons] ?? Music}
					<li class="min-w-0">
						<button
							type="button"
							disabled={!app.enabled}
							onclick={() => os.openApp(app.id)}
							aria-label={app.enabled ? `${$_('os.openApp')}: ${app.name}` : `${app.name}: ${$_('os.soon')}`}
							aria-disabled={!app.enabled}
							class="group flex w-full flex-col items-center gap-1 rounded-2xl p-1 transition-transform {app.enabled
								? 'hover:scale-105 active:scale-95'
								: 'cursor-not-allowed opacity-40'}"
						>
							<span
								class="flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/15 bg-white/10 text-slate-100 shadow-lg backdrop-blur transition-colors {app.enabled
									? 'group-hover:border-white/35 group-hover:bg-white/15'
									: ''}"
							>
								<Icon size={24} aria-hidden="true" />
							</span>
							<span
								class="w-full truncate text-center text-[10px] font-medium text-slate-200"
							>
								{app.name}
							</span>
							{#if !app.enabled}
								<span
									class="rounded-full bg-white/10 px-1.5 text-[9px] text-slate-400"
									>{$_('os.soon')}</span
								>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
