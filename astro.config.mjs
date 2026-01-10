import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'
import icon from 'astro-icon'
import react from '@astrojs/react'
import markdoc from '@astrojs/markdoc'
import keystatic from '@keystatic/astro'
import cloudflare from '@astrojs/cloudflare'
import rehypeFigureTitle from 'rehype-figure-title'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs'
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs'

// https://astro.build/config
export default defineConfig({
	site: 'https://hisenz.com',
	base: '/',
	output: 'server',
	adapter: cloudflare({
		mode: 'advanced',
		platformProxy: {
			enabled: true
		},
		functionPerRoute: false
	}),
	integrations: [
		react(),
		markdoc(),
		keystatic(),
		mdx(),
		sitemap(),
		icon(),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		define: {
			'process.env.KEYSTATIC_GITHUB_CLIENT_ID': JSON.stringify(process.env.KEYSTATIC_GITHUB_CLIENT_ID),
			'process.env.KEYSTATIC_GITHUB_CLIENT_SECRET': JSON.stringify(process.env.KEYSTATIC_GITHUB_CLIENT_SECRET),
			'process.env.KEYSTATIC_SECRET': JSON.stringify(process.env.KEYSTATIC_SECRET),
			'process.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG': JSON.stringify(process.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG)
		}
	},
	markdown: {
		remarkPlugins: [remarkReadingTime, remarkModifiedTime],
		rehypePlugins: [rehypeFigureTitle, rehypeAccessibleEmojis],
	},
})
