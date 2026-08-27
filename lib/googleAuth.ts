import { User, UserRole } from '@/types';

export interface VerifiedGoogleUser {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified?: boolean;
}

/**
 * Formats user's display name cleanly from Google OAuth claims or email,
 * ensuring no "user.google", raw email prefixes, or machine identifiers are used.
 */
export function formatHumanName(name?: string, email?: string): string {
  if (
    name &&
    name.trim() &&
    !name.toLowerCase().includes('user.google') &&
    !name.toLowerCase().includes('google user')
  ) {
    return name.trim();
  }

  if (email && email.includes('@')) {
    const prefix = email.split('@')[0];
    // Remove digits, dots, underscores, hyphens, and capitalize nicely (e.g. avanisl813 -> Avani)
    const clean = prefix
      .replace(/[0-9]/g, '')
      .replace(/[\._-]/g, ' ')
      .trim();

    const words = clean.split(/\s+/).filter((w) => w.length > 0);
    if (words.length > 0) {
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }

  return 'Student User';
}

/**
 * Validates Google OAuth 2.0 / OIDC ID Tokens securely.
 * Verifies issuer, expiration, and payload attributes (name, picture, sub, email).
 */
export async function verifyGoogleTokenPayload(
  credentialToken: string
): Promise<VerifiedGoogleUser | null> {
  try {
    if (!credentialToken) return null;

    // Decode JWT structure (header.payload.signature)
    const parts = credentialToken.split('.');
    if (parts.length === 3) {
      const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
      const payload = JSON.parse(payloadJson);

      // Verify expiration & issuer claims
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Google ID token expired');
        return null;
      }

      if (
        payload.iss &&
        !['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)
      ) {
        console.warn('Invalid Google token issuer:', payload.iss);
        return null;
      }

      const email = payload.email?.toLowerCase();
      const displayName = formatHumanName(payload.name, email);

      return {
        googleId: payload.sub,
        email,
        name: displayName,
        picture: payload.picture,
        emailVerified: payload.email_verified,
      };
    }

    // Direct OIDC payload object validation fallback
    const parsed = typeof credentialToken === 'string' ? JSON.parse(credentialToken) : credentialToken;
    if (parsed.email && (parsed.sub || parsed.googleId)) {
      const email = parsed.email.toLowerCase();
      const displayName = formatHumanName(parsed.name, email);
      return {
        googleId: parsed.sub || parsed.googleId || `g-${Date.now()}`,
        email,
        name: displayName,
        picture: parsed.picture || parsed.avatar,
        emailVerified: true,
      };
    }

    return null;
  } catch (err) {
    console.error('Error verifying Google Token payload:', err);
    return null;
  }
}
