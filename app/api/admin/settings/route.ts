import { NextResponse } from 'next/server';

let localSettings = {
  commissionRate: 5.0,
  autoVerifyEdu: true,
  maxHourlyRate: 2000.0,
  allowedDomains: '@university.edu,@campus.edu,@college.edu,@iit.ac.in,@mit.edu',
};

export async function GET() {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';
  
  try {
    const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/settings`, {
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
    settings: localSettings,
  });
}

export async function POST(request: Request) {
  const javaPort = process.env.JAVA_BACKEND_PORT || '8080';

  try {
    const body = await request.json();
    localSettings = { ...localSettings, ...body };

    try {
      const javaRes = await fetch(`http://127.0.0.1:${javaPort}/api/admin/settings`, {
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
      message: 'Platform settings saved successfully.',
      settings: localSettings,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Saving settings failed' }, { status: 400 });
  }
}
