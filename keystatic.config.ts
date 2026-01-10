import { config } from '@keystatic/core';
import { site, seo, home, social, navigation } from 'src/cms/singletons';
import { posts, media } from 'src/cms/collections';

export default config({
  storage: {
    kind: 'github',
    repo: 'HisenZhang/hisenz-blog',
  },

  ui: {
    brand: { name: 'Saral Blog' },
    navigation: {
      'Content': ['home', 'posts'],
      'Media': ['media'],
      'Settings': ['site', 'seo', 'social', 'navigation'],
    },
  },

  collections: {
    posts,
    media,
  },

  singletons: {
    site,
    seo,
    home,
    social,
    navigation,
  },
});
