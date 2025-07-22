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
        rutgers: {
          scarlet: '#CC0033',
          green: '#2E7D32',
          dark: '#1B1B1B',
        },
        social: {
          facebook: '#1877F2',
          instagram: '#E4405F',
          twitter: '#1DA1F2',
          tiktok: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 