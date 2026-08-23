'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface InteractiveMascotProps {
  isPasswordFocused?: boolean;
  isEmailFocused?: boolean;
  isPasswordVisible?: boolean;
}

export const InteractiveMascot: React.FC<InteractiveMascotProps> = ({
  isPasswordFocused = false,
  isEmailFocused = false,
  isPasswordVisible = false,
}) => {
  const mascotRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const faceCenterX = rect.left + rect.width / 2;
      const faceCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - faceCenterX;
      const deltaY = e.clientY - faceCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(7, Math.hypot(deltaX, deltaY) / 25);

      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });

      setHeadTilt(Math.max(-12, Math.min(12, deltaX / 40)));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isCoveringEyes = isPasswordFocused && !isPasswordVisible;

  return (
    <div ref={mascotRef} className="relative w-28 h-28 mx-auto flex items-center justify-center select-none">
      {/* Glow Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/30 to-secondary-500/30 rounded-full blur-xl animate-pulse" />

      {/* Main Mascot Body Container */}
      <motion.div
        animate={{
          rotate: headTilt,
          y: isEmailFocused ? [0, -4, 0] : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative w-24 h-24 bg-gradient-to-tr from-primary-600 via-primary-500 to-secondary-500 rounded-3xl shadow-xl border-2 border-white/20 p-2 flex flex-col items-center justify-center"
      >
        {/* Antenna / Crown */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
          <div className="w-2 h-3 bg-secondary-400 rounded-full animate-bounce" />
        </div>

        {/* Mascot Face */}
        <div className="relative w-full h-full bg-slate-900/90 rounded-2xl p-2 flex flex-col items-center justify-between border border-white/10 overflow-hidden">

          {/* Ears / Side Accents */}
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-primary-400/50" />
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary-400/50" />

          {/* EYES CONTAINER */}
          <div className="w-full flex items-center justify-center gap-3 mt-3">
            {/* Left Eye */}
            <div className="relative w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden">
              <motion.div
                animate={{
                  x: isCoveringEyes ? 0 : pupilOffset.x,
                  y: isCoveringEyes ? 0 : pupilOffset.y,
                  scaleY: isCoveringEyes ? 0.2 : 1,
                }}
                className="w-3.5 h-3.5 bg-slate-900 rounded-full relative flex items-center justify-center"
              >
                {/* Catchlight sparkle */}
                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
              </motion.div>
            </div>

            {/* Right Eye */}
            <div className="relative w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden">
              <motion.div
                animate={{
                  x: isCoveringEyes ? 0 : pupilOffset.x,
                  y: isCoveringEyes ? 0 : pupilOffset.y,
                  scaleY: isCoveringEyes ? 0.2 : 1,
                }}
                className="w-3.5 h-3.5 bg-slate-900 rounded-full relative flex items-center justify-center"
              >
                {/* Catchlight sparkle */}
                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
              </motion.div>
            </div>
          </div>

          {/* MOUTH & CHEEKS */}
          <div className="relative flex items-center justify-center mb-2">
            {/* Cheeks */}
            <div className="absolute -left-4 w-2 h-1.5 bg-rose-400/60 rounded-full blur-[1px]" />
            <div className="absolute -right-4 w-2 h-1.5 bg-rose-400/60 rounded-full blur-[1px]" />

            {/* Mouth expression */}
            <div className="w-4 h-2 border-b-2 border-amber-300 rounded-full" />
          </div>

          {/* PAWS / HANDS (Covering eyes when typing password!) */}
          <motion.div
            initial={{ y: 30 }}
            animate={{ y: isCoveringEyes ? 2 : 30 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            className="absolute inset-x-0 bottom-0 top-3 flex justify-between px-2 pointer-events-none z-20"
          >
            <div className="w-6 h-7 bg-primary-500 rounded-t-full border border-white/20 shadow-md" />
            <div className="w-6 h-7 bg-secondary-500 rounded-t-full border border-white/20 shadow-md" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
