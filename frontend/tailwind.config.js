/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      
      colors: {
        primary: '#2563eb',   
        secondary: '#e11d48', 
      },
    },
  },
  plugins: [],
}
