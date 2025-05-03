
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
        colors: {
        'custom-brown': '#7C6A46',
      },},
  },
  plugins: [],
}