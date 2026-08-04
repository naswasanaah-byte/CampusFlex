'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { ShieldCheck, QrCode, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface DigitalWorkIDProps {
  user: User;
}

export const DigitalWorkID: React.FC<DigitalWorkIDProps> = ({ user }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState<string | null>(null);

  const studentIdNumber = `CF-STU-${user.id.slice(-6).toUpperCase()}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CampusFlex-VerifiedStudent-${user.id}`;

  const handleToggleClockIn = () => {
    if (clockedIn) {
      setClockedIn(false);
      setClockTime(null);
    } else {
      setClockedIn(true);
      setClockTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-primary-500/30 overflow-hidden group">

      {/* Background Holographic Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-all duration-500" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white block">CampusFlex</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-primary-300">Digital Student ID</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
        </div>
      </div>

      {/* Main Student Card Content */}
      <div className="my-6 flex items-center gap-5 relative z-10">
        <div className="relative">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary-400/50 shadow-lg"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold text-white truncate">
            {user.name}
          </h3>
          <p className="text-xs text-primary-300 font-semibold truncate mt-0.5">
            {user.department || 'Computer Science'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            {studentIdNumber}
          </p>
        </div>
      </div>

      {/* QR Code & Barcode Section */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between relative z-10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Attendance Scanner
          </span>
          <p className="text-xs text-slate-300 font-medium max-w-[170px] leading-tight">
            Scan at employer terminal to register shift attendance.
          </p>
        </div>
        <div className="p-1.5 bg-white rounded-xl shadow-md">
          <img src={qrCodeUrl} alt="Student QR Code" className="w-16 h-16 object-contain" />
        </div>
      </div>

      {/* Shift Clock-in Action Button */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
        <div className="text-[11px] text-slate-300">
          Status: {clockedIn ? <span className="font-bold text-emerald-400">Clocked In ({clockTime})</span> : <span className="text-slate-400">Not Shift Active</span>}
        </div>
        <button
          onClick={handleToggleClockIn}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            clockedIn
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          {clockedIn ? 'Clock Out' : 'Clock In'}
        </button>
      </div>

    </div>
  );
};
