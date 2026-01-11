import { fields, singleton } from '@keystatic/core';

export const footer = singleton({
  label: 'Footer',
  path: 'src/content/settings/footer',
  schema: {
    linksTitle: fields.text({
      label: 'Links Section Title',
      defaultValue: 'Links',
    }),
    socialsTitle: fields.text({
      label: 'Socials Section Title',
      defaultValue: 'Socials',
    }),
    copyrightText: fields.text({
      label: 'Copyright Text',
      multiline: true,
      defaultValue: 'Source code available on',
    }),
    githubUrl: fields.text({
      label: 'GitHub Repository URL',
      defaultValue: 'https://github.com/yashjawale/saral-theme-astro',
    }),
    githubLinkText: fields.text({
      label: 'GitHub Link Text',
      defaultValue: 'GitHub',
    }),
  },
});
