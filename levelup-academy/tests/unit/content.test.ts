import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { REQUIRED_SECTIONS, loadCourses, missingSections } from '../../scripts/lib/content.mjs';

type Mod = { slug: string; status: string; preview: boolean; body: string };
type C = { slug: string; title: string; modules: Mod[] };
const courses = loadCourses(path.join(__dirname, '../../content/courses')) as unknown as C[];

describe('course content', () => {
  it('contains all eight courses', () => {
    expect(courses.map((c) => c.slug)).toEqual([
      'making-money-with-ai',
      'freelancing-from-zero',
      'building-and-selling-websites',
      'dropshipping-and-ecommerce',
      'trading-and-investing-education',
      'content-creation-and-digital-products',
      'digital-marketing',
      'starting-an-online-business',
    ]);
  });

  for (const c of courses) {
    describe(c.title, () => {
      it('has exactly one free preview lesson', () => {
        expect(c.modules.filter((m) => m.preview)).toHaveLength(1);
      });
      for (const m of c.modules.filter((x) => x.status === 'published')) {
        it(`${m.slug} includes every required section and a checklist`, () => {
          expect(missingSections(m.body)).toEqual([]);
          expect(m.body).toMatch(/- \[ \]/);
          expect(m.body.split(/\s+/).length).toBeGreaterThan(200);
        });
      }
    });
  }

  it('lists the ten lesson sections', () => {
    expect(REQUIRED_SECTIONS).toHaveLength(10);
  });

  it('trading course carries risk warnings and makes no profit promises', () => {
    const trading = courses.find((c) => c.slug === 'trading-and-investing-education')!;
    for (const m of trading.modules) expect(m.body).toMatch(/Risk warning|risk/i);
    const all = trading.modules.map((m) => m.body).join('\n').toLowerCase();
    expect(all).toContain('not personalised financial');
    expect(all).toContain('leverage magnifies losses');
    // Any mention of guarantees must be a negation (e.g. "does not ... guaranteed income").
    for (const match of all.matchAll(/.{0,60}guarantee[sd]? (profit|returns|income)/g)) {
      expect(match[0]).toMatch(/not|no |never|doesn|claims|promis|scam|suspicion|if something/);
    }
  });
});
