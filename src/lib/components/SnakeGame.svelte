<script lang="ts">
	import { MoveDown, MoveLeft, MoveRight, MoveUp } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import { _ } from 'svelte-i18n';
	import bgBlur from '$lib/assets/background-blurs.avif';
	import bolt from '$lib/assets/bolt.png';
	import snakeFood from '$lib/assets/snake-food.png';
	import snakeFoodEmpty from '$lib/assets/snake-food-empty.png';

	type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

	interface Position {
		x: number;
		y: number;
	}

	const GRID_SIZE = 20;
	const INITIAL_SPEED = 150;
	const SPEED_INCREMENT = 5;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let gameInterval: ReturnType<typeof setInterval>;

	let snake: Position[] = $state.raw([
		{ x: 160, y: 160 },
		{ x: 160 - GRID_SIZE, y: 160 },
		{ x: 160 - 2 * GRID_SIZE, y: 160 }
	]);
	let food: Position = $state.raw({ x: 320, y: 420 });
	let score = $state(-1);
	let gameOver = $state(false);
	let gameStarted = $state(false);
	let direction: Direction = 'RIGHT';
	let nextDirection: Direction = 'RIGHT';
	let isWin = false;
	let currentSpeed = INITIAL_SPEED;

	// Función para generar una nueva ubicación de comida que no esté en la serpiente
	function generateFood(): Position {
		let newFood: Position;
		do {
			newFood = {
				x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE,
				y: Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE
			};
		} while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
		return newFood;
	}

	// Function to start/restart the game
	function startGame() {
		snake = [
			{ x: 160, y: 160 },
			{ x: 160 - GRID_SIZE, y: 160 },
			{ x: 160 - 2 * GRID_SIZE, y: 160 }
		];
		food = generateFood();
		direction = 'RIGHT';
		nextDirection = 'RIGHT';
		gameOver = false;
		gameStarted = true;
		score = -1;
		gameLoop();
	}

	function updateGame() {
		if (gameOver) return;

		direction = nextDirection;

		const head = { ...snake[0] };

		switch (direction) {
			case 'UP':
				head.y = head.y - GRID_SIZE;
				break;
			case 'DOWN':
				head.y = head.y + GRID_SIZE;
				break;
			case 'LEFT':
				head.x = head.x - GRID_SIZE;
				break;
			case 'RIGHT':
				head.x = head.x + GRID_SIZE;
				break;
		}

		// Wall collision
		if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
			gameOver = true;
			gameStarted = false;
			stopGameLoop();
			return;
		}

		// Self-collision
		if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
			gameOver = true;
			gameStarted = false;
			stopGameLoop();
			return;
		}

		// Añadir la nueva cabeza
		snake = [head, ...snake];

		// Verificar si comió la comida
		if (head.x === food.x && head.y === food.y) {
			score++;

			if (score === 9) {
				isWin = true;
				gameStarted = false;
				stopGameLoop();
				window.location.href = '/about-me';
				return;
			}
			food = generateFood();
			currentSpeed -= SPEED_INCREMENT;
			gameLoop(); // Reiniciar el intervalo con la nueva velocidad
		} else {
			snake = snake.slice(0, -1);
		}
	}

	// Function to handle keyboard input
	function handleKeyPress(e: KeyboardEvent) {
		if (!gameStarted && e.key === ' ') {
			startGame();
			return;
		}
		changeDirection(e.key);
	}

	function changeDirection(key: string) {
		// Solo permitir cambiar de dirección si no es en sentido contrario inmediato
		switch (key) {
			case 'ArrowUp':
				if (direction !== 'DOWN') nextDirection = 'UP';
				break;
			case 'ArrowDown':
				if (direction !== 'UP') nextDirection = 'DOWN';
				break;
			case 'ArrowLeft':
				if (direction !== 'RIGHT') nextDirection = 'LEFT';
				break;
			case 'ArrowRight':
				if (direction !== 'LEFT') nextDirection = 'RIGHT';
				break;
		}
	}

	// Detener el bucle del juego
	function stopGameLoop() {
		if (gameInterval) clearInterval(gameInterval);
	}
	// Function to update the game state and redraw the canvas
	function gameLoop() {
		stopGameLoop();
		gameInterval = setInterval(() => {
			updateGame();
		}, currentSpeed);
	}

	// Function to draw the game on the canvas
	function drawGame() {
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

		// Draw the snake
		snake.forEach((segment, index) => {
			switch (index) {
				case snake.length - 1:
					ctx.fillStyle = 'rgb(67, 217, 173, 0.55)';
					break;
				case snake.length - 2:
					ctx.fillStyle = 'rgb(67, 217, 173, 0.70)';
					break;
				case snake.length - 3:
					ctx.fillStyle = 'rgb(67, 217, 173, 0.85)';
					break;
				default:
					ctx.fillStyle = 'rgb(67, 217, 173)';
					break;
			}
			ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
		});

		// Draw the food
		ctx.fillStyle = '#46ecd5';
		ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);

		// If the game is over, show a message
		if (gameOver) {
			ctx.fillStyle = 'white';
			ctx.font = '50px Arial';
			ctx.fillText($_('gameOver'), canvas.width / 2 - 120, canvas.height / 2);
		}

		if (isWin) {
			ctx.fillStyle = 'white';
			ctx.font = '50px Arial';
			ctx.fillText($_('youWin'), canvas.width / 2 - 120, canvas.height / 2);
		}
	}

	// Al destruir el componente
	onDestroy(() => {
		stopGameLoop();
	});

	// Efecto para dibujar cuando cambia el estado del juego (snake, food, etc.)
	$effect(() => {
		ctx = canvas.getContext('2d')!;
		drawGame();
	});
