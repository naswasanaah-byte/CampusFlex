import { NextResponse } from 'next/server';
import { MOCK_JOBS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({ success: true, count: MOCK_JOBS.length, jobs: MOCK_JOBS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newJob = {
      ...body,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString(),
      selectedEmployees: 0,
      status: 'AVAILABLE',
    };
    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid job format' }, { status: 400 });
  }
}
