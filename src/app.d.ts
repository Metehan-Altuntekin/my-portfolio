// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type Tool = {
		name: string;
		icon: import('svelte').Component<SVGAttributes<SVGSVGElement>, {}, string>;
	};

	type Project = {
		name: string;
		desc: string;
		tags: string[];
		tools: Tool[];

		thumb: import('@sveltejs/enhanced-img').Picture;
		visitUrl?: string;
	};

	type Skill = {
		name: string;
		areas: string[];
		tools: Tool[];
	};

	type Social = {
		name: string;
		url: string;
		icon: import('svelte').Component<SVGAttributes<SVGSVGElement>, {}, string>;
	};

	interface Post {
		id: string;
		lang: 'en' | 'tr';
		title: string;
		slug: string;
		description: string;
		image?: string;
		/** Optional JSON-LD image variants (see `buildImageArray` in blog utils) */
		image16x9?: string;
		image4x3?: string;
		image1x1?: string;
		ogImage?: string;
		createdAt: string | Date;
		updatedAt?: string | Date;
		tags: string[];
		published: boolean;
		joke?: string;
		toc: { id: string; level: number; title: string }[];
	}
}

export {};
