import { error, redirect } from '@sveltejs/kit';
import { getPostBySlug, getPostAlternates, getAllPosts } from '$lib/utils/getPosts';
import { setLanguageTag } from '$lib/paraglide/runtime';
import { getLanguageFromPath, buildLocalizedPath } from '$lib/i18n-utils';
import { calculateReadingTime } from '$lib/utils/blog';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, url }) => {
	const lang = getLanguageFromPath(url.pathname);
	setLanguageTag(lang);

	// Get post by slug and language
	let post = await getPostBySlug(params.slug, lang);

	// If not found, check if this slug exists in another language and redirect
	if (!post) {
		const { bySlug } = await getAllPosts();
		const postInOtherLang = bySlug.get(params.slug);

		if (postInOtherLang && postInOtherLang.lang !== lang) {
			// Get the correct version for the current language
			const { urls } = await getPostAlternates(postInOtherLang.id, postInOtherLang.lang);
			const redirectUrl = urls[lang];

			if (redirectUrl) {
				redirect(307, redirectUrl);
			}
		}

		error(404, `Could not find post: ${params.slug}`);
	}

	// Try to load the markdown file
	let content = await import(`../../../content/blog/posts/${post.id}/${post.lang}.md`)
		.then((p) => p.default)
		.catch(() => {
			throw error(404, `Could not load post content: ${params.slug}`);
		});

	let readingTime = await import(`../../../content/blog/posts/${post.id}/${post.lang}.md?raw`)
		.then((rawModule) => {
			const rawMarkdown = typeof rawModule.default === 'string' ? rawModule.default : '';
			return calculateReadingTime(rawMarkdown);
		})
		.catch(() => 1);

	// Get alternate language versions for hreflang
	const { urls: alternateUrls } = await getPostAlternates(post.id, lang);

	return {
		content,
		meta: post,
		slug: params.slug,
		readingTime,
		alternateUrls
	};
};
