# play-quibble/docs

Starlight (Astro) documentation site for Quibble. Deployed to GitHub Pages at `https://play-quibble.github.io/docs`.

## Local dev

```bash
npm install
npm run dev      # dev server at http://localhost:4321/docs/
npm run build    # static output → dist/
npm run preview  # preview the built site
```

## Structure

- `astro.config.mjs` — sidebar nav and site config
- `src/content/docs/` — all documentation pages (Markdown / MDX)
- `public/` — static assets served at root

## Adding a page

Create a `.md` or `.mdx` file under `src/content/docs/` then add it to the `sidebar` array in `astro.config.mjs`.

Frontmatter required on every page:
```yaml
---
title: Page Title
description: One-line description for SEO and social previews
---
```

## Deployment

Merging to `main` triggers `.github/workflows/deploy.yml` which builds the site and deploys to GitHub Pages via the official `withastro/action`.
