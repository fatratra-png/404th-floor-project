/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#135bec",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
        "panel-dark": "#1a1f2e",
        "metal-dark": "#151a25",
        "accent-glow": "#3b82f6",
        "terminal-green": "#0f0",
        surface: "#192233",
        "surface-highlight": "#232d42",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["Share Tech Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 10px rgba(19, 91, 236, 0.5), 0 0 20px rgba(19, 91, 236, 0.3)",
        "neon-strong":
          "0 0 15px rgba(19, 91, 236, 0.8), 0 0 30px rgba(19, 91, 236, 0.5)",
        crt: "inset 0 0 20px rgba(0,0,0,0.5)",
        "button-pressed":
          "inset 2px 2px 5px rgba(0,0,0,0.5), inset -1px -1px 2px rgba(255,255,255,0.1)",
        "button-normal":
          "5px 5px 10px rgba(0,0,0,0.5), -1px -1px 2px rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "brushed-metal":
          "linear-gradient(135deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.02) 75%, transparent 75%, transparent)",
        scanlines:
          "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        glitch: {
          "0%": { clipPath: "inset(40% 0 61% 0)" },
          "20%": { clipPath: "inset(92% 0 1% 0)" },
          "40%": { clipPath: "inset(43% 0 1% 0)" },
          "60%": { clipPath: "inset(25% 0 58% 0)" },
          "80%": { clipPath: "inset(54% 0 7% 0)" },
          "100%": { clipPath: "inset(58% 0 43% 0)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": { opacity: "1" },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.4" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out infinite",
        "shake-once": "shake 0.5s ease-in-out",
        glitch: "glitch 0.3s linear infinite",
        flicker: "flicker 3s infinite",
        scanline: "scanline 8s linear infinite",
        float: "float 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
