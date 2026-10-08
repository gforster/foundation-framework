# Foundation Framework · v0.1

[Live website](https://gforster.github.io/foundation-framework/) · [GitHub repository](https://github.com/gforster/foundation-framework)

A church-centered field guide for biblical formation, practical competence, and faithful service. **All challenge curriculum is prototype/sample content**, not an approved curriculum. Review with church leaders before use.

## Develop

Node 22.12+ and npm. Run `npm ci`, `npm run dev`, `npm run check`, and `npm run build`. Then run `npm run verify:build` to check static references and Foundation 7. `npm run preview` serves the build. The default URL prefix is `/foundation-framework/`; visit that path locally. To build at a domain root: `BASE_PATH=/ npm run build`.

## Architecture and content

Astro static output, TypeScript, validated Markdown content collections, plain CSS, and small vanilla JS modules. No React, accounts, database, or backend.

- Challenges: `src/content/challenges/*.md`; schema: `src/content.config.ts`.
- Add a challenge by copying one Markdown file and changing its filename (the slug) and JSON frontmatter. Keep checklist item order stable until a curriculum version is introduced. Run checks/build.
- Foundation 7: set `foundation7: true` and a unique `sequence` from 1–7. Exactly seven sample challenges qualify; the path is optional.
- Shared cards, icons, layout: `src/components/`, `src/layouts/`.
- Branding: `src/styles/global.css`, repository-owned `public/icons/*.svg`, `public/favicon.svg`.
- Progress adapter: `src/scripts/progress.ts`. LocalStorage readiness is not adult approval. Reset on the catalog page.
- Printing: challenge-page Print button and `@media print` stylesheet. Browser print settings may add headers/footers.

## GitHub Pages

Create the repository **foundation-framework** (stop if that name is already taken). Push main, then select **Settings → Pages → Source → GitHub Actions**. The workflow checks and builds, uploads `dist`, then deploys with Pages permissions. `configure-pages` supplies origin and base path; configuration defaults to `https://gforster.github.io/foundation-framework/` for local builds. No secrets are needed by this static workflow.

Example after authenticating: `gh repo create foundation-framework --public --source=. --remote=origin --push`. Enable Pages using Actions in repository settings. See `docs/architecture.md` for future persistence boundaries.

## Documentation

- [Architecture](docs/architecture.md)
- [Content model](docs/content-model.md)
- [Design system](docs/design-system.md)

See `docs/verification.md` for checks and limitations. No PR is required for this initial main-branch prototype.

## Working features

My Workshop resumes the next unchecked step, shows review-ready work, and reports pillar coverage. Challenge pages provide preparation/materials, learning, practice, demonstration, and adult guidance. Foundation 7 suggestions respond to local progress. Resources link to a printable progress record and a sample church launch kit. All added guidance remains prototype curriculum. Existing checklists and their indices are preserved.
