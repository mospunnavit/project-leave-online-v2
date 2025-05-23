'use client';
import DashboardLayout from "@/app/components/dashboardLayout";
import { useEffect, useState } from 'react';
import {DocumentSnapshot, DocumentData } from "firebase/firestore";
import { Leave } from '@/app/types/formleave';
import { useSession } from "next-auth/react";
import { Loading } from "@/app/components/loading";
const UserDashboard = () => {
    const [docs, setDocs] = useState<Leave[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<String>('');
    const [lastDocIds, setLastDocIds] = useState<DocumentSnapshot[]>([]); // Store IDs of last docs for each page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showImg, setShowImg] = useState(false);
    const [selectedImg, setSelectedImg] = useState("");
    const [searchUsername, setSearchUsername] = useState('');
    const { data: session, status } = useSession();
    
    useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL +`/api/v2/user/getleavebyuser?page=${currentPage}`);
        const data = await res.json();
        setDocs(data);
        setHasMore(data.length < 5);
        console.log(data);
      } catch (err) {
        console.error('Error fetching leave data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [currentPage]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const renderStatus = (status: string) => {
  if (status.includes("waiting")) {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        {status}
      </span>
    );
  } else if (status.includes("rejected")) {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
        {status}
      </span>
    );
  } else if (status.includes("approved")) {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        {status}
      </span>
    );
  } else {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-white text-black">
        {status}
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
// ฟังก์ชันสำหรับการเปิด modal

    if (loading && docs.length === 0) 
      return <>
        <Loading /></>;
  return (
    <DashboardLayout title="Want to Leave">
      <div className="flex flex-col flex-wrap bg-white p-4 rounded shadow">
       <div className="flex flex-row flex-wrap gap-4 ">
          <div className="flex flex-col w-full sm:w-[calc(50%-0.5rem)] bg-white p-4 rounded shadow">
              <label htmlFor="">ชื่อ: {session?.user?.firstname}  {session?.user?.lastname}</label>
              <label htmlFor="">แผนก: {session?.user?.department}</label>
          </div>
          <div className="flex flex-col w-full sm:w-[calc(50%-0.5rem)] bg-white p-4 rounded shadow">ข้อมูลการประเภทการลา
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
                  <tr>
                    <td className="border px-4 py-2">ลากิจ</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">0</td>
                   </tr>     

                    <tr>
                    <td className="border px-4 py-2">ลาป่วย </td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">0</td>
                     </tr>   
                   <tr>
                    <td className="border px-4 py-2">ลาพักร้อน</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">0</td>
                       </tr> 
                    
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
                    <td className="border px-4 py-2">{doc.leave_type}
                      {doc.leave_type === "มีใบรับรองแพทย์" && <img src= {`/uploads/${doc.image_filename}`} 
                      onClick={() => openImageModal(doc.image_filename)
                      }
                      alt="Uploaded File" className="w-10 h-10" />}
                    </td>
                    <td className="border px-4 py-2">{doc.leave_date}</td>
                    <td className="border px-4 py-2">{doc.start_time.slice(0, 5)} - {doc.end_time.slice(0, 5)}</td>
                    <td className="border px-4 py-2">{doc.reason}</td>
                    <td className="border px-4 py-2">{doc.submitted_at}</td>
                    <td className="border px-4 py-2">
                      {renderStatus(doc.status)}
                    </td>
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
                  <span className="font-medium">{doc.leave_type}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    doc.status === 'อนุมัติ' ? 'bg-green-100 text-green-800' : 
                    doc.status === 'รออนุมัติ' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">วันที่ลา</p>
                    <p>{doc.leave_date}</p>
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
                    <p>{doc.submitted_at}</p>
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
                currentPage <= 0 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
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