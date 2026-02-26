<script lang="ts">
	// Mobile versions (aspect ratio 1.175)
	import heroPicMobile500 from '$lib/assets/optimized/hero-pic-500px-mobile.jpeg';
	import heroPicMobile800 from '$lib/assets/optimized/hero-pic-800px-mobile.jpeg';
	import heroPicMobile1100 from '$lib/assets/optimized/hero-pic-1100px-mobile.avif';

	// Desktop versions (aspect ratio 3/4)
	import heroPicDesktop1400 from '$lib/assets/optimized/hero-pic-1400px-desktop.avif';
	import heroPicDesktop1100 from '$lib/assets/optimized/hero-pic-1100px-desktop.avif';
	import heroPicDesktop800 from '$lib/assets/optimized/hero-pic-800px-desktop.avif';
	import heroPicDesktop500 from '$lib/assets/optimized/hero-pic-500px-desktop.jpeg';

	import MailIcon from '~icons/foundation/mail';
	import * as m from '$lib/paraglide/messages.js';

	type Cta = {
		title: string;
		description: string;
		url: string;
	};

	const ctas: Cta[] = [
		{
			title: m.hero_cta_projects_title(),
			description: m.hero_cta_projects_desc(),
			url: '#projects'
		},
		{
			title: m.hero_cta_about_title(),
			description: m.hero_cta_about_desc(),
			url: '#skills'
		}
	];
</script>

<svelte:head>
	<link
		rel="preload"
		as="image"
		media="(max-width: 639px)"
		imagesrcset="{heroPicMobile500} 500w, {heroPicMobile800} 800w, {heroPicMobile1100} 1100w"
		imagesizes="65vw"
		fetchpriority="high"
	/>

	<link
		rel="preload"
		as="image"
		media="(min-width: 640px)"
		imagesrcset="{heroPicDesktop500} 500w, {heroPicDesktop800} 800w, {heroPicDesktop1100} 1100w, {heroPicDesktop1400} 1400w"
		imagesizes="25vw"
		fetchpriority="high"
	/>
</svelte:head>

<section
	id="hero-section"
	class="z-10 h-screen pt-16 flex flex-col items-center justify-evenly
				gap-4 sm:gap-6 md:gap-x-10 lg:gap-10 xl:gap-x-20
				sm:portrait:h-min"
>
	<!-- Image & Text -->
	<div
		class="flex flex-col w-full gap-10 justify-center grow
					sm:flex-row-reverse sm:justify-between sm:items-center"
	>
		<!-- Image  -->
		<div
			class="image-card aspect-[1.175] max-h-full w-[70vw] min-w-64 ml-auto
						sm:aspect-3/4 sm:ml-0 sm:w-auto sm:h-full sm:max-h-[60vh]"
		>
			<picture class="block h-full w-full object-center">
				<!-- Desktop versions (min-width: 640px) - aspect ratio 3/4 -->
				<source
					media="(min-width: 640px)"
					srcset={`${heroPicDesktop500} 500w, ${heroPicDesktop800} 800w, ${heroPicDesktop1100} 1100w, ${heroPicDesktop1400} 1400w`}
					sizes="25vw"
				/>
				<!-- Mobile versions (max-width: 639px) - aspect ratio 1.175 -->
				<source
					media="(max-width: 639px)"
					srcset={`${heroPicMobile500} 500w, ${heroPicMobile800} 800w, ${heroPicMobile1100} 1100w`}
					sizes="65vw"
				/>
				<!-- Fallback img -->
				<img
					class="block min-h-full min-w-full object-center"
					src={heroPicMobile500}
					width="400"
					height="340"
					alt="Mete on a pedestrian bridge over a highway in a sunny day. Car traffic, green trees and mountains on the background."
					fetchpriority="high"
					loading="eager"
					decoding="sync"
				/>
			</picture>
		</div>

		<!-- Heading, Paragraph -->
		<div class="sm:grow-0">
			<h1
				class="mb-[0.725em] text-[clamp(40px,5vw,88px)] font-bold leading-[1.14em] max-w-[10em]"
				style="font-variation-settings:
							'FLAR' 100,
							'VOLM' 10;"
			>
				{m.hero_title()}
			</h1>

			<p class="text-base/5 font-normal sm:text-xl/6 lg:text-2xl/7 max-w-[27em]">
				{@html m.hero_description()}
			</p>
		</div>
	</div>

	<!-- CTAs & Email -->
	<div class="flex w-full justify-between items-end">
		<!--  CTAs -->
		<div class="flex gap-5 max-w-full">
			{#each ctas as c (c.title)}
				<a class="card card-clickable w-64 gap-1 p-3 lg:gap-3 lg:p-6" href={c.url}>
					<h2 class="text-xl/7 lg:text-2xl font-bold">{c.title}</h2>
					<p class="text-subtitle">{c.description}</p>
				</a>
			{/each}
		</div>

		<!-- Email -->
		<div class="hidden flex-col items-center justify-center gap-2 lg:flex">
			<a href="#contact" class="chip backdrop-blur-xl">{m.hero_reach_out()}</a>

			<a
				href="mailto:dev@metehan.design"
				class="card card-clickable flex-row items-center justify-center gap-3 px-5 py-3 xl:gap-6 xl:px-9 xl:py-5"
			>
				<MailIcon class="text-2xl lg:text-3xl xl:text-4xl" />
				<span class="text-xl/7 lg:text-xl xl:text-2xl font-bold">dev@metehan.design</span>
			</a>
		</div>
	</div>
</section>
