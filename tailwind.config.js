/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        rose: {
          50: '#fff0f5',
          100: '#ffe0ec',
          200: '#ffc1d9',
          300: '#ff94be',
          400: '#ff5e9e',
          500: '#f53d80',
          600: '#e01b60',
          700: '#bc0e4d',
          800: '#9c1044',
          900: '#83123d',
        },
        blush: {
          50: '#fdf4f8',
          100: '#fce8f3',
          200: '#fbd1e9',
          300: '#f8acd5',
          400: '#f27db8',
          500: '#e8539c',
          600: '#d43580',
          700: '#b12567',
          800: '#922256',
          900: '#7a2049',
        },
        cream: {
          50: '#fffdf9',
          100: '#fefaf0',
          200: '#fdf3dc',
          300: '#fbe9c0',
          400: '#f8d994',
          500: '#f4c460',
        },
        wine: {
          800: '#2d1533',
          900: '#1a0c1f',
          950: '#0f0612',
        },
      },
      backgroundImage: {
        'rose-gradient': 'linear-gradient(135deg, #fdf4f8 0%, #fce8f3 50%, #f8d4e8 100%)',
        'hero-gradient': 'linear-gradient(180deg, #1a0c1f 0%, #2d1533 40%, #4a1a5e 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(253,244,248,0.9) 100%)',
        'result-gradient': 'linear-gradient(135deg, #1a0c1f 0%, #2d1533 100%)',
        'cta-gradient': 'linear-gradient(135deg, #e8539c 0%, #f27db8 50%, #e8539c 100%)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'particle': 'particle 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.85' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'particle': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: '0.4' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
        },
      },
      boxShadow: {
        'glow-rose': '0 0 20px rgba(232, 83, 156, 0.3)',
        'glow-soft': '0 0 40px rgba(232, 83, 156, 0.15)',
        'card': '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
