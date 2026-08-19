/** Prefix a public asset or internal route with Astro's configured base path. */
export const withBase = (path: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
};
