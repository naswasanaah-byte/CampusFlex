/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F4F0FF',
          100: '#E9E2FF',
          200: '#D5C7FF',
          300: '#A78BFA',
          400: '#9B6EFF',
          500: '#6C3EF4', // Main brand primary
          600: '#5B2DE0',
          700: '#4A21C0',
          800: '#3D1A9E',
          900: '#321580',
        },
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6', // Supporting accent
          600: '#7C3AED',
          700: '#6D28D9',
        },
        neutral: {
          bgLight: '#F8F9FC',
          bgDark: '#0F0F14',
          cardLight: '#FFFFFF',
          cardDark: '#18181F',
          textPrimaryLight: '#17121F',
          textPrimaryDark: '#F9FAFB',
          textSecondaryLight: '#6B7280',
          textSecondaryDark: '#9CA3AF',
        },
        functional: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      boxShadow: {
        'glass': '0 8px 30px rgba(108, 62, 244, 0.06)',
        'glass-dark': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px rgba(108, 62, 244, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
