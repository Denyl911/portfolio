<script>
	import { SiX, SiGithub, SiInstagram } from '@icons-pack/svelte-simple-icons';
</script>

<footer class="sticky bottom-0 z-50 border-t border-bluegray">
	<div class="container mx-auto flex items-center justify-between md:flex-row">
		<div class="flex items-center space-x-4 pl-1 md:pl-6 lg:pl-8">
			<span class="text-midnight">find me in:</span>
			<!-- <a
				href="#"
				target="_blank" rel="noopener noreferrer"
				aria-label="X / Twitter"
				class="flex h-10 items-center border-x border-bluegray px-4 text-midnight hover:text-cwhite"
			>
				<SiX size={20}/>
			</a> -->
			<a
				href="https://www.instagram.com/denilson_drs"
				target="_blank" rel="noopener noreferrer"
				aria-label="Instagram"
				class="flex h-10 items-center border-x border-bluegray px-4 text-midnight hover:text-cwhite"
			>
				<SiInstagram size={20}/>
			</a>
			<a
				href="https://www.linkedin.com/in/denilson-de-la-rosa-s%C3%A1nchez-7171281b9"
				target="_blank" rel="noopener noreferrer"
				aria-label="LinkedIn"
				class="flex h-10 items-center border-r border-bluegray pr-4 text-midnight hover:text-cwhite"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"
					><path
						d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
					></path></svg
				>
			</a>
			<a
				href="https://github.com/Denyl911"
				target="_blank" rel="noopener noreferrer"
				aria-label="GitHub"
				class="flex h-10 items-center border-r border-bluegray pr-4 text-midnight hover:text-cwhite md:hidden"
			>
				<SiGithub />
			</a>
		</div>
		<div class="hidden border-l border-bluegray px-3 text-sm text-midnight md:block">
			<a
				href="https://github.com/Denyl911"
				target="_blank" rel="noopener noreferrer"
				aria-label="GitHub"
				class="flex h-10 items-center text-midnight hover:text-cwhite"
			>
				<span class="mt-1 mr-2">@Denyl911</span>
				<SiGithub />
			</a>
		</div>
	</div>
</footer>
