'use client';
import DashboardLayout from "@/app/components/dashboardLayout";
import { useEffect, useState } from 'react';
import { Leave } from '@/app/types/formleave';
import { useSession } from "next-auth/react";
import { Loading } from "@/app/components/loading";
import { Leavetypes } from "@/app/types/leavetypes";

const UserDashboard = () => {
    const [docs, setDocs] = useState<Leave[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<String>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showImg, setShowImg] = useState(false);
    const [selectedImg, setSelectedImg] = useState("");
    const [searchUsername, setSearchUsername] = useState('');
    const { data: session, status } = useSession();
    const [selectYear, setSelectYear] = useState('');
    const [getLeaveTypeTotal, setGetLeaveTypeTotal] = useState<Leavetypes[]>([]);
    
    useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL +`/api/v2/user/getleavebyuser?page=${currentPage}`);
        const data = await res.json();
        
        if (res.ok) {
          if(data.length == 0){
            setError('ไม่พบข้อมูลการลา');
            setDocs([]);
            setHasMore(true);
          }else{
            setError('');
            setDocs(data);
            setHasMore(data.length < 5);
          }
          
        }
        if (!res.ok) {
          setError('API error: ' + (data.error || 'Unknown error'));
        }
       
      } catch (err) {
        setError('something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [currentPage]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const statusTranslations: { [key: string]: string } = {
  'waiting for head approval': 'รอหัวหน้าอนุมัติ',
  'waiting for manager approval': 'รอผู้จัดการอนุมัติ',
  'waiting for hr approval': 'รอ HR อนุมัติ',
  'rejected by head': 'ปฏิเสธโดยหัวหน้า',
  'rejected by hr': 'ปฏิเสธโดย HR',
  'rejected by manager': 'ปฏิเสธโดยผู้จัดการ',
  'approved': 'อนุมัติแล้ว',
  'waiting': 'รอดำเนินการ',
};

const fecthDataleavetypetotal = async () => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v2/user/gettotalleaveformbyuser');
    const data = await res.json();
    if (res.ok) {
        const leaveData = data.leave_types_total || [];
        setGetLeaveTypeTotal(leaveData);
        console.log("leavetype from fetch:", leaveData); // ✅ ได้ทันที
    }
  } catch (err) {
    console.log(err);
  }
}
useEffect(() => {
  fecthDataleavetypetotal();

}, []);
const translateStatus = (status: string): string => {
  return statusTranslations[status] || status; // ถ้าไม่มีคำแปล ให้คืนค่าเดิม
};
  const renderStatus = (status: string) => {
  if (status.includes("waiting")) {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        {translateStatus(status)}
      </span>
    );
  } else if (status.includes("rejected")) {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
        {translateStatus(status)}
      </span>
    );
  } else if (status.includes("approved")) {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        {translateStatus(status)}
      </span>
    );
  } else {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-white text-black">
        {translateStatus(status)}
      </span>
    );
  }
};

// ในส่วนของ component

const openImageModal = (imagePath : string) => {
  setSelectedImg(imagePath);
  setShowImg(true);
};

// ฟังก์ชันสำหรับการปิด modal
const closeImageModal = () => {
  setShowImg(false);
};
// ฟังก์ชันสำหรับเวลาเป็น ไทย
const dateTimeFormatter = new Intl.DateTimeFormat('th-TH', {
  timeZone: 'Asia/Bangkok',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric', 
});
  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setSelectYear(currentYear); // จะอัปเดตทุกครั้งที่โหลด
  }, []);
