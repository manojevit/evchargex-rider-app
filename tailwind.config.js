/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // --- shadcn / react-native-reusables tokens (CSS variables) ---
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          // keep the brand ramp for gradients / fine control
          50: '#EEF4FF',
          100: '#DBE7FF',
          200: '#BBD0FF',
          300: '#8BB0FF',
          400: '#5586FB',
          500: '#1E63F0',
          600: '#1550D6',
          700: '#1340AC',
          800: '#163A88',
          900: '#17356C',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // --- aliases kept so existing screens keep rendering ---
        brand: {
          50: '#EEF4FF',
          100: '#DBE7FF',
          200: '#BBD0FF',
          300: '#8BB0FF',
          400: '#5586FB',
          500: '#1E63F0',
          600: '#1550D6',
          700: '#1340AC',
          800: '#163A88',
          900: '#17356C',
          DEFAULT: '#1E63F0',
        },
        success: { DEFAULT: '#16A34A', soft: '#DCFCE7', ink: '#0F7A38', foreground: '#FFFFFF' },
        warn: { DEFAULT: '#F59E0B', soft: '#FEF3C7', ink: '#B45309', foreground: '#FFFFFF' },
        danger: { DEFAULT: '#DC2626', soft: '#FEE2E2', ink: '#B91C1C', foreground: '#FFFFFF' },
        info: { DEFAULT: '#2563EB', soft: '#DBEAFE', ink: '#1D4ED8' },
        ink: '#0B1420',
        muted: '#6B7684',
        faint: '#9AA4B2',
        line: '#E7EBF1',
        canvas: '#F2F5F9',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '26px',
      },
    },
  },
  plugins: [],
};
