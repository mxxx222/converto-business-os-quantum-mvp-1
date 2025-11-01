import { NextRequest, NextResponse } from 'next/server';

/**
 * Plausible Analytics - Server-side tracking endpoint
 * Tracks events server-side (bypasses ad blockers)
 */

const PLAUSIBLE_API_KEY = process.env.PLAUSIBLE_API_KEY;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'converto.fi';
const PLAUSIBLE_API_URL = 'https://plausible.io/api/event';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, props, revenue, url } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Event name required' },
        { status: 400 }
      );
    }

    // Build Plausible event payload
    const payload = {
      name,
      domain: PLAUSIBLE_DOMAIN,
      url: url || 'https://converto.fi',
      props: {
        ...props,
        ...(revenue && { revenue }),
      },
    };

    // Send to Plausible API
    const response = await fetch(PLAUSIBLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'Converto Analytics',
        ...(PLAUSIBLE_API_KEY && {
          'Authorization': `Bearer ${PLAUSIBLE_API_KEY}`,
        }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Plausible API error:', error);
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Plausible tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Proxy Stats API requests
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('site_id') || PLAUSIBLE_DOMAIN;
    const period = searchParams.get('period') || '30d';
    const metrics = searchParams.get('metrics') || 'visitors,pageviews';

    if (!PLAUSIBLE_API_KEY) {
      return NextResponse.json(
        { error: 'Plausible API key not configured' },
        { status: 500 }
      );
    }

    // Fetch stats from Plausible Stats API
    const statsUrl = `https://plausible.io/api/v1/stats/aggregate?site_id=${siteId}&period=${period}&metrics=${metrics}`;
    
    const response = await fetch(statsUrl, {
      headers: {
        'Authorization': `Bearer ${PLAUSIBLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Plausible Stats API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Plausible stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

