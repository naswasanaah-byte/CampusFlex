'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Send,
  Building2,
  Info
} from 'lucide-react';

interface ReportEmployerModalProps {
  isOpen: boolean;
  onClose: () => void;
  employerId: string;
  employerName: string;
  jobId?: string;
  jobTitle?: string;
}

const REPORT_REASONS = [
  'Unpaid Wages / Delayed Payment Discrepancy',
  'Misleading Shift Hours or Work Requirements',
  'Unsafe / Unprofessional Workplace Environment',
  'Off-Platform Payment or Suspicious Wire Request',
  'Discriminatory or Harassing Workplace Conduct',
  'Fake Job / Scam Listing Violation',
];

export const ReportEmployerModal: React.FC<ReportEmployerModalProps> = ({
  isOpen,
  onClose,
  employerId,
  employerName,
  jobId,
  jobTitle,
}) => {
  const { currentUser, reportEmployer } = useAuthStore();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ text: string; banned: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);

    const res = reportEmployer(
      employerId,
      currentUser.id,
      currentUser.name,
      currentUser.email,
      reason,
      details,
      jobId,
      jobTitle
    );

    // Also forward report to Java Backend REST service
    try {
      await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerId,
          studentId: currentUser.id,
          studentName: currentUser.name,
          reason,
          details,
          jobId,
        }),
      });
    } catch (e) {}

    setIsSubmitting(false);
    setResultMessage({ text: res.message, banned: res.banned });

    setTimeout(() => {
      setResultMessage(null);
      setDetails('');
      onClose();
    }, 2800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Employer for Review">
      <div className="space-y-4 pt-1">

        {/* 3-Report Safety Threshold Notice */}
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 space-y-1">
          <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>CampusFlex 3-Report Safety Policy</span>
          </div>
          <p className="leading-relaxed">
            Student workplace safety is our highest priority. If an employer receives <strong>3 verified student reports</strong>, their account and all active job postings will be <strong>automatically removed</strong> from CampusFlex.
          </p>
        </div>

        {/* Employer Context */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="font-semibold">Reporting Organization:</span>
          <span className="font-extrabold text-slate-900 dark:text-white truncate">{employerName}</span>
          {jobTitle && <span className="text-[11px] text-slate-400">({jobTitle})</span>}
        </div>

        {/* Submission Confirmation Alert */}
        {resultMessage ? (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-start gap-2.5 animate-in fade-in ${
              resultMessage.banned
                ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-400 text-rose-900 dark:text-rose-100'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            {resultMessage.banned ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-black text-sm mb-0.5">
                {resultMessage.banned ? '🚨 Automated Employer Removal Triggered!' : 'Report Successfully Recorded'}
              </p>
              <p className="text-[11px] font-normal leading-relaxed">{resultMessage.text}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Primary Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Details & Incident Evidence (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Explain what occurred during shift, messaging, or interview..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Submitting...' : 'Submit Student Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
