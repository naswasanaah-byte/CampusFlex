'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { AIAdminEngine, AIAdminAuditLog } from '@/lib/aiAdmin';
import {
  ShieldCheck,
  Users,
  Briefcase,
  AlertTriangle,
  DollarSign,
  Cpu,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  Settings,
  Sparkles,
  Eye,
  Mail,
  Building2,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { EmployerVerificationModal } from '@/components/admin/EmployerVerificationModal';
import { User } from '@/types';

export default function AdminDashboard() {
  const { currentUser, usersList, verifyEmployer, toggleVerifyUser, toggleUserStatus } = useAuthStore();
  const { jobs, updateJob, deleteJob } = useJobStore();
  const { applications } = useApplicationStore();

  const [javaBackendOnline, setJavaBackendOnline] = useState<boolean | null>(null);
  const [javaStats, setJavaStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AIAdminAuditLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [reviewingEmployer, setReviewingEmployer] = useState<User | null>(null);

  // Fetch Java Backend Stats & Health
  const checkBackendHealth = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setJavaStats(data.stats);
        setJavaBackendOnline(true);
      } else {
        setJavaBackendOnline(false);
      }
    } catch (err) {
      setJavaBackendOnline(false);
    }

    try {
      const logRes = await fetch('/api/admin/ai-logs');
      if (logRes.ok) {
        const data = await logRes.json();
        setAuditLogs(data.logs || []);
      } else {
        setAuditLogs(AIAdminEngine.getLiveSystemLogs());
      }
    } catch (e) {
      setAuditLogs(AIAdminEngine.getLiveSystemLogs());
    }

    setTimeout(() => setIsRefreshing(false), 600);
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Metrics
  const students = usersList.filter((u) => u.role === 'student');
  const employers = usersList.filter((u) => u.role === 'employer');
  const pendingEmployers = employers.filter((u) => !u.verified);
  const activeJobs = jobs.filter((j) => j.status === 'AVAILABLE');
  const flaggedJobs = jobs.filter((j) => j.status === 'FLAGGED');

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-8 min-w-0">

        {/* Success Notification Toast */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Admin Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-purple-900/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-extrabold border border-purple-500/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                UNIVERSITY SUPER ADMIN
              </span>

              {/* Java 17 Backend Live Health Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] font-bold border border-slate-700">
                <span className={`w-2 h-2 rounded-full ${javaBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>Backend: {javaStats?.backendLanguage || 'Java 17 (Port 8080)'}</span>
              </div>

              {/* JDBC Subsystem Health Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] font-bold border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>JDBC: {javaStats?.jdbcStatus || 'Online (CampusFlexDriver)'}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Platform Command Center
            </h1>
            <p className="text-xs text-purple-200 max-w-xl">
              Real-time oversight for student part-time jobs, autonomous AI verification, employer credentials, and campus shift safety.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-purple-200 font-semibold">
              <span className="text-purple-300">Administrator:</span>
              <span className="text-white font-extrabold">{currentUser?.name || 'Administrator'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={checkBackendHealth}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
            <Link
              href="/admin/ai-governance"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-purple-200" />
              <span>AI Governance</span>
            </Link>
          </div>
        </div>

        {/* KPI Stats Grid - Fresh Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={students.length}
            subtitle="Registered university talent"
            icon={Users}
            trend="Active on campus"
          />
          <StatCard
            title="Registered Employers"
            value={employers.length}
            subtitle={`${pendingEmployers.length} pending verification`}
            icon={Briefcase}
            colorGradient="from-indigo-600 to-purple-600"
          />
          <StatCard
            title="Active Job Postings"
            value={activeJobs.length}
            subtitle={`${flaggedJobs.length} flagged for review`}
            icon={Activity}
            colorGradient="from-purple-600 to-pink-600"
          />
          <StatCard
            title="Shift Payouts Handled"
            value={javaStats?.totalShiftEarningsPaid !== undefined ? `₹${javaStats.totalShiftEarningsPaid.toLocaleString('en-IN')}` : '₹0'}
            subtitle="Platform escrow ready • 0 shifts"
            icon={DollarSign}
            colorGradient="from-emerald-600 to-teal-600"
          />
        </div>

        {/* Incoming Employer Registration Messages & Verification Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${pendingEmployers.length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Incoming Employer Registration Messages & Verification
                </h3>
                {pendingEmployers.length > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                    {pendingEmployers.length} Awaiting Verification
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                    All Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                When employers register in CampusFlex, their details appear here. The Super Admin must check their details and verify their account before they can enter the app to hire students.
              </p>
            </div>
            <Link href="/admin/users?tab=PENDING" className="text-xs font-bold text-purple-600 hover:underline">
              View Directory →
            </Link>
          </div>

          {pendingEmployers.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold">Queue Clear:</span>
                <span>All registered employers have been verified. No pending registration messages.</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                Active Gatekeeper
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingEmployers.map((emp) => (
                <div
                  key={emp.id}
                  className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/60 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.companyLogo || emp.avatar || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100'}
                          alt={emp.companyName || emp.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-300 dark:ring-amber-700 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            {emp.companyName || emp.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Recruiter: <strong className="text-slate-700 dark:text-slate-300">{emp.name}</strong> • {emp.email}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold shrink-0 animate-pulse">
                        Pending Entry
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-amber-100 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Registration Message to Admin</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">
                        &quot;New employer registered requesting platform access. Business Reg: <strong>{emp.businessRegistrationNumber || 'REG-PENDING'}</strong>. Please inspect credentials and verify to allow student hiring.&quot;
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 font-mono">
                        <span>Reg No: {emp.businessRegistrationNumber || 'REG-PENDING'}</span>
                        <span>{new Date(emp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-amber-200/40 dark:border-amber-800/40">
                    <span className="text-[10px] text-slate-400">
                      📍 {emp.location || 'Campus / Local Partner'}
                    </span>
                    <button
                      onClick={() => setReviewingEmployer(emp)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Check Details & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Command Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/users"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              User Directory & Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Audit students, recruiters, and toggle status or business verification flags.
            </p>
          </Link>

          <Link
            href="/admin/jobs"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Job Postings Moderation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Review active listings, inspect AI scam risk scores, and close completed shifts.
            </p>
          </Link>

          <Link
            href="/admin/settings"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Platform & Campus Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure allowed campus email domains, hourly rate caps, and commission %.
            </p>
          </Link>
        </div>

        {/* 2-Column Section: Pending Verifications & Live AI System Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pending Verifications Queue */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Employer Verification Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Review departments and corporate partners requesting hiring permissions.
                </p>
              </div>
              <Link href="/admin/users" className="text-xs font-bold text-purple-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {employers.slice(0, 3).map((emp) => (
                <div
                  key={emp.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={emp.companyLogo || emp.avatar || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100'}
                      alt={emp.companyName || emp.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {emp.companyName || emp.name}
                        </span>
                        {emp.verified ? (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {emp.email} • {emp.location || 'Campus Partner'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        toggleVerifyUser(emp.id);
                        showToast(`Updated verification status for ${emp.companyName || emp.name}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        emp.verified
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      {emp.verified ? 'Revoke' : 'Approve'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous AI Admin System Audit Logs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  Autonomous AI Governance Feed
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous AI fraud prevention, quota enforcement & match calibration.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold border border-purple-200 dark:border-purple-800">
                Confidence 99.4%
              </span>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        log.status === 'PASSED' ? 'bg-emerald-500' :
                        log.status === 'FLAGGED' ? 'bg-rose-500' : 'bg-purple-500'
                      }`} />
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {log.details}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>Target: <strong>{log.targetName}</strong></span>
                    <span>•</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                      {log.confidenceScore}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal: Check Employer Details & Verify */}
        <EmployerVerificationModal
          employer={reviewingEmployer}
          isOpen={!!reviewingEmployer}
          onClose={() => setReviewingEmployer(null)}
          onVerify={(employerId, allow) => {
            verifyEmployer(employerId, allow);
            showToast(allow
              ? `Verified ${reviewingEmployer?.companyName || 'Employer'}! Allowed entry into the app to recruit students.`
              : `Revoked entry for ${reviewingEmployer?.companyName || 'Employer'}.`
            );
          }}
        />

      </main>
    </div>
  );
}
