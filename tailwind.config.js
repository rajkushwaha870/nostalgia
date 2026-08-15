/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nostalgia: {
          'deep-brown': '#24150F',
          'dark-brown': '#3A2116',
          'terracotta': '#B9472F',
          'dusty-red': '#8F3025',
          'warm-red': '#C94B32',
          'cream': '#F1D7A3',
          'yellow': '#E5AD54',
          'gold': '#C88A3D',
        }
      },
      fontFamily: {
        display: ['"Gajraj One"', '"Rozha One"', '"Yatra One"', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Outfit"', '"Hind"', 'sans-serif'],
        script: ['"Kaushan Script"', '"Yellowtail"', '"Satisfy"', 'cursive'],
      },
      animation: {
        'dust-float': 'dustFloat 20s infinite linear',
        'subtle-pulse': 'subtlePulse 4s ease-in-out infinite',
        'dial-glow': 'dialGlow 3s ease-in-out infinite',
      },
      keyframes: {
        dustFloat: {
          '0%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.3' },
          '50%': { transform: 'translateY(-30px) translateX(15px)', opacity: '0.8' },
          '100%': { transform: 'translateY(-60px) translateX(0px)', opacity: '0.3' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.01)' },
        },
        dialGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px #E5AD54)' },
          '50%': { filter: 'drop-shadow(0 0 6px #E5AD54)' },
        }
      }
    },
  },
  plugins: [],
}
