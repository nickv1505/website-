import { ImageResponse } from 'next/og';

import { offer, site } from '@/config/site';

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(circle at 80% 0%, rgba(61,252,143,.18), transparent 50%), #070809',
          color: '#f4f5f6',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 600 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#14171b', border: '1px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3dfc8f' }}>
            ⌃
          </div>
          <div style={{ display: 'flex' }}>{site.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>Your Next Income Stream</div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, color: '#3dfc8f' }}>Starts Here.</div>
        </div>
        <div style={{ fontSize: 28, color: '#9ba1a8' }}>
          {`AI · Freelancing · Websites · E-commerce · Marketing · ${offer.priceLabelLong} lifetime access`}
        </div>
      </div>
    ),
    size
  );
}
