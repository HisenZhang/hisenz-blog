import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
	const blog = await getCollection('blog', ({ data }) => {
		// Only include public posts in RSS feed
		return data.visibility === 'public'
	})
	return rss({
		// `<title>` field in output xml
		title: 'Hisenz Blog',
		// `<description>` field in output xml
		description:
			'Personal blog by Hisenz - thoughts on programming, food, and life',
		// Pull in your project "site" from the endpoint context
		// https://docs.astro.build/en/reference/api-reference/#site
		site: context.site,
		// Array of `<item>`s in output xml
		// See "Generating items" section for examples using content collections and glob imports
		items: blog.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			// Use post.slug for the correct URL
			link: `/blog/${post.slug}/`,
		})),
	})
}
