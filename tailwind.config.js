/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          light: '#D4E8DA',
          DEFAULT: '#B8D8C0',
          dark: '#97C0A2',
        },
        coral: {
          light: '#F8BDB4',
          DEFAULT: '#F4A69A',
          hover: '#EE8E80',
          dark: '#E07564',
        },
        forest: {
          light: '#3C6252',
          DEFAULT: '#29463A',
          dark: '#1C3128',
        },
        cream: {
          DEFAULT: '#FFFDF8',
          dark: '#F7F4EC',
        },
        sage: {
          light: '#F1F6F2',
          DEFAULT: '#E7F0E9',
          dark: '#D0DFD3',
        },
        warmgray: {
          light: '#A0A4A0',
          DEFAULT: '#737873',
          dark: '#4B504B',
        },
        dyariborder: '#E5E9E4',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'dyari': '20px',
        'dyari-sm': '16px',
        'dyari-lg': '24px',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(41, 70, 58, 0.07)',
        'soft-hover': '0 20px 40px -15px rgba(41, 70, 58, 0.12)',
        'card': '0 4px 20px -2px rgba(41, 70, 58, 0.05)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translateY(-8px) rotate(var(--rot, 0deg))' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20px, -30px) scale(1.08)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        blob: 'blob 8s infinite',
      }
    },
  },
  plugins: [],
}
