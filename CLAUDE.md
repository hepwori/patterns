# CLAUDE.md

Working notes for Claude on this project.

## What this is

A pattern language for product management in complex organizations, authored by Isaac Hepworth. Patterns are extracted from real career experiences — stories of recurring dynamics that stood out as significant. The collection is an authored work, not a wiki.

## How the site works

Static site built with **Eleventy 3** (`npm run build` → `_site/`). Every page is pre-rendered HTML; no client-side rendering. (It used to be a client-side markdown SPA; that was replaced because JS-only content is fragile for SEO and for agents/crawlers that don't run JS.)

- `content/index.json`: site index; lists all published patterns by category with slug, title, and summary, plus the featured list and the two background pages. **A pattern is published only if it's listed here**; this also drives the nav, contents page and prev/next order. Files in `content/patterns/` that aren't listed are drafts and produce no page.
- `content/patterns/<slug>.md`: one file per pattern, with YAML frontmatter. `content/introduction.md`, `content/about.md`: static pages.
- `eleventy.config.js`: the `[[Wikilink]]` markdown-it plugin (warns at build time on titles that don't resolve), and a preprocessor that turns each pattern's `## Related Patterns` bullets into the card grid.
- `data/site.js`: loads `content/index.json` for templates. `layouts/`: `base.njk` (head, sidebar, meta/OG/canonical), `pattern.njk`, `page.njk`. `content/index.njk` is the contents page, `content/404.njk`, `content/sitemap.njk`.
- `static/`: copied to the site root as-is (`style.css`, `nav.js`, `robots.txt`, favicons). `nav.js` is progressive enhancement only (sidebar search filter, mobile menu toggle, remembers sidebar scroll); the site works without it.
- `drafts/`: work-in-progress notes, never built or served.
- Local: `npm install`, then `npm start` (live-reloading server) or `npm run build`. Node version is pinned in `.node-version`; Eleventy is pinned exactly in `package.json`.

## Deployment & serving

Cloudflare Pages (project `patterns`, git-connected to `main`) at **`patterns.isaa.ch`**. Build command `npm run build`, output dir `_site` (set in the Pages dashboard, since Pages build commands aren't configurable from the repo). Push to `main` and it rebuilds and deploys (~1 min). A failed build leaves the previous deploy live. Other branches get preview URLs, e.g. `https://<branch>.patterns-7ov.pages.dev`.

- URLs are directory-style (`/alignment-mirage/`); Pages 308-redirects `/alignment-mirage` to the slash form, so old links keep working.
- `404.html` is generated; there's no SPA fallback any more.
- The `phase-transition-debt` pattern file exists in `content/patterns/` but is intentionally unpublished (not in `index.json`), and nothing links to it. There's also a *different* copy in `drafts/`; reconcile before publishing. The build prints one `[patterns]` warning about an unresolved `[[Representational Parallax]]` link in that unpublished file; it is expected until the pattern is reconciled and published.

History: this was `pmp/` inside `hepwori/hepwori.github.io` (history preserved via `git subtree split`), served at `hepwori.github.io/pmp/` and, via a Cloudflare Worker, at `isaa.ch/patterns/`. See `~/Documents/projects/domain-audit/tracker.md` for the zone's history and the cutover.

## Status / next steps

- Live at `patterns.isaa.ch`. **`isaa.ch/patterns/*` now 301s here** via a Cloudflare Redirect Rule on the `isaa.ch` zone ("patterns to patterns.isaa.ch": wildcard `https://isaa.ch/patterns*` → `https://patterns.isaa.ch${1}`); redirect rules run before Workers routes, so the old `isaa-ch-patterns` Worker route (`isaa.ch/patterns*`) is now dead code. `hepwori.github.io/pmp/` is a redirect stub. There is no longer a second copy of the site anywhere.
- At the `isaa.ch` homepage cutover (see `~/Documents/projects/isaa.ch/CLAUDE.md`): delete the dead `/patterns*` Workers route and the `isaa-ch-patterns` Worker. The homepage repo's `_redirects` then also carries a `/patterns/*` 301, so the dashboard redirect rule becomes redundant and can be deleted. (The old Worker's source is in the `hepwori.github.io` git history, at `pmp/cloudflare-worker.js`, and in this repo's history.)
- Possible follow-ups: raw `.md` alongside each page for agents; JSON-LD; a per-pattern OG image.
- Content: the latest published pattern is Divergence Blindness (Nov 2026). **Next up is Tailwind Blindness**; its skeleton is `drafts/tailwind-blindness.md` and its handover (story, mechanism, overlap checks, questions to ask Isaac first) is in `drafts/scratchpad.md`, whose "State of play" table at the top lists every candidate. After that: Scaffolding Penalty, Altitude Distortion, Phase Transition Debt. `drafts/todo.md` is the short list.

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

Two build constraints:

- **Related Patterns bullets must each be a single line**, of the form `- [[Pattern Title]] — one-line reason`. The card builder reads one line per bullet, so a hard-wrapped bullet is cut off at the first line break.
- **`summary` should be short** (about ten words, one sentence, in the style of the existing ones) and identical in the frontmatter and in `index.json`. The contents page shows it on a card, and a long one makes the grid uneven.

## Wikilinks

Cross-references use `[[Pattern Title]]` syntax, turned into links at build time (case-insensitive match on the title in `index.json`). The build warns about any that don't resolve; fix them.

## Adding a new pattern

1. Create `content/patterns/<slug>.md`
2. Add entry to `content/index.json` under the appropriate category (this is what publishes it)
3. Update Related Patterns in other patterns that should reference the new one (one single-line bullet each, and unwrap the new pattern's own Related Patterns bullets if the draft was hard-wrapped)
4. `npm run build` and check for `[patterns]` warnings (only the expected phase-transition-debt one should remain), then look at the built page and its contents-page card

## Editorial voice

- Neutral and descriptive, not prescriptive or moral
- Patterns describe how things *tend* to work, not how they *should* work
- No TED Talk framing — direct, no emotional fanfare
- Short paragraphs, confident tone
- Known Uses are fables that resemble reality, not literal retellings of Isaac's stories. Keep the shape of the story; drop names, dates, quotes, and non-public details of employers or colleagues. Twitter-era organizational history is the exception Isaac is comfortable telling. When unsure, ask.
- Names have to work cold on the contents page: a PM scanning the list should get a sense of what the pattern is about. Keep to short noun phrases like the existing titles, and check a name's connotations against what the pattern is actually about (for example, "terrain" suggests difficulty, but Divergence Blindness is about a difference in kind).

## How patterns get made

The method is conversational. Isaac recalls a story from two decades of product work, Claude acts as thought partner, and the pattern is extracted from the story, so every pattern comes with a real instance behind it.

- Story first, then the recurring dynamic underneath it. Log raw stories in `drafts/scratchpad.md` as they arrive, before extracting, even if they will become separate patterns later.
- Before minting a pattern, check the published patterns and the scratchpad for overlap and say what you find. Prefer folding an idea into an existing pattern, or a Degeneration section, over a near-duplicate.
- Look for what makes it a pattern rather than a platitude (a timing asymmetry, a reinforcing loop, a difference in kind rather than degree) and state it.
- Be critical of Claude's own inferences. When a Force, example, or claim is inference rather than something Isaac said, flag it so Isaac can strike it. Don't invent specifics.
- Once a candidate has a name, give it `drafts/<slug>.md`. Drafts under review are hard-wrapped at about 80 columns so inline comments land on readable lines. Review happens as inline line comments; apply them literally and mention any judgment calls.
- Commit and push to the designated branch. Merging to `main` deploys the site, so do it only when Isaac says so (drafts-only changes don't affect the site).

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
- `drafts/todo.md` — the short list of what's next. The scratchpad opens with a "State of play" table of every candidate; keep it current.
- `drafts/work.md` — an old (April 2026) handoff kept for history; the scratchpad and this file are current
- When ready: move to `content/patterns/`, add to `index.json`, update cross-references
