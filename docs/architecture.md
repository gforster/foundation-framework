# Architecture

Astro generates HTML for the home, catalog, 16 challenge pages, Foundation 7, how it works, levels, pillars and four pillar detail pages, church involvement, and resources. Shared content drives both catalog and details. All internal URLs and SVG sources use Astro’s BASE_URL. No routing fallback is needed on GitHub Pages.

Vanilla TypeScript handles filters, responsive navigation, printing, and local progress. The progressStore read/write/reset adapter is the replacement boundary for future authentication and persistence. Summary totals derive from the current content collection, ignoring removed challenge records. It validates stored shape and handles unavailable browser storage. “Ready” requires all checklist items; no official approval is recorded.

Future: introduce stable challenge/checklist identifiers and curriculum versions before syncing progress. A backend can link participants to households/churches, authorize mentors and sign-off, store history, evidence, notes, comments, and printable records. Church-specific enabled challenges and custom content can be selected at build time or through an authorized backend. Certificates and dashboards should use verified approval, not local readiness. These are deliberately outside v0.1.

## Working experiences

My Workshop derives in-progress and review-ready lists from the same collection and local progress adapter. ProgressData ships only metadata needed for those views; workshop.ts renders content using textContent. Foundation 7 chooses an underway challenge first, then the first unstarted selection; this never locks other challenges. The printable record reflects this device only.

Challenge pages organize data into Prepare, Learn, Practice, and Demonstrate, with an adult guide. Added curriculum fields do not change existing checklist order or localStorage keys, preserving existing device progress. The church launch kit provides sample meeting, parent, and mentor materials as static printable HTML.

The visual workbench shows at most two unstarted Foundation 7 suggestions, all active work, and all ready work. Start uses the existing progress adapter. Completing a checklist sets local readiness; unchecking an item returns it to in-progress. Per-card and per-pillar native progress elements describe checklist and breadth coverage. The full catalog remains freely available.

## Pilot planning

See [Church pilot specification](pilot-specification.md) for the proposed completion workflow, relationship-based permissions, versioned data model, and first backend milestone. This is a planning specification; no account or persistence service is provisioned yet.
