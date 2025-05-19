'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import {DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from "react";
import { Leave } from '@/app/types/formleave';

interface roleData {
  title: string;
  apiPath?: string;
  pendingStatus: string;
  approvedStatus: string;
  rejectedStatus: string;
}



const approveDashboard = () => {
    const [docs, setDocs] = useState<Leave[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<String>('');
    const [lastDocIds, setLastDocIds] = useState<DocumentSnapshot[]>([]); // Store IDs of last docs for each page
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { data: session, status } = useSession();    
    const [today, setToday] = useState('');
    const [selectStatus, setSelectStatus] = useState<String>('');
    const limit = 5;
    const [showImg, setShowImg] = useState(false);
    const [selectedImg, setSelectedImg] = useState("");


 const getRoleSpecificData = () => {
        if (!session?.user?.role) return { title: "อนุมัติการลา", statuses: [] };

        switch (session.user.role) {
            case 'head':
                return {
                    title: "หัวหน้าแผนกอนุมัติ",
                    apiPath: "/api/user/getleavesbydepartment",
                    pendingStatus: "waiting for head approval",
                    approvedStatus: "waiting for manager approval",
                    rejectedStatus: "rejected by head"
                };
            case 'manager':
                return {
                    title: "ผู้จัดการอนุมัติ",
                    apiPath: "/api/user/getleavesformanager",
                    pendingStatus: "waiting for manager approval",
                    approvedStatus: "waiting for hr approval",
                    rejectedStatus: "rejected by manager"
                };
            case 'hr':
                return {
                    title: "HR อนุมัติ",
                    apiPath: "/api/user/getleavesforhr",
                    pendingStatus: "waiting for hr approval",
                    approvedStatus: "approved",
                    rejectedStatus: "rejected by hr"
                };
            default:
                return {
                    title: "อนุมัติการลา",
                    apiPath: "",
                    pendingStatus: "pending",
                    approvedStatus: "approved",
                    rejectedStatus: "rejected"
                };
        }
    };
    const roleData = getRoleSpecificData();
    console.log(roleData.pendingStatus, roleData.approvedStatus, roleData.rejectedStatus);
  
const fetchData = async (lastDocId: DocumentSnapshot<DocumentData, DocumentData> | null = null, isPrevious = false) => {
       try {
         setLoading(true);
         let url = `/api/user/getleavesbydepartmentandstatus?selectStatus=${selectStatus}&limit=${limit}`;
         
         if (lastDocId) {
           url += `&lastDoc=${lastDocId}`;
         }
         
         if (isPrevious) {
           url += '&direction=prev';
         }
         
         const res = await fetch(url);
         const result = await res.json();
         
         if (res.ok) {
           setDocs(result.data || []);
 
           console.log(result.data);
           console.log(result.lastVisible);
           setHasMore(result.data.length === limit && result.hasMore);
           return result.lastVisible;
         } else {
           setError('API error: ' + (result.error || 'Unknown error'));
           return null;
         }
       } catch (err) {
         console.error('Error fetching documents:', err);
         setError('Failed to connect to server.');
         return null;
       } finally {
         setLoading(false);
       }
     };
  useEffect(() => {
     const date = new Date().toLocaleDateString(); // หรือ 'th-TH'
     setToday(date);
   }, []);
   
   useEffect(() => {
         if (status === "loading") 
            return;
     
         const loadInitialData = async () => {
           const lastVisible = await fetchData();
           if (lastVisible) {
             setLastDocIds([lastVisible]);
           }
         };
         
         loadInitialData();
         console.log("status" + selectStatus);
    },  [status, selectStatus]);
    const handleNext = async () => {
        if (!hasMore) return;
        
        const lastVisible = await fetchData(lastDocIds[currentPage]);
        
        if (lastVisible) {
          // If we navigated back and then forward, remove the forward history
          if (currentPage < lastDocIds.length - 1) {
            setLastDocIds(prev => [...prev.slice(0, currentPage + 1), lastVisible]);
          } else {
            setLastDocIds(prev => [...prev, lastVisible]);
          }
          setCurrentPage(prev => prev + 1);
        }
      };
  
      const handlePrevious = async () => {
        if (currentPage <= 0) return;
        
        const newPage = currentPage - 1;
        const previousLastDocId = newPage > 0 ? lastDocIds[newPage - 1] : null;
        
        await fetchData(previousLastDocId);
        setCurrentPage(newPage);
        setHasMore(true); // When going back, we know there's more forward
      };
      const handleChangeStatus = async (docId: string, status: string) => {
        console.log(docId, status);
        try {
          setLoading(true);
          const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/changestatusformleave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    docId,
                    status
                })
            })
          if(res.ok){
            const lastDocId = currentPage > 0 ? lastDocIds[currentPage - 1] : null;
            await fetchData(lastDocId);
          }
        }catch (err) {
          console.error('Error fetching documents:', err);
          setError('Failed to connect to server.');
          return null;
        }finally {
          setLoading(false);
        }
      }
    
    const renderStatus = (status: string) => {
      if (status === roleData.pendingStatus) {
        return <span className={`px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800`}>
                        {status}
                      </span>
      }else if(status === roleData.approvedStatus){
           return <span className={`px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800`}>
                        {status}
                      </span>
      }else if(status.includes("rejected")){
            return  <span className={`px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800`}>
                        {status}
                      </span>
      }else{
        return    <span className={`px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800`}>
                        {status}
                      </span>
      }
    }
    const openImageModal = (imagePath : string) => {
  setSelectedImg(imagePath);
  setShowImg(true);
};

