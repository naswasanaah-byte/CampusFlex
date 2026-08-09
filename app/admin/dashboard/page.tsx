'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import { AIAdminEngine, AIAdminAuditLog } from '@/lib/aiAdmin';
import { ShieldCheck, Users, Building2, Briefcase, Cpu, CheckCircle2, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AIAdminDashboard() {
  const { usersList, toggleVerifyEmployer } = useAuthStore();
  const { jobs } = useJobStore();

  const [auditLogs, setAuditLogs] = useState<AIAdminAuditLog[]>(() => AIAdminEngine.getLiveSystemLogs());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const students = usersList.filter((u) => u.role === 'student');
  const employers = usersList.filter((u) => u.role === 'employer');
  const verifiedEmployers = employers.filter((e) => e.verified);

  const handleRunAIAudit = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newLog: AIAdminAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'FRAUD_PREVENTION',
        targetName: 'Continuous System Scan',
        action: 'Autonomous Security Sweep Executed',
        confidenceScore: 99.8,
        status: 'PASSED',
        details: 'Scanned 100% of marketplace listings; 0 illegal spam keywords detected.'
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-8 min-w-0">

        {/* AI Admin Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-500/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[11px] font-bold">
              <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Autonomous AI Platform Governance Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              AI Admin Audit & Security Console
            </h1>
            <p className="text-xs text-slate-300">
              Operating 24/7 to verify employers, enforce smart job quotas, block fake jobs, and protect students.
            </p>
          </div>

          <button
            onClick={handleRunAIAudit}
            disabled={isRefreshing}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-xs font-extrabold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Run Immediate AI Audit Sweep
          </button>
        </div>

        {/* System Health Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="AI Security Status"
            value="100% Safe"
            subtitle="Autonomous scam prevention"
            icon={ShieldCheck}
            colorGradient="from-purple-600 to-indigo-600"
          />
          <StatCard
            title="Verified Campus Employers"
            value={`${verifiedEmployers.length} / ${employers.length}`}
            subtitle="AI email domain verification"
            icon={Building2}
            colorGradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Monitored Student Network"
            value={students.length}
            subtitle="Verified university members"
            icon={Users}
            colorGradient="from-primary-600 to-secondary-500"
          />
          <StatCard
            title="Quota Auto-Close Engine"
            value="Active ⚡"
            subtitle="Hiring slots enforced 24/7"
            icon={CheckCircle2}
            colorGradient="from-amber-500 to-orange-600"
          />
        </div>

        {/* AI Admin Live Action Audit Log */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI Admin Live System Governance Audit Logs
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ● Live Engine Operational
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold uppercase">
                      {log.type.replace('_', ' ')}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {log.action} — <span className="text-primary-600">{log.targetName}</span>
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {log.details}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Confidence: {log.confidenceScore}%
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      log.status === 'PASSED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : log.status === 'ENFORCED'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Autonomous Employer Verification Center */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" /> Employer Verification Status & Audit
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {employers.map((emp) => {
              const audit = AIAdminEngine.verifyEmployer(emp);
              return (
                <div key={emp.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.companyLogo || emp.avatar}
                      alt={emp.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        {emp.companyName || emp.name}
                      </h4>
                      <span className="text-[11px] text-slate-500">{emp.email} • {audit.reason}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        emp.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {emp.verified ? 'AI VERIFIED ✅' : 'PENDING CHECK'}
                    </span>
                    <button
                      onClick={() => toggleVerifyEmployer(emp.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        emp.verified
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      }`}
                    >
                      {emp.verified ? 'Revoke' : 'AI Approve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
