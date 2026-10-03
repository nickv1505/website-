// Parses the course source files in content/courses/*.md.
//
// File format:
//   ---course            course metadata (key: value lines)
//   ---
//   ===module            one block per module (key: value lines)
//   ===
//   ...markdown lesson body...
//
// Each module currently has one lesson (the module's practical lesson). More
// lessons can be added per module later through the admin area.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

export const REQUIRED_SECTIONS = [
  'Goal',
  'Prerequisites',
  'Step-by-step instructions',
  'Tools and resources',
  'Practical example',
  'Expected costs',
  'How this earns revenue',
  'Common mistakes',
  'Action checklist',
  'Next steps',
];

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function parseFields(block) {
  const out = {};
  for (const raw of block.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const i = line.indexOf(':');
    if (i === -1) throw new Error(`Invalid metadata line: ${line}`);
    let value = line.slice(i + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    out[line.slice(0, i).trim()] = value;
  }
  return out;
}

export function parseCourseFile(source, fileName = 'course') {
  const text = source.replace(/\r\n/g, '\n');
  const head = text.match(/^---course\n([\s\S]*?)\n---\n/);
  if (!head) throw new Error(`${fileName}: missing ---course header`);
  const course = parseFields(head[1]);
  for (const key of ['slug', 'title', 'subtitle', 'category', 'icon', 'description']) {
    if (!course[key]) throw new Error(`${fileName}: course is missing "${key}"`);
  }
  if (!SLUG_RE.test(course.slug)) throw new Error(`${fileName}: invalid course slug`);

  const rest = text.slice(head[0].length);
  const parts = rest.split(/^===module\n/m).slice(1);
  const modules = parts.map((part, index) => {
    const end = part.indexOf('\n===\n');
    if (end === -1) throw new Error(`${fileName}: module ${index + 1} missing closing ===`);
    const meta = parseFields(part.slice(0, end));
    const body = part.slice(end + 5).trim();
    for (const key of ['title', 'slug', 'summary']) {
      if (!meta[key]) throw new Error(`${fileName}: module ${index + 1} missing "${key}"`);
    }
    if (!SLUG_RE.test(meta.slug)) throw new Error(`${fileName}: invalid slug "${meta.slug}"`);
    return {
      position: index + 1,
      title: meta.title,
      slug: meta.slug,
      summary: meta.summary,
      minutes: Number(meta.minutes || 20),
      preview: meta.preview === 'true',
      status: meta.status === 'draft' ? 'draft' : 'published',
      body,
    };
  });
  if (!modules.length) throw new Error(`${fileName}: no modules found`);
  return { ...course, modules };
}

export function loadCourses(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f, i) => ({ ...parseCourseFile(readFileSync(path.join(dir, f), 'utf8'), f), position: i + 1 }));
}

/** Returns the list of required "## " sections missing from a lesson body. */
export function missingSections(body) {
  const headings = new Set(
    [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim().toLowerCase())
  );
  return REQUIRED_SECTIONS.filter((s) => !headings.has(s.toLowerCase()));
}

/** Deterministic UUID so re-running the seed updates rows instead of duplicating. */
export function stableId(...parts) {
  const h = createHash('md5').update(parts.join(':')).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}