// ฟังก์ชันสำหรับการปิด modal
const closeImageModal = () => {
  setShowImg(false);
};
      if (loading && docs.length === 0) return <p>Loading...</p>;
  return (
    <DashboardLayout title={`หัวหน้าอนุมัติ ${session?.user?.role} ${session?.user?.department}`}>
      <div className="bg-white p-4 rounded shadow">
        {error && <p className="text-red-500">{error}</p>}
       <div className="flex w-full text-xl font-bold mb-4 mr-65">  วัน ณ ปัจจุบัน {today} </div>
        
       <div className="flex flex-row flex-wrap gap-4 ">
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
                <button onClick={() => {setSelectStatus(''); setCurrentPage(0)}}>ทั้งหมด</button>
            </div>
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
     
                <button onClick={() => {setSelectStatus(roleData?.pendingStatus ?? ''); setCurrentPage(0)}}>รอการอนุมัติ</button>
            </div>
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
            <button onClick={() => {setSelectStatus(roleData?.approvedStatus ?? ''); setCurrentPage(0)}}>อนุมัติแล้ว</button>
            </div>
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
            <button onClick={() => {setSelectStatus(roleData?.rejectedStatus ?? ''); setCurrentPage(0)}}>ยกเลิก</button>
            </div>
       </div>
       <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-collapse border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                <th className="border px-4 py-2">ชื่อ</th>
                <th className="border px-4 py-2">แผนก</th>
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
                    <td className="border px-4 py-2">{doc.fullname}</td>
                    <td className="border px-4 py-2">{doc.department}</td>
                    <td className="border px-4 py-2">{doc.selectedLeavetype}
                       {doc.uploadedPath !== "" &&  <img
                          src={`/uploads/${doc.uploadedPath}`}
                          onClick={() => openImageModal(doc.uploadedPath)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/fallback.png"; // ตั้ง path รูป default ที่ต้องการ
                          }}
                          alt="Uploaded File"
                          className="w-10 h-10 object-cover"
                        />}
                    </td>
                    <td className="border px-4 py-2">{doc.leaveDays}</td>
                    <td className="border px-4 py-2">{doc.leaveTime.startTime} - {doc.leaveTime.endTime}</td>
                    <td className="border px-4 py-2">{doc.reason}</td>
                    <td className="border px-4 py-2">{doc.createdAt}
                        <div>
                       
                           
                        </div>
                    </td>
                    <td className="border px-4 py-2">
                      {renderStatus(doc.status)}
                      {doc.status === roleData?.pendingStatus && (
                        <>
                            <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleChangeStatus(doc.id, roleData?.approvedStatus ?? '')}
                            >
                            อนุมัติ
                            </button>
                            <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                            onClick={() => handleChangeStatus(doc.id, roleData?.rejectedStatus ?? '')}
                            >
                            ไม่อนุมัติ
                            </button>
                        </>
                        )}
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
                  <span className="font-medium">{doc.selectedLeavetype}</span>
                  <span className="px-2 py-1 rounded text-xs font-medium 
                  bg-green-100 text-green-800">
                    {doc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">วันที่ลา</p>
                    <p>{doc.leaveDays}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">ช่วงเวลา</p>
                    <p>{doc.periodTime}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">เหตุผล</p>
                    <p>{doc.reason}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">เวลาที่ส่งฟอร์ม</p>
                    <p>{doc.createdAt}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {docs.length === 0 && !loading && (
              <p className="text-center py-4 text-gray-500">
                ไม่พบข้อมูลประวัติการลา
                </p>
            )}
          </div>
          
          {/* ปุ่มเปลี่ยนหน้า */}
          <div className="flex justify-between mt-6">
            <button 
              onClick={handlePrevious}
              disabled={currentPage <= 0 || loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                currentPage <= 0 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              ก่อนหน้า
            </button>
            
            <span className="self-center text-sm">หน้า {currentPage + 1}</span>
            
            <button 
              onClick={handleNext}
              disabled={!hasMore || loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                !hasMore || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              ถัดไป
            </button>
          </div>
          
         {loading && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="text-center">
              <div className="inline-block relative w-16 h-16">
                {/* Spinning gradient ring */}
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent animate-spin"></div>
                
                {/* Inner ring */}
                <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-200 border-b-blue-100 border-l-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              
              <p className="mt-4 text-lg font-medium text-gray-700">กรุณารอสักครู่</p>
              <p className="text-sm text-blue-500 animate-pulse mt-1">กำลังอัพเดทสถานะ...</p>
            </div>
          </div>
        )}
                  
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

export default approveDashboard;
