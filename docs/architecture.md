# Architecture

Astro generates HTML for the home, catalog, 16 challenge pages, Foundation 7, how it works, levels, pillars and four pillar detail pages, church involvement, and resources. Shared content drives both catalog and details. All internal URLs and SVG sources use Astro’s BASE_URL. No routing fallback is needed on GitHub Pages.

Vanilla TypeScript handles filters, responsive navigation, printing, and local progress. The progressStore read/write/reset adapter is the replacement boundary for future authentication and persistence. It validates stored shape and handles unavailable browser storage. “Ready” requires all checklist items; no official approval is recorded.

Future: introduce stable challenge/checklist identifiers and curriculum versions before syncing progress. A backend can link participants to households/churches, authorize mentors and sign-off, store history, evidence, notes, comments, and printable records. Church-specific enabled challenges and custom content can be selected at build time or through an authorized backend. Certificates and dashboards should use verified approval, not local readiness. These are deliberately outside v0.1.
