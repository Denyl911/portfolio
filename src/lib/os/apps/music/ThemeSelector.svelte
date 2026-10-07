<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
import { audio } from '../../audio/engine.svelte';
import { THEMES } from '../../audio/tracks';
</script>

<fieldset class="flex items-center gap-1.5">
	<legend class="sr-only">{$_('os.theme')}</legend>
	{#each THEMES as th (th.id)}
		<button
			type="button"
			onclick={() => audio.setTheme(th.id)}
			aria-pressed={audio.theme === th.id}
			title={th.name}
			aria-label={`${$_('os.theme')}: ${th.name}`}
			class="h-8 min-w-[44px] flex-1 rounded-md border px-2 text-[11px] font-medium transition-all {audio.theme === th.id
				? 'text-[#020618]'
				: 'border-white/15 text-slate-300 hover:border-white/30 hover:text-white'}"
			style={audio.theme === th.id
				? `background: ${th.accent}; border-color: ${th.accent};`
				: 'background: rgba(255,255,255,0.04);'}
		>
			{th.name}
		</button>
	{/each}
</fieldset>
