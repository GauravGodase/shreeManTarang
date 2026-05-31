/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          light: '#e8d06a',
          dark: '#a88a1f',
        },
        ink: {
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#222222',
          500: '#2d2d2d',
          400: '#3d3d3d',
          300: '#555555',
          200: '#888888',
          100: '#bbbbbb',
          50: '#e5e5e5',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        shimmer: 'shimmer 2.5s infinite',
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        marquee: 'marquee 20s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37, #f5e89a, #a88a1f)',
        'card-gradient': 'linear-gradient(145deg, #1a1a1a, #111111)',
      },
      boxShadow: {
        gold: '0 0 20px rgba(212,175,55,0.35)',
        'gold-lg': '0 0 50px rgba(212,175,55,0.45)',
        'dark-lg': '0 8px 60px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
};


