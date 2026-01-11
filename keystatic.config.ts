import { config } from '@keystatic/core';
import { site, seo, home, about, social, navigation, footer } from 'src/cms/singletons';
import { posts } from 'src/cms/collections';

export default config({
  storage: {
    kind: 'github',
    repo: 'HisenZhang/hisenz-blog',
  },

  ui: {
    brand: { name: 'Hisen\'s Blog' },
    navigation: {
      'Content': ['home', 'about', 'posts'],
      'Settings': ['site', 'seo', 'social', 'navigation', 'footer'],
    },
  },

  collections: {
    posts,
  },

  singletons: {
    site,
    seo,
    home,
    about,
    social,
    navigation,
    footer,
  },
});
