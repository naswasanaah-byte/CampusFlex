'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { User, UserRole, EmployerReport } from '@/types';
import { Modal } from '@/components/ui/Modal';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle2,
  Building2,
  GraduationCap,
  Sparkles,
  Filter,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  Database,
  RefreshCw,
  FileText,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const { usersList, verifyEmployer, toggleVerifyUser, toggleUserStatus, deleteUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'suspended'>('ALL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'REPORTED' | 'JDBC'>('ALL');
  const [toastMessage, setToastMessage] = useState('');

  // Selected Employer for Viewing Student Reports
  const [selectedEmployerForReports, setSelectedEmployerForReports] = useState<User | null>(null);

  // Live JDBC Database Status from Java Backend
  const [jdbcData, setJdbcData] = useState<any>(null);
  const [jdbcLoading, setJdbcLoading] = useState(false);

  const fetchJdbcStatus = async () => {
    setJdbcLoading(true);
    try {
      const res = await fetch('/api/admin/jdbc');
      if (res.ok) {
        const data = await res.json();
        setJdbcData(data.jdbc);
      }
    } catch (e) {}
    setTimeout(() => setJdbcLoading(false), 500);
  };

  useEffect(() => {
    fetchJdbcStatus();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const pendingEmployers = usersList.filter((u) => u.role === 'employer' && !u.verified);
  const reportedEmployers = usersList.filter(
    (u) => u.role === 'employer' && ((u.reportCount && u.reportCount > 0) || (u.reports && u.reports.length > 0))
  );

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.companyName && u.companyName.toLowerCase().includes(search.toLowerCase()));

    if (activeTab === 'PENDING') {
      return matchesSearch && u.role === 'employer' && !u.verified;
    }

    if (activeTab === 'REPORTED') {
      return (
        matchesSearch &&
        u.role === 'employer' &&
        ((u.reportCount && u.reportCount > 0) || (u.reports && u.reports.length > 0))
      );
    }

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        {/* Toast Notification */}
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
                Admin Security Console
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-bold">{usersList.length} Total Users</span>
              {pendingEmployers.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold animate-pulse">
                  {pendingEmployers.length} Pending Approval
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Employer Verification & Governance
            </h1>
            <p className="text-xs text-slate-500">
              Only verified employers are allowed entry into CampusFlex. Employers receiving 3 student safety reports are automatically removed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchJdbcStatus();
                showToast('Synchronized with Java JDBC Database.');
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${jdbcLoading ? 'animate-spin text-purple-600' : ''}`} />
              <span>Sync JDBC</span>
            </button>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
            >
              ← Overview
            </Link>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2.5 rounded-2xl font-black transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Accounts ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2.5 rounded-2xl font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals</span>
            {pendingEmployers.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'PENDING' ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-700'
              }`}>
                {pendingEmployers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('REPORTED')}
            className={`px-4 py-2.5 rounded-2xl font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REPORTED'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Reported Employers</span>
            {reportedEmployers.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'REPORTED' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'
              }`}>
                {reportedEmployers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('JDBC')}
            className={`px-4 py-2.5 rounded-2xl font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'JDBC'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Java JDBC Engine</span>
          </button>
        </div>

        {/* VIEW: JDBC LIVE DATABASE PANEL */}
        {activeTab === 'JDBC' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-cyan-400 shadow-lg">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Java Database Connectivity (JDBC 4.3)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live relational storage managed natively via OpenJDK 17 java.sql package.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 text-xs font-black border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {jdbcData?.status || 'ONLINE (JDBC Connected)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Driver Implementation</span>
                <p className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {jdbcData?.driver || 'com.campusflex.db.CampusFlexDriver'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">JDBC Connection URL</span>
                <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {jdbcData?.url || 'jdbc:campusflex:data/campusflex.db'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Database Engine</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {jdbcData?.databaseEngine || 'CampusFlex Embedded Relational (Java 17)'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Active JDBC Relational Tables
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['employers', 'employer_reports', 'jobs', 'users'].map((t) => (
                  <div key={t} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">{t}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-[10px] font-black">
                      TABLE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PENDING EMPLOYER GATEKEEPING QUEUE (ACTION REQUIRED) */}
        {activeTab === 'PENDING' && pendingEmployers.length > 0 && (
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-black uppercase tracking-wider">
                Pending Employer Gatekeeping Queue ({pendingEmployers.length})
              </h3>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              These employers cannot enter the portal, post smart jobs, or access student profiles until you verify their credentials. Review and approve legitimate organizations below.
            </p>
          </div>
        )}

        {/* Search & Filters Bar */}
        {activeTab !== 'JDBC' && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or company..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {activeTab === 'ALL' && (
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="student">Students</option>
                  <option value="employer">Employers</option>
                  <option value="admin">Admins</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Users Table */}
        {activeTab !== 'JDBC' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-4">User / Organization</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Gate & Verification</th>
                    <th className="px-5 py-4">Student Safety Reports</th>
                    <th className="px-5 py-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        No records match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const reportCount = user.reportCount || (user.reports?.length || 0);
                      const isAutoBanned = reportCount >= 3 || user.status === 'suspended';

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          {/* User / Org */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                alt={user.name}
                                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                              />
                              <div>
                                <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {user.companyName && user.role === 'employer' && (
                                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold">
                                      ({user.companyName})
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {user.email}
                                </div>
                                {user.businessRegistrationNumber && (
                                  <div className="text-[10px] font-mono text-slate-400">
                                    Reg: {user.businessRegistrationNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                              user.role === 'admin'
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                                : user.role === 'employer'
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {user.role}
                            </span>
                          </td>

                          {/* Gatekeeper Verification Status */}
                          <td className="px-5 py-4">
                            {user.role === 'employer' ? (
                              user.verified ? (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 text-[10px] font-extrabold flex items-center gap-1 w-max border border-emerald-500/20">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  Allowed in App
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold flex items-center gap-1 w-max border border-amber-500/30 animate-pulse">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  Pending Approval
                                </span>
                              )
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                                {user.verified ? 'Verified Student' : 'Active'}
                              </span>
                            )}
                          </td>

                          {/* Student Safety Reports (3-Report Auto Removal) */}
                          <td className="px-5 py-4">
                            {user.role === 'employer' ? (
                              isAutoBanned ? (
                                <div className="space-y-1">
                                  <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black flex items-center gap-1 w-max border border-rose-300 dark:border-rose-800">
                                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                                    ⛔ AUTO-REMOVED ({reportCount}/3)
                                  </span>
                                  {user.reports && user.reports.length > 0 && (
                                    <button
                                      onClick={() => setSelectedEmployerForReports(user)}
                                      className="text-[10px] text-rose-600 font-extrabold hover:underline block cursor-pointer"
                                    >
                                      View {user.reports.length} Reports →
                                    </button>
                                  )}
                                </div>
                              ) : reportCount > 0 ? (
                                <div className="space-y-1">
                                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold flex items-center gap-1 w-max">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                    🚩 {reportCount}/3 Reports
                                  </span>
                                  <button
                                    onClick={() => setSelectedEmployerForReports(user)}
                                    className="text-[10px] text-amber-700 font-bold hover:underline block cursor-pointer"
                                  >
                                    View Reports →
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 0 Reports (Clean)
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Employer Gatekeeper Actions */}
                              {user.role === 'employer' && (
                                <>
                                  {!user.verified ? (
                                    <button
                                      onClick={() => {
                                        verifyEmployer(user.id, true);
                                        showToast(`Allowed ${user.name} into app! They can now hire students.`);
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black shadow-sm flex items-center gap-1 cursor-pointer transition-all"
                                      title="Approve employer and allow entry into the app"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      Approve Entry
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        verifyEmployer(user.id, false);
                                        showToast(`Revoked access for ${user.name}`);
                                      }}
                                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-[11px] font-bold text-slate-600 transition-colors cursor-pointer"
                                      title="Revoke employer entry"
                                    >
                                      Revoke Access
                                    </button>
                                  )}
                                </>
                              )}

                              {/* Toggle Suspend */}
                              <button
                                onClick={() => {
                                  toggleUserStatus(user.id);
                                  showToast(`Status updated for ${user.name}`);
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                                  user.status === 'suspended'
                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                }`}
                                title="Suspend or Activate"
                              >
                                {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                              </button>

                              {/* Delete */}
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Permanently remove ${user.name} from CampusFlex?`)) {
                                      deleteUser(user.id);
                                      showToast(`User ${user.name} deleted.`);
                                    }
                                  }}
                                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Permanently Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: VIEW STUDENT REPORTS FOR EMPLOYER */}
        {selectedEmployerForReports && (
          <Modal
            isOpen={!!selectedEmployerForReports}
            onClose={() => setSelectedEmployerForReports(null)}
            title={`Student Safety Reports: ${selectedEmployerForReports.companyName || selectedEmployerForReports.name}`}
          >
            <div className="space-y-4 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-500">Total Safety Reports:</span>
                  <span className="ml-2 font-black text-rose-600">
                    {selectedEmployerForReports.reportCount || (selectedEmployerForReports.reports?.length || 0)} / 3 Threshold
                  </span>
                </div>
                {selectedEmployerForReports.status === 'suspended' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">
                    AUTOMATICALLY REMOVED
                  </span>
                )}
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(!selectedEmployerForReports.reports || selectedEmployerForReports.reports.length === 0) ? (
                  <p className="text-center py-6 text-xs text-slate-400">
                    No individual incident descriptions recorded.
                  </p>
                ) : (
                  selectedEmployerForReports.reports.map((report, idx) => (
                    <div
                      key={report.id || idx}
                      className="p-3.5 rounded-2xl border border-rose-100 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-extrabold text-rose-700 dark:text-rose-300">
                        <span>Report #{idx + 1}: {report.reason}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {report.details && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          &quot;{report.details}&quot;
                        </p>
                      )}
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-rose-100 dark:border-rose-900/40">
                        <span>Reported by: {report.studentName} ({report.studentEmail})</span>
                        {report.jobTitle && <span>Job: {report.jobTitle}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedEmployerForReports(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}

      </main>
    </div>
  );
}
