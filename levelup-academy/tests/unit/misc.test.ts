import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { toEmbedUrl } from '@/components/course/video-player';

describe('toEmbedUrl', () => {
  it('converts YouTube and Vimeo links', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=abc123')).toBe('https://www.youtube-nocookie.com/embed/abc123');
    expect(toEmbedUrl('https://youtu.be/abc123')).toBe('https://www.youtube-nocookie.com/embed/abc123');
    expect(toEmbedUrl('https://vimeo.com/76979871')).toBe('https://player.vimeo.com/video/76979871');
  });
  it('returns null for direct files so a <video> tag is used', () => {
    expect(toEmbedUrl('https://cdn.example.com/lesson.mp4')).toBeNull();
    expect(toEmbedUrl('not a url')).toBeNull();
  });
});

describe('safeNext', () => {
  it('only allows same-site relative paths', async () => {
    const { safeNext } = await import('@/lib/auth');
    expect(safeNext('/dashboard')).toBe('/dashboard');
    expect(safeNext('/courses/x?y=1')).toBe('/courses/x?y=1');
    expect(safeNext('https://evil.com')).toBe('/dashboard');
    expect(safeNext('//evil.com')).toBe('/dashboard');
    expect(safeNext('/\\evil.com')).toBe('/dashboard');
    expect(safeNext(undefined, '/x')).toBe('/x');
  });
});
