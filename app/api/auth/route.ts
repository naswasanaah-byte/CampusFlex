import { NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mockData';

const sanitizeUser = (user: any) => {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
};

export async function GET() {
  const safeUsers = MOCK_USERS.map(sanitizeUser);
  return NextResponse.json({ success: true, users: safeUsers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    const cleanEmail = email ? email.toLowerCase().trim() : '';

    if (role === 'admin') {
      const isAuthorized =
        cleanEmail === 'avanislavanisl536@gmail.com' || cleanEmail === 'avanislavanisl536';
      if (!isAuthorized) {
        return NextResponse.json({ success: false, error: 'Unauthorized administrator access' }, { status: 403 });
      }
    }

    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (user) {
      return NextResponse.json({ success: true, user: sanitizeUser(user) });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: `user-${Date.now()}`,
        name: cleanEmail ? cleanEmail.split('@')[0] : 'User',
        email: cleanEmail,
        role: role || 'student',
        verified: true,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Auth failed' }, { status: 400 });
  }
}
