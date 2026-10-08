# v0.1 verification

- Installed dependencies and lockfile; Astro 7.3.8. npm audit: zero vulnerabilities.
- Astro check: zero errors, warnings, or hints. Production build: 28 pages.
- Built successfully with both root and repository base paths. `npm run verify:build` checks built links and the seven Foundation 7 selections.
- Checked 557 internal links and asset references against static output, including /foundation-framework/ base path.
- Headless Chrome: all catalog filters, title/description search, empty state, resource filters, saved checklists across reload, automatic in-progress status, readiness requiring all items, summary count, and reset passed.
- Responsive overflow checks at 390, 768, and 1440 pixels on representative routes; mobile menu open/close passed. Inspected desktop/mobile screenshots.
- Print media: navigation and local record hidden, paper signature lines visible; generated and inspected challenge PDF.
- No browser JavaScript errors during checks.

Artifacts: home-desktop.png, home-mobile.png, challenge-print.pdf. Browser checks used external Playwright tooling, not a runtime dependency. This is focused functional QA, not a full accessibility audit or exhaustive browser/device certification.

Limitations: sample curriculum; local-device readiness only; no accounts, real approval, cross-device sync, evidence, or participant notes. Pathfinder/Vanguard curriculum is not yet authored.

The user approved public visibility. Repository: https://github.com/gforster/foundation-framework. GitHub Pages is enabled with Actions deployment at https://gforster.github.io/foundation-framework/.

## Workshop update

Both color themes checked at 360, 390, 768, 1024, and 1440 pixels on home, catalog, and challenge pages. Verified device preference, saved preference across reload/navigation, keyboard switching, storage-unavailable fallback, and white paper printing from dark mode. Theme storage is independent from prototype progress.

## Working-view update

Production build now generates 31 pages; 681 static references resolve. My Workshop workbench, next unchecked step links, pillar coverage, ready-for-review queue, reset refresh, progress-aware Foundation 7, adult guide, and 16-row printable record passed browser checks. New pages were checked in both themes at 360/390/768/1440 pixels. Progress record prints on one A4 page; expanded challenge and adult guide print across four pages. Existing catalog/search/progress and mobile navigation checks also passed. Checklist indices and storage key were preserved.
