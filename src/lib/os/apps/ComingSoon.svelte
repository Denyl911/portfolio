<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: i18n translation
import { _ } from 'svelte-i18n';
</script>

<div
	class="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-6 text-center"
>
	<p class="text-4xl" aria-hidden="true">📦</p>
	<p class="text-sm font-medium text-white">{$_('os.soon')}</p>
	<p class="text-xs text-slate-400">{$_('os.soonHint')}</p>
</div>
