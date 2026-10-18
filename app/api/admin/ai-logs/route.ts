import { NextResponse } from 'next/server';
import { AIAdminEngine } from '@/lib/aiAdmin';

export async function GET() {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';
  
  try {
    const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/ai-logs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (javaRes.ok) {
      const data = await javaRes.json();
      return NextResponse.json(data);
    }
  } catch (err) {}

  const logs = AIAdminEngine.getLiveSystemLogs();
  return NextResponse.json({
    success: true,
    logs,
  });
}
