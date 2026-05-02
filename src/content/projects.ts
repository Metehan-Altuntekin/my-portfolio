import allsetThumb from '$content/thumbs/allset.webp?enhanced';
import breezbookThumb from '$content/thumbs/breezbook.webp?enhanced';
import ozkanMusavirlikThumb from '$content/thumbs/ozkan-musavirlik.webp?enhanced';
import tojsonThumb from '$content/thumbs/tojson.webp?enhanced';
import breezbookBookingThumb from '$content/thumbs/breezbook-booking.webp?enhanced';

import TypeScriptIcon from '~icons/skill-icons/typescript';
import FigmaIcon from '~icons/logos/figma';
import SvelteIcon from '~icons/logos/svelte-icon';
import TailwindIcon from '~icons/devicon/tailwindcss';
import DaisyUIIcon from '~icons/logos/daisyui-icon';
import SassIcon from '~icons/logos/sass';
import ReactIcon from '~icons/logos/react';
import SupabaseIcon from '~icons/devicon/supabase';
import NextJsIcon from '~icons/devicon/nextjs';
import MuiIcon from '~icons/simple-icons/mui';
import NodeJsIcon from '~icons/logos/nodejs-icon';
import AffinityDesignerIcon from '~icons/simple-icons/affinitydesigner';

export const tools = {
	ts: {
		name: 'TypeScript',
		icon: TypeScriptIcon
	},
	figma: {
		name: 'Figma',
		icon: FigmaIcon
	},
	svelte: {
		name: 'Svelte/Kit',
		icon: SvelteIcon
	},
	tailwind: {
		name: 'Tailwind CSS',
		icon: TailwindIcon
	},
	daisyui: {
		name: 'Daisy UI',
		icon: DaisyUIIcon
	},
	sass: {
		name: 'SASS',
		icon: SassIcon
	},
	react: {
		name: 'React',
		icon: ReactIcon
	},
	supabase: {
		name: 'Supabase',
		icon: SupabaseIcon
	},
	nextJs: {
		name: 'NextJS',
		icon: NextJsIcon
	},
	mui: {
		name: 'Material UI',
		icon: MuiIcon
	},
	nodejs: {
		name: 'Node JS',
		icon: NodeJsIcon
	},
	affinityDesigner: {
		name: 'AD 2',
		icon: AffinityDesignerIcon
	}
} as const;

const projects: Project[] = [
	{
		name: 'Ozkan Musavirlik',
		desc: 'A headless CMS and high-performance marketing platform for a financial consultancy firm. Built with SvelteKit & Sanity for 100/100 SEO scores. ',
		tools: [tools.ts, tools.svelte, tools.sass, tools.figma],
		tags: ['Design', 'Frontend'],
		visitUrl: 'https://www.ozkanmusavirlik.com.tr',
		thumb: ozkanMusavirlikThumb
	},
	{
		name: 'AllSet',
		desc: 'An AI-powered receptionist integrated with WhatsApp. Designed the brand identity and engineered the landing infrastructure.',
		tools: [tools.ts, tools.figma, tools.svelte, tools.tailwind, tools.daisyui],
		tags: ['Design', 'Frontend'],
		visitUrl: 'https://allset-landing-dev-git-copy-test-metehan-altuntekins-projects.vercel.app/',
		thumb: allsetThumb
	},
	{
		name: 'BreezBook',
		desc: 'The original booking engine architecture that evolved into AllSet. Focused on reducing friction for high-volume service scheduling.',
		tools: [tools.ts, tools.svelte, tools.daisyui, tools.tailwind],
		tags: ['Design', 'Frontend'],
		visitUrl: 'https://breezbook.com',
		thumb: breezbookThumb
	},
	{
		name: 'BreezBook Booking App',
		desc: 'A mobile-first booking architecture designed in Figma. Focused on reducing user friction and increasing conversion rates for service businesses.',
		tools: [tools.figma],
		tags: ['Design'],
		visitUrl:
			'https://www.figma.com/proto/Y3429sNI1L6LkuI8Jy8h4b/Booking-App?page-id=6332%3A16614&node-id=7112-19778&p=f&viewport=385%2C457%2C0.09&t=S0bQVVQMdWIHw9NU-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=7112%3A19778',
		thumb: breezbookBookingThumb
	},

	{
		name: 'ToJson.dev',
		desc: 'A developer utility for extracting structured JSON data from unstructured files (PDFs, Images). Designed to streamline automation workflows.',
		tools: [tools.ts, tools.daisyui, tools.tailwind],
		tags: ['Design', 'Frontend'],
		visitUrl: 'https://tojson.dev',
		thumb: tojsonThumb
	}
	// {
	// 	name: 'Kurdancioglu Ltd.',
	// 	desc: 'Kurdancioglu Ltd. is a company I made up for fun and practicing. One of the earliest designs I made. ("Tree Flesh" wording is just for fun :D)',
	// 	tools: [tools.sass],
	// 	tags: ['Design', 'Frontend'],
	// 	visitUrl: 'https://metehan-altuntekin.github.io/Kurdancioglu-Ltd',
	// 	// import kurdanciogluThumb from '$content/thumbs/kurdancioglu.webp?enhanced';
	// 	thumb: kurdanciogluThumb
	// }
];

export default projects;
