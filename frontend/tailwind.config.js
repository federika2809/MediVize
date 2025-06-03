/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Tambahkan utilitas tombol kustom
      colors: {
        primary: '#2563eb',   // biru Tailwind
        secondary: '#e11d48', // merah Tailwind
      },
    },
  },
  plugins: [],
}
