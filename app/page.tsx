import HomeLayout from "./components/homeLayout";
import Image from "next/image";

export default function Home() {
  return (
    <HomeLayout>
      <div className="relative grid grid-cols-1 md:grid-cols-2 h-full w-50% bg-gradient-to-br shadow-lg from-blue-50 to-gray-100">
        
        {/* ด้านซ้าย: รูปภาพ */}
        <div className="flex items-center justify-center p-8">
          <Image
            src="/images/black-envelope.jpg" // เปลี่ยน path เป็นรูปจริงที่คุณใช้
            alt="Left side"
            width={400}
            height={500}
            className="rounded-2xl shadow-lg"
          />
        
        </div>

        {/* ด้านขวา: เนื้อหา + ปุ่ม */}
        <div className="flex flex-col justify-end items-start p-8 space-y-8 gap-4">
        <div className="flex justify-end">

          <h1 className="text-3xl font-bold text-gray-700">Welcome to Leave online</h1>

          <p className="text-gray-600 max-w-md text-center">
          </p>
          </div>
        <div className="flex justify-end">

        
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-40 px-4 py-2 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <span className="text-lg">Leave now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-pink-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-60 left-1/2 w-1 h-1 bg-green-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </HomeLayout>
  );
}
