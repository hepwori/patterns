import fs from 'node:fs';

// Everything the templates need from content/index.json, plus a flat reading order.
const index = JSON.parse(fs.readFileSync('content/index.json', 'utf8'));

const bySlug = {};
const flat = [];
for (const cat of index.categories) {
  for (const p of cat.patterns) {
    const entry = { ...p, n: flat.length, category: { id: cat.id, title: cat.title } };
    bySlug[p.slug] = entry;
    flat.push(entry);
  }
}

export default { ...index, bySlug, flat, origin: 'https://patterns.isaa.ch' };
