<script>
import {
	SiGithub,
	SiInstagram,
	SiMastodon,
	SiX,
} from '@icons-pack/svelte-simple-icons';
import { _ } from 'svelte-i18n';
</script>

<footer class="border-white/20 sticky bottom-0 z-50 border-t bg-black/20 backdrop-blur-lg">
	<div class="container mx-auto flex items-center justify-between md:flex-row">
		<div class="flex items-center space-x-4 pl-1 md:pl-6 lg:pl-8">
			<span class="text-midnight" data-interactive-cursor="text">{$_('findMeIn')}</span>
			<!-- <a
				href="#"
				target="_blank" rel="noopener noreferrer"
				aria-label="X / Twitter"
				class="flex h-10 items-center border-x border-bluegray px-4 text-midnight hover:text-cwhite"
			>
				<SiX size={20}/>
			</a> -->
			<!-- <a
				data-interactive-cursor="navitem"
				href="https://www.instagram.com/denilson_drs"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Instagram"
				class="border-bluegray text-midnight hover:text-cwhite flex h-10 items-center border-x px-4"
			>
				<SiInstagram size={20} />
			</a> -->
			<a
				data-interactive-cursor="navitem"
				href="https://www.linkedin.com/in/denilson-de-la-rosa-s%C3%A1nchez-7171281b9"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="LinkedIn"
				class="border-white/20 text-midnight hover:text-cwhite flex h-10 items-center border-x px-4"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"
					><path
						d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
					></path></svg
				>
			</a>
			<a
				rel="noopener noreferrer"
				href="https://x.com/imnotdenyl"
				target="_blank"
				aria-label="Twitter"
				class="border-white/20 text-midnight hover:text-cwhite flex h-10 items-center border-r pr-4"
			>
				<SiX />
			</a>
			<a
				href="https://github.com/Denyl911"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
				class="border-white/20 text-midnight hover:text-cwhite flex h-10 items-center border-r pr-4 md:hidden"
			>
				<SiGithub />
			</a>
		</div>
		<div class="border-white/20 text-midnight hidden border-l px-3 text-sm md:flex md:space-x-4">
			<a
				data-interactive-cursor="navitem"
				href="https://github.com/Denyl911"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
				class="text-midnight hover:text-cwhite flex h-10 items-center"
			>
				<span class="mt-1 mr-2">@Denyl911</span>
				<SiGithub />
			</a>
		</div>
	</div>
</footer>
