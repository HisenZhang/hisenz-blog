import { fields, singleton } from '@keystatic/core';

export const home = singleton({
  label: 'Home Page',
  path: 'src/content/settings/home',
  schema: {
    welcomeText: fields.text({
      label: 'Welcome Text',
      description: 'Small text above the main heading',
      defaultValue: 'Welcome to',
    }),
    heading: fields.text({
      label: 'Main Heading',
      validation: { isRequired: true },
      defaultValue: 'Saral Theme',
    }),
    subheading: fields.text({
      label: 'Subheading',
      multiline: true,
      validation: { isRequired: true },
      defaultValue: 'A simple theme for personal blog sites, created for Astro framework.',
    }),
    recentPostsTitle: fields.text({
      label: 'Recent Posts Section Title',
      defaultValue: 'Recent Posts',
    }),
    aboutTitle: fields.text({
      label: 'About Section Title',
      defaultValue: 'About Me',
    }),
    aboutText: fields.text({
      label: 'About Text',
      multiline: true,
      defaultValue: 'A brief introduction about yourself. You can include your profession, hobbies, interests, or anything you\'d like visitors to know about you.',
    }),
    contactTitle: fields.text({
      label: 'Contact Section Title',
      defaultValue: 'Get in touch',
    }),
    contactText: fields.text({
      label: 'Contact Text',
      multiline: true,
      defaultValue: 'Use the buttons below for my resume & email.',
    }),
    emailAddress: fields.text({
      label: 'Email Address',
      defaultValue: 'example@email.com',
    }),
    resumeUrl: fields.text({
      label: 'Resume URL',
      description: 'Link to your resume file or page',
      defaultValue: 'https://example.com',
    }),
  },
});
