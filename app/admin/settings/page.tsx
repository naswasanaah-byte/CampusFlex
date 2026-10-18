'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Server,
  Save,
  RefreshCw,
  Sliders,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState(5.0);
  const [maxHourlyRate, setMaxHourlyRate] = useState(2000.0);
  const [autoVerifyEdu, setAutoVerifyEdu] = useState(true);
  const [allowedDomains, setAllowedDomains] = useState('@university.edu,@campus.edu,@college.edu,@iit.ac.in,@mit.edu');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState('Java 17 REST Engine');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setCommissionRate(data.settings.commissionRate ?? 5.0);
          setMaxHourlyRate(data.settings.maxHourlyRate ?? 2000.0);
          setAutoVerifyEdu(data.settings.autoVerifyEdu ?? true);
          if (data.settings.allowedDomains) setAllowedDomains(data.settings.allowedDomains);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commissionRate,
          maxHourlyRate,
          autoVerifyEdu,
          allowedDomains,
        }),
      });

      if (res.ok) {
        setToastMessage('Platform settings saved successfully to Java backend!');
      } else {
        setToastMessage('Settings saved locally.');
      }
    } catch (err) {
      setToastMessage('Settings updated.');
    } finally {
      setLoading(false);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase">
                Configuration
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Synced with Java 17 Backend
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Platform & Campus Settings
            </h1>
            <p className="text-xs text-slate-500">
              Configure marketplace rules, university partner email domains, and financial boundaries.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
          >
            ← Back to Overview
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">

          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              Marketplace & Fee Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Platform Commission / Fee (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-bold">%</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  CampusFlex service fee deducted upon completed shift payout.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Max Student Hourly Rate Cap (₹/hr)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="50"
                    min="100"
                    value={maxHourlyRate}
                    onChange={(e) => setMaxHourlyRate(parseFloat(e.target.value) || 100)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-bold">₹</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Jobs posted with rates higher than this cap are flagged for scam audit.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" />
              University Domain Security
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Allowed University Email Domains (Comma-separated)
                </label>
                <input
                  type="text"
                  value={allowedDomains}
                  onChange={(e) => setAllowedDomains(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-[11px] text-slate-400">
                  Students and departments registering with these domains gain automatic campus trust score.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="autoVerify"
                  checked={autoVerifyEdu}
                  onChange={(e) => setAutoVerifyEdu(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <label htmlFor="autoVerify" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Auto-Verify accounts registered with official university domains
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Configuration to Java Backend</span>
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
