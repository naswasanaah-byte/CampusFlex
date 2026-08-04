'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Job } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { calculateAIMatch } from '@/lib/aiEngine';
import { Sparkles, FileText, Calendar, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose }) => {
  const { currentUser } = useAuthStore();
  const { applyForJob } = useApplicationStore();

  const [coverLetter, setCoverLetter] = useState(
    'I am excited to apply for this position! My academic background and flexible hours align perfectly with the role.'
  );
  const [availability, setAvailability] = useState('Mon/Wed/Fri afternoons (10-15 hrs/week)');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!job || !currentUser) return null;

  const aiMatch = calculateAIMatch(currentUser, job);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = applyForJob(
      job.id,
      job.title,
      job.companyName,
      currentUser.id,
      currentUser.name,
      currentUser.avatar || '',
      currentUser.email,
      currentUser.department || 'General Studies',
      coverLetter,
      availability,
      aiMatch.score,
      aiMatch.reasons
    );

    if (!success) {
      setError('You have already submitted an application for this position!');
      return;
    }

    setSubmitted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback if confetti canvas fails
    }

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${job.title}`}>
      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Application Submitted!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Your application and AI match profile have been sent directly to {job.companyName}. You can track status updates in your Application Timeline.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Job Overview Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company</h4>
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{job.companyName}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rate</span>
              <p className="text-sm font-black text-primary-600 dark:text-primary-400">${job.hourlyRate}/hr</p>
            </div>
          </div>

          {/* AI Match Score Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/60 dark:to-secondary-950/60 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary-600 animate-pulse" />
              <span className="text-xs font-bold text-primary-700 dark:text-primary-300">
                AI Compatibility Score: {aiMatch.score}% Match
              </span>
            </div>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pl-5 list-disc">
              {aiMatch.reasons.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Availability Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-600" /> Weekly Availability Schedule
            </label>
            <input
              type="text"
              required
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Mon/Wed 2-6pm, Sat mornings"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Cover Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary-600" /> Short Cover Note
            </label>
            <textarea
              required
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Briefly state your interest and relevant skills..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Resume Preview */}
          <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary-600" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  {currentUser.resumeUrl || 'alex_rivera_resume.pdf'}
                </span>
                <span className="text-[10px] text-slate-400">Attached from your student profile</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl shadow-lg hover:opacity-95 transition-opacity"
            >
              Submit Application
            </button>
          </div>

        </form>
      )}
    </Modal>
  );
};
