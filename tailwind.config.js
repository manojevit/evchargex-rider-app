/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // EVCHARGEX brand — royal blue
        brand: {
          50: '#EEF4FF',
          100: '#DBE7FF',
          200: '#BBD0FF',
          300: '#8BB0FF',
          400: '#5586FB',
          500: '#1E63F0', // DEFAULT
          600: '#1550D6',
          700: '#1340AC',
          800: '#163A88',
          900: '#17356C',
          DEFAULT: '#1E63F0',
        },
        // Semantic
        success: { DEFAULT: '#16A34A', soft: '#DCFCE7', ink: '#0F7A38' },
        warn: { DEFAULT: '#F59E0B', soft: '#FEF3C7', ink: '#B45309' },
        danger: { DEFAULT: '#DC2626', soft: '#FEE2E2', ink: '#B91C1C' },
        info: { DEFAULT: '#2563EB', soft: '#DBEAFE', ink: '#1D4ED8' },
        // Neutrals
        ink: '#0B1420',
        muted: '#6B7684',
        faint: '#9AA4B2',
        line: '#E7EBF1',
        canvas: '#F2F5F9',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
        extrabold: ['Inter_800ExtraBold'],
        black: ['Inter_900Black'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '26px',
      },
    },
  },
  plugins: [],
};
