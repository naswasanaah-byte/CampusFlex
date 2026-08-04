'use client';

import React from 'react';
import { Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { JobStatus } from '@/types';

interface SmartJobBadgeProps {
  requiredEmployees: number;
  selectedEmployees: number;
  status: JobStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const SmartJobBadge: React.FC<SmartJobBadgeProps> = ({
  requiredEmployees,
  selectedEmployees,
  status,
  size = 'md',
}) => {
  const isFilled = status === 'FILLED' || selectedEmployees >= requiredEmployees;
  const remaining = Math.max(0, requiredEmployees - selectedEmployees);

  if (isFilled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>FILLED ({selectedEmployees}/{requiredEmployees})</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-xs shadow-sm">
      <Users className="w-3.5 h-3.5" />
      <span>
        Hiring ({selectedEmployees}/{requiredEmployees}) • <strong className="text-emerald-600 dark:text-emerald-400">{remaining} slot{remaining > 1 ? 's' : ''} left</strong>
      </span>
    </div>
  );
};
