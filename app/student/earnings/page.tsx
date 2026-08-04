'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MOCK_EARNINGS } from '@/lib/mockData';
import { exportToCSV, formatCurrency } from '@/lib/utils';
import { DollarSign, Download, CheckCircle2, Clock, Calculator } from 'lucide-react';

export default function EarningsPage() {
  const totalEarned = MOCK_EARNINGS.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalHours = MOCK_EARNINGS.reduce((acc, curr) => acc + curr.hoursWorked, 0);

  const handleExportCSV = () => {
    exportToCSV('campusflex_student_earnings.csv', MOCK_EARNINGS);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
              Financial Tracker
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Part-Time Earnings & Payouts
            </h1>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV Report
          </button>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-glass">
            <span className="text-xs font-semibold text-slate-500">Total Income Earned</span>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(totalEarned)}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-glass">
            <span className="text-xs font-semibold text-slate-500">Total Shift Hours</span>
            <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {totalHours} hrs
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-glass">
            <span className="text-xs font-semibold text-slate-500">Average Pay Rate</span>
            <p className="text-3xl font-black text-primary-600 dark:text-primary-400 mt-1">
              $21.35/hr
            </p>
          </div>
        </div>

        {/* Earnings History Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4 overflow-hidden">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Shift Payout History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Job & Company</th>
                  <th className="p-3.5">Hours</th>
                  <th className="p-3.5">Rate</th>
                  <th className="p-3.5">Total Pay</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {MOCK_EARNINGS.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{row.jobTitle}</div>
                      <div className="text-[11px] text-slate-400">{row.companyName}</div>
                    </td>
                    <td className="p-3.5">{row.hoursWorked} hrs</td>
                    <td className="p-3.5">${row.hourlyRate}/hr</td>
                    <td className="p-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                      {formatCurrency(row.totalAmount)}
                    </td>
                    <td className="p-3.5 text-slate-500">{row.date}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          row.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
