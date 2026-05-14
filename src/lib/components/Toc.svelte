<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import CloseIcon from '~icons/mdi/close';
	import * as m from '$lib/paraglide/messages.js';

	type TocItem = { id: string; level: number; title: string };

	const { items }: { items: TocItem[] } = $props();

	let activeTitle = $state<string | null>(null);
	let popoverRoot = $state<HTMLElement | undefined>(undefined);

	let observer: IntersectionObserver | null = null;

	function closeMobileToc() {
		popoverRoot?.hidePopover?.();
	}

	function itemTextClass(level: number, id: string, compact: boolean): string {
		const active = activeTitle === id;
		const base = compact ? 'block w-full text-left no-underline ' : 'hover:underline max-w-full ';
		const weight = active ? 'font-bold text-base-content' : 'font-medium text-base-content-muted';

		switch (level) {
			case 1:
				return `${base}text-lg tracking-[0.27px] ${weight}`;
			case 2:
				return `${base}text-base tracking-[0.24px] pl-6 ${weight}`;
			case 3:
				return `${base}text-sm tracking-[0.21px] pl-12 ${weight}`;
			case 4:
				return `${base}text-sm tracking-[0.21px] pl-16 ${weight}`;
			default:
				return `${base}text-[13px] tracking-[0.18px] pl-20 ${weight}`;
		}
	}

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

<!-- Desktop: sticky sidebar -->
<section
	id="table-of-contents"
	class="hidden lg:block lg:sticky top-10 right-0 shrink-0 px-0
				md:w-42
				lg:w-56 lg:ml-14
				xl:w-auto xl:max-w-xs 2xl:max-w-sm"
	aria-label="Table of contents"
>
	<div class="flex flex-col max-h-[75vh]">
		<ul class="max-h-full overflow-y-auto z-0">
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
						>
						{title}
						</a
					>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Mobile: collapsed strip + expandable panel -->
<div class="fixed right-0 bottom-12 z-100 flex flex-col items-end translate-x-0.5 lg:hidden">
	<button
		class="cursor-pointer flex flex-col items-center justify-center
					card p-0 rounded-r-none rounded-l-2xs
					px-2.5 py-4 gap-2.5 max-h-[50vh] min-h-0"
		aria-label={m.toc_open()}
		aria-controls="mobile-toc-expanded"
		popovertarget="mobile-toc-expanded"
		type="button"
	>
		{#each items as { id }}
			<span
				class="h-0.75 w-4 shrink-0 rounded-[2px] overflow-hidden
								{activeTitle === id ? 'bg-[#c5d1d0]' : 'bg-base-content-muted/30'}"
				aria-hidden="true"
			></span>
		{/each}
	</button>

	<div
		bind:this={popoverRoot}
		popover="auto"
		id="mobile-toc-expanded"
		class="bg-transparent fixed left-auto top-auto m-0 bottom-12 right-0 translate-x-0.5 overflow-visible"
	>
		<nav
			class="z-0 flex min-h-0 max-h-[70vh] w-full min-w-0 flex-col gap-3
						card p-0 rounded-r-none rounded-l-sm
						px-3 py-5 max-w-[min(85vw,20rem)]"
			aria-label="Table of contents"
		>
			<button
				type="button"
				class="z-1 absolute top-4 right-4
					rounded-full p-1 text-base-content-muted transition-colors
						bg-white/10 hover:bg-white/20 hover:text-base-content"
				aria-label={m.toc_close()}
				onclick={closeMobileToc}
			>
				<CloseIcon class="size-5" />
			</button>

			<ul
				class="z-0 m-0 flex min-h-0 w-full flex-1 list-none flex-col items-start gap-4 overflow-y-auto p-0"
			>
				{#each items as { id, title, level }}
					<li class="m-0">
						<a
							href="#{id}"
							class={itemTextClass(level, id, true)}
							aria-current={activeTitle === id ? 'true' : undefined}
							onclick={closeMobileToc}
						>
							{title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</div>
