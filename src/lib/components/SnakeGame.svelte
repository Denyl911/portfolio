<script>
	import { MoveLeft, MoveRight, MoveUp, MoveDown } from 'lucide-svelte';
	import bgBlur from '$lib/assets/background-blurs.png';
	import bolt from '$lib/assets/bolt.png';
	import snakeFood from '$lib/assets/snake-food.png';
	import snakeFoodEmpty from '$lib/assets/snake-food-empty.png';
	import { onMount } from 'svelte';

	//let canvas = $state();
	let canvasElement = $state();
	let ctx = $state();
	const snakeSize = $state([]);
	const gridWidth = 20; // Ancho de cada segmento (por ejemplo, 20 píxeles)
	const gridHeight = 20;
	let snake = $state([
		{ x: 160, y: 160 },
		{ x: 160 - gridWidth, y: 160 },
		{ x: 160 - 2 * gridWidth, y: 160 }
	]);
	let food = $state({ x: 420, y: 220 });
	let direction = $state({ x: gridWidth, y: 0 });
	let gameInterval;
	let isGameOver = $state(false);
	let gameStarted = $state(false);
	let isWin = $state(false);

	// Function to start/restart the game
	function startGame() {
		snake = [
			{ x: 160, y: 160 },
			{ x: 160 - gridWidth, y: 160 },
			{ x: 160 - 2 * gridWidth, y: 160 }
		];
		food = generateFoodLocation(); // Generar una nueva posición para la comida al inicio
		direction = { x: gridWidth, y: 0 };
		isGameOver = false;
		gameStarted = true;
		clearInterval(gameInterval);
		gameInterval = setInterval(gameLoop, 150);
		drawGame();
	}

	// Function to end the game
	function endGame() {
		clearInterval(gameInterval);
		isGameOver = true;
		drawGame();
	}

	// Function to handle keyboard input
	function changeDirection(event) {
		if (isGameOver) return;

		if (event.key === 'ArrowUp' && direction.y === 0) {
			direction = { x: 0, y: -gridHeight };
		} else if (event.key === 'ArrowDown' && direction.y === 0) {
			direction = { x: 0, y: gridHeight };
		} else if (event.key === 'ArrowLeft' && direction.x === 0) {
			direction = { x: -gridWidth, y: 0 };
		} else if (event.key === 'ArrowRight' && direction.x === 0) {
			direction = { x: gridWidth, y: 0 };
		}
	}

	// Función para generar una nueva ubicación de comida que no esté en la serpiente
	function generateFoodLocation() {
		let newFood;
		do {
			newFood = {
				x: Math.floor(Math.random() * (canvasElement.width / gridWidth)) * gridWidth,
				y: Math.floor(Math.random() * (canvasElement.height / gridHeight)) * gridHeight
			};
		} while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
		return newFood;
	}

	// Function to detect collision with walls or self
	function detectCollision() {
		const head = snake[0];
		// Wall collision
		if (
			head.x < 0 ||
			head.x >= canvasElement.width ||
			head.y < 0 ||
			head.y >= canvasElement.height
		) {
			return true;
		}
		// Self-collision
		for (let i = 1; i < snake.length; i++) {
			if (head.x === snake[i].x && head.y === snake[i].y) {
				return true;
			}
		}
		return false;
	}

	// Function to handle food consumption
	function eatFood() {
		const head = snake[0];
		if (head.x === food.x && head.y === food.y) {
			snakeSize.push(1);
			food = generateFoodLocation();
		} else {
			snake.pop(); // Remove the last segment of the snake if food is not eaten
		}
	}

	// Function to update the game state and redraw the canvas
	function gameLoop() {
		if (isGameOver) return;

		// Move the snake
		const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
		snake = [head, ...snake]; // Esto asegura la reactividad de Svelte

		// Check if win
		if (snakeSize.length == 10) {
			clearInterval(gameInterval);
			isWin = true;
			drawGame();
			window.location.href = '/about-me';
		}

		eatFood(); // Check if food is eaten

		if (detectCollision()) {
			endGame();
			return;
		}

		drawGame();
	}

	// Function to draw the game on the canvas
	function drawGame() {
		ctx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Clear the canvas

		// Draw the snake
		snake.forEach((segment, index) => {
			var grd = ctx.createLinearGradient(0, 0, 200, 0);
			grd.addColorStop(0, 'red');
			grd.addColorStop(1, 'white');
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
			// if (index === snake.length - 1) {
			// 	ctx.fillStyle = 'rgb(67, 217, 173, 0.5)'; // tail
			// }else {
			// 	ctx.fillStyle = 'rgb(67, 217, 173)'; // Body
			// }
			ctx.fillRect(segment.x, segment.y, gridWidth, gridHeight);
		});

		// Draw the food in yellow
		ctx.fillStyle = '#46ecd5';
		ctx.beginPath();
		ctx.fillRect(food.x, food.y, gridWidth, gridHeight);
		//ctx.arc(food.x + gridWidth / 2, food.y + gridHeight / 2, Math.min(gridWidth, gridHeight) / 2, 0, Math.PI * 2);
		ctx.fill();

		// If the game is over, show a message
		if (isGameOver) {
			ctx.fillStyle = 'white';
			ctx.font = '50px Arial';
			ctx.fillText('Game Over', canvasElement.width / 2 - 120, canvasElement.height / 2);
		}

		if (isWin) {
			ctx.fillStyle = 'white';
			ctx.font = '50px Arial';
			ctx.fillText("You've won", canvasElement.width / 2 - 120, canvasElement.height / 2);
		}
	}

	onMount(() => {
		ctx = canvasElement.getContext('2d');
		// Asegúrate de que el canvas tenga un tamaño definido para que el juego funcione correctamente
		canvasElement.width = 400; // O el tamaño que desees
		canvasElement.height = 800; // O el tamaño que desees

		drawGame(); // Initialize the game by showing the "Click to Start" message

		// Event listener for keyboard input
		window.addEventListener('keydown', changeDirection);
		window.addEventListener('keyup', (event) => {
			if (event.key === ' ') {
				if (isGameOver || !gameStarted) {
					startGame();
				}
			}
		});

		// Limpia el intervalo y el event listener cuando el componente se desmonte
		return () => {
			clearInterval(gameInterval);
			window.removeEventListener('keydown', changeDirection);
			window.removeEventListener('keyup', (event) => {
				if (event.key === ' ') {
					if (isGameOver || !gameStarted) {
						startGame();
					}
				}
			});
		};
	});
