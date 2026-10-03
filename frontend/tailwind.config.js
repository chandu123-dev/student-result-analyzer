/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b19',
          900: '#0b132b',
          850: '#0f1a3a',
          800: '#1c2541',
          700: '#273469',
        },
        brand: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          violet: '#7c3aed',
          pink: '#ec4899',
          emerald: '#10b981',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-blue': '0 0 20px -2px rgba(59, 130, 246, 0.4)',
        'glow-purple': '0 0 20px -2px rgba(139, 92, 246, 0.4)',
      }
    },
  },
  plugins: [],
}
