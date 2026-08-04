'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useJobStore } from '@/store/useJobStore';
import { Users, Sparkles, CheckCircle2, XCircle, Calendar, MessageSquare, FileText, Check } from 'lucide-react';
import Link from 'next/link';

export default function ApplicantsPage() {
  const { applications, acceptApplication, rejectApplication, scheduleInterview } = useApplicationStore();
  const { jobs } = useJobStore();

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('2026-08-10 at 2:00 PM');
  const [interviewLocation, setInterviewLocation] = useState('Innovation Lab Room 204');

  const handleAccept = (appId: string) => {
    acceptApplication(appId);
  };

  const handleReject = (appId: string) => {
    rejectApplication(appId, 'Application reviewed. Thank you for your interest.');
  };

  const handleOpenInterview = (appId: string) => {
    setSelectedAppId(appId);
    setIsInterviewModalOpen(true);
  };

  const handleConfirmInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAppId) {
      scheduleInterview(selectedAppId, interviewDate, interviewLocation);
      setIsInterviewModalOpen(false);
    }
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Candidate Evaluation
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Applicant Match Center ({applications.length})
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Review AI scores, schedule interviews, or accept candidates to fill job slots.
            </p>
          </div>
          <Users className="w-8 h-8 text-indigo-400" />
        </div>

        {/* Applicants List Grid */}
        <div className="space-y-6">
          {applications.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            const isFilled = job?.status === 'FILLED';

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4"
              >

                {/* Candidate Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.studentAvatar}
                      alt={app.studentName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-500/20 shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                        {app.studentName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Applied for <strong className="text-slate-800 dark:text-slate-200">{app.jobTitle}</strong> • {app.studentDepartment}
                      </p>
                    </div>
                  </div>

                  {/* AI Match Badge & Status Pill */}
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-300 border border-primary-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> {app.matchPercentage}% AI Match
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        app.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-700'
                          : app.status === 'INTERVIEW_SCHEDULED'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Cover Note & Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">Cover Note:</span>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{app.coverLetter}"</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">Availability Schedule:</span>
                    <p className="text-slate-600 dark:text-slate-400">{app.availability}</p>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href="/employer/messages"
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-primary-600" /> Direct Message
                    </Link>
                    <button
                      onClick={() => handleOpenInterview(app.id)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-bold border border-indigo-200 flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                    </button>
                  </div>

                  {/* Accept / Reject Buttons */}
                  {app.status !== 'ACCEPTED' && app.status !== 'REJECTED' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(app.id)}
                        className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 rounded-xl border border-rose-200"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAccept(app.id)}
                        className="px-5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-md hover:opacity-95 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Accept & Fill Slot
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Schedule Interview Modal */}
        <Modal
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          title="Schedule Candidate Interview"
        >
          <form onSubmit={handleConfirmInterview} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Interview Date & Time
              </label>
              <input
                type="text"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                placeholder="e.g. Aug 12, 2026 at 2:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Location or Video Call Link
              </label>
              <input
                type="text"
                required
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
                placeholder="e.g. Innovation Lab Room 204 or Zoom Link"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsInterviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-md"
              >
                Send Interview Invite
              </button>
            </div>
          </form>
        </Modal>

      </main>
    </div>
  );
}
