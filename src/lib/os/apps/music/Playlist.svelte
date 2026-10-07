<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import { audio } from '../../audio/engine.svelte';

let { accent = '#43d9ad' }: { accent?: string } = $props();
</script>

<ol
	class="os-scroll flex max-h-36 flex-col gap-1 overflow-y-auto pr-1"
	aria-label={$_('os.playlist')}
>
	{#each audio.playlist as t, i (t.id)}
		<li>
			<button
				type="button"
				onclick={() => audio.select(i)}
				aria-current={i === audio.trackIndex ? 'true' : undefined}
				class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors {i === audio.trackIndex
					? 'bg-white/10 text-white'
					: 'text-slate-300 hover:bg-white/5 hover:text-white'}"
				style={i === audio.trackIndex ? `border-left: 2px solid ${accent}` : ''}
			>
				<img
					src={t.cover}
					alt=""
					width={28}
					height={28}
					loading="lazy"
					decoding="async"
					class="h-7 w-7 shrink-0 rounded"
				>
				<span class="min-w-0 flex-1">
					<span class="block truncate font-medium">{t.title}</span>
					<span class="block truncate text-[11px] opacity-70">{t.artist}</span>
				</span>
				{#if i === audio.trackIndex}
					<span aria-hidden="true" class="text-[11px]" style="color: {accent}"
						>♪</span
					>
				{/if}
			</button>
		</li>
	{/each}
</ol>
