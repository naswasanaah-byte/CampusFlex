'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { exportToCSV } from '@/lib/utils';
import { Building2, ShieldCheck, Download, Check, X } from 'lucide-react';

export default function AdminEmployersPage() {
  const { usersList, toggleVerifyEmployer, toggleUserStatus } = useAuthStore();

  const employers = usersList.filter((u) => u.role === 'employer');

  const handleExportCSV = () => {
    exportToCSV('campusflex_employers_directory.csv', employers);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Employer Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Employer Verification Center ({employers.length})
            </h1>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Company & Contact</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {employers.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {emp.companyName || emp.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{emp.email}</div>
                    </td>
                    <td className="p-3.5">{emp.location || 'Campus Center'}</td>
                    <td className="p-3.5">{emp.phone || 'N/A'}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          emp.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {emp.verified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleVerifyEmployer(emp.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          emp.verified
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        {emp.verified ? 'Revoke' : 'Approve & Verify'}
                      </button>
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
