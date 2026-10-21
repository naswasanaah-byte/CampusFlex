'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { Sparkles, User, Building2, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { GoogleOAuthModal } from '@/components/ui/GoogleOAuthModal';
import { GoogleSignInButton } from '@/components/ui/GoogleSignInButton';
import { formatHumanName } from '@/lib/googleAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuthStore();

  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [companyName, setCompanyName] = useState('');
  const [businessReg, setBusinessReg] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('Teaching, Communication, Problem Solving');
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    register({
      name,
      email,
      password,
      role,
      department: role === 'student' ? department : undefined,
      companyName: role === 'employer' ? companyName : undefined,
      businessRegistrationNumber: role === 'employer' ? (businessReg || `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      phone: role === 'employer' ? phone : undefined,
      location: role === 'employer' ? location : undefined,
      skills: role === 'student' ? skills.split(',').map((s) => s.trim()) : undefined,
    });

    if (role === 'employer') router.push('/employer/dashboard');
    else router.push('/student/dashboard');
  };

  const handleGoogleSelect = async (gEmail: string, gName: string, avatarUrl?: string, tokenPayload?: string) => {
    const res = await loginWithGoogle(gEmail, gName, avatarUrl, role, tokenPayload);
    if (res.success) {
      setGoogleModalOpen(false);
      if (role === 'employer') router.push('/employer/dashboard');
      else router.push('/student/dashboard');
    } else {
      setGoogleModalOpen(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-2xl space-y-6">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Create CampusFlex Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join the university marketplace for verified part-time jobs and top student talent.
          </p>
        </div>

        {/* GOOGLE SIGN UP BUTTON INTEGRATION */}
        <GoogleSignInButton
          text="Sign up with Google"
          role={role}
          onSuccess={(credential) => {
            if (credential) {
              handleGoogleSelect('', '', undefined, credential);
            } else {
              setGoogleModalOpen(true);
            }
          }}
        />

        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400 shrink-0">
            OR register with email
          </span>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              role === 'student'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" /> Student Account
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              role === 'employer'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Employer / Company
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {role === 'student' ? 'Full Name' : 'Contact Person / Recruiter Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'student' ? 'e.g. Alex Rivera' : 'e.g. Jane Doe (Hiring Manager)'}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              University / Official Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Conditional Role Inputs */}
          {role === 'student' ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Academic Department / Major
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
                  Skills (comma separated for AI matching)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Teaching, Python, Social Media, Communication"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Bright Academy or Apex Logistics"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Business Registration / Tax ID
                  </label>
                  <input
                    type="text"
                    value={businessReg}
                    onChange={(e) => setBusinessReg(e.target.value)}
                    placeholder="e.g. REG-2026-BRT-1002"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Official Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Office Location / Campus Headquarters
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Campus Technology Park or Calicut, Kerala"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-[11px] text-purple-800 dark:text-purple-300 space-y-0.5">
                <p className="font-bold flex items-center gap-1.5">
                  <span>🛡️</span> Super Admin Verification Guard
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  After registration, your account will be reviewed by the Super Admin. You will be allowed into the app to recruit students once verified.
                </p>
              </div>
            </>
          )}

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Set Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-xs font-extrabold text-white bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            Create {role === 'student' ? 'Student' : 'Employer'} Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-primary-600 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>

      {/* GOOGLE OAUTH MODAL MATCHING USER SCREENSHOT */}
      <GoogleOAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectAccount={(gEmail, gName, avatarUrl) => handleGoogleSelect(gEmail, gName, avatarUrl)}
        role={role}
      />

    </div>
  );
}
