<script lang="ts">
	import { BASE_URL, SITE_NAME, SITE_DESCRIPTION, TWITTER_HANDLE } from '$lib/constants.js';
	import type { PageProps } from './$types';
	import { languageTag } from '$lib/paraglide/runtime';

	let { data }: PageProps = $props();

	const pageUrl = `${BASE_URL}/blog`;
	const ogImage = `${BASE_URL}/android-chrome-512x512.png`;

	function formatDate(
		date: string | Date,
		dateStyle: Intl.DateTimeFormatOptions['dateStyle'] = 'medium'
	): string {
		const dateToFormat = typeof date === 'string' ? new Date(date.replaceAll('-', '/')) : date;
		const currentLang = languageTag();
		return new Intl.DateTimeFormat(currentLang === 'tr' ? 'tr-TR' : 'en-US', { dateStyle }).format(
			dateToFormat
		);
	}

	function formatISODate(date: string | Date): string {
		const dateObj = typeof date === 'string' ? new Date(date.replaceAll('-', '/')) : date;
		return dateObj.toISOString();
	}
</script>

<!-- SEO -->
<svelte:head>
	<title>Blog | {SITE_NAME}</title>
	<meta name="description" content={`Blog posts by ${SITE_NAME}. ${SITE_DESCRIPTION}`} />
	<link rel="canonical" href={pageUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={`Blog | ${SITE_NAME}`} />
	<meta property="og:description" content={`Blog posts by ${SITE_NAME}. ${SITE_DESCRIPTION}`} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:title" content={`Blog | ${SITE_NAME}`} />
	<meta name="twitter:description" content={`Blog posts by ${SITE_NAME}. ${SITE_DESCRIPTION}`} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<section id="posts">
	<h1 class="text-4xl font-bold mx-auto text-center mb-[2em]">Blog Posts</h1>
	<article class="flex flex-wrap gap-5 justify-center">
		{#each data.posts as post (post.slug)}
			<a
				class="card card-clickable overflow-hidden flex-1 min-w-xs max-w-sm p-0"
				href="/blog/{post.slug}"
			>
				<figure>
					<img
						class="card-content w-full aspect-video object-cover rounded-b-none"
						src={post.image}
						alt={post.title}
					/>
				</figure>

				<div class="card-body p-5">
					<time
						datetime={formatISODate(post.createdAt)}
						class="text-base-content-muted font-medium text-xs block mb-1"
					>
						{formatDate(post.createdAt)}
					</time>
					<h2 class="card-title text-lg font-semibold text-ellipsis overflow-hidden line-clamp-2">
						{post.title}
					</h2>
				</div>
			</a>
		{/each}
	</article>
</section>