</script>

<svelte:window onkeydown={handleKeyPress} />
<div class="items-center justify-center flex">
	<div class="absolute overflow-hidden hidden lg:block">
		<img src={bgBlur} alt="Background Blur" />
	</div>
	<div class="z-2 rounded-lg bg-gradient-to-r from-[#175553]/100 to-[#43d9ad]/13 p-1 shadow-2xl">
		<div class="relative">
			<img class="absolute top-1 left-1" src={bolt} alt="Background Blur" />
		</div>
		<div class="relative">
			<img class="absolute top-1 right-1" src={bolt} alt="Background Blur" />
		</div>

		<div class="flex h-160 w-90 md:h-190 md:w-150 lg:h-160 lg:w-120 flex-col justify-between rounded-md px-6">
			<div class="flex flex-grow items-center justify-between space-x-4">
				<div class="h-[90%] md:w-[70%] w-[80%]">
					<canvas
						width="420"
						height="800"
						bind:this={canvas}
						class="h-full w-full rounded-md border border-[#1d293d] bg-[#1d293d]"
					></canvas>
					{#if !gameStarted}
						<button
							data-interactive-cursor="navitem"
							class="hvr-bounce-in relative -top-18 left-6 w-3/4 cursor-pointer rounded-lg bg-[#ffb86a] px-4 py-2 text-sm text-[#020618] hover:bg-[#FEA55F] hover:text-[#01080E]"
							onclick={() => {
								startGame();
							}}
						>
							{gameOver ? $_('restartGame') : $_('startGame')}
						</button>
					{/if}
				</div>

				<div class="flex h-[90%] flex-col justify-between text-xs text-slate-50">
					<div>
						<div class="rounded-md bg-[#1d293d] p-4">
							<p class="mb-2">{$_('useKeyboard')}</p>
							<p class="mb-4">{$_('arrowsToPlay')}</p>
							<div class="mx-auto grid w-[70px] grid-cols-3 gap-x-3 gap-y-0">
								<div></div>
								<button
									onclick={() => changeDirection('ArrowUp')}
									class="flex h-7 w-7 items-center justify-center rounded-sm border border-[#1A293A] bg-[#010C15] text-[#E5E9F0]"
								>
									<MoveUp size={18} />
								</button>
								<div></div>
								<button
									onclick={() => changeDirection('ArrowLeft')}
									class="flex h-7 w-7 items-center justify-center rounded-sm border border-[#1A293A] bg-[#010C15] text-sm text-[#E5E9F0]"
								>
									<MoveLeft size={18} />
								</button>
								<button
									onclick={() => changeDirection('ArrowDown')}
									class="flex h-7 w-7 items-center justify-center rounded-sm border border-[#1A293A] bg-[#010C15] text-[#E5E9F0]"
								>
									<MoveDown size={18} />
								</button>
								<button
									onclick={() => changeDirection('ArrowRight')}
									class="flex h-7 w-7 items-center justify-center rounded-sm border border-[#1A293A] bg-[#010C15] text-[#E5E9F0]"
								>
									<MoveRight size={18} />
								</button>
							</div>
						</div>

						<div class="mt-5 p-3">
							<p class="mb-2">{$_('foodLeft')}</p>
							<div class="grid grid-cols-5 gap-1">
								{#each Array(10) as _, i}
									{#if i <= score}
										<img src={snakeFood} alt="Snake's food" />
									{:else}
										<img src={snakeFoodEmpty} alt="Snake's food empty" />
									{/if}
								{/each}
							</div>
						</div>
					</div>

					<a
						href="/about-me"
						class="mr-1 mb-3 self-end rounded border border-[#607B96] p-2 text-xs text-[#607B96] hover:border-[#E5E9F0] hover:text-[#E5E9F0]"
					>
						{$_('skip')}
					</a>
				</div>
			</div>
		</div>
		<div class="relative">
			<img class="absolute bottom-1 left-1" src={bolt} alt="Background Blur" />
		</div>
		<div class="relative">
			<img class="absolute right-1 bottom-1" src={bolt} alt="Background Blur" />
		</div>
	</div>
</div>

<style>
	/* Bounce In */
	.hvr-bounce-in {
		display: inline-block;
		vertical-align: middle;
		-webkit-transform: perspective(1px) translateZ(0);
		transform: perspective(1px) translateZ(0);
		box-shadow: 0 0 1px rgba(0, 0, 0, 0);
		-webkit-transition-duration: 0.5s;
		transition-duration: 0.5s;
	}
	.hvr-bounce-in:hover,
	.hvr-bounce-in:focus,
	.hvr-bounce-in:active {
		-webkit-transform: scale(1.2);
		transform: scale(1.2);
		-webkit-transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
		transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
	}
</style>
