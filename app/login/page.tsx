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
  ShieldCheck
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
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

  // Mouse Position Tracking for Interactive Parallax & Glowing Cursor Trail
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normalizedX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normalizedY = (y / rect.height - 0.5) * 2; // -1 to 1
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
      setError('Invalid credentials. Please check your email and password.');
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
      className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 overflow-hidden select-none"
    >
      {/* 1. MOUSE-FOLLOWING INTERACTIVE GLOWING ORBS & PARALLAX BACKGROUND */}
      <motion.div
        animate={{
          x: mousePos.normalizedX * 40,
          y: mousePos.normalizedY * 40,
        }}
        transition={{ type: 'spring', stiffness: 75, damping: 25 }}
        className="absolute top-10 left-1/4 w-96 h-96 bg-primary-600/25 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: mousePos.normalizedX * -50,
          y: mousePos.normalizedY * -50,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary-500/25 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: mousePos.normalizedX * 25,
          y: mousePos.normalizedY * 25,
        }}
        transition={{ type: 'spring', stiffness: 90, damping: 30 }}
        className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[90px] pointer-events-none"
      />

      {/* Interactive Cursor Spotlight Trail */}
      <div
        className="absolute w-80 h-80 bg-primary-400/15 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 160}px`,
          top: `${mousePos.y - 160}px`,
        }}
      />

      {/* 2. 3D CARD CONTAINER WITH MOUSE PARALLAX TILT */}
      <motion.div
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.normalizedY * -4}deg) rotateY(${mousePos.normalizedX * 4}deg)`,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-2xl space-y-6 transition-all duration-300 hover:shadow-primary-500/10">

          {/* Brand Header */}
          <div className="text-center space-y-2">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-secondary-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/30"
            >
              <Sparkles className="w-7 h-7" />
            </motion.div>

            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Sign in to your CampusFlex portal to manage jobs, applications, and work IDs.
            </p>
          </div>

          {/* Error Banner */}
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

            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Select Account Role</span>
                <span className="text-[10px] text-slate-400 font-normal">Student or Employer</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`py-2 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all ${
                    selectedRole === 'student'
                      ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-md scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" /> Student Portal
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  className={`py-2 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all ${
                    selectedRole === 'employer'
                      ? 'bg-white dark:bg-slate-900 text-secondary-600 dark:text-secondary-400 shadow-md scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Employer Portal
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'student' ? 'alex.rivera@university.edu' : 'hiring@company.com'}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="space-y-1.5">
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
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

            {/* Demo Fill Helper Chips */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">Quick Fill Demo:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFillDemo('alex.rivera@university.edu', 'student')}
                  className="text-primary-600 hover:underline font-bold"
                >
                  Student Demo
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickFillDemo('hiring@techcorp.com', 'employer')}
                  className="text-secondary-600 hover:underline font-bold"
                >
                  Employer Demo
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 text-xs font-black text-white bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 rounded-2xl shadow-lg shadow-primary-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Register Prompt */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-extrabold text-primary-600 dark:text-primary-400 hover:underline">
              Create Free Account
            </Link>
          </div>

        </div>
      </motion.div>

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
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-primary-600 rounded-xl shadow-md hover:bg-primary-700 transition-colors"
            >
              Send Reset Password Link
            </button>
          </form>
        )}
      </Modal>

    </div>
  );
}
