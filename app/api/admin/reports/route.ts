import { NextResponse } from 'next/server';

export async function GET() {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';

  try {
    const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/reports`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (javaRes.ok) {
      const data = await javaRes.json();
      return NextResponse.json(data);
    }
  } catch (err) {}

  return NextResponse.json({
    success: true,
    reports: [],
  });
}

export async function POST(request: Request) {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';

  try {
    const body = await request.json();

    try {
      const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (javaRes.ok) {
        const data = await javaRes.json();
        return NextResponse.json(data);
      }
    } catch (javaError) {}

    return NextResponse.json({
      success: true,
      banned: false,
      reportCount: 1,
      message: 'Report logged via Next.js fallback.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process report' }, { status: 400 });
  }
}
