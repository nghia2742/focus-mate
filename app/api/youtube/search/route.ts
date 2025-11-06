import { NextRequest, NextResponse } from 'next/server';

const YT_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') ?? '';
        const maxResults = Number(searchParams.get('max')) || 10;

        if (!q.trim()) {
            return NextResponse.json({ items: [] });
        }

        const key = process.env.YOUTUBE_API_KEY;
        if (!key) {
            return NextResponse.json(
                { error: 'Missing YOUTUBE_API_KEY' },
                { status: 500 }
            );
        }

        const url = new URL(YT_SEARCH_URL);
        url.searchParams.set('part', 'snippet');
        url.searchParams.set('type', 'video');
        url.searchParams.set(
            'maxResults',
            String(Math.max(1, Math.min(25, maxResults)))
        );
        url.searchParams.set('q', q);
        url.searchParams.set('key', key);

        const r = await fetch(url.toString());
        if (!r.ok) {
            const text = await r.text();
            return NextResponse.json(
                { error: 'Upstream error', details: text },
                { status: 502 }
            );
        }

        const data = await r.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = (data?.items ?? []).map((it: any) => ({
            id: it?.id?.videoId,
            title: it?.snippet?.title,
            channel: it?.snippet?.channelTitle,
            thumbnail:
                it?.snippet?.thumbnails?.medium?.url ||
                it?.snippet?.thumbnails?.default?.url ||
                null,
        }));

        return NextResponse.json({ items });
    } catch (err) {
        return NextResponse.json(
            { error: 'Unexpected error', details: String(err) },
            { status: 500 }
        );
    }
}
