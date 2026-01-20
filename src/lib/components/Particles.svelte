<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let particles = Array.from({ length: 50 }, () => ({
		id: Math.random(),
		left: Math.random() * 100,
		top: Math.random() * 100,
		delay: Math.random() * 10
	}));
</script>

<div class="particles-container {className}">
	{#each particles as p (p.id)}
		<div
			class="particle"
			style="left: {p.left}%; top: {p.top}%; animation-delay: {p.delay}s;"
		></div>
	{/each}
</div>

<style>
	.particles-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;
	}

	.particle {
		position: absolute;
		width: 4px;
		height: 4px;
		background-color: rgba(77, 91, 206, 0.4);
		border-radius: 50%;
		animation: float 15s infinite ease-in-out;
	}

	@keyframes float {
		0% {
			transform: translateY(0px) translateX(0px);
			opacity: 0.2;
		}
		25% {
			transform: translateY(-30px) translateX(5px);
			opacity: 0.6;
		}
		50% {
			transform: translateY(-60px) translateX(-5px);
			opacity: 0.4;
		}
		75% {
			transform: translateY(-30px) translateX(10px);
			opacity: 0.5;
		}
		100% {
			transform: translateY(0px) translateX(0px);
			opacity: 0.2;
		}
	}
</style>