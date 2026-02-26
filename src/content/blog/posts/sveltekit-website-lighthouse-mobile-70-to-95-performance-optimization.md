---
id: 'sveltekit-website-lighthouse-mobile-95-plus-performance-optimization'
lang: 'en'
title: "How I optimized my SvelteKit website from 70 to 95+ on mobile Lighthouse tests"
description: "My journey of optimizing my SvelteKit site's mobile Lighthouse scores from 70 to 95+. I share tweaks for CSS inlining, JS chunks, and faster LCP."
createdAt: '2026-02-26'
published: true
image: "/blog/thumbs/mobile-perf-thumb16x9.jpg"
image16x9: "/blog/thumbs/mobile-perf-thumb16x9.jpg"
image4x3: "/blog/thumbs/mobile-perf-thumb4x3.jpg"
image1x1: "/blog/thumbs/mobile-perf-thumb1x1.jpg"
tags:
- web-development
- programming
- web-performance
---



When I initially built this portfolio/blog website, my priority was getting it live quickly, so I didn't pay much attention to performance. The stack I used — SvelteKit and TailwindCSS — handled a good baseline but tools alone can't cover everything. Lighthouse desktop scores were about 95-98 but mobile scores were only around 65-80.

The mobile tests are very harsh. They simulate a slow 4G network and a very throttled CPU. So many things that are negligible on desktop become prominent on mobile. I had to put in work to improve these things to make the mobile test scores better. I also wanted to expand my knowledge of website loading performance, so I decided to take on this project.

And I finally achieved what I wanted. Now after all this work, my test scores are consistently 95+ on mobile and 100 on desktop. And I learned quite a few things along the way. With this post, I want to publish my journey and the things I learned. The topics will be varying from why I chose JPEG instead of more optimized formats for my LCP image, to tricks in SvelteKit to make it load more efficiently for websites with smaller bundle sizes.

I hope it will be useful for future me who may forget these and for others.

## Before State

Let's start with taking a look at one of the mobile test results from the before state.

![before performance scores|700](/blog/mobile-perf-improvement/before-score.avif)

The FCP is not too bad with 1.7 seconds. We also don't see any CLS, which is great.

But our LCP is 5.9 seconds, which is bad. TBT is 220ms and Speed Index is 3.9 seconds, these don't look good either.

You can find these results <a href="https://pagespeed.web.dev/analysis/https-9c949a03-my-portfolio-v2-8as-pages-dev/fywei63hog?form_factor=mobile" target="_blank">here</a>.

## Analyzing Performance with Lighthouse

A great thing about Lighthouse is that it gives insights and diagnostics that help us understand the problems and culprits. So let's begin with taking a look at them.

![before insights & diagnostics|700](/blog/mobile-perf-improvement/before-insights&diagnostics.avif)

Lighthouse is giving us quite a few insights and diagnostics. Which is great, we can use this information to figure out what we need to do.

The screenshots also show us that it is taking quite a while for the site to even start rendering. This means the browser is taking too long to download all the necessary assets and process them to begin with rendering.

### Reviewing Insights & Diagnostics

Let's review each of the insights one by one and try to understand what they mean.

Some of these insights turned out to be caused by my PostHog implementation. PostHog is a separate topic, so I will exclude those insights from this post. I eventually decided to remove it but also experimented with it a bit. I plan to write a separate post about that later.

#### Improve image delivery

Images are usually the low hanging fruit when optimizing website performance as they take quite a bit of bandwidth and processing. And often at least one of them is the LCP element of the initial load screen, which makes it even more important.

In my case, I have one image of myself in my hero section. We can see that Lighthouse is showing us some problems about it:

![Insight: image delivery|700](/blog/mobile-perf-improvement/insight-image-delivery.avif)

We can see that Lighthouse is suggesting a few things. First is that the hero image at 132.4KiB is quite big for this size. It could be compressed more. Also JPEG compression format is not resulting in the smallest file size (though decoding JPEG is the fastest, more on that later).

Then, we are seeing that a second image is being loaded too. And Lighthouse tells us this image could be compressed further and resized smaller. Probably true, but the real problem here is this image being loaded in the first place. Why? It's because this image belongs to the "Projects" section, which is not visible in initial load. But it comes right after the hero section, which seems to make the browser prioritize it.

This means we will need to optimize the hero section image and find a solution to deprioritize the rest of the images.

#### Network Dependency Tree

Network dependency trees happen when a resource (a file) triggers to load another resource. This results in extra delays with waiting for all the loading and processing time of a resource before it can load the next one.

![Insight: network dependency tree|700](/blog/mobile-perf-improvement/insight-network-dep-tree.avif)

We can see that `assets/0.C2pj507j.css` takes 266 milliseconds with 9.66KiB and `assets/4.DgPqur8T.css` takes 261 milliseconds with 1.14KiB. These are just CSS chunks but their download is triggered only after the initial HTML file is loaded and processed to detect the links to these stylesheets. So, even though Tailwind and Vite optimizes the CSS files, they still add to our network usage.

#### Render Blocking Requests

Render blocking requests happen when a file being loaded is required to be processed by browser to render the website properly. These files are generally CSS files.

![Insight: render blocking requests|700](/blog/mobile-perf-improvement/insight-render-blocking-reqs.avif)

And in our case, the same CSS files in the Network dependency tree issue are also blocking render until they are downloaded. It makes sense, since CSS is a required asset for the browser to render the website. So the solution we will come up with can fix both of these issues at once.

#### LCP Breakdown

"LCP breakdown" isn't a warning but it is a useful insight because it shows us what element is considered as the LCP element and it also shows us the details of its loading.

![Insight: LCP breakdown|700](/blog/mobile-perf-improvement/insight-lcp-breakdown.avif)

Turns out the detected LCP element is not the hero section image as I was expecting. Instead, the subheading text element is considered as the LCP element by the browser. This means the image is smaller than this text element. And I guess image is still taking a little longer than this text to render. That means our current LCP score may even be worse than calculated 5.9 seconds.

We see that the `Element render delay` is 2,290 milliseconds. That is 2.29 seconds of browser just doing nothing about the LCP element while it's busy on other things. That is a huge waste of time. But it is not a surprise now that we know what things are blocking the render.

This also will get better with all the solutions we will come up for the previous issues.

#### 3rd Parties

3rd party code is scripts injected with a different source than your website's domain.

![Insight: 3rd Parties|700](/blog/mobile-perf-improvement/insight-3rd-parties.avif)

I am using `@iconify/svelte` so it is adding lines where it loads the icons from Iconify CDN. The total transfer size is 18KiB while main thread time is 0ms. They likely load after everything else so I am not too worried about this at the moment.

#### Avoid long main-thread tasks

Long main-thread tasks happen when there is a task that requires a lot of processing in the main-thread.

![Diagnostic: Avoid long main-thread tasks|700](/blog/mobile-perf-improvement/diagnostic-long-main-thread-tasks.avif)

PostHog session recorder is being the biggest culprit here, which will be solved once I remove it. But after that, a chunk of our build seems to be taking some time to start. That's probably because all the network usage causing this one to take long to load. But it also takes 95ms to run which is a significant duration worth paying attention to.

I then took a look at the `chunks/ClkWq1G8.js` to see what it is about. It seems to be mostly related to Iconify and injecting the SVGs it downloads into our DOM. So we may want to do something about that, perhaps moving away from `@iconify/svelte` package. The icons loading and being added later can also cause layout shifts which we don't want and it also makes us rely on Iconify's CDN.

## Finding optimization solutions

Now that we reviewed the issues and learned from the Lighthouse insights & diagnostics, we can start looking into the solutions.

The most important thing I need to focus on is to reduce the downloading and processing time of our assets. We saw in the insights that a piece of text as an LCP element waits for 2.3 seconds to even start rendering, which is very bad. But it will be reduced as I improve the network and processor usage.

It is also important to note that we want the scores to be stable between different tests. Networks have slight instabilities which can sometimes amplify some issues. So getting consistent scores is also as important as raising them up.

Let's delve into each topic one by one.

### CSS Inlining in SvelteKit

There are a few things we can improve on the CSS loading. One is that, they are being triggered to load after the HTML is loaded and this makes Lighthouse give us the `Network dependency tree` warning. The second is that they are blocking the render until they finish loading and this triggers Lighthouse to give `Render blocking requests` warning.

To make this better, we can configure our setup to keep the CSS files inlined in the HTML file. This will save us from the dependency tree slowness as all the HTML and required CSS will be downloaded in one single batch. It will make our HTML files bigger, but it will certainly perform better at initial load than the same size being loaded separately and dependently.

In order to do this, we can just tell Svelte compiler to inline our CSS. We can do that by adding this configuration option in our Svelte configuration:

```js
// svelte.config.js

const config = {
	//...
	kit: {
		// ...
		inlineStyleThreshold: 10240, // Inline CSS files smaller than 10KiB
	}
```

*This tells Svelte to inline CSS files smaller than 10KiB. Our biggest CSS file is under this threshold with 9.4kB so it should inline it. Right?*

![CSS inlining 10kB threshold result|700](/blog/mobile-perf-improvement/css-inlining-10kB-threshold-result.avif)

**Wrong. It didn't work.** It included the smaller 1.7kB one but it did not include the 9.4kB one. What's going on here?

Well, it turns out the 9.4kB one wasn't actually 9.4kB on disk. That size was only the data transferred through the network, the compressed version. But the raw disk size was 52.43kB. Apparently Svelte looks at the disk size, not the compressed size transferred, naturally.

![disk size of the compressed 9.4kB file|180](/blog/mobile-perf-improvement/css-inlining-css-disk-size.avif)

So I think I should set the threshold to 60kB instead to make it include this file:

```js
// svelte.config.js

const config = {
	//...
	kit: {
		// ...
		inlineStyleThreshold: 60000, // Inline CSS files smaller than 60kB
	}
```

And yes it worked, now finally all of the CSS files are inlined:

![Results with 60kB threshold|600](/blog/mobile-perf-improvement/css-inlining-60kb-threshold-result.avif)

This increased the size of `index.html` with jumping from ~6kB to 15.4kB but it is worth it for this case. And since this loads in the first single request, we have successfully eliminated network dependency tree and render blocking request issues. This also reduced the network stability issues thanks to not having to chain CSS files after the HTML is processed.

One thing to pay attention to here is that, this breaks the caching of the CSS completely. So, when a visitor navigates between pages, all the content of the CSS load from scratch again with each .html file. For a content website like this it is not important, but it can be a problem for SaaS apps with lots of users.

### Image optimization

As we saw in the Lighthouse insights, the LCP element wasn't the hero section image as I guessed, it was instead the subheading text underneath the heading. This made me realize I missed the hierarchy of design there a bit. So I decided to make the image slightly bigger, now making it the LCP element.

The 132.4kB size of the image wasn't properly optimized. That wasn't horrible but it wasn't in the good range either. I took a bit of work through optimizing it and finally got it down to 37kB.

I firstly improved the responsive image set I already had. Responsive images with multiple different sources allow the browser to select the image size it calculates for the area it will print the image. You don't need the 1400px size — that you may need on a 4K monitor — in a little handheld device.

I also — even though they result in smaller file sizes — eventually decided against using AVIF or WebP on mobile, while choosing progressive JPEG instead. WebP was destroying the colors of my image no matter what I tried and AVIF was lowering the scores because it was much slower to decode. So AVIF was ending up the slower option on a very throttled CPU, despite the smaller size.

I plan to write a more detailed separate post about this later.

### Font optimization

Font files are very important to be aware of as they can be quite large. I prefer to self host them (rather than using a CDN like Google Fonts) for best control and reliability so I had to work on optimization myself.

First things first, when you define a font face you should probably set your  `@font-face` to `font-display: swap;`. What this does is, it swaps the font family you specified with the next one you define until the font file loads. This helps prevent blocking of rendering until your font file loads.

I use Commissioner variable font for one single font file for my website. It’s a very stylish font that doesn’t feel cold and it's also readable in long reading text. It can be configured to very different styles thanks to its generous offering of variable axes. You can read the review of it by <a href="https://pimpmytype.com/font/commissioner" target="_blank">PimpMyType here</a>

But having all these axes also comes with a downside. They make the variable font file quite big. The TTF version of variable file is massive at 740kB size.

![Disk size of the variable TTF file|600](/blog/mobile-perf-improvement/commissioner-var-font-disk-size.avif)

But we don't really need to use TTF anymore, do we? No, we have WOFF2 format now. After compression to WOFF2, the same file is down to 269kB. Much smaller than original but it's still very big though.

That's what I have been using until this performance optimization project. Even though I had the `font-display: swap;`, this font file with 269kB size was using quite a bit of network. And it was in the priority so it was slowing down the loading of the other assets. So I decided to shrink it down further with font subsetting.

The tool I have used was `pyftsubset`. I don't want to get into the details of font subsetting here but I may write another post in the future on how I did it.

Eventually, with font subsetting, I got this font file down to 99kB. And that is while all the variable axes still included. I could probably go much lower than that if I'd give up on the axes but I didn't want to do that. And this shaved off 170kB of dead weight.

### Replacing 100 divs with image tiling (spoiler: didn't help)

I also found a potential performance issue in my code that Lighthouse couldn't have shown me.

I have a background grid decoration in the home page in a particular style. It is a pattern that consists of a solid and a dashed line alternating on both horizontal and vertical directions to create an interesting blueprint style background decoration. The decoration also fades away towards the edges with a CSS mask.

The method I used to implement this in code was, creating divs for each line (about 50 in each axis) and styling them with CSS, aligning them with flexbox, using a linear gradient for the dashed lines and solid background color for solid ones. On top of that also a shadow of the same color as the line color on each line to make it softer.

This method was pretty expensive as it was both requiring heavy CSS processing and bloating the DOM with 100 extra divs. So I had to change that to a more efficient method.

As a solution, I implemented the same grid with background image tiling instead. I created an image for a square that forms as a part of this pattern in Figma. Then I exported it and converted to WebP. That left me with a small 730B image. Then I used it as a background image with the combination of `background-repeat: repeat;` to make it tile. That resulted in the same thing I made with the div lines, but with a lot more efficiency — reducing both `index.html` file size and the time browser needs to render the decoration. <a href="https://github.com/Metehan-Altuntekin/my-portfolio/blob/master/src/lib/components/GridBG.svelte" target="_blank">You can find the code for that component here.</a>

And after testing, I couldn't see any measurable difference with this update. I guess modern browser engines handle CSS and DOM rendering so efficiently even on throttled processors, so 100 divs with shadows and gradients weren't a bottleneck I assumed it would be. It also didn't reduce the HTML size much at all, only 0.3kB.

I am keeping this regardless, since it resulted in cleaner code.

### Migrating to unplugin-icons from @iconify/svelte

I was using `@iconify/svelte` to render my icons. It is a pretty convenient npm package that helps me add any icon or change it with just changing the icon code.

But it had some performance downsides. It was causing 18KiB of requests to Iconify CDN, the JS chunk that was performing the addition of the icons to the DOM was blocking the main thread for 95ms. And it also had a potential for layout shifts because it was adding the icons after rendering started.

So I found <a href="https://github.com/unplugin/unplugin-icons" target="_blank">unplugin-icons</a> as an alternative. It does things differently than `@iconify/svelte`. Instead of loading from a CDN and hydrating the DOM on the client side, it adds the SVGs directly into the .html file in the build. And we still get to keep the benefits of importing icons from Iconify with their ids, but only from `@iconify/json` locally this time.

This also has a few trade-offs. First is that it removes separate caching for icons as they are bundled in the .html file. And then, for my case, `index.html` file size increased from the previous 15.5kB to 26.8kB. These trade-offs weren't important compared to the benefits it provided for my use case — mainly the 95ms of main thread blocking — so I was fine with this.

A better method could be creating SVG sprites manually and importing all the icons with just one single file. This can especially be used for lazy loading them if the icons are not shown at the first loading screen, while also keeping the caching benefits. However, I like the convenience of still being able to use Iconify icons directly inside my components so I didn't bother to migrate to sprites, at least for this website.

### Reducing the quantity of the chunks

SvelteKit uses granular chunking of Rollup by default to use caching more efficiently for JS chunks. With granular chunking, it generates smaller but many chunks to isolate specific things like a `node_modules` entry. It also uses deterministic hashing to persist the same name for a chunk with the same exact content between builds.

This is great for caching but it has a slight downside. It increases the quantity of chunks, which makes the compression and client processing of each file slightly less efficient. It is not as bad as it would be in the old days with HTTP/1.1 thanks to new HTTP/2 and HTTP/3 multiplexing allowing many files to be sent over one connection. But each file still has header overhead and requires the browser to manage a separate entry in the network stack.

And on a narrow bandwidth or a very slow mobile CPU, the overhead of parsing more headers and managing more streams can still cause extra delays.

In this case the chunk total size was 64.6KiB while the quantity of chunks was 28.

![Network waterfall on HTTP/3 with 28 chunks|800](/blog/mobile-perf-improvement/waterfall-28-chunks.avif)

So I wanted to reduce the quantity of these chunks. Best opportunity for that was creating a `vendor.js` to bundle the `node_modules` entries to one single file. So I added this bit of config to my setup:

```ts
// vite.config.ts

// ones to not include in the vendor
const heavyLibs: string[] = []; // e.g. "three"

export default defineConfig({
	// ...
	build: {
		rollupOptions: {
			output: {
				// bundle small node_modules packages into one single .js file
				// to reduce the amount of the chunks
				manualChunks: (id) => {

					if (id.includes('node_modules')) {

						// still bundle heavy ones separately
						for (const lib of heavyLibs) {
							if (id.includes(lib)) return lib;
						}

						// everything else to vendor
						return 'vendor';
					}

				}
			}
		}
	}
});
```

This makes Rollup bundle all the `node_modules` entries in one single file (except for the ones defined in `heavyLibs`). And this results in fewer chunks. The name of the script in production will be hashed so don't be surprised if you can't find `vendor.js` in the build folder.

This method can be counterintuitive if you include big heavy libraries like `three` in this as it may inflate this chunk. So I also added a constant to define them to not include in this bundle. I don't have any big packages so mine is empty.

![Network waterfall on HTTP/3 with 12 chunks|800](/blog/mobile-perf-improvement/waterfall-12-chunks.avif)

It will also change the `vendor.js` chunk each time we update a dependency. So this means we miss the granular caching for the `node_modules`, which is a trade-off that I don't find worth worrying for this specific case.

This method got the quantity of the individual chunks down to 12 from 28. It also allowed compression algorithms to reduce the total size of JS chunks from 64.6KiB to 59.1KiB, though this little of a difference won't really matter. It makes the loading more stable, because fewer files means less getting affected by network jitter and less processing for the slow processor.

### Removing preload of JS files in SvelteKit

After all this, I was seeing some drops in the scores in some tests. These low score test results had a suspicious "Element render delay" of sometimes over 2 seconds, while the good ones had only about 120ms.

![LCP breakdown insight|700](/blog/mobile-perf-improvement/insight-lcp-breakdown-removing-js-preload.avif)

I realized that the JS chunks were getting more priority, despite the preload tag of the image. That was due to SvelteKit setting the chunks to preload too. So the chunks were being treated with higher priority than the image by the browser.

Network is an unstable thing. So sometimes due to network differences I was getting 2 seconds of element render delay on my LCP image instead of 120ms that happens on a good time. The quantity of the files causing more competition and CPU usage was affecting the load time.

So it was important to make the LCP image higher priority. I tried to disable CSR first and that made a massive difference as it removed all the chunks. But I didn't really want to remove CSR, that would break the beautiful seamless navigation of SvelteKit within my website.

Then I discovered this method:

```ts
// hooks.server.ts

const handleRemovePreloads: Handle = async ({ event, resolve }) => {
	return await resolve(event, {
		preload: ({ type, path }) => {
			if (type === 'js') {
				// 1. Preload start.js and app.js
				// These are pretty small and essential for booting the app.
				if (path.includes('entry/start') || path.includes('entry/app')) {
					return true;
				}

				// 2. Other .js files don't preload
				return false;
			}

			// Keep other assets
			return true;
		}
	});
};
```


This is a little server handle hook that tells Svelte what to allow to preload and what not to. I set to allow the preload of `app.js` and `start.js` since these two are the essential main scripts. But every other JS file can wait after the LCP image. The other assets like CSS files are allowed.

What this essentially does is that, it hides the rest of the scripts from the initial preload scanner of the website. Only the `start.js` and `app.js` link tags get added in the head. SvelteKit injects the link tags for the rest of the chunks later. And this lets the preload tags we have for the hero section image to be processed before these scripts, causing the browser to fetch it first.

![Network waterfall after JS chunks removed from preload (localhost HTTP/1.1)|800](/blog/mobile-perf-improvement/waterfall-js-preload-removed.avif)

After this method, my LCP image started to load immediately after the .html file was done loading. After we get our LCP complete, the rest of the .js files start loading. We still load all of our 12 JS files but in a different order.

This method alone as the last step brought my live site test results from 92-96 to stable 95-98. I was so glad to find it, there was no functionality loss and the PSI was showing the high range we wanted constantly.

## Results

Now let's take a look at the after test results and see how much better this gets.

This is one of the results from PageSpeed Insights:

![After scores on PSI|700](/blog/mobile-perf-improvement/after-scores-98.avif)

98 out of 100. Total blocking time is completely eliminated. FCP went down to 1 second. Speed index went down to 1.2 seconds. 2.4 seconds of LCP. Pretty great scores overall. You can find this test's results [here](https://pagespeed.web.dev/analysis/https-metehan-design/1poy0njydp?form_factor=mobile).

The results now sit between 95-98 consistently, which is the consistency I wanted. It is possible that I can take this even further but I would probably have to make compromises like removing some variable axes from my font file or disabling CSR — trade-offs that aren't worth it.

And with local Lighthouse testing (with `npx @lhci/cli` median of 10 tests, with `--settings.throttlingMethod=devtools`):

![Localhost preview median of 10 tests|700](/blog/mobile-perf-improvement/after-score-localhost-devtools-throttling.avif)

99 out of 100 on mobile. 0.9s FCP, 2.1s LCP, 0ms TBT, 0 CLS, 1.1s SI. Excellent.

These results are even better due to the differences in the testing environments. Local testing with a localhost preview gives the most reliable results as it has zero network connection issues, but its downside is that it uses HTTP/1.1 compared to Cloudflare hosted HTTP/2 and HTTP/3.

## Conclusion

With all this work, I finally achieved the consistent 95+ mobile scores and learned a lot of things. Lighthouse was very useful to spot issues, but it doesn't show everything. Some of the improvements required me to be aware of the details in the code.

Optimizing basics like font files and images was crucial. After that, setup-specific solutions like CSS inlining and especially the JS chunks preloading trick have been very helpful. In the end, initial loading performance boils down to reducing the size and the processing time of assets.

It is important to mention these setup-specific solutions each come with trade-offs and they may not be ideal for all cases. They have been pretty useful for a small content website like this, but a complex SaaS app with hundreds of daily users will have different needs.

I also focused mostly on the lab test results on this project. Lab tests don't cover everything but they are very important tools to predict real-world performance. Since Lighthouse mobile tests were very throttled, now I know that my website will load fast even in the worst conditions.


