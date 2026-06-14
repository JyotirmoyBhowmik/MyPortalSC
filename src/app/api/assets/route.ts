import { NextRequest, NextResponse } from 'next/server';

/**
 * Asset Proxy Route
 * 
 * Proxies requests to Supabase Storage so that raw Supabase URLs
 * are never exposed to visitors. Instead of:
 *   https://cqtluudfmigefqphmfbb.supabase.co/storage/v1/object/public/project-assets/...
 * 
 * The frontend serves:
 *   /api/assets?path=projects/documents/filename.pdf
 * 
 * This hides the Supabase project ID and bucket structure from end users.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const BUCKET_NAME = 'project-assets';

export async function GET(req: NextRequest) {
    const path = req.nextUrl.searchParams.get('path');

    if (!path) {
        return NextResponse.json({ error: 'Missing "path" parameter' }, { status: 400 });
    }

    // Sanitize: prevent path traversal
    const sanitized = path.replace(/\.\./g, '').replace(/\/\//g, '/');
    const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${sanitized}`;

    try {
        const upstream = await fetch(storageUrl, {
            cache: 'force-cache'
        });

        if (!upstream.ok) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
        const body = await upstream.arrayBuffer();

        return new NextResponse(body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error) {
        console.error('Asset proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 });
    }
}
