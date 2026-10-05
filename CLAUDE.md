# CLAUDE.md

Working notes for Claude on this project.

## What this is

A pattern language for product management in complex organizations, authored by Isaac Hepworth. Patterns are extracted from real career experiences — stories of recurring dynamics that stood out as significant. The collection is an authored work, not a wiki.

## How the site works

- `content/index.json` — site index; lists all published patterns by category with slug, title, and summary. **Adding a pattern here is what makes it appear in the nav and ToC.**
- `content/patterns/<slug>.md` — one file per pattern, with YAML frontmatter
- `content/introduction.md` and `content/about.md` — static pages
- `drafts/` — work-in-progress patterns and scratchpad notes (not served by the site)
- `app.js` — single-page app; routes via the History API (`pushState`/`popstate`), fetches and renders markdown
- `style.css` — all styles
- `index.html` — shell; sidebar title is hardcoded short form

## Deployment & serving

Served by Cloudflare Pages (project `patterns`, git-connected to `main`, no build step, output dir = repo root) at **`patterns.isaa.ch`**. Push to `main` and it redeploys in ~30s.

- There's no `404.html`, so Pages runs in SPA mode: any path that isn't a real file gets `index.html`. That's what makes deep links like `/alignment-mirage` work.
- `index.html` has `<base href="/">` so relative asset/content URLs resolve correctly from deep paths. `app.js` reads `document.baseURI` for its mount point, so it would still work if mounted under a prefix with a different `<base>`.
- The directory is served as-is, so `drafts/` is publicly reachable (it's just not linked).

History: this was `pmp/` inside `hepwori/hepwori.github.io` (history preserved via `git subtree split`), served at `hepwori.github.io/pmp/` and, via a Cloudflare Worker, at `isaa.ch/patterns/`. See `~/Documents/projects/domain-audit/tracker.md` for the zone's history and the cutover.

## Pattern file format

```
---
title: Pattern Title
also_known_as: Alternative Name (optional)
category: category-id
summary: One sentence.
---

## Context
## Problem
## Forces
## Navigation Strategies
## Consequences
## Known Uses        (optional)
## Related Patterns
```

Sections are consistent across patterns. "Degeneration" sub-sections appear under Consequences when relevant.

## Wikilinks

Cross-references use `[[Pattern Title]]` syntax — processed by `app.js` into links. Use the exact pattern title as it appears in the frontmatter.

## Adding a new pattern

1. Create `content/patterns/<slug>.md`
2. Add entry to `content/index.json` under the appropriate category
3. Update Related Patterns in other patterns that should reference the new one

## Editorial voice

- Neutral and descriptive, not prescriptive or moral
- Patterns describe how things *tend* to work, not how they *should* work
- No TED Talk framing — direct, no emotional fanfare
- Short paragraphs, confident tone

## Division of labor: About vs Introduction

- **Introduction** — what the collection is and how to use it
- **About** — who wrote it and why (personal provenance, authorship stance)

These should not overlap. The "descriptive not prescriptive" point lives in the Introduction.

## Title structure

- Canonical title: *A Pattern Language for Product Management in Complex Organizations*
- Short form (sidebar, browser tab): *A Pattern Language for Product Management*
- Both stored in `index.json` as `title` and `title_short`

## Drafts workflow

- `drafts/scratchpad.md` — raw exploration, story fragments, candidate patterns not yet named or structured
- `drafts/<slug>.md` — individual draft files once a pattern has a name and rough section shape
- When ready: move to `content/patterns/`, add to `index.json`, update cross-references
