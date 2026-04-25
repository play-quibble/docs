# Quibble Docs

Documentation site for [Quibble](https://github.com/play-quibble/trivia) — a self-hosted live trivia platform for Kubernetes.

**Live site:** https://play-quibble.github.io/docs/

Built with [Starlight](https://starlight.astro.build).

## Local dev

```bash
npm install
npm run dev
```

Dev server starts at `http://localhost:4321/docs/`.

## Contributing

Add or edit `.md` / `.mdx` files under `src/content/docs/`, then update the `sidebar` in `astro.config.mjs` if adding a new page. See [Contributing](https://play-quibble.github.io/docs/contributing/) for details.