const formatDateWithOffset = (dateString : string, hoursOffset = 0) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const adjustedDate = new Date(date.getTime() + (hoursOffset * 60 * 60 * 1000));
  return dateTimeFormatter.format(adjustedDate);
};
    if (loading && docs.length === 0) 
      return <>
        <Loading /></>;
  return (
    <DashboardLayout title="Want to Leave">
      <div className="flex flex-col flex-wrap bg-white p-4 rounded shadow">
       <div className="flex flex-row flex-wrap gap-4 ">
          <div className="flex flex-col w-full sm:w-[calc(50%-0.5rem)] bg-white p-4 rounded shadow">
              <label htmlFor="">ชื่อ: {session?.user?.firstname}  {session?.user?.lastname}</label>
              <label htmlFor="">แผนก: {session?.user?.department_name}</label>
          </div>
          <div className="flex flex-col w-full sm:w-[calc(50%-0.5rem)] bg-white p-4 rounded shadow">
          <div className="flex flex-row flex-wrap gap-4">
            <input
  type="number"
  min="2000"
  max="2099"
  className="border w-16 sm:w-48 px-3 py-2 rounded"
  value={selectYear}
  onChange={(e) => setSelectYear(e.target.value)}
  placeholder="กรอกปี เช่น 2025"
/>
<button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">ค้นหา</button>
</div>
            ข้อมูลการประเภทการลา
              <table className="min-w-full border border-collapse border-gray-300">
                  <thead>
    <tr>
      <th className="border px-4 py-2">ประเภทการลา</th>
      <th className="border px-4 py-2">ลาได้</th>
      <th className="border px-4 py-2">ใช้ไปแล้ว</th>
      <th className="border px-4 py-2">คงเหลือ</th>
    </tr>
  </thead>
  
  <tbody>
    {getLeaveTypeTotal.map((item, index) => (
      <tr key={index}>
        <td className="border px-4 py-2">{item.lt_name}</td>
        <td className="border px-4 py-2">{item.quotaperyear}</td>
        <td className="border px-4 py-2">{item.used_quota}</td>
        <td className="border px-4 py-2">{item.left_quota}</td>
      </tr>
    ))}
  </tbody>
              </table>
          </div>
       </div>
        {/* Content */}
        <div>
          <h1 className="text-xl font-bold mb-4">ข้อมูลประวัติการลา</h1>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          
          {/* ตารางประวัติการลาสำหรับหน้าจอขนาดกลางและใหญ่ */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-collapse border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ประเภทการลา</th>
                  <th className="border px-4 py-2">วันที่ลา</th>
                  <th className="border px-4 py-2">ช่วงเวลาที่ลา</th>
                  <th className="border px-4 py-2">เหตุผล</th>
                  <th className="border px-4 py-2">เวลาที่ส่งฟอร์ม</th>
                  <th className="border px-4 py-2">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{doc.lt_name}
                      {doc.lt_name === "มีใบรับรองแพทย์" && <img src= {`/uploads/${doc.image_filename}`} 
                      onClick={() => openImageModal(doc.image_filename)
                      }
                      alt="Uploaded File" className="w-10 h-10" />}
                    </td>
                     <td className="border px-4 py-2">{formatDateWithOffset(doc.leave_date, 7).slice(0, 15)}
                       {doc.end_leave_date && ` - ${formatDateWithOffset(doc.end_leave_date, 7).slice(0, 10)}`}
                    </td>
                    <td className="border px-4 py-2">{doc.start_time.slice(0, 5)} - {doc.end_time.slice(0, 5)}</td>
                    <td className="border px-4 py-2">{doc.reason}</td>
                
                    <td className="border px-4 py-2">
                        {formatDateWithOffset(doc.submitted_at, 7)}
                      
                    </td>
                    <td className="border px-4 py-2">
                      {renderStatus(doc.status)}
                  {doc.exported === 1 ? (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">นำออกแล้ว</span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">ยังไม่ได้นำออก</span>
                  )}                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* การ์ดประวัติการลาสำหรับหน้าจอขนาดเล็ก */}
          <div className="md:hidden space-y-4">
            {docs.map((doc, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{doc.lt_name}</span>
                
                     {renderStatus(doc.status)}
                  {doc.exported === 1 ? (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">นำออกแล้ว</span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">ยังไม่ได้นำออก</span>
                  )} 
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">วันที่ลา</p>
                    <p>{formatDateWithOffset(doc.leave_date, 7).slice(0, 10)}
                       {doc.end_leave_date && ` - ${formatDateWithOffset(doc.end_leave_date, 7).slice(0, 10)}`}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">ช่วงเวลา</p>
                    <p>{doc.start_time.slice(0, 5)} - {doc.end_time.slice(0, 5)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">เหตุผล</p>
                    <p>{doc.reason}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">เวลาที่ส่งฟอร์ม</p>
                    <p> {formatDateWithOffset(doc.submitted_at, 7)}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {docs.length === 0 && !loading && (
              <p className="text-center py-4 text-gray-500">ไม่พบข้อมูลประวัติการลา</p>
            )}
          </div>
          
          {/* ปุ่มเปลี่ยนหน้า */}
          <div className="flex justify-between mt-6">
            <button 
              onClick={handlePrev}
              disabled={currentPage <= 0 || loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                currentPage == 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              ก่อนหน้า
            </button>
            
            <span className="self-center text-sm">หน้า {currentPage }</span>
            
            <button 
              onClick={handleNext}
              disabled={hasMore}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                hasMore || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              ถัดไป
            </button>
          </div>
          
          {loading && (
            <div className="text-center mt-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2">กำลังโหลด...</p>
            </div>
          )}
        </div>
    
      </div>
      {showImg && (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50"
           onClick={closeImageModal}>
        <div className="relative max-w-4xl max-h-[90vh] p-2 bg-white rounded-lg">
          <button 
            className="absolute top-2 right-2 p-1 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={closeImageModal}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={`/uploads/${selectedImg}`} 
            alt="Enlarged view" 
            className="max-h-[85vh] max-w-full object-contain" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    )}
    </DashboardLayout>
  );
};

export default UserDashboard;