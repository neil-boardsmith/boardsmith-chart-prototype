/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          200: '#99f6e4',
          600: '#0d9488',
          800: '#0f766e',
        },
        slate: {
          50: '#f8fafc',
          600: '#475569',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}