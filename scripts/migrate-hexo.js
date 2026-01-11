import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import Anthropic from '@anthropic-ai/sdk'

const HEXO_POSTS_DIR = '/Volumes/Untitled/blog/source/_posts'
const ASTRO_BLOG_DIR = './src/content/blog'
const BATCH_SIZE = 5 // Process posts in batches to avoid rate limits

// Initialize Anthropic client
const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY
})

/**
 * Generate a concise description from post content using Claude
 */
async function generateDescription(title, content, batchPosts = []) {
	try {
		// Remove HTML tags and code blocks for cleaner input
		const cleanContent = content
			.replace(/<[^>]*>/g, '') // Remove HTML
			.replace(/```[\s\S]*?```/g, '') // Remove code blocks
			.slice(0, 2000) // Limit content length

		const prompt = batchPosts.length > 0
			? `Generate concise one-sentence descriptions (max 160 characters each) for these blog posts. Return ONLY a JSON array of descriptions in the same order:

${batchPosts.map((post, i) => `${i + 1}. Title: "${post.title}"
Content excerpt: ${post.content.slice(0, 500)}...
`).join('\n')}`
			: `Generate a concise one-sentence description (max 160 characters) for this blog post. Return ONLY the description text, no quotes or extra formatting.

Title: "${title}"
Content excerpt: ${cleanContent}`

		const message = await anthropic.messages.create({
			model: 'claude-3-5-haiku-20241022',
			max_tokens: 1024,
			messages: [{
				role: 'user',
				content: prompt
			}]
		})

		const result = message.content[0].text.trim()

		if (batchPosts.length > 0) {
			// Parse JSON array for batch processing
			try {
				return JSON.parse(result)
			} catch (e) {
				console.warn('Failed to parse batch response, falling back to individual processing')
				return null
			}
		}

		return result.replace(/^["']|["']$/g, '') // Remove quotes if present
	} catch (error) {
		console.error('Error generating description:', error.message)
		return title // Fallback to title if generation fails
	}
}

/**
 * Convert Hexo frontmatter to Astrokeys format
 */
function convertFrontmatter(hexoFrontmatter, description) {
	const astroFrontmatter = {
		title: hexoFrontmatter.title || 'Untitled',
		description: description,
		pubDate: hexoFrontmatter.date || new Date(),
	}

	// Add optional fields if they exist
	if (hexoFrontmatter.category) {
		astroFrontmatter.category = hexoFrontmatter.category
	}

	if (hexoFrontmatter.tags) {
		astroFrontmatter.tags = Array.isArray(hexoFrontmatter.tags)
			? hexoFrontmatter.tags
			: [hexoFrontmatter.tags]
	}

	// Check for updated date
	if (hexoFrontmatter.updated && hexoFrontmatter.updated !== hexoFrontmatter.date) {
		astroFrontmatter.updatedDate = hexoFrontmatter.updated
	}

	return astroFrontmatter
}

/**
 * Convert Hexo-specific syntax to Astro-compatible format
 */
function convertContent(content) {
	return content
		// Remove Hexo's <!-- more --> excerpt marker
		.replace(/<!--\s*more\s*-->/gi, '')
		// Keep HTML embeds as-is (Astro supports them)
		// Update image paths if needed (can be customized)
		.replace(/!\[(.*?)\]\(\/images\//g, '![$1](/images/')
}

/**
 * Generate slug from filename
 */
function generateSlug(filename) {
	return filename
		.replace(/\.md$/, '')
		.toLowerCase()
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // Support Chinese characters
		.replace(/^-+|-+$/g, '')
}

/**
 * Process a single post
 */
async function processPost(filename, description) {
	const filePath = path.join(HEXO_POSTS_DIR, filename)
	const fileContent = await fs.readFile(filePath, 'utf-8')

	// Parse frontmatter and content
	const { data: frontmatter, content } = matter(fileContent)

	// Convert frontmatter
	const astroFrontmatter = convertFrontmatter(frontmatter, description)

	// Convert content
	const astroContent = convertContent(content)

	// Generate slug
	const slug = generateSlug(filename)

	// Create new file content in Markdoc format
	const newContent = `---
title: ${JSON.stringify(astroFrontmatter.title)}
description: ${JSON.stringify(astroFrontmatter.description)}
pubDate: ${astroFrontmatter.pubDate.toISOString()}
${astroFrontmatter.updatedDate ? `updatedDate: ${astroFrontmatter.updatedDate.toISOString()}\n` : ''}${astroFrontmatter.category ? `category: ${JSON.stringify(astroFrontmatter.category)}\n` : ''}${astroFrontmatter.tags ? `tags: ${JSON.stringify(astroFrontmatter.tags)}\n` : ''}---

${astroContent}
`

	// Write to new location
	const outputPath = path.join(ASTRO_BLOG_DIR, `${slug}.mdoc`)
	await fs.writeFile(outputPath, newContent, 'utf-8')

	return {
		original: filename,
		slug,
		success: true
	}
}

/**
 * Main migration function
 */
async function migrate() {
	console.log('🚀 Starting Hexo to Astrokeys migration...\n')

	// Check if API key is set
	if (!process.env.ANTHROPIC_API_KEY) {
		console.error('❌ ANTHROPIC_API_KEY environment variable is not set')
		console.log('Please set it with: export ANTHROPIC_API_KEY=your_key_here')
		process.exit(1)
	}

	// Ensure output directory exists
	await fs.mkdir(ASTRO_BLOG_DIR, { recursive: true })

	// Read all post files
	const files = await fs.readdir(HEXO_POSTS_DIR)
	const mdFiles = files.filter(f => f.endsWith('.md'))

	console.log(`📚 Found ${mdFiles.length} posts to migrate\n`)

	const results = []
	let processed = 0

	// Process in batches
	for (let i = 0; i < mdFiles.length; i += BATCH_SIZE) {
		const batch = mdFiles.slice(i, i + BATCH_SIZE)

		console.log(`📝 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(mdFiles.length / BATCH_SIZE)}...`)

		// Read all posts in batch
		const batchPosts = await Promise.all(
			batch.map(async (filename) => {
				const filePath = path.join(HEXO_POSTS_DIR, filename)
				const fileContent = await fs.readFile(filePath, 'utf-8')
				const { data: frontmatter, content } = matter(fileContent)
				return {
					filename,
					title: frontmatter.title || 'Untitled',
					content: content.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, '').slice(0, 500)
				}
			})
		)

		// Generate descriptions for batch
		console.log('   🤖 Generating descriptions with Claude...')
		const descriptions = await generateDescription(null, null, batchPosts)

		// Process each post in batch
		for (let j = 0; j < batch.length; j++) {
			const filename = batch[j]
			const description = Array.isArray(descriptions) ? descriptions[j] : await generateDescription(
				batchPosts[j].title,
				batchPosts[j].content
			)

			try {
				const result = await processPost(filename, description)
				results.push(result)
				processed++
				console.log(`   ✅ ${filename} → ${result.slug}.mdoc`)
			} catch (error) {
				console.error(`   ❌ Failed to process ${filename}:`, error.message)
				results.push({
					original: filename,
					success: false,
					error: error.message
				})
			}
		}

		console.log()

		// Add delay between batches to respect rate limits
		if (i + BATCH_SIZE < mdFiles.length) {
			await new Promise(resolve => setTimeout(resolve, 1000))
		}
	}

	// Summary
	const successful = results.filter(r => r.success).length
	const failed = results.filter(r => !r.success).length

	console.log('✨ Migration complete!\n')
	console.log(`📊 Summary:`)
	console.log(`   Total: ${mdFiles.length}`)
	console.log(`   Successful: ${successful}`)
	console.log(`   Failed: ${failed}`)

	if (failed > 0) {
		console.log('\n❌ Failed files:')
		results.filter(r => !r.success).forEach(r => {
			console.log(`   - ${r.original}: ${r.error}`)
		})
	}

	console.log('\n🎉 Next steps:')
	console.log('   1. Run: npm run dev')
	console.log('   2. Check http://localhost:4321/blog')
	console.log('   3. Review posts in Keystatic admin')
	console.log('   4. Migrate images if needed')
}

// Run migration
migrate().catch(console.error)
