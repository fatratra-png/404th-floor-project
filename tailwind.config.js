/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        elevator: {
          bg: '#0d1117',
          panel: '#161b22',
          blue: '#1f6feb',
          red: '#da3633',
          green: '#3fb950',
          yellow: '#e3b341',
        }
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        glitch: {
          '0%': { clipPath: 'inset(40% 0 61% 0)' },
          '20%': { clipPath: 'inset(92% 0 1% 0)' },
          '40%': { clipPath: 'inset(43% 0 1% 0)' },
          '60%': { clipPath: 'inset(25% 0 58% 0)' },
          '80%': { clipPath: 'inset(54% 0 7% 0)' },
          '100%': { clipPath: 'inset(58% 0 43% 0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      },
      animation: {
        shake: 'shake 0.5s ease-in-out infinite',
        'shake-once': 'shake 0.5s ease-in-out',
        glitch: 'glitch 0.3s linear infinite',
        flicker: 'flicker 2s linear infinite',
        scanline: 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}