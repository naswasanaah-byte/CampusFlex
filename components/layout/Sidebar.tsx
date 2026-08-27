'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Calendar,
  Star,
  LogOut,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { formatHumanName } from '@/lib/googleAuth';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();

  if (!currentUser) return null;

  const role = currentUser.role;

  const studentLinks = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/student/profile', icon: User },
    { label: 'My Timetable', href: '/student/saved', icon: Calendar },
    { label: 'Find Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Applied Jobs', href: '/student/applications', icon: Clock },
    { label: 'Earnings', href: '/student/earnings', icon: DollarSign },
    { label: 'Ratings', href: '/student/profile', icon: Star },
    { label: 'Settings', href: '/student/settings', icon: Settings },
  ];

  const employerLinks = [
    { label: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
    { label: 'Post Job', href: '/employer/post-job', icon: PlusCircle },
    { label: 'My Jobs', href: '/employer/jobs', icon: Briefcase },
    { label: 'Applicants', href: '/employer/applicants', icon: Users },
    { label: 'Messages', href: '/employer/messages', icon: MessageSquare },
    { label: 'Profile', href: '/employer/profile', icon: Building2 },
    { label: 'Settings', href: '/student/settings', icon: Settings },
  ];

  const links = role === 'employer' ? employerLinks : studentLinks;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 shrink-0 hidden md:block select-none">
      <div className="sticky top-20 bg-[#1E1B4B] text-white rounded-3xl p-5 shadow-2xl space-y-6 border border-indigo-900/50">

        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            CampusFlex
          </span>
        </Link>

        {/* Student Avatar Card & Profile Completion Bar */}
        {(() => {
          const completion = (currentUser.skills && currentUser.skills.length > 0) ? 80 : 35;
          return (
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-400/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-white truncate">
                    {formatHumanName(currentUser.name, currentUser.email)}
                  </h4>
                  <p className="text-[11px] text-indigo-200 truncate">
                    {currentUser.department || 'Student'} • {currentUser.year || 'Member'}
                  </p>
                </div>
              </div>

              {/* Profile Completion Bar */}
              <div className="space-y-1 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-200">
                  <span>Profile Completion</span>
                  <span className="text-indigo-300">{completion}%</span>
                </div>
                <div className="w-full h-1.5 bg-indigo-950/80 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${completion}%` }}
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Navigation Links (Matching Mockup Sidebar) */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-300'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-indigo-200 hover:bg-rose-500/20 hover:text-rose-300 transition-all duration-200 cursor-pointer pt-2"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </nav>

      </div>
    </aside>
  );
};
