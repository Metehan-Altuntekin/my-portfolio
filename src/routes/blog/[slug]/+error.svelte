<script lang="ts">
	import { page } from '$app/state';
	import { SITE_NAME } from '$lib/constants.js';

	const isTurkish = page.url.pathname.startsWith('/tr');
</script>

<svelte:head>
	<title>{isTurkish ? 'Yazı Bulunamadı' : 'Post Not Found'} | {SITE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="flex flex-col items-center justify-center min-h-[60vh] px-4">
	<div class="text-center max-w-2xl">
		<h1 class="text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 lg:mb-6 xl:mb-8">404</h1>
		<h2 class="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4 lg:mb-6 xl:mb-8">
			{isTurkish ? 'Yazı Bulunamadı' : 'Post Not Found'}
		</h2>
		<p class="text-base-content-muted text-lg mb-8">
			{isTurkish
				? 'Aradığınız blog yazısı bulunamadı. Yazı silinmiş veya taşınmış olabilir. Veya seçtiğiniz dilde eklenmemiş olabilir.'
				: "The blog post you're looking for doesn't exist. It may have been deleted or moved. Or it may not have been added in the language you selected."}
		</p>

		<div class="flex gap-4 justify-center">
			<a href={'/blog'} class="card card-clickable px-6 py-3 text-center">
				{isTurkish ? 'Tüm Yazılar' : 'All Posts'}
			</a>
			<a href={'/'} class="card card-clickable px-6 py-3 text-center">
				{isTurkish ? 'Ana Sayfa' : 'Home'}
			</a>
		</div>
	</div>
</section>
