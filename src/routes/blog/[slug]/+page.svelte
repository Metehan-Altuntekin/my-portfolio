<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { browser } from '$app/environment';

	import { BASE_URL, SITE_NAME, TWITTER_HANDLE, AUTHOR_NAME } from '$lib/constants.js';
	import { languageTag } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import {
		buildImageArray,
		formatDate,
		formatISODate,
		getAbsoluteImageUrl
	} from '$lib/utils/blog.js';

	const { data } = $props();

	let activeTitle = $state<string | null>(null);

	// Generate URLs and dates
	const pageUrl = `${BASE_URL}/blog/${data.slug}`;
	const ogImage = getAbsoluteImageUrl(data.meta.image);
	const createdAt = formatISODate(data.meta.createdAt);
	const updatedAt = data.meta.updatedAt ? formatISODate(data.meta.updatedAt) : createdAt;
	const currentLang = languageTag();

	// JSON-LD structured data
	const imageData = buildImageArray(data.meta);
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.meta.title,
		description: data.meta.description,
		datePublished: createdAt,
		dateModified: updatedAt,
		author: {
			'@type': 'Person',
			name: AUTHOR_NAME,
			url: BASE_URL
		},
		...(imageData && { image: imageData }),
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			logo: {
				'@type': 'ImageObject',
				url: `${BASE_URL}/favicon-32x32.png`
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': pageUrl
		}
	};

	$inspect('activeTitle: ', activeTitle);

	let observer: IntersectionObserver | null = $state(null);

	onMount(async () => {
		if (!browser) return;

		await tick();

		observer = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						activeTitle = e.target.id;
					}
				});
			},
			{
				threshold: 0,
				rootMargin: '5% 0px -70% 0px'
				// only observe the top 30% of the page to prevent other titles becoming active early
			}
		);

		data.meta.toc.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (!el) return;
			observer?.observe(el);
		});
	});

	// make sure to disconnect to prevent memory leaks
	onDestroy(() => {
		if (!browser) return;
		observer?.disconnect();
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title} | {SITE_NAME}</title>

	<!-- Essential SEO -->
	<meta name="description" content={data.meta.description} />
	<meta name="robots" content="max-image-preview:large" />
	<link rel="canonical" href={pageUrl} />

	<!-- Language alternates -->
	{#if data.alternateUrls.en}
		<link rel="alternate" hreflang="en" href={`${BASE_URL}${data.alternateUrls.en}`} />
	{/if}
	{#if data.alternateUrls.tr}
		<link rel="alternate" hreflang="tr" href={`${BASE_URL}${data.alternateUrls.tr}`} />
	{/if}

	<link
		rel="alternate"
		hreflang="x-default"
		href={`${BASE_URL}${data.alternateUrls.en || pageUrl}`}
	/>

	<!-- Open Graph (Facebook, LinkedIn, etc.) -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:site_name" content={SITE_NAME} />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
		<meta property="og:image:alt" content={data.meta.title} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="900" />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}

	<!-- Article meta tags (for better SEO) -->
	<meta property="article:published_time" content={createdAt} />
	<meta property="article:modified_time" content={updatedAt} />
	{#if data.meta.tags && data.meta.tags.length > 0}
		{#each data.meta.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<section class="pt-0 flex flex-col items-start lg:flex-row-reverse">
	{#if data.meta.toc.length}
		<section
			id="table-of-contents"
			class="hidden lg:block lg:sticky top-10 right-0 text-blog-base-content-muted px-0 lg:ml-14 shrink-0
 						md:w-42 lg:w-56 xl:w-auto xl:max-w-xs 2xl:max-w-sm"
		>
			{@render toc()}
		</section>
	{/if}

	<article
		id="post"
		class="prose prose-custom prose-invert prose-lg max-w-full md:max-w-4xl mb-16 mr-auto min-w-0"
	>
		<hgroup class="flex flex-col items-center sm:mb-10">
			<!-- Image -->
			{#if data.meta.image}
				<img
					src={data.meta.image}
					alt={data.meta.title}
					class="image-card rounded-md w-full aspect-5/2 sm:aspect-7/2"
				/>
			{/if}

			<!-- Title -->
			<h1 class="text-4xl lg:text-5xl self-start mt-0! sm:mt-6!">
				{data.meta.title}
			</h1>

			<!-- Date and Reading Time -->
			<div class="w-full flex items-center gap-x-3 gap-y-2 flex-wrap mb-6">
				<p class="text-sm text-blog-base-content-muted font-medium opacity-80 my-0!">
					{formatDate(data.meta.createdAt)}
					{#if data.meta.updatedAt}
						{@const created =
							typeof data.meta.createdAt === 'string'
								? new Date(data.meta.createdAt.replaceAll('-', '/'))
								: new Date(data.meta.createdAt)}
						{@const updated =
							typeof data.meta.updatedAt === 'string'
								? new Date(data.meta.updatedAt.replaceAll('-', '/'))
								: new Date(data.meta.updatedAt)}
						{#if updated.getTime() !== created.getTime()}
							<span class="opacity-60">
								({m.blog_updated()} {formatDate(data.meta.updatedAt)})</span
							>
						{/if}
					{/if}
				</p>

				{#if data.readingTime}
					<div class="flex items-center gap-1">
						<span class="text-blog-base-content-muted opacity-50 my-0!">·</span>
						<p class="text-sm text-blog-base-content-muted font-medium opacity-80 my-0!">
							{data.readingTime === 1
								? m.blog_min_read({ count: data.readingTime })
								: m.blog_mins_read({ count: data.readingTime })}
						</p>
					</div>
				{/if}

				{#if data.meta.joke}
					<div class="flex items-center gap-1">
						<span class="text-blog-base-content-muted opacity-50 my-0!">·</span>
						<p class="text-sm text-blog-base-content-muted opacity-50 font-medium my-0!">
							{data.meta.joke}
						</p>
					</div>
				{/if}
			</div>

			<!-- Tags -->
			<div class="flex flex-wrap self-start gap-4 mb-6">
				{#each data.meta.tags as category}
					<a
						href={`/blog?category=${category}`}
						class="chip variant-filled-secondary no-underline border border-blog-base-content-muted/20 px-4! py-2! text-blog-base-content-muted hover:underline backdrop-blur-sm"
						>{category}</a
					>
				{/each}
			</div>
		</hgroup>

		{@render data.content()}
	</article>
</section>

<section id="comments"></section>

{#snippet toc()}
	<ul class=" ">
		{#each data.meta.toc as { id, title, level }}
			<li
				class="mb-3
				{level === 1 || level === 2
					? 'text-lg'
					: level === 3
						? 'ml-6 text-base'
						: level === 4
							? 'ml-12 text-sm'
							: 'ml-18 text-xs'}"
			>
				<a
					href="#{id}"
					class="hover:underline max-w-full
					{activeTitle === id
						? 'text-blog-base-content font-semibold'
						: 'text-blog-base-content-muted font-medium'}">{title}</a
				>
			</li>
		{/each}
	</ul>
{/snippet}
