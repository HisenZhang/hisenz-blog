import { fields, singleton } from '@keystatic/core';

export const about = singleton({
  label: 'About Page',
  path: 'src/content/settings/about',
  schema: {
    title: fields.text({
      label: 'Page Title',
      validation: { isRequired: true },
      defaultValue: 'About Me',
    }),
    content: fields.document({
      label: 'Content',
      formatting: true,
      dividers: true,
      links: true,
      images: {
        directory: 'public/images',
        publicPath: '/images/',
      },
    }),
  },
});
