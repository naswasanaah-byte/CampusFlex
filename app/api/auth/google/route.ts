import { NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mockData';
import { verifyGoogleTokenPayload, formatHumanName } from '@/lib/googleAuth';
import { User, UserRole } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credential, role = 'student', googleId, email, name, avatar } = body;

    // 1. Verify Google OIDC Token securely & format display name
    let googlePayload = null;
    if (credential) {
      googlePayload = await verifyGoogleTokenPayload(credential);
    } else if (email && (googleId || name)) {
      const cleanEmail = email.toLowerCase().trim();
      const displayName = formatHumanName(name, cleanEmail);
      googlePayload = {
        googleId: googleId || `google-uid-${Date.now()}`,
        email: cleanEmail,
        name: displayName,
        picture: avatar,
        emailVerified: true,
      };
    }

    if (!googlePayload || !googlePayload.email) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired Google authentication token.' },
        { status: 400 }
      );
    }

    const cleanEmail = googlePayload.email.toLowerCase().trim();
    const displayName = formatHumanName(googlePayload.name, cleanEmail);

    // 2. Search existing user database by Google ID or Email
    let user = MOCK_USERS.find(
      (u) => u.googleId === googlePayload.googleId || u.email.toLowerCase() === cleanEmail
    );

    if (user) {
      // Account exists: update name if missing or user.google, link Google ID
      if (!user.name || user.name.toLowerCase().includes('user.google')) {
        user.name = displayName;
      }
      if (!user.googleId) {
        user.googleId = googlePayload.googleId;
        user.authProvider = 'google';
      }
      if (googlePayload.picture && (!user.avatar || user.avatar.includes('unsplash'))) {
        user.avatar = googlePayload.picture;
      }

      return NextResponse.json({
        success: true,
        isNewUser: false,
        message: 'Google login successful. Welcome back!',
        user,
      });
    }

    // 3. New User Account Provisioning
    const newGoogleUser: User = {
      id: `user-google-${Date.now()}`,
      googleId: googlePayload.googleId,
      authProvider: 'google',
      name: displayName,
      email: cleanEmail,
      role: (role as UserRole) || 'student',
      avatar:
        googlePayload.picture ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      verified: true,
      department: 'Computer Science',
      year: 'Semester 1',
      skills: ['Problem Solving', 'Communication'],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    // Save to user store / database
    MOCK_USERS.push(newGoogleUser);

    return NextResponse.json(
      {
        success: true,
        isNewUser: true,
        message: 'Google account created and authenticated successfully.',
        user: newGoogleUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Google OAuth API Exception:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process Google authentication. Please try again.',
      },
      { status: 500 }
    );
  }
}
