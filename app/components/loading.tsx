export function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="text-center">
            <div className="inline-block relative w-12 h-12 sm:w-16 sm:h-16">
              {/* Spinning gradient ring */}
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent animate-spin"></div>
              
              {/* Inner ring */}
              <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-200 border-b-blue-100 border-l-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            
            <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">กรุณารอสักครู่</p>
            <p className="text-xs sm:text-sm text-blue-500 animate-pulse mt-1">กำลังอัพเดทสถานะ...</p>
          </div>
        </div>
  );
}