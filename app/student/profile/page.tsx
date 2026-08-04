'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DigitalWorkID } from '@/components/student/DigitalWorkID';
import { useAuthStore } from '@/store/useAuthStore';
import { User, QrCode, Upload, Save, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export default function StudentProfilePage() {
  const { currentUser, updateProfile } = useAuthStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science');
  const [skills, setSkills] = useState((currentUser?.skills || []).join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      bio,
      department,
      skills: skills.split(',').map((s) => s.trim()),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-8 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
              Student Credentials
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Profile & Digital Work ID
            </h1>
          </div>
          <QrCode className="w-8 h-8 text-primary-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Digital Work ID Badge */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-primary-600" /> Official Campus Badge
            </h3>
            <DigitalWorkID user={currentUser} />
          </div>

          {/* Right Column: Profile Edit Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-6">

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Personal & Skill Information
              </h3>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Academic Major
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Skills (used by AI Engine)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, JavaScript, Tailwind CSS"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Student Bio / Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Resume File Upload Box */}
              <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-primary-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Resume PDF: {currentUser.resumeUrl || 'alex_rivera_resume.pdf'}
                    </span>
                    <span className="text-[10px] text-slate-400">Attached to all job applications</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-950 rounded-xl hover:bg-primary-100"
                >
                  Replace PDF
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl shadow-md hover:opacity-95 transition-opacity flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </div>

            </form>
          </div>

        </div>

      </main>
    </div>
  );
}
