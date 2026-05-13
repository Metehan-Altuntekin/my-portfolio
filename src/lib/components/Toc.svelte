<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { browser } from '$app/environment';

	type TocItem = { id: string; level: number; title: string };

	const { items }: { items: TocItem[] } = $props();

	let activeTitle = $state<string | null>(null);
	let observer: IntersectionObserver | null = null;

	onMount(async () => {
		if (!browser) return;

		await tick();

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						activeTitle = e.target.id;
					}
				});
			},
			{
				threshold: 0,
				rootMargin: '5% 0px -70% 0px'
			}
		);

		items.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (!el) return;
			observer?.observe(el);
		});
	});

	onDestroy(() => {
		if (!browser) return;
		observer?.disconnect();
	});
</script>

<section
	id="table-of-contents"
	class="hidden lg:block lg:sticky top-10 right-0 shrink-0 px-0
				md:w-42
				lg:w-56 lg:ml-14
				xl:w-auto xl:max-w-xs 2xl:max-w-sm"
>
	<div class="flex flex-col max-h-[75vh]">
		<ul
			class="max-h-full overflow-y-auto z-0
						[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:w-4 [&::-webkit-scrollbar-thumb]:bg-gray-500/40 [&::-webkit-scrollbar-thumb]:rounded-xs"
		>
			{#each items as { id, title, level }}
				<li
					class="mb-3
				{level === 1 || level === 2
						? 'text-base'
						: level === 3
							? 'ml-6 text-sm'
							: level === 4
								? 'ml-12 text-xs'
								: 'ml-18 text-[10px]'}"
				>
					<a
						href="#{id}"
						class="hover:underline max-w-full
				{activeTitle === id ? 'text-base-content font-semibold' : 'text-base-content-muted font-medium'}"
						>{title}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</section>
