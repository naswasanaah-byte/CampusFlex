import { NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({ success: true, users: MOCK_USERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email?.toLowerCase() || (role && u.role === role)
    );

    if (user) {
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: role || 'student',
        verified: true,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Auth failed' }, { status: 400 });
  }
}
