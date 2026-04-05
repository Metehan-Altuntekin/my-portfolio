<script lang="ts">
	import SquareGridBG from '$lib/components/SquareGridBG.svelte';
	import Footer from '$lib/sections/Footer.svelte';
	import Header from '$lib/sections/Header.svelte';

	let { children } = $props();
</script>

<SquareGridBG />

<div class="w-full relative min-h-screen flex flex-col">
	<Header />

	<div class="mt-16 grow">
		{@render children()}
	</div>

	<Footer />
</div>
