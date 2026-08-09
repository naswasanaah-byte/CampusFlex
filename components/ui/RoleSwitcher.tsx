'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { User, Building2, ShieldCheck } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useAuthStore();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'student', label: 'Student', icon: <User className="w-3.5 h-3.5" />, color: 'bg-primary-600 text-white shadow-sm' },
    { role: 'employer', label: 'Employer', icon: <Building2 className="w-3.5 h-3.5" />, color: 'bg-indigo-600 text-white shadow-sm' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
      <span className="text-xs font-semibold px-2 text-slate-500 dark:text-slate-400 hidden sm:inline-block">
        Demo Mode:
      </span>
      {roles.map(({ role, label, icon, color }) => {
        const isActive = currentUser?.role === role;
        return (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              isActive
                ? color
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
