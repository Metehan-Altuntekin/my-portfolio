<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let scrollY = $state(0);
	let scrolled = $derived(scrollY > 70);
	$inspect(scrolled);
</script>

<svelte:window bind:scrollY />

<header
	class="z-50 fixed left-0 right-0 top-0 w-full px-(--page-padding) py-3
				transition-all duration-500
				flex items-center justify-between
				before:absolute before:-z-10 before:left-0 before:right-0 before:-top-16 before:bottom-0
				before:bg-black/0 before:transition-all before:duration-500
				{scrolled && 'before:bg-black/5 before:backdrop-blur-lg'}	"
>
	<a href="/" title="Home">
		<Logo />
	</a>

	<div class="flex items-center gap-4 md:gap-6">
		<a href="/blog" class="font-medium">{m.nav_blog()}</a>
		<LanguageSwitcher />
	</div>
</header>
