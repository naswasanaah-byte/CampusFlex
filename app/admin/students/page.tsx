'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { exportToCSV } from '@/lib/utils';
import { Users, Download, ShieldCheck, UserX, UserCheck } from 'lucide-react';

export default function AdminStudentsPage() {
  const { usersList, toggleUserStatus } = useAuthStore();

  const students = usersList.filter((u) => u.role === 'student');

  const handleExportCSV = () => {
    exportToCSV('campusflex_students_directory.csv', students);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Student Directory
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Registered Students ({students.length})
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
                  <th className="p-3.5 rounded-l-xl">Student Name</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">GPA</th>
                  <th className="p-3.5">Account Status</th>
                  <th className="p-3.5 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{stu.name}</div>
                        <div className="text-[11px] text-slate-400">{stu.email}</div>
                      </div>
                    </td>
                    <td className="p-3.5">{stu.department || 'Computer Science'}</td>
                    <td className="p-3.5 font-bold text-emerald-600">{stu.gpa || 3.8}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          stu.status === 'suspended' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {stu.status === 'suspended' ? 'SUSPENDED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleUserStatus(stu.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          stu.status === 'suspended'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                        }`}
                      >
                        {stu.status === 'suspended' ? 'Unsuspend' : 'Suspend Account'}
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
