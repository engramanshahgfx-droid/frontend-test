// app/proxy/moyasar-sdk/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://cdn.moyasar.com/mpf/1.14.0/moyasar.js', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Next.js)',
        Accept: 'application/javascript, text/javascript, */*;q=0.8',
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Moyasar SDK proxy fetch failed', res.status, body.slice(0, 500));
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch SDK', status: res.status }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const script = await res.text();
    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error proxying Moyasar SDK:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}