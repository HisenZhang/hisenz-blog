import { fields, collection } from '@keystatic/core';

export const posts = collection({
  label: 'Posts',
  slugField: 'title',
  path: 'src/content/blog/*',
  entryLayout: 'content',
  format: { contentField: 'content' },
  columns: ['title', 'pubDate', 'updatedDate', 'category', 'visibility'],
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    description: fields.text({
      label: 'Description',
      multiline: true,
      description: 'A brief description of this post',
      validation: { isRequired: true }
    }),
    pubDate: fields.date({
      label: 'Published Date',
      validation: { isRequired: true }
    }),
    updatedDate: fields.date({
      label: 'Updated Date',
      description: 'Optional - only set if you want to show an update date'
    }),
    coverImageUrl: fields.text({
      label: 'Cover Image URL',
      description: 'Enter an external image URL (recommended: 853x480px). Leave empty to upload a file below.',
    }),
    coverImage: fields.image({
      label: 'Or Upload Cover Image',
      description: 'Upload a cover image (only used if URL above is empty)',
      directory: 'src/assets/blogimages',
      publicPath: '@assets/blogimages/',
    }),
    coverImageCredit: fields.text({
      label: 'Cover Image Credit',
      description: 'Optional credit for the cover image'
    }),
    category: fields.select({
      label: 'Category',
      description: 'Select a category for this post',
      options: [
        { label: 'Technology', value: 'Technology' },
        { label: 'Spark', value: 'Spark' },
        { label: 'Music', value: 'Music' },
        { label: 'Food', value: 'Food' },
        { label: 'Lecture', value: 'Lecture' },
        { label: 'Aviation', value: 'Aviation' },
      ],
      defaultValue: 'Technology',
    }),
    tags: fields.array(
      fields.text({ label: 'Tag' }),
      {
        label: 'Tags',
        description: 'Add tags to help organize and filter posts',
        itemLabel: (props) => props.value || 'New Tag',
      }
    ),
    visibility: fields.select({
      label: 'Visibility',
      description: 'Control who can see this post',
      options: [
        { label: 'Private', value: 'private' },
        { label: 'Unlisted', value: 'unlisted' },
        { label: 'Public', value: 'public' },
      ],
      defaultValue: 'private',
    }),
    useMathJax: fields.checkbox({
      label: 'Use MathJax',
      description: 'Enable MathJax for rendering mathematical formulas',
      defaultValue: false,
    }),
    content: fields.markdoc({
      label: 'Content',
      options: {
        image: {
          directory: 'src/assets/blogimages',
          publicPath: '@assets/blogimages/',
        },
      },
    }),
  },
});
