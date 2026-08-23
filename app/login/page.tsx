'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email or phone.');
      return;
    }

    const success = login(email, selectedRole);
    if (success) {
      if (selectedRole === 'employer') router.push('/employer/dashboard');
      else router.push('/student/dashboard');
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-3 sm:px-6">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT COLUMN: 3D STUDENT ILLUSTRATION & BRAND BANNER (MATCHING MOCKUP SCREEN 1) */}
        <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 dark:from-slate-800 dark:to-indigo-950 p-8 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800">
          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#5B46E5] flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                CampusFlex
              </span>
            </Link>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 pl-1">
              Smart Jobs. Flexible Future.
            </p>
          </div>

          {/* Center 3D Student Character Banner Illustration */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/60 dark:ring-slate-800">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
                alt="Campus Students Illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 via-transparent to-transparent flex items-end p-4">
                <p className="text-white text-xs font-extrabold drop-shadow-md">
                  Join 10,000+ university students finding flexible part-time jobs today!
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Match & Guaranteed Hourly Shift Payouts</span>
          </div>
        </div>

        {/* RIGHT COLUMN: SLEEK LOGIN FORM (MATCHING MOCKUP SCREEN 1) */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">

          {/* Welcome Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Welcome Back!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Login to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role Switcher Tabs (Student / Employer) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-[#5B46E5] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('employer')}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  selectedRole === 'employer'
                    ? 'bg-[#5B46E5] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Employer
              </button>
            </div>

            {/* Email or Phone Input */}
            <div className="space-y-1">
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-[#5B46E5] transition-colors" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Phone"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B46E5] transition-all"
                />
              </div>
            </div>

            {/* Password Input with Eye Icon */}
            <div className="space-y-1">
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-[#5B46E5] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B46E5] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5B46E5] focus:ring-[#5B46E5]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="font-bold text-[#5B46E5] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Solid Purple Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 text-xs font-black text-white bg-[#5B46E5] hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer mt-2"
            >
              Login
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link href="/register" className="font-extrabold text-[#5B46E5] hover:underline">
              Register Now
            </Link>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
      >
        {forgotSent ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Reset Email Sent!</h4>
            <p className="text-xs text-slate-500">Check your inbox for password reset instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your registered email address and we'll send you a password recovery link.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Registered Email
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B46E5]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-[#5B46E5] rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
            >
              Send Reset Password Link
            </button>
          </form>
        )}
      </Modal>

    </div>
  );
}
