import { fields, collection } from '@keystatic/core';

export const media = collection({
  label: 'Media Library',
  slugField: 'title',
  path: 'src/content/media/*',
  format: { data: 'json' },
  schema: {
    title: fields.slug({
      name: {
        label: 'Title',
        description: 'Descriptive name for this media item',
      },
    }),
    image: fields.image({
      label: 'Image',
      directory: 'public/media',
      publicPath: '/media/',
    }),
    altText: fields.text({
      label: 'Alt Text',
      description: 'Describe the image for accessibility',
    }),
    caption: fields.text({
      label: 'Caption',
      multiline: true,
      description: 'Optional caption or description',
    }),
  },
});
