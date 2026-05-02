import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

// to be split into their own chunks automatically
const heavyLibs: string[] = []; // e.g. "three"

export default defineConfig({
	plugins: [
		enhancedImages(),
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		paraglide({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	build: {
		target: 'esnext',
		rollupOptions: {
			output: {
				// bundle small node_modules packages into one single .js file
				// to reduce the amount of the small chunks to prevent extra network usage
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						// check if it's a heavy lib
						for (const lib of heavyLibs) {
							if (id.includes(lib)) {
								return lib;
							}
						}

						// everything else goes to vendor
						return 'vendor';
					}
				}
			}
		}
	}
});
