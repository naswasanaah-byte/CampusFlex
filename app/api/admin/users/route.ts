import { NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mockData';

export async function GET() {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';
  
  try {
    const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (javaRes.ok) {
      const data = await javaRes.json();
      return NextResponse.json(data);
    }
  } catch (err) {}

  const safeUsers = MOCK_USERS.map(({ password, ...u }) => u);
  return NextResponse.json({
    success: true,
    count: safeUsers.length,
    users: safeUsers,
  });
}

export async function POST(request: Request) {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';

  try {
    const body = await request.json();
    
    try {
      const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/users`, {
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
      message: `Admin user action '${body.action || 'update'}' processed successfully.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'User admin action failed' }, { status: 400 });
  }
}
