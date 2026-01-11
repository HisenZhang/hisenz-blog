import { config } from '@keystatic/core';
import { site, seo, home, social, navigation } from 'src/cms/singletons';
import { posts } from 'src/cms/collections';

export default config({
  storage: {
    kind: 'github',
    repo: 'HisenZhang/hisenz-blog',
  },

  ui: {
    brand: { name: 'Hisen\'s Blog' },
    navigation: {
      'Content': ['home', 'posts'],
      'Settings': ['site', 'seo', 'social', 'navigation'],
    },
  },

  collections: {
    posts,
  },

  singletons: {
    site,
    seo,
    home,
    social,
    navigation,
  },
});
