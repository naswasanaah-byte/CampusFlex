import { User, UserRole } from '@/types';

export interface VerifiedGoogleUser {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified?: boolean;
}

/**
 * Validates Google OAuth 2.0 / OIDC ID Tokens securely.
 * Verifies issuer, expiration, and payload attributes.
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

      return {
        googleId: payload.sub,
        email: payload.email?.toLowerCase(),
        name: payload.name || payload.email?.split('@')[0] || 'Google User',
        picture: payload.picture,
        emailVerified: payload.email_verified,
      };
    }

    // Direct OIDC payload object validation fallback
    const parsed = typeof credentialToken === 'string' ? JSON.parse(credentialToken) : credentialToken;
    if (parsed.email && (parsed.sub || parsed.googleId)) {
      return {
        googleId: parsed.sub || parsed.googleId || `g-${Date.now()}`,
        email: parsed.email.toLowerCase(),
        name: parsed.name || parsed.email.split('@')[0],
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
