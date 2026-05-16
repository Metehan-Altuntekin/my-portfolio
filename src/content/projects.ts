import allsetThumb from '$content/thumbs/allset.webp?enhanced';
import breezbookThumb from '$content/thumbs/breezbook.webp?enhanced';
import ozkanMusavirlikThumb from '$content/thumbs/ozkan-musavirlik.webp?enhanced';
import tojsonThumb from '$content/thumbs/tojson.webp?enhanced';
import breezbookBookingThumb from '$content/thumbs/breezbook-booking.webp?enhanced';
import reguleThumb from '$content/thumbs/regule.png?enhanced';

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
import SwiftIcon from '~icons/skill-icons/swift';
import SanityIcon from '~icons/simple-icons/sanity';

export const tools = {
	figma: {
		name: 'Figma',
		icon: FigmaIcon
	},
	ts: {
		name: 'TypeScript',
		icon: TypeScriptIcon
	},
	nodejs: {
		name: 'Node JS',
		icon: NodeJsIcon
	},

	svelte: {
		name: 'Svelte/Kit',
		icon: SvelteIcon
	},
	react: {
		name: 'React',
		icon: ReactIcon
	},
	nextJs: {
		name: 'NextJS',
		icon: NextJsIcon
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
	supabase: {
		name: 'Supabase',
		icon: SupabaseIcon
	},
	mui: {
		name: 'Material UI',
		icon: MuiIcon
	},
	swift: {
		name: 'Swift',
		icon: SwiftIcon
	},
	affinityDesigner: {
		name: 'AD 2',
		icon: AffinityDesignerIcon
	},
	sanity: {
		name: 'Sanity',
		icon: SanityIcon
	}
} as const;

const projects: Project[] = [
	{
		name: 'Regule App',
		desc: 'My productivity app for managing time well. It is for tracking time you on activities and calculating when your projects will finish.',
		tools: [tools.figma, tools.swift, tools.ts, tools.svelte],
		tags: ['Mobile Design', 'iOS App'],
		visitUrl: 'https://regule.app',
		thumb: reguleThumb
	},
	{
		name: 'Ozkan Musavirlik',
		desc: 'High-performance marketing website with a blog feature for an accountancy firm. Built with SvelteKit & Sanity.',
		tools: [tools.ts, tools.svelte, tools.sanity, tools.sass, tools.figma],
		tags: ['Design', 'Full-Stack', 'CMS'],
		visitUrl: 'https://www.ozkanmusavirlik.com.tr',
		thumb: ozkanMusavirlikThumb
	},
	{
		name: 'AllSet',
		desc: 'An AI-powered receptionist integrated with WhatsApp. Designed and built the brand identity, landing page and the onboarding flow.',
		tools: [tools.ts, tools.figma, tools.svelte, tools.tailwind, tools.daisyui],
		tags: ['Design', 'Frontend'],
		visitUrl: 'https://allset-landing-dev-git-copy-test-metehan-altuntekins-projects.vercel.app/',
		thumb: allsetThumb
	},
	// {
	// 	name: 'BreezBook',
	// 	desc: 'The original booking engine architecture that evolved into AllSet. Focused on reducing friction for high-volume service scheduling.',
	// 	tools: [tools.ts, tools.svelte, tools.daisyui, tools.tailwind],
	// 	tags: ['Design', 'Frontend'],
	// 	visitUrl: 'https://breezbook.com',
	// 	thumb: breezbookThumb
	// },
	// {
	// 	name: 'BreezBook Booking App',
	// 	desc: 'A mobile-first booking architecture designed in Figma. Focused on reducing user friction and increasing conversion rates for service businesses.',
	// 	tools: [tools.figma],
	// 	tags: ['Design'],
	// 	visitUrl:
	// 		'https://www.figma.com/proto/Y3429sNI1L6LkuI8Jy8h4b/Booking-App?page-id=6332%3A16614&node-id=7112-19778&p=f&viewport=385%2C457%2C0.09&t=S0bQVVQMdWIHw9NU-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=7112%3A19778',
	// 	thumb: breezbookBookingThumb
	// },

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
