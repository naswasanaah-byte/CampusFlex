'use client';

import React from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { SmartJobBadge } from './SmartJobBadge';
import { calculateAIMatch } from '@/lib/aiEngine';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import { MapPin, DollarSign, Sparkles, Bookmark, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApplyClick }) => {
  const { currentUser } = useAuthStore();
  const { savedJobIds, toggleSaveJob } = useJobStore();

  const isSaved = savedJobIds.includes(job.id);
  const isStudent = currentUser?.role === 'student';
  const isFilled = job.status === 'FILLED' || job.selectedEmployees >= job.requiredEmployees;

  // Compute AI Match score for current student profile
  const aiMatch = currentUser ? calculateAIMatch(currentUser, job) : { score: 85, reasons: ['Strong skills alignment'] };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass hover:shadow-2xl hover:border-primary-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">

      {/* Featured Ribbon Badge */}
      {job.featured && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-l from-primary-600 to-secondary-500 text-white text-[10px] uppercase font-black px-4 py-1 rounded-bl-2xl shadow-sm tracking-wider">
            ★ Featured
          </div>
        </div>
      )}

      <div>
        {/* Top Company & Save Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                {job.companyName}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </h4>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
              </span>
            </div>
          </div>

          {/* Bookmark Button */}
          {isStudent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveJob(job.id);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-300 dark:border-primary-800 text-primary-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
              }`}
              title="Bookmark Job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {job.title}
          </h3>
        </Link>

        {/* AI Match Pill */}
        {isStudent && (
          <div className="mt-2.5 p-2.5 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/40 dark:to-secondary-950/40 border border-primary-100 dark:border-primary-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-600 animate-pulse" />
              <span className="text-xs font-bold text-primary-700 dark:text-primary-300">
                {aiMatch.score}% Match
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              {aiMatch.reasons[0]}
            </span>
          </div>
        )}

        {/* Skill Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skillsRequired.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="px-2 py-1 rounded-xl text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400">
              +{job.skillsRequired.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metadata & CTA Row */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100">
            {formatCurrency(job.hourlyRate)}
            <span className="text-xs font-normal text-slate-500">/hr</span>
          </div>
          <div className="mt-1">
            <SmartJobBadge
              requiredEmployees={job.requiredEmployees}
              selectedEmployees={job.selectedEmployees}
              status={job.status}
              size="sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onApplyClick && !isFilled && (
            <button
              onClick={() => onApplyClick(job)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition-all"
            >
              Apply
            </button>
          )}
          <Link
            href={`/jobs/${job.id}`}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Job Details"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
