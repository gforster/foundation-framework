# Challenge content

Each Markdown filename is the URL slug. JSON frontmatter is valid YAML and is validated by the Astro collection schema. `sample: true` and an in-source comment identify invented curriculum.

Fields: title, pillar, level, description, purpose, difficulty (1 easy / 2 moderate / 3 challenging), effort, foundation7, optional sequence, prerequisites, required, adult, adultNotes, skills, requirements, checklist, demonstration, signoff, resources (title, level, optional URL), scripture (reference and KJV text), notes, sample.

Adult values: Parent, Pastor / Teacher, Mentor, Skilled Church Member, None. Level values: Apprentice, Pathfinder, Vanguard. Pillars: Identity, Stewardship, Service, Dominion. Resource levels are independent recommendations. Prerequisites are explicit and empty in this sample curriculum; Foundation 7 is never a prerequisite.

Options appear within requirements (budget medium, meal type, repair/project type). All 16 sample Apprentice challenges are required. Later schemas may support richer elective groups without changing the page template.

Checklist progress currently uses item indices. Reordering or changing a published checklist requires resetting local prototype progress; introduce stable item IDs and curriculum versioning before production use. Quotes are KJV; shortened quotes are identified as excerpts in the UI.
