<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { browser } from '$app/environment';
import { audio } from '../audio/engine.svelte';

let el: HTMLAudioElement | null = $state(null);

onMount(() => {
	if (browser && el) audio.attach(el);
});

onDestroy(() => {
	// No detach: el elemento persiste en el layout; solo se desmonta
	// en recargas. Conservar el binding para no perder el estado.
});
</script>

<!-- biome-ignore lint/a11y/useMediaCaption: pista musical sin diálogo ni subtítulos -->
<audio
	bind:this={el}
	preload="metadata"
	crossorigin="anonymous"
	aria-hidden="true"
	tabindex={-1}
	class="hidden"
></audio>
