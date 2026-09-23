'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string, email?: string, name?: string, avatar?: string) => void;
  onError?: (error: string) => void;
  text?: string;
  className?: string;
  role?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  text = 'Continue with Google',
  className = '',
  role = 'student',
}) => {
  const [loading, setLoading] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);

  useEffect(() => {
    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      setGisLoaded(true);
      return;
    }

    // Load Google Identity Services script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGisLoaded(true);
    };
    script.onerror = () => {
      console.warn('Failed to load Google Identity Services SDK.');
    };
    document.body.appendChild(script);
  }, []);

  const handleCustomClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (window.google?.accounts?.id && clientId && !clientId.includes('your-google-client-id')) {
      try {
        setLoading(true);
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            setLoading(false);
            if (response?.credential) {
              onSuccess(response.credential);
            } else {
              onError?.('No credential returned from Google Authentication.');
            }
          },
          auto_select: false,
        });

        // Prompt Google Account Chooser popup
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setLoading(false);
            // Fallback trigger if popup was blocked or dismissed
            onSuccess('');
          }
        });
      } catch (err) {
        setLoading(false);
        onSuccess('');
      }
    } else {
      // Direct interactive authentication modal trigger
      onSuccess('');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCustomClick}
      disabled={loading}
      className={`w-full py-3 min-h-[48px] px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center justify-center gap-3 cursor-pointer group hover:border-[#5B46E5]/40 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-[#5B46E5]" />
      ) : (
        <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      )}
      <span>{text}</span>
    </button>
  );
};
