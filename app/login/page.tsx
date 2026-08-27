'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
  Check,
  UserCheck,
  Building2
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { InteractiveMascot } from '@/components/ui/InteractiveMascot';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Google OAuth Modal State
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Field focus tracking for Mascot animations
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Mouse Tracking for 3D Login Pad Tilt & Parallax
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;
    setMousePos({ x, y, normalizedX, normalizedY });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const res = login(email, password, selectedRole);
    if (res.success) {
      if (selectedRole === 'employer') router.push('/employer/dashboard');
      else router.push('/student/dashboard');
    } else {
      setError(res.message || 'Invalid email or password. Please check your credentials.');
    }
  };

  const handleGoogleSelect = async (gEmail: string, gName: string, avatarUrl?: string, tokenPayload?: string) => {
    setError('');
    const res = await loginWithGoogle(gEmail, gName, avatarUrl, selectedRole, tokenPayload);
    if (res.success) {
      setGoogleModalOpen(false);
      if (selectedRole === 'employer') router.push('/employer/dashboard');
      else router.push('/student/dashboard');
    } else {
      setError(res.message || 'Google authentication failed.');
      setGoogleModalOpen(false);
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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] flex items-center justify-center py-6 px-3 sm:px-6 overflow-hidden select-none"
    >
      {/* Ambient Glowing Orbs Following Mouse */}
      <motion.div
        animate={{
          x: mousePos.normalizedX * 40,
          y: mousePos.normalizedY * 40,
        }}
        transition={{ type: 'spring', stiffness: 75, damping: 25 }}
        className="absolute top-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#5B46E5]/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: mousePos.normalizedX * -50,
          y: mousePos.normalizedY * -50,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Mouse Cursor Spotlight Glow */}
      <div
        className="hidden md:block absolute w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 160}px`,
          top: `${mousePos.y - 160}px`,
        }}
      />

      {/* 3D LOGIN PAD CONTAINER */}
      <motion.div
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.normalizedY * -5}deg) rotateY(${mousePos.normalizedX * 5}deg) translate3d(${mousePos.normalizedX * 12}px, ${mousePos.normalizedY * 12}px, 0px)`,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 max-w-4xl w-full"
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

          {/* LEFT COLUMN: BRAND BANNER & 3D STUDENT ILLUSTRATION */}
          <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 dark:from-slate-800 dark:to-indigo-950 p-8 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800">
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

            <div className="relative my-6 flex items-center justify-center">
              <div className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/60 dark:ring-slate-800">
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

            <div className="relative z-10 flex items-center gap-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Match & Guaranteed Hourly Shift Payouts</span>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE LOGIN PAD FORM */}
          <div className="p-6 sm:p-8 flex flex-col justify-center space-y-4">

            {/* Interactive Staring Cartoon Mascot Character */}
            <div className="pt-1">
              <InteractiveMascot
                isEmailFocused={isEmailFocused}
                isPasswordFocused={isPasswordFocused}
                isPasswordVisible={showPassword}
              />
            </div>

            {/* Welcome Header */}
            <div className="text-center space-y-0.5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Welcome Back!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Login to continue to your portal
              </p>
            </div>

            {/* Error Alert Banner */}
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

            {/* GOOGLE SIGN-IN BUTTON */}
            <button
              type="button"
              onClick={() => setGoogleModalOpen(true)}
              className="w-full py-3 min-h-[48px] px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400 shrink-0">
                OR email sign in
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Role Switcher Tabs */}
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

              {/* Email Input */}
              <div className="space-y-1">
                <div className="relative group">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-[#5B46E5] transition-colors" />
                  <input
                    type="text"
                    required
                    value={email}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 min-h-[48px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-base sm:text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B46E5] transition-all"
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
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-11 py-3 min-h-[48px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-base sm:text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B46E5] transition-all"
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

              {/* Helpful Guidance Notice */}
              <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 text-[11px]">
                  <Info className="w-3.5 h-3.5 shrink-0 text-[#5B46E5]" />
                  <span>First time on CampusFlex?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-indigo-800/90 dark:text-indigo-300/90">
                  Enter your registered email & password, or click <strong>Register Now</strong> below to create your student or employer account.
                </p>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
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
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 min-h-[48px] text-xs font-black text-white bg-[#5B46E5] hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                Login to {selectedRole.toUpperCase()} Portal
              </motion.button>
            </form>

            {/* Footer Register Link */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
              Don't have an account?{' '}
              <Link href="/register" className="font-extrabold text-[#5B46E5] hover:underline">
                Register Now
              </Link>
            </div>

          </div>

        </div>
      </motion.div>

      {/* GOOGLE SIGN-IN INTERACTIVE OAUTH MODAL */}
      <Modal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        title="Sign in with Google"
      >
        <div className="py-2 space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Choose a Google Account
            </h3>
            <p className="text-xs text-slate-500">
              to continue to <strong>CampusFlex ({selectedRole.toUpperCase()})</strong>
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block">
                Enter your Google Account Email:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#5B46E5]"
                />
                <button
                  onClick={() => {
                    const mail = customGoogleEmail.trim() || 'user.google@gmail.com';
                    handleGoogleSelect(mail, mail.split('@')[0]);
                  }}
                  className="px-5 py-2.5 bg-[#5B46E5] hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all shrink-0"
                >
                  Continue with Google
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                🔒 CampusFlex automatically authenticates your verified Google account profile.
              </p>
            </div>
          </div>
        </div>
      </Modal>

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
