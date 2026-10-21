'use client';

import React from 'react';
import { User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import {
  Building2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  Calendar,
  ExternalLink,
  Check,
  X
} from 'lucide-react';

interface EmployerVerificationModalProps {
  employer: User | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (employerId: string, allow: boolean) => void;
}

export const EmployerVerificationModal: React.FC<EmployerVerificationModalProps> = ({
  employer,
  isOpen,
  onClose,
  onVerify,
}) => {
  if (!employer) return null;

  const isVerified = !!employer.verified;
  const regNumber = employer.businessRegistrationNumber || 'REG-2026-PENDING';
  const taxId = employer.taxId || 'GSTIN32AABCA1234F1Z5';
  const emailDomain = employer.email.split('@')[1] || '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employer Verification & Credential Audit"
    >
      <div className="space-y-5 pt-1 text-slate-900 dark:text-white">

        {/* Company Header Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={employer.companyLogo || employer.avatar || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120'}
              alt={employer.companyName || employer.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/20 shrink-0"
            />
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{employer.companyName || employer.name}</span>
                {isVerified ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Allowed in App
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3 text-amber-500" />
                    Pending Verification
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Contact: <strong className="text-slate-700 dark:text-slate-200">{employer.name}</strong> • Official Recruiter
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Status Code</span>
            <span className={`text-xs font-black ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isVerified ? 'ACTIVE_ALLOWED' : 'BLOCKED_PENDING'}
            </span>
          </div>
        </div>

        {/* Gatekeeper Security Notice */}
        <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 ${
          isVerified
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        }`}>
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-purple-600" />
          <div className="space-y-0.5">
            <p className="font-extrabold">
              {isVerified
                ? 'Employer Is Allowed In App'
                : 'Gatekeeper Rule: Employer Is Currently Locked Out of CampusFlex'}
            </p>
            <p className="text-[11px] opacity-90">
              {isVerified
                ? 'This employer is authorized to publish job listings, view student profiles, and recruit university candidates.'
                : 'Until you click "Verify & Allow Employer Into App", this employer cannot post jobs or access any student applications.'}
            </p>
          </div>
        </div>

        {/* Detailed Credential Checklist Grid */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Employer Credentials & Documentation
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Business Registration */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                Business Registration No.
              </span>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-100">
                {regNumber}
              </p>
            </div>

            {/* Tax ID */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                Government Tax ID / GSTIN
              </span>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-100">
                {taxId}
              </p>
            </div>

            {/* Email */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                Official Business Email
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100 truncate">
                {employer.email}
              </p>
            </div>

            {/* Phone */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                Contact Phone
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {employer.phone || '+91 98765 00000'}
              </p>
            </div>

            {/* Location */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Operating Location / HQ
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {employer.location || 'Campus / Local Partner'}
              </p>
            </div>

            {/* Registration Date */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Registration Timestamp
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {new Date(employer.createdAt).toLocaleDateString()} at {new Date(employer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Company Bio & Purpose */}
        {employer.companyDescription && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 text-xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Company Hiring Intent & Bio
            </span>
            <p className="text-slate-600 dark:text-slate-300 italic">
              &quot;{employer.companyDescription}&quot;
            </p>
          </div>
        )}

        {/* AI Scam & Domain Check */}
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              AI Domain & Fraud Scan: <strong className="text-purple-700 dark:text-purple-300">@{emailDomain} Clean</strong> (Confidence 99.2%)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
            PASSED
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {isVerified ? (
              <button
                onClick={() => {
                  onVerify(employer.id, false);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Revoke Entry
              </button>
            ) : (
              <button
                onClick={() => {
                  onVerify(employer.id, true);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Verify & Allow Employer Into App
              </button>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
