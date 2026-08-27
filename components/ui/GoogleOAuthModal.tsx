'use client';

import React, { useState } from 'react';
import { GraduationCap, Mail, UserCheck, ShieldCheck, X } from 'lucide-react';
import { formatHumanName } from '@/lib/googleAuth';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string, avatar?: string) => void;
  role?: string;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  role = 'STUDENT',
}) => {
  const [googleEmail, setGoogleEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const email = googleEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }

    const cleanName = formatHumanName(fullName, email);
    onSelectAccount(email, cleanName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      
      {/* GOOGLE ACCOUNT CHOOSER DIALOG CONTAINER */}
      <div className="relative max-w-md w-full bg-[#18181A] border border-[#2B2B30] rounded-3xl shadow-2xl overflow-hidden text-slate-100 font-sans">
        
        {/* TOP BAR: Google Sign-In Branding */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2B2B30] bg-[#141416]">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-sm font-semibold text-slate-200">
              Sign in with Google
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DIALOG BODY */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* APP LOGO & HEADER */}
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#18181A] flex items-center justify-center shadow-lg mx-auto">
              <GraduationCap className="w-7 h-7 text-[#5B46E5]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Sign in with Google
              </h2>
              <p className="text-xs font-medium text-slate-400">
                to continue to <strong className="text-white">CampusFlex ({role.toUpperCase()})</strong>
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* GOOGLE ACCOUNT AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Google Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#111113] border border-[#333338] rounded-2xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5B46E5]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-4 py-3 bg-[#111113] border border-[#333338] rounded-2xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5B46E5]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-xs font-bold text-white bg-[#5B46E5] hover:bg-indigo-600 rounded-2xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authenticate Google Account
            </button>

          </form>

          {/* FOOTER NOTICE */}
          <p className="text-[11px] text-slate-500 text-center leading-relaxed pt-2 border-t border-[#2B2B30]">
            Before using CampusFlex, you can review our{' '}
            <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a> and{' '}
            <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>.
          </p>

        </div>

      </div>

    </div>
  );
};
