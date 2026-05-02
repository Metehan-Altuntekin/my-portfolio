<script lang="ts">
	import { getProjects } from '$content/index';
	import ArrowOutwardIcon from '~icons/material-symbols/arrow-outward-rounded';
	import * as m from '$lib/paraglide/messages.js';

	const projects = getProjects();
</script>

<!-- @component Section for projects of the developer. -->

<section id="projects">
	<!-- Heading -->
	<div class="w-full flex flex-col items-center mb-10 md:mb-12 lg:mb-16">
		<h1 class="text-3xl md:text-4xl lg:text-5xl text-center mb-[0.5em] font-bold">
			{m.projects_title()}
		</h1>
		<p class="text-center">{m.projects_subtitle()}</p>
	</div>

	<!-- TODO probably sliding container for mobile -->
	<!-- Projects Container -->
	<flex
		class="grid auto-rows-fr items-stretch justify-center w-full place-content-center place-items-center
					grid-cols-[repeat(auto-fill,minmax(320px,1fr))]
					lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]
					2xl:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]
					gap-4 md:gap-6 xl:gap-8"
	>
		<!-- Projects -->
		{#each projects as p, i (i)}
			<div class="card p-0 overflow-hidden max-w-120 lg:max-w-none">
				<!-- TODO revise the hover cover -->
				<a href={p.visitUrl} class="relative" target="_blank" title="Visit {p.name}">
					<enhanced:img
						src={p.thumb}
						sizes="(max-width: 639px) 45vw, (max-width: 1023px) 45vw, 30vw"
						class="card-content rounded-b-none aspect-video"
						alt="Preview of {p.name} project"
						loading="lazy"
						decoding="async"
					/>

					{#if p.visitUrl}
						<div
							class="card-content rounded-b-none
										flex items-center justify-center absolute inset-[1.5px] z-10
										bg-white/10 backdrop-blur-xs text-2xl font-semibold
										opacity-0 hover:opacity-100 transition-all"
						>
							<span class="chip bg-black/50 text-xl text-base-content">
								{m.projects_visit_site()}
								<ArrowOutwardIcon class="text-3xl ml-2 inline" />
							</span>
						</div>
					{/if}
				</a>

				<div
					class="flex flex-col p-4 pt-3 gap-2 content-between h-full
								lg:p-5 md:gap-3"
				>
					<h2 class="text-xl md:text-2xl xl:text-3xl font-bold">{p.name}</h2>
					<p class="text-base-content-muted text-xs sm:text-sm/4">{p.desc}</p>

					<div class="flex justify-between mt-auto">
						<div class="flex gap-1">
							{#each p.tags as tag}
								<span class="chip bg-opacity-0">{tag}</span>
							{/each}
						</div>

						<div class="chip rounded-3xs flex gap-2">
							{#each p.tools as t}
								<!-- TODO name tooltip -->
								<svelte:component this={t.icon} class="h-5 w-5 text-trans" />
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</flex>
</section>
