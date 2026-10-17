import fs from 'node:fs';

// Content model: content/index.json lists published patterns (by category) and the
// two background pages; content/patterns/<slug>.md is each pattern.
const site = JSON.parse(fs.readFileSync('content/index.json', 'utf8'));
const titleToSlug = new Map();
for (const cat of site.categories) {
  for (const p of cat.patterns) titleToSlug.set(p.title.toLowerCase(), p.slug);
}

const RELATED_RE = /^## Related Patterns[ \t]*$/m;
const BULLET_RE = /^-\s*\[\[([^\]]+)\]\]\s*—\s*(.+)$/gm;

function slugFor(title) {
  return titleToSlug.get(title.trim().toLowerCase()) ?? null;
}

// [[Pattern Title]] → link to that pattern (build warns if the title doesn't resolve).
function wikilinks(md) {
  md.inline.ruler.before('link', 'wikilink', (state, silent) => {
    const { src, pos } = state;
    if (src.charCodeAt(pos) !== 0x5b || src.charCodeAt(pos + 1) !== 0x5b) return false;
    const end = src.indexOf(']]', pos + 2);
    if (end < 0) return false;
    const title = src.slice(pos + 2, end);
    if (!title || title.includes('\n')) return false;
    if (!silent) {
      const slug = slugFor(title);
      if (slug) {
        const open = state.push('link_open', 'a', 1);
        open.attrs = [['href', `/${slug}/`]];
      } else {
        console.warn(`[patterns] unresolved wikilink: [[${title}]]`);
        const open = state.push('html_inline', '', 0);
        open.content = '<span class="broken-link">';
      }
      const text = state.push('text', '', 0);
      text.content = title;
      if (slug) state.push('link_close', 'a', -1);
      else state.push('html_inline', '', 0).content = '</span>';
    }
    state.pos = end + 2;
    return true;
  });
}

// "## Related Patterns" bullets → the same card grid used on the contents page.
function relatedCards(content, inputPath) {
  const parts = content.split(RELATED_RE);
  if (parts.length < 2) return content;
  const cards = [];
  for (const [, title, summary] of parts[1].matchAll(BULLET_RE)) {
    const slug = slugFor(title);
    if (!slug) console.warn(`[patterns] ${inputPath}: unresolved related pattern [[${title}]]`);
    cards.push(
      slug
        ? `<a href="/${slug}/" class="toc-featured-pattern"><span class="toc-featured-title">${title}</span><span class="toc-featured-summary">${summary}</span></a>`
        : `<div class="toc-featured-pattern related-broken"><span class="toc-featured-title">${title}</span><span class="toc-featured-summary">${summary}</span></div>`
    );
  }
  if (!cards.length) return parts[0];
  return `${parts[0]}<!--related-->\n<section class="related-patterns">\n<h2>Related Patterns</h2>\n<div class="toc-featured-grid">${cards.join('')}</div>\n</section>\n`;
}

export default function (eleventyConfig) {
  eleventyConfig.amendLibrary('md', (md) => md.use(wikilinks));
  eleventyConfig.addPreprocessor('related-patterns', 'md', (data, content) =>
    data.page.inputPath.includes('/content/patterns/') ? relatedCards(content, data.page.inputPath) : content
  );
  // Pattern body vs. the related-patterns section (which lives outside .prose).
  eleventyConfig.addFilter('splitRelated', (html) => String(html).split('<!--related-->'));
  eleventyConfig.addPassthroughCopy({ static: '/' });

  return {
    markdownTemplateEngine: false,
    dir: { input: 'content', includes: '../layouts', data: '../data', output: '_site' },
  };
}
