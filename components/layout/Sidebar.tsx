'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  Briefcase,
  User,
  Clock,
  Bookmark,
  DollarSign,
  Settings,
  PlusCircle,
  Users,
  MessageSquare,
  Building2,
  ShieldCheck,
  BarChart3,
  QrCode,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = useAuthStore();

  if (!currentUser) return null;

  const role = currentUser.role;

  const studentLinks = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Find Jobs', href: '/jobs', icon: Briefcase },
    { label: 'My Applications', href: '/student/applications', icon: Clock },
    { label: 'Digital Work ID', href: '/student/profile', icon: QrCode },
    { label: 'Saved Jobs', href: '/student/saved', icon: Bookmark },
    { label: 'Earnings & Payouts', href: '/student/earnings', icon: DollarSign },
    { label: 'Settings', href: '/student/settings', icon: Settings },
  ];

  const employerLinks = [
    { label: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
    { label: 'Post New Job', href: '/employer/post-job', icon: PlusCircle },
    { label: 'Applicants Hub', href: '/employer/applicants', icon: Users },
    { label: 'My Job Postings', href: '/employer/jobs', icon: Briefcase },
    { label: 'Student Messages', href: '/employer/messages', icon: MessageSquare },
    { label: 'Company Profile', href: '/employer/profile', icon: Building2 },
  ];

  const adminLinks = [
    { label: 'Platform Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employer Verification', href: '/admin/employers', icon: ShieldCheck },
    { label: 'Manage Students', href: '/admin/students', icon: Users },
    { label: 'Job Moderation', href: '/admin/jobs', icon: Briefcase },
    { label: 'Analytics Reports', href: '/admin/analytics', icon: BarChart3 },
  ];

  const links = role === 'employer' ? employerLinks : role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 shadow-glass">

        {/* User Card Header */}
        <div className="p-3 mb-4 rounded-2xl bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-800/60 dark:to-primary-950/20 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || currentUser.companyLogo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-500/20"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-primary-600 dark:text-primary-400 capitalize font-medium flex items-center gap-1">
                {currentUser.verified && <ShieldCheck className="w-3 h-3 text-emerald-500 inline" />}
                {currentUser.role} Account
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md shadow-primary-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* AI Assistant Banner Box */}
        <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
            CampusFlex AI Active
          </div>
          <p className="text-[11px] opacity-90 leading-relaxed">
            Automated slot monitoring and job recommendations are enabled.
          </p>
        </div>

      </div>
    </aside>
  );
};