</script>

<div class="hidden items-center justify-center lg:flex">
	<div class="absolute overflow-hidden">
		<img src={bgBlur} alt="Background Blur" />
	</div>
	<div class="z-2 rounded-lg bg-gradient-to-r from-[#175553]/100 to-[#43d9ad]/13 p-1 shadow-2xl">
		<div class="relative">
			<img class="absolute top-1 left-1" src={bolt} alt="Background Blur" />
		</div>
		<div class="relative">
			<img class="absolute top-1 right-1" src={bolt} alt="Background Blur" />
		</div>

		<div class="flex h-[520px] w-[400px] flex-col justify-between rounded-md px-6">
			<div class="flex flex-grow items-center justify-between space-x-4">
				<div class="h-[90%] w-[60%]">
					<canvas
						bind:this={canvasElement}
						class="h-full w-full rounded-md border border-[#1d293d] bg-[#1d293d]"
					></canvas>
					{#if isGameOver || !gameStarted}
						<button
						data-interactive-cursor="navitem"
							class="hvr-bounce-in relative -top-18 left-6 w-3/4 cursor-pointer rounded-lg bg-[#ffb86a] px-4 py-2 text-sm text-[#020618] hover:bg-[#FEA55F] hover:text-[#01080E]"
							onclick={() => {
								if (isGameOver || !gameStarted) {
									startGame();
								}
							}}
						>
							{isGameOver ? 'restart-game' : 'start-game'}
						</button>
					{/if}
				</div>

				<div class="flex h-[90%] flex-col justify-between text-xs text-slate-50">
					<div>
						<div class="rounded-md bg-[#1d293d] p-4">
							<p class="mb-2">// use keyboard</p>
							<p class="mb-4">// arrows to play</p>
							<div class="mx-auto grid w-[70px] grid-cols-3 gap-x-3 gap-y-0">
								<div></div>
								<div
									class="flex h-7 w-7 items-center justify-center rounded-sm border border-[#1A293A] bg-[#010C15] text-[#E5E9F0]"
								>
									<MoveUp size={18} />
								</div>
								<div></div>
								<div
									class="flex h-7 w-7 items-center justify-center rounded-sm border border-[#1A293A] bg-[#010C15] text-sm text-[#E5E9F0]"
								>
									<MoveLeft size={18} />
								</div>
								<div
									class="flex h-7 w-7 items-center justify-center rounded-sm border border-[#1A293A] bg-[#010C15] text-[#E5E9F0]"
								>
									<MoveDown size={18} />
								</div>
								<div
									class="flex h-7 w-7 items-center justify-center rounded-sm border border-[#1A293A] bg-[#010C15] text-[#E5E9F0]"
								>
									<MoveRight size={18} />
								</div>
							</div>
						</div>

						<div class="mt-5 p-3">
							<p class="mb-2">// food left</p>
							<div class="grid grid-cols-5 gap-1">
								{#each Array(10) as _, i}
									{#if snakeSize[i] === 1}
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
						skip
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
