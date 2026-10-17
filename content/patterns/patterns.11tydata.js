// Only patterns listed in content/index.json are published (that's the "make it appear"
// switch, same as before); unlisted files are treated as drafts and produce no page.
export default {
  layout: 'pattern.njk',
  eleventyComputed: {
    permalink: (data) => (data.site.bySlug[data.page.fileSlug] ? `/${data.page.fileSlug}/` : false),
    description: (data) => data.site.bySlug[data.page.fileSlug]?.summary,
  },
};
