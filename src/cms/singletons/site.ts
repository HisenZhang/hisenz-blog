import { fields, singleton } from '@keystatic/core';

export const site = singleton({
  label: 'Site Settings',
  path: 'src/content/settings/site',
  schema: {
    SITE_TITLE: fields.text({
      label: 'Site Title',
      validation: { isRequired: true },
    }),
    SITE_DESCRIPTION: fields.text({
      label: 'Site Description',
      multiline: true,
      validation: { isRequired: true },
    }),
    SITE_BASE: fields.text({
      label: 'Site Base Path',
      description: 'Leave empty for root domain, or specify subdirectory like /blog',
      defaultValue: '',
    }),
  },
});
