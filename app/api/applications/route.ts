import { NextResponse } from 'next/server';
import { MOCK_APPLICATIONS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({ success: true, count: MOCK_APPLICATIONS.length, applications: MOCK_APPLICATIONS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newApp = {
      ...body,
      id: `app-${Date.now()}`,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, application: newApp }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Application error' }, { status: 400 });
  }
}
