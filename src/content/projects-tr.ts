import allsetThumb from '$content/thumbs/allset.webp?enhanced';
import breezbookThumb from '$content/thumbs/breezbook.webp?enhanced';
import ozkanMusavirlikThumb from '$content/thumbs/ozkan-musavirlik.webp?enhanced';
import tojsonThumb from '$content/thumbs/tojson.webp?enhanced';
import breezbookBookingThumb from '$content/thumbs/breezbook-booking.webp?enhanced';
import { tools } from './projects';

const projects: Project[] = [
	{
		name: 'Ozkan Musavirlik',
		desc: 'Mali müşavirlik firması için headless CMS ve yüksek performanslı pazarlama platformu. 100/100 SEO skorları ve 0 hosting maliyeti için SvelteKit & Sanity ile geliştirildi.',
		tools: [tools.ts, tools.svelte, tools.sass, tools.figma],
		tags: ['Tasarım', 'Frontend'],
		visitUrl: 'https://www.ozkanmusavirlik.com.tr',
		thumb: ozkanMusavirlikThumb
	},
	{
		name: 'AllSet',
		desc: 'WhatsApp ile entegre edilmiş AI destekli resepsiyonist. Marka kimliğini tasarladım ve landing sayfasını geliştirdim.',
		tools: [tools.ts, tools.figma, tools.svelte, tools.tailwind, tools.daisyui],
		tags: ['Tasarım', 'Frontend'],
		visitUrl: 'https://allset-landing-dev-git-copy-test-metehan-altuntekins-projects.vercel.app/',
		thumb: allsetThumb
	},
	{
		name: 'BreezBook',
		desc: "AllSet'e evrilen orijinal rezervasyon uygulaması. Yüksek hacimli hizmet planlaması için kullanıcı sürtünmesini azaltmaya odaklandı.",
		tools: [tools.ts, tools.svelte, tools.daisyui, tools.tailwind],
		tags: ['Tasarım', 'Frontend'],
		visitUrl: 'https://breezbook.com',
		thumb: breezbookThumb
	},
	{
		name: 'BreezBook Booking App',
		desc: "Figma'da tasarlanmış mobil-öncelikli rezervasyon uygulaması. Hizmet işletmeleri için kullanıcı sürtünmesini azaltmaya ve dönüşüm oranlarını artırmaya odaklandı.",
		tools: [tools.figma],
		tags: ['Tasarım'],
		visitUrl:
			'https://www.figma.com/proto/Y3429sNI1L6LkuI8Jy8h4b/Booking-App?page-id=6332%3A16614&node-id=7112-19778&p=f&viewport=385%2C457%2C0.09&t=S0bQVVQMdWIHw9NU-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=7112%3A19778',
		thumb: breezbookBookingThumb
	},
	{
		name: 'ToJson.dev',
		desc: "Yapılandırılmamış dosyalardan (PDF'ler, Görüntüler) yapılandırılmış JSON verisi çıkarmak için bir geliştirici yardımcı programı. Otomasyon iş akışlarını kolaylaştırmak için tasarlandı.",
		tools: [tools.ts, tools.daisyui, tools.tailwind],
		tags: ['Tasarım', 'Frontend'],
		visitUrl: 'https://tojson.dev',
		thumb: tojsonThumb
	}
];

export default projects;
