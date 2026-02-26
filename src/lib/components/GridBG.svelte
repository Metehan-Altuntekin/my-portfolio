<script lang="ts">
	let scrollY = $state(0);
	let translateY = $derived(scrollY * -0.06);
</script>

<!-- @component This component renders a background grid decoration that looks like the lines on a blueprint. -->

<svelte:window bind:scrollY />

<svelte:head>
	<link rel="preload" as="image" href="/grid-dashed-bit.webp" />
</svelte:head>

<div
	class="bg-grid fixed left-0 h-[150vh] w-screen overflow-hidden"
	style="transform: translateY({translateY}px);"
></div>

<style>
	.bg-grid {
		--bg-size: 64px;
		background: url('/grid-dashed-bit.webp');
		background-repeat: repeat;
		background-size: var(--bg-size) var(--bg-size);
		opacity: 0.32;

		/* For parallax better performance */
		will-change: transform;
		backface-visibility: hidden;

		/* background: radial-gradient(#fff, rgba(255, 255, 255, 0.7) 40%, transparent 70%); */
		mask-image: radial-gradient(
			#fff,
			rgba(255, 255, 255, 0.7) 40%,
			transparent 70%,
			transparent 101%
		);
		mask-size: 100% 100%;
	}
</style>
