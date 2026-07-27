/**
 * content.json and a couple of components hardcode root-relative asset
 * paths ("/images/...", "/videos/..."), which break once the site is
 * served from a subpath (GitHub Pages project sites live at
 * "<user>.github.io/<repo>/", not the domain root — see vite.config.js's
 * `base`). Vite exposes that same base as import.meta.env.BASE_URL at
 * runtime, so prefixing every asset path with it here makes them resolve
 * correctly both in dev (base "/") and on Pages (base "/Eurus-v1/").
 */
export function asset(path) {
  if (!path) return path;
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return base + path;
}
