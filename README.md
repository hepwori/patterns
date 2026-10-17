# A Pattern Language for Product Management in Complex Organizations

A reference vocabulary for the dynamics that experienced PMs recognize but have never quite pulled into focus. An authored collection by [Isaac Hepworth](https://isaa.ch), published at **https://patterns.isaa.ch**.

## Layout

| path | what |
| --- | --- |
| `content/patterns/<slug>.md` | one pattern each (YAML front matter + Context / Problem / Forces / ... / Related Patterns) |
| `content/index.json` | the index: categories, summaries, featured list, background pages. **A pattern is published only if it's listed here.** |
| `content/introduction.md`, `content/about.md` | background pages |
| `layouts/`, `data/`, `eleventy.config.js` | Eleventy templates, data, `[[wikilink]]` + Related Patterns handling |
| `static/` | copied to the site root as-is (`style.css`, `nav.js`, icons, `robots.txt`) |
| `drafts/` | work in progress; never built or served |

Cross-references are written `[[Pattern Title]]` and become links at build time; the build warns about any that don't resolve.

## Working on it

```bash
npm install
npm start          # local server with live reload
npm run build      # writes the static site to _site/
```

Node version is in `.node-version`; Eleventy is pinned exactly in `package.json`.

**Add a pattern:** write `content/patterns/<slug>.md`, add it to `content/index.json` under a category, add it to the Related Patterns of any patterns that should point to it, then `npm run build` and check for `[patterns]` warnings.

## Deployment

Cloudflare Pages project `patterns`, git-connected to `main`: build command `npm run build`, output `_site`. A push to `main` goes live in about a minute; other branches get preview URLs (`https://<branch>.patterns-7ov.pages.dev`). The site is pre-rendered HTML, so it reads fine without JavaScript (`static/nav.js` only adds sidebar search and the mobile menu).

`isaa.ch/patterns/*` and `hepwori.github.io/pmp/` both redirect here.

## More

See [CLAUDE.md](CLAUDE.md) for editorial conventions, the pattern file format, and project history/status. This repo was split out of `hepwori/hepwori.github.io` (`pmp/`) with its history intact.
