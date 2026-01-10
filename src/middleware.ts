import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  // Inject Cloudflare environment variables into process.env for Keystatic
  const runtime = (context.locals as any).runtime;
  if (runtime?.env) {
    const env = runtime.env;

    if (env.KEYSTATIC_GITHUB_CLIENT_ID) {
      process.env.KEYSTATIC_GITHUB_CLIENT_ID = env.KEYSTATIC_GITHUB_CLIENT_ID;
    }
    if (env.KEYSTATIC_GITHUB_CLIENT_SECRET) {
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET = env.KEYSTATIC_GITHUB_CLIENT_SECRET;
    }
    if (env.KEYSTATIC_SECRET) {
      process.env.KEYSTATIC_SECRET = env.KEYSTATIC_SECRET;
    }
    if (env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG) {
      process.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG = env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG;
    }
  }

  return next();
});
