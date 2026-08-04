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
          300: '#B89EFF',
          400: '#9B6EFF',
          500: '#6C3EF4', // Core Brand Primary
          600: '#5B2DE0',
          700: '#4A21C0',
          800: '#3D1A9E',
          900: '#321580',
        },
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6', // Core Brand Secondary
          600: '#7C3AED',
          700: '#6D28D9',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          cyan: '#06B6D4'
        },
        surface: {
          light: '#F8F9FC',
          dark: '#0F172A',
          cardLight: '#FFFFFF',
          cardDark: '#1E293B',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(108, 62, 244, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(108, 62, 244, 0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'radial-gradient(circle at 50% 50%, rgba(108, 62, 244, 0.12) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
