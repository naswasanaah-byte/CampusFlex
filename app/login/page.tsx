'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Zap,
  Smartphone
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { InteractiveMascot } from '@/components/ui/InteractiveMascot';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Field focus tracking for Mascot animations
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Mouse Tracking for Parallax Background
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
      setError('Please enter your email address.');
      return;
    }

    const success = login(email, selectedRole);
    if (success) {
      if (selectedRole === 'employer') router.push('/employer/dashboard');
      else router.push('/student/dashboard');
    } else {
      setError('Invalid credentials. Please check your details.');
    }
  };

  const handleQuickFillDemo = (demoEmail: string, role: UserRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setSelectedRole(role);
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
      className="relative min-h-[85vh] flex items-center justify-center py-6 px-3 sm:py-12 sm:px-6 overflow-hidden select-none"
    >
      {/* 1. AMBIENT GLOWING BACKGROUND ORBS (PARALLAX EFFECT) */}
      <motion.div
        animate={{
          x: mousePos.normalizedX * 35,
          y: mousePos.normalizedY * 35,
        }}
        transition={{ type: 'spring', stiffness: 75, damping: 25 }}
        className="absolute top-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-primary-600/25 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: mousePos.normalizedX * -45,
          y: mousePos.normalizedY * -45,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-secondary-500/25 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Cursor Spotlight Effect */}
      <div
        className="hidden md:block absolute w-80 h-80 bg-primary-400/15 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 160}px`,
          top: `${mousePos.y - 160}px`,
        }}
      />

      {/* 2. MAIN MOBILE-OPTIMIZED LOGIN CARD */}
      <motion.div
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.normalizedY * -3}deg) rotateY(${mousePos.normalizedX * 3}deg)`,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-8 shadow-2xl space-y-5">

          {/* Interactive Mascot Cartoon Character */}
          <div className="pt-1">
            <InteractiveMascot
              isEmailFocused={isEmailFocused}
              isPasswordFocused={isPasswordFocused}
              isPasswordVisible={showPassword}
            />
          </div>

          {/* Brand Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Welcome to CampusFlex
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Smart Jobs. Flexible Future. Sign in to your portal.
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role Selection Tabs (Big Touch-Friendly Targets) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Account Role</span>
                <span className="text-[10px] text-slate-400 font-normal">Student / Employer</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`min-h-[44px] text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'student'
                      ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-md'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  className={`min-h-[44px] text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'employer'
                      ? 'bg-white dark:bg-slate-900 text-secondary-600 dark:text-secondary-400 shadow-md'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Employer
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'student' ? 'alex.rivera@university.edu' : 'hiring@company.com'}
                  className="w-full pl-10 pr-4 py-3 min-h-[48px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-base sm:text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 min-h-[48px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-base sm:text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* One-Touch Quick Fill Helper Buttons (Touch Friendly) */}
            <div className="p-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/40 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-center">
                ⚡ Quick Fill Test Credentials:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFillDemo('alex.rivera@university.edu', 'student')}
                  className="py-1.5 px-2 rounded-xl bg-primary-600/10 hover:bg-primary-600/20 text-primary-700 dark:text-primary-300 text-[11px] font-bold text-center border border-primary-500/20 transition-colors cursor-pointer"
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillDemo('hiring@techcorp.com', 'employer')}
                  className="py-1.5 px-2 rounded-xl bg-secondary-600/10 hover:bg-secondary-600/20 text-secondary-700 dark:text-secondary-300 text-[11px] font-bold text-center border border-secondary-500/20 transition-colors cursor-pointer"
                >
                  Employer Demo
                </button>
              </div>
            </div>

            {/* Large Touch Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full min-h-[48px] py-3.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-2xl shadow-lg shadow-primary-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Don't have an account?{' '}
            <Link href="/register" className="font-extrabold text-primary-600 dark:text-primary-400 hover:underline">
              Create Free Account
            </Link>
          </div>

        </div>
      </motion.div>

      {/* Password Reset Modal */}
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
              Enter your registered university or company email address and we'll send you a password recovery link.
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
                className="w-full px-3.5 py-3 min-h-[48px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 min-h-[48px] text-xs font-bold text-white bg-primary-600 rounded-xl shadow-md hover:bg-primary-700 transition-colors"
            >
              Send Reset Password Link
            </button>
          </form>
        )}
      </Modal>

    </div>
  );
}
