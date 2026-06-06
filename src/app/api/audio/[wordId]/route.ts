import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ wordId: string }> },
) {
  const { wordId } = await params;

  if (!wordId || typeof wordId !== 'string') {
    return NextResponse.json({ error: 'wordId is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ar&q=${encodeURIComponent(wordId)}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!response.ok) {
      throw new Error(`TTS API responded with ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'CDN-Cache-Control': 'public, s-maxage=86400',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 },
    );
  }
}
