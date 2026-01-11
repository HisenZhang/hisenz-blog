import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		coverImage: image().optional(),
		coverImageCredit: z.string().optional(),
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
		visibility: z.enum(['public', 'unlisted', 'private']).default('public'),
		useMathJax: z.boolean().default(false),
	}),
})

// Keystatic-managed collections
const settings = defineCollection({
	type: 'data',
	schema: z.object({
		// Settings managed by Keystatic singletons
	}),
})

export const collections = { blog, settings }
