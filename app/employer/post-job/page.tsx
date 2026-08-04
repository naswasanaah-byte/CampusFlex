'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import { WorkType } from '@/types';
import { PlusCircle, Users, DollarSign, Sparkles, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { addJob } = useJobStore();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [workType, setWorkType] = useState<WorkType>('Part-Time');
  const [hourlyRate, setHourlyRate] = useState(20);
  const [requiredEmployees, setRequiredEmployees] = useState(3);
  const [location, setLocation] = useState('Campus Innovation Lab / Remote');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('React, JavaScript, Communication');
  const [requirements, setRequirements] = useState('Available 10-15 hours per week, Good communication skills');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    addJob({
      title,
      companyId: currentUser.id,
      companyName: currentUser.companyName || currentUser.name,
      companyLogo: currentUser.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      department,
      location,
      workType,
      hourlyRate: Number(hourlyRate),
      description,
      requirements: requirements.split(',').map((r) => r.trim()),
      skillsRequired: skillsRequired.split(',').map((s) => s.trim()),
      requiredEmployees: Number(requiredEmployees),
      deadline: '2026-09-01',
      featured: true,
    });

    router.push('/employer/jobs');
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0 max-w-3xl">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Smart Hiring Form
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Post a New Smart Job
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Set hiring quota. Position will automatically auto-close once filled.
            </p>
          </div>
          <PlusCircle className="w-8 h-8 text-indigo-400" />
        </div>

        {/* Smart Job Auto-Close Explanation Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Smart Auto-Close Protection Active</strong>
            <span>
              When you accept {requiredEmployees} applicant{requiredEmployees > 1 ? 's' : ''}, the job status will automatically flip to <strong>FILLED</strong>, hiding it from public search and rejecting remaining applications.
            </span>
          </div>
        </div>

        {/* Post Job Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-glass space-y-5">

          {/* Job Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Job Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Web Developer Assistant"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Grid: Slots & Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary-600" /> Required Employees (Quota)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={requiredEmployees}
                onChange={(e) => setRequiredEmployees(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Hourly Pay Rate ($/hr)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                step="0.5"
                required
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Grid: Department & Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Department Focus
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Hospitality & Business">Hospitality & Business</option>
                <option value="Engineering">Engineering</option>
                <option value="General Studies">General Studies</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Work Schedule Type
              </label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as WorkType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Part-Time">Part-Time</option>
                <option value="Weekend">Weekend</option>
                <option value="Evening">Evening</option>
                <option value="Remote">Remote</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Job Location / Venue
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Student Union Lab or Remote"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Skills Required */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Required Skills (comma-separated for AI Matcher)
            </label>
            <input
              type="text"
              required
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              placeholder="React, JavaScript, Tailwind CSS"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Full Job Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tasks, duties, and shift hours..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 text-xs font-extrabold text-white bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl shadow-lg hover:opacity-95 transition-opacity"
            >
              Publish Smart Job Listing
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
