/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          DEFAULT: '#f7a600',
          50: '#fef7e6',
          100: '#fdecc0',
          200: '#fbd896',
          300: '#f9c46c',
          400: '#f8b142',
          500: '#f7a600',
          600: '#de9500',
          700: '#c58400',
          800: '#ac7300',
          900: '#936200',
        },
        accent: {
          DEFAULT: '#f5f7fa',
          50: '#fafbfc',
          100: '#f5f7fa',
          200: '#e9ecf1',
          300: '#dde1e8',
          400: '#d1d6df',
          500: '#c5cbd6',
          600: '#b9c0cd',
          700: '#adb5c4',
          800: '#a1aabb',
          900: '#959fb2',
        },
        dark: {
          DEFAULT: '#000000',
          50: '#1a1a1a',
          100: '#0d0d0d',
          200: '#000000',
        }
      },
      backgroundColor: {
        'app': '#000000',
        'card': '#ffffff',
        'accent': '#f5f7fa',
      },
      textColor: {
        'primary': '#f7a600',
        'on-dark': '#ffffff',
        'on-light': '#000000',
        'muted': '#6b7280',
      },
      borderColor: {
        'primary': '#f7a600',
        'accent': '#f5f7fa',
        'muted': '#e5e7eb',
      }
    },
  },
  plugins: [],
};
