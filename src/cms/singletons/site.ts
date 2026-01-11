import { fields, singleton } from '@keystatic/core';

export const site = singleton({
  label: 'Site Settings',
  path: 'src/content/settings/site',
  schema: {
    SITE_BASE: fields.text({
      label: 'Site Base Path',
      description: 'Leave empty for root domain, or specify subdirectory like /blog',
      defaultValue: '',
    }),
  },
});
