'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { AIAdminEngine, AIAdminAuditLog } from '@/lib/aiAdmin';
import {
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Zap,
  Lock,
  Search,
  Scan,
  RefreshCw,
  Server
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAIGovernancePage() {
  const [logs, setLogs] = useState<AIAdminAuditLog[]>(AIAdminEngine.getLiveSystemLogs());
  const [testText, setTestText] = useState('');
  const [scanResult, setScanResult] = useState<{ isSafe: boolean; scamRiskScore: number; flags: string[] } | null>(null);

  const handleTestScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testText.trim()) return;

    const res = AIAdminEngine.scanJobPosting({
      title: testText,
      description: testText,
      hourlyRate: 50,
    });
    setScanResult(res);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-purple-900/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-extrabold border border-purple-500/40 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                AUTONOMOUS AI OVERSIGHT
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                JAVA 17 ENGINE ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              AI Governance & Fraud Prevention
            </h1>
            <p className="text-xs text-purple-200 max-w-xl">
              Real-time heuristic scanning for student safety: blocks off-platform payment scams, enforces smart hiring quotas, and auto-verifies campus domains.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all text-center self-start sm:self-auto"
          >
            ← Back to Overview
          </Link>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Overall AI Confidence</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              99.4%
            </div>
            <p className="text-[11px] text-slate-400">
              Fresh launch state • Continuous real-time scans active.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Scam Postings Blocked</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
              0
            </div>
            <p className="text-[11px] text-slate-400">
              Suspicious wire/crypto/telegram terms caught automatically. 0 at launch.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Smart-Close Enforcements</span>
              <Lock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
              0
            </div>
            <p className="text-[11px] text-slate-400">
              Hiring quotas reached; candidates auto-notified. 0 shifts closed yet.
            </p>
          </div>
        </div>

        {/* Interactive Real-Time AI Scanner Tool */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Scan className="w-4 h-4 text-purple-600" />
              Live AI Scam & Keyword Diagnostic Scanner
            </h3>
            <p className="text-xs text-slate-500">
              Test any job title or employer posting description against the AI security heuristics.
            </p>
          </div>

          <form onSubmit={handleTestScan} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="e.g. Work from home online, wire transfer payment via telegram..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all shrink-0"
            >
              Scan with AI
            </button>
          </form>

          {scanResult && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              scanResult.isSafe
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            }`}>
              <div className="flex items-center justify-between font-extrabold">
                <span className="flex items-center gap-1.5">
                  {scanResult.isSafe ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  Analysis Result: {scanResult.isSafe ? 'SAFE LISTING' : 'FLAGGED - SUSPICIOUS CONTENT'}
                </span>
                <span>Scam Risk Score: {scanResult.scamRiskScore}%</span>
              </div>
              {scanResult.flags.length > 0 && (
                <div className="font-medium text-[11px] pt-1">
                  Detected Violations: {scanResult.flags.join(' • ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* System Audit Logs Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-600" />
                Live System Audit & Enforcement Logs
              </h3>
              <p className="text-xs text-slate-500">
                Synchronized with Java Backend & AI Governance Engine.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="py-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      log.status === 'PASSED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                      log.status === 'FLAGGED' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                      'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    }`}>
                      {log.status}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {log.details}
                </p>
                <div className="text-[10px] text-slate-400">
                  Target: <strong>{log.targetName}</strong> • AI Confidence: <strong className="text-purple-600 dark:text-purple-400">{log.confidenceScore}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
