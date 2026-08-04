'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { exportToCSV } from '@/lib/utils';
import { BarChart3, Download, TrendingUp, Users, CheckCircle2, DollarSign } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const analyticsSummary = [
    { metric: 'Total Student Applicants', value: '450+', change: '+18% MoM' },
    { metric: 'Average Time to Fill Slot', value: '3.2 Days', change: '-24% faster' },
    { metric: 'Total Student Earnings Paid', value: '$45,820', change: '+32% volume' },
    { metric: 'Smart Auto-Close Trigger Count', value: '84 Jobs', change: '100% quota precision' },
  ];

  const handleExportCSV = () => {
    exportToCSV('campusflex_platform_analytics.csv', analyticsSummary);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Data Insights
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Platform Analytics & Reports
            </h1>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export Full Analytics CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analyticsSummary.map((item, idx) => (
            <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-glass space-y-2">
              <span className="text-xs font-semibold text-slate-500">{item.metric}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{item.value}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Fill Rate Progress Card */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-glass space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Marketplace Hiring Efficiency Rate
          </h3>
          <p className="text-xs text-slate-500">
            92% of all part-time job postings hit their required candidate quota within 5 days of publication.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Overall Quota Fill Efficiency</span>
              <span className="text-emerald-600 font-extrabold">92%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-600 via-secondary-500 to-emerald-500 w-[92%]" />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
