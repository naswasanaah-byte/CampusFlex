'use client';

import React, { useState } from 'react';
import { GraduationCap, User, UserPlus, ArrowRight, X } from 'lucide-react';
import { formatHumanName } from '@/lib/googleAuth';

interface GoogleAccount {
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  color?: string;
}

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string, avatar?: string) => void;
  role?: string;
}

const PRESET_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Avani SL',
    email: 'avanisl813@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    color: 'bg-amber-600',
  },
  {
    name: 'Avani. SL Avani. SL',
    email: 'avanislavani536@gmail.com',
    initials: 'A',
    color: 'bg-slate-700',
  },
  {
    name: 'kook kim',
    email: 'jkforthv45@gmail.com',
    initials: 'k',
    color: 'bg-emerald-700',
  },
  {
    name: 'akkudu ava',
    email: 'akkuduava@gmail.com',
    initials: 'a',
    color: 'bg-slate-600',
  },
  {
    name: 'Devi Krishna T C',
    email: 'devikrishnatc44@gmail.com',
    initials: 'D',
    color: 'bg-blue-600',
  },
  {
    name: 'Naswa',
    email: 'fathimanaswakk@gmail.com',
    initials: 'N',
    color: 'bg-emerald-600',
  },
  {
    name: 'Naswa',
    email: 'naswasanaah@gmail.com',
    initials: 'N',
    color: 'bg-teal-600',
  },
  {
    name: 'Akshaya R S',
    email: 'akshayars0920@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    color: 'bg-[#5B46E5]',
  },
];

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  role = 'STUDENT',
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail.trim()) {
      const email = customEmail.trim();
      const cleanName = formatHumanName(undefined, email);
      onSelectAccount(email, cleanName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      
      {/* GOOGLE ACCOUNT CHOOSER DIALOG CONTAINER */}
      <div className="relative max-w-lg w-full bg-[#18181A] border border-[#2B2B30] rounded-3xl shadow-2xl overflow-hidden text-slate-100 font-sans">
        
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
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#18181A] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-[#5B46E5]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
                Choose an account
              </h2>
              <p className="text-sm font-medium text-slate-400">
                to continue to <strong className="text-white">CampusFlex</strong>
              </p>
            </div>
          </div>

          {/* ACCOUNTS LIST */}
          <div className="divide-y divide-[#2B2B30] border-t border-b border-[#2B2B30] max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
            {PRESET_GOOGLE_ACCOUNTS.map((acc, idx) => (
              <button
                key={idx}
                onClick={() => onSelectAccount(acc.email, acc.name, acc.avatar)}
                className="w-full py-3.5 px-2 flex items-center gap-3.5 hover:bg-[#252529] transition-colors text-left group cursor-pointer"
              >
                {/* Account Avatar or Initials Circle */}
                {acc.avatar ? (
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                  />
                ) : (
                  <div
                    className={`w-9 h-9 rounded-full ${acc.color || 'bg-slate-700'} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {acc.initials || acc.name[0]}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-100 group-hover:text-white truncate">
                    {acc.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {acc.email}
                  </div>
                </div>
              </button>
            ))}

            {/* USE ANOTHER ACCOUNT BUTTON */}
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="w-full py-3.5 px-2 flex items-center gap-3.5 hover:bg-[#252529] transition-colors text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#2A2A2E] text-slate-300 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                Use another account
              </div>
            </button>
          </div>

          {/* CUSTOM GOOGLE EMAIL INPUT FORM */}
          {showCustomInput && (
            <form onSubmit={handleCustomSubmit} className="space-y-2 p-3 rounded-2xl bg-[#222226] border border-[#333338]">
              <label className="text-xs font-semibold text-slate-300 block">
                Enter custom Google Account Email:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="flex-1 px-3.5 py-2.5 bg-[#161618] border border-[#3B3B42] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#5B46E5]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#5B46E5] hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {/* FOOTER NOTICE */}
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Before using this app, you can review CampusFlex's{' '}
            <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a> and{' '}
            <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>.
          </p>

        </div>

      </div>

    </div>
  );
};
