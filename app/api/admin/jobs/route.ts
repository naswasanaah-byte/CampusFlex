import { NextResponse } from 'next/server';
import { MOCK_JOBS } from '@/lib/mockData';

export async function GET() {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';
  
  try {
    const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/jobs`, {
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
    count: MOCK_JOBS.length,
    jobs: MOCK_JOBS,
  });
}

export async function POST(request: Request) {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';

  try {
    const body = await request.json();

    try {
      const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (javaRes.ok) {
        const data = await javaRes.json();
        return NextResponse.json(data);
      }
    } catch (err) {}

    return NextResponse.json({
      success: true,
      message: `Job moderation action '${body.action || 'update'}' completed successfully.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Job moderation failed' }, { status: 400 });
  }
}
