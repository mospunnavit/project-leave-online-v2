export function Success() {
  return (
   <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-100">
            <div className="bg-white rounded-lg shadow-xl p-6 transform transition-all max-w-sm w-full">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">ส่งคำขอลาสำเร็จ!</h3>
              <p className="text-sm text-gray-500 text-center mt-2">ระบบกำลังนำคุณไปยังหน้าสรุป...</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full animate-progress"></div>
              </div>
            </div>
          </div>
  );
}