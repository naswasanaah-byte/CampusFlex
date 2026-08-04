'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                CampusFlex
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Smart Jobs. Flexible Future. Connecting university students with verified part-time campus and remote opportunities.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Verified University Employers
            </div>
          </div>

          {/* Student Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              For Students
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/jobs" className="hover:text-primary-600 transition-colors">Find Part-Time Jobs</Link></li>
              <li><Link href="/student/profile" className="hover:text-primary-600 transition-colors">Digital Work ID & QR</Link></li>
              <li><Link href="/student/earnings" className="hover:text-primary-600 transition-colors">Earnings & Payouts</Link></li>
              <li><Link href="/student/applications" className="hover:text-primary-600 transition-colors">Application Status</Link></li>
            </ul>
          </div>

          {/* Employer Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              For Employers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/employer/post-job" className="hover:text-primary-600 transition-colors">Post Smart Job</Link></li>
              <li><Link href="/employer/applicants" className="hover:text-primary-600 transition-colors">Applicant Match Center</Link></li>
              <li><Link href="/employer/profile" className="hover:text-primary-600 transition-colors">Employer Verification</Link></li>
              <li><Link href="/employer/messages" className="hover:text-primary-600 transition-colors">Live Candidate Chat</Link></li>
            </ul>
          </div>

          {/* Vercel & SaaS Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Deployment & Platform
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Production-ready web application built for instant zero-config Vercel deployment.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span>Ready for</span>
              <span className="font-extrabold text-slate-900 dark:text-white">▲ Vercel</span>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CampusFlex SaaS Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with Next.js, React & Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
};
