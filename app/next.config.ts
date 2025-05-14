/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async headers() {
      return [
        {
          // ตั้งค่าสำหรับทุก API routes
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" }, // หรือระบุโดเมนที่อนุญาต
            { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          ]
        }
      ]
    },
    // ถ้ามีปัญหากับ API routes อาจลองใช้ rewrites
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        },
      ]
    },
  }
  
  module.exports = nextConfig