import { buildLocalizedPath } from '../i18n-utils';

// Post type is defined globally in app.d.ts
type PostMetadata = {
	id: string;
	lang: 'en' | 'tr';
	title: string;
	description: string;
	image?: string;
	ogImage?: string;
	createdAt: string | Date;
	updatedAt?: string | Date;
	tags: string[];
	published: boolean;
	joke?: string;
	toc: { id: string; level: number; title: string }[];
};

// Cache for getAllPosts to avoid reloading
let postsCache: {
	posts: Post[];
	byId: Map<string, Post[]>;
	bySlug: Map<string, Post>;
} | null = null;

/**
 * Load all blog posts and create a mapping by ID and language
 */
export async function getAllPosts(): Promise<{
	posts: Post[];
	byId: Map<string, Post[]>;
	bySlug: Map<string, Post>;
}> {
	// Return cached version if available
	if (postsCache) return postsCache;

	const paths = import.meta.glob('/src/content/blog/posts/*.md', { eager: true });
	const posts: Post[] = [];
	const byId = new Map<string, Post[]>();
	const bySlug = new Map<string, Post>();

	const entries = Object.entries(paths)
		.map(([path, file]) => {
			const slug = path.split('/').at(-1)?.replace('.md', '');
			if (file && typeof file === 'object' && 'metadata' in file && slug) {
				const metadata = file.metadata as PostMetadata;
				const post = { ...metadata, slug } satisfies Post;
				return post.published && post.id && post.lang ? post : null;
			}
			return null;
		})
		.filter((post): post is Post => post !== null);

	entries.forEach((post) => {
		posts.push(post);
		bySlug.set(post.slug, post);

		byId.has(post.id) ? byId.get(post.id)!.push(post) : byId.set(post.id, [post]);
	});

	postsCache = { posts, byId, bySlug };
	return postsCache;
}

/**
 * Get posts filtered by language
 */
export async function getPostsByLanguage(lang: 'en' | 'tr'): Promise<Post[]> {
	const { posts } = await getAllPosts();
	return posts.filter((post) => post.lang === lang);
}

/**
 * Get alternate language versions of a post by ID with localized URLs
 */
export async function getPostAlternates(
	postId: string,
	currentLang: 'en' | 'tr'
): Promise<{
	en?: Post;
	tr?: Post;
	urls: { en?: string; tr?: string };
}> {
	const { byId } = await getAllPosts();
	const posts = byId.get(postId) || [];

	const alternates = posts.reduce<{ en?: Post; tr?: Post }>((acc, post) => {
		if (post.lang === 'en') acc.en = post;
		if (post.lang === 'tr') acc.tr = post;
		return acc;
	}, {});

	const urls = (['en', 'tr'] as const).reduce<{ en?: string; tr?: string }>((acc, lang) => {
		if (alternates[lang]) {
			acc[lang] = buildLocalizedPath(`/blog/${alternates[lang]!.slug}`, lang);
		}
		return acc;
	}, {});

	return { ...alternates, urls };
}

/**
 * Get post by slug and language
 */
export async function getPostBySlug(slug: string, lang: 'en' | 'tr'): Promise<Post | null> {
	const { bySlug } = await getAllPosts();
	const post = bySlug.get(slug);
	return post && post.lang === lang ? post : null;
}
