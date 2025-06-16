/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",    // สำหรับ Next.js ที่ใช้ App Router
    "./pages/**/*.{js,ts,jsx,tsx}",  // สำหรับ Next.js ที่ใช้ Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", // ส่วนประกอบต่าง ๆ
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
