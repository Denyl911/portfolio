<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-[#020618]">
	<div
		class="flex h-[97vh] w-[97vw] flex-col overflow-y-auto rounded-lg border border-[#1E2D3D] bg-[#011627] font-['Fira_Code',_monospace] text-[#E5E9F0]"
	>
		<Header />

		{@render children()}

		<Footer />
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');
</style>
