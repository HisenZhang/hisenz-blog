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
	}),
})

export const collections = { blog }
