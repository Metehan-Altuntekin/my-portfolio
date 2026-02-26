import { BASE_URL } from '$lib/constants.js';
import { getAllPosts } from '$lib/utils/getPosts.js';
import { buildLocalizedPath } from '$lib/i18n-utils.js';

export const prerender = true;

const LANGUAGES = ['en', 'tr'] as const;

const listOfLastMod = {
	'/': new Date('2026-02-26').toISOString(),
	'/blog': new Date('2026-02-26').toISOString()
};

function formatDate(date: string | Date | undefined): string {
	if (!date) return new Date().toISOString();
	const dateObj = typeof date === 'string' ? new Date(date.replaceAll('-', '/')) : date;
	return dateObj.toISOString();
}

export async function GET() {
	const { posts } = await getAllPosts();

	const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];

	// Add homepage for each language
	LANGUAGES.forEach((lang) => {
		const path = buildLocalizedPath('/', lang);
		urls.push({
			loc: `${BASE_URL}${path}`,
			lastmod: listOfLastMod['/'],
			changefreq: 'weekly',
			priority: '1.0'
		});
	});

	// Add blog listing page for each language
	LANGUAGES.forEach((lang) => {
		const path = buildLocalizedPath('/blog', lang);
		urls.push({
			loc: `${BASE_URL}${path}`,
			lastmod: listOfLastMod['/blog'],
			changefreq: 'weekly',
			priority: '0.9'
		});
	});

	// Add all blog posts
	posts.forEach((post) => {
		const path = buildLocalizedPath(`/blog/${post.slug}`, post.lang);
		urls.push({
			loc: `${BASE_URL}${path}`,
			lastmod: formatDate(post.updatedAt || post.createdAt),
			changefreq: 'monthly',
			priority: '0.8'
		});
	});

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `	<url>
		<loc>${url.loc}</loc>
		<lastmod>${url.lastmod}</lastmod>
		<changefreq>${url.changefreq}</changefreq>
		<priority>${url.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
}
