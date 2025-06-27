// tailwind.config.js
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
          50: '#f0f4f8',
          100: '#dce4ef',
          200: '#b8cade',
          300: '#94afd0',
          400: '#7095c1',
          500: '#4c7ab3',
          600: '#3d6290',
          700: '#2d496c',
          800: '#1e3149',
          900: '#0f1825',
        },
      },
    },
  },
  plugins: [],
};
