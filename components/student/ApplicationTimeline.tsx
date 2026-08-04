'use client';

import React from 'react';
import { Application, ApplicationStatus } from '@/types';
import { CheckCircle2, Clock, Calendar, Check, XCircle, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ApplicationTimelineProps {
  application: Application;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ application }) => {
  const steps: { key: ApplicationStatus | 'APPLIED'; label: string; icon: any }[] = [
    { key: 'APPLIED', label: 'Applied', icon: FileText },
    { key: 'UNDER_REVIEW', label: 'Under Review', icon: Clock },
    { key: 'INTERVIEW_SCHEDULED', label: 'Interview', icon: Calendar },
    { key: 'ACCEPTED', label: 'Hired / Accepted', icon: CheckCircle2 },
  ];

  const getStepStatus = (stepKey: string) => {
    if (application.status === 'REJECTED') {
      if (stepKey === 'APPLIED') return 'completed';
      return 'rejected';
    }

    const order = ['APPLIED', 'PENDING', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'ACCEPTED'];
    const currentIdx = order.indexOf(application.status);
    const stepIdx = order.indexOf(stepKey);

    if (currentIdx >= stepIdx) return 'completed';
    return 'pending';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            {application.jobTitle}
          </h4>
          <span className="text-xs font-semibold text-slate-500">
            {application.companyName} • Applied on {formatDate(application.appliedAt)}
          </span>
        </div>

        {/* Status Badge */}
        <div>
          {application.status === 'ACCEPTED' ? (
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs font-black">
              ✓ Hired Position
            </span>
          ) : application.status === 'REJECTED' ? (
            <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-bold">
              Position Closed / Filled
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/80 border border-primary-300 text-primary-600 dark:text-primary-400 text-xs font-bold">
              {application.status.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Rejection / Auto-close Alert */}
      {application.status === 'REJECTED' && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Application Status Notice</strong>
            <span>{application.rejectionReason || 'This position has been filled by the employer.'}</span>
          </div>
        </div>
      )}

      {/* Interview Date Alert */}
      {application.status === 'INTERVIEW_SCHEDULED' && application.interviewDate && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Upcoming Interview Scheduled!</strong>
            <span>Date: <strong>{application.interviewDate}</strong></span>
            {application.interviewLocation && <span className="block mt-0.5 text-[11px] opacity-90">Location: {application.interviewLocation}</span>}
          </div>
        </div>
      )}

      {/* Visual Timeline Steps */}
      <div className="pt-4">
        <div className="relative flex items-center justify-between">

          {/* Line behind steps */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 z-0" />

          {steps.map((step, idx) => {
            const status = getStepStatus(step.key);
            const Icon = step.icon;

            let circleStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700';
            if (status === 'completed') {
              circleStyle = 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md shadow-primary-500/20 border-transparent';
            } else if (status === 'rejected' && step.key !== 'APPLIED') {
              circleStyle = 'bg-rose-100 dark:bg-rose-950 text-rose-400 border-rose-300';
            }

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${circleStyle}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
