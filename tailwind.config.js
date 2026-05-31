/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Code"', '"JetBrains Mono"', 'Consolas', 'monospace'],
        display: ['"Fira Code"', '"JetBrains Mono"', 'Consolas', 'monospace'],
        mono: ['"Fira Code"', '"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        primary: {
          50: '#e6f5fd',
          100: '#cdebf9', // Color 1 (Lightest)
          200: '#a8dbf7',
          300: '#80cbf4', // Color 2
          400: '#40bcf0',
          500: '#00a3f5', // Color 3 (Vibrant/Main)
          600: '#0082c4',
          700: '#015682', // Color 4
          800: '#014568',
          900: '#01334d', // Color 5 (Darkest)
          950: '#001a27',
        },
        accent: {
          50: '#e6f5fd',
          100: '#cdebf9',
          200: '#a8dbf7',
          300: '#80cbf4',
          400: '#40bcf0',
          500: '#00a3f5',
          600: '#0082c4',
          700: '#015682',
          800: '#014568',
          900: '#01334d',
          950: '#001a27',
        },
        slate: {
          850: '#1a2035',
          950: '#09090e',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #01334d 0%, #001a27 100%)',
        'gradient-card': 'linear-gradient(135deg, #01334d 0%, #001a27 100%)',
        'gradient-primary': 'linear-gradient(135deg, #80cbf4 0%, #00a3f5 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00a3f5 0%, #015682 100%)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(0, 163, 245, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 0 0 1px rgba(255,255,255,0.05)',
        'glass-lg': '0 0 0 1px rgba(255,255,255,0.1), 0 10px 40px rgba(0,0,0,0.5)',
        'glow': '0 0 30px rgba(0, 163, 245, 0.3)',
        'glow-accent': '0 0 30px rgba(128, 203, 244, 0.3)',
        'card': '0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 0 0 1px rgba(255,255,255,0.1), 0 10px 40px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
