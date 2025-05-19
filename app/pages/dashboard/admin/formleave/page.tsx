'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import {DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { Leave } from '@/app/types/formleave';
import { X } from "lucide-react";


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
    const limit = 10;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [selectedImg, setSelectedImg] = useState("");
    const [currentLeave, setCurrentLeave] = useState<Leave | null>(null);
  const handleEdit = (leave: Leave) => {
    setCurrentLeave({...leave});
    setIsEditModalOpen(true);
  };

  // Function สำหรับลบข้อมูล
  const handleDelete = (leave: Leave) => {
    setCurrentLeave({...leave});
    setIsDeleteModalOpen(true);
    
  };

  const handleDeleteConfirm = async () => {
    if (!currentLeave) return;
    console.log(currentLeave.id);
    try {
      // ใช้ async/await เพื่อรอการตอบกลับจาก API
      const response = await fetch('/api/admin/deleteformbyid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ส่งข้อมูลทั้งหมดใน currentLeave ไปใน body
        body: JSON.stringify({
          id: currentLeave.id,
          // สามารถเพิ่ม field อื่นๆ จาก currentLeave ที่นี่ถ้าต้องการ
        })
      });
  
      // ตรวจสอบว่า response เป็น OK หรือไม่
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
  
      // แปลง response เป็น JSON
      const result = await response.json();
      console.log('Deleted successfully:', result);
  
      // เมื่อลบสำเร็จ ดึงข้อมูลใหม่จาก database
      const lastDocId = currentPage > 0 ? lastDocIds[currentPage - 1] : null;
      await fetchData(lastDocId);
      // แสดงการแจ้งเตือนว่าลบสำเร็จ
      // toast.success('ลบข้อมูลเรียบร้อย');
    } catch (error) {
      console.error('Error deleting leave:', error);
    }finally {
      setIsDeleteModalOpen(false);
    }
  }
  // Function สำหรับบันทึกการแก้ไข
  const handleSaveEdit = async () => {
    
  if (!currentLeave) return;
  try {
    // ใช้ async/await เพื่อรอการตอบกลับจาก API
    const response = await fetch('/api/admin/editformbyid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ส่งข้อมูลทั้งหมดใน currentLeave ไปใน body
      body: JSON.stringify({
        id: currentLeave.id,
        selectedLeavetype: currentLeave.selectedLeavetype,
        leaveTime: currentLeave.leaveTime,
        reason: currentLeave.reason,
        leaveDays: currentLeave.leaveDays,
        // สามารถเพิ่ม field อื่นๆ จาก currentLeave ที่นี่ถ้าต้องการ
      })
    });

    // ตรวจสอบว่า response เป็น OK หรือไม่
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // แปลง response เป็น JSON
    const result = await response.json();
    console.log('Updated successfully:', result);

    // เมื่ออัปเดตสำเร็จ ดึงข้อมูลใหม่จาก database
    const lastDocId = currentPage > 0 ? lastDocIds[currentPage - 1] : null;
    await fetchData(lastDocId);
    
    // แสดงการแจ้งเตือนว่าอัปเดตสำเร็จ
    // toast.success('บันทึกการแก้ไขเรียบร้อย');
  } catch (error) {
    console.error('Error updating leave:', error);
    // แสดงการแจ้งเตือนเมื่อเกิดข้อผิดพลาด
    // toast.error('ไม่สามารถบันทึกการแก้ไขได้');
    
  } finally {
    // ไม่ว่าจะสำเร็จหรือล้มเหลว ให้ปิด modal และล้างค่า currentLeave
    setIsEditModalOpen(false);
    setCurrentLeave(null);
  }
};

  // Function สำหรับจัดการการเปลี่ยนแปลงข้อมูลใน form แก้ไข
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!currentLeave) return;
    
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCurrentLeave({
        ...currentLeave,
        [parent]: {
          ...currentLeave[parent as keyof Leave] as object,
          [child]: value
        }
      });
    } else {
      setCurrentLeave({
        ...currentLeave,
        [name]: value
      });
    }
  };
const fetchData = async (lastDocId: DocumentSnapshot<DocumentData, DocumentData> | null = null, isPrevious = false) => {
       try {
         setLoading(true);
         let url = `/api/admin/getallleave?selectStatus=${selectStatus}&limit=${limit}`;
         
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
    
    const renderStatus = (status: string) => {
      if (status.includes("waiting")) {
        return <span className={`px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800`}>
                        {status}
                      </span>
      }else if(status === "approved"){
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
    <DashboardLayout title={`admin ${session?.user?.role} ${session?.user?.department}`}>
      <div className="bg-white p-4 rounded shadow">
         {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
       <div className="flex w-full text-xl font-bold mb-4 mr-65">  วัน ณ ปัจจุบัน {today} </div>
        
       <div className="flex flex-row flex-wrap gap-4">
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
                <button onClick={() => {setSelectStatus(''); setCurrentPage(0)}}>ทั้งหมด</button>
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
                      {doc.uploadedPath !== "" && <img src= {`/uploads/${doc.uploadedPath}`} 
                      onClick={() => openImageModal(doc.uploadedPath)
                      }
                      alt="Uploaded File" className="w-10 h-10" />}

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

                            <button
                                onClick={() => handleEdit(doc)}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                แก้ไข
                            </button>
                            <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                             onClick={() => handleDelete(doc)}
                            >
                             ลบ
                            </button>
                       
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {isEditModalOpen && currentLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">แก้ไขข้อมูลการลา</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  name="fullname"
                  value={currentLeave.fullname}
                  readOnly
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
                <input
                  type="text"
                  name="department"
                  value={currentLeave.department}
                  readOnly
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทการลา</label>
                <select
                  name="selectedLeavetype"
                  value={currentLeave.selectedLeavetype}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="ไม่มีใบรับรองแพทย์">ไม่มีใบรับรองแพทย์</option>
                  <option value="มีใบรับรองแพทย์">มีใบรับรองแพทย์</option>
                  <option value="ลากิจ">ลากิจ</option>
                  <option value="ลากิจ">ลากิจพิเศษ</option>
                  <option value="ลาพักร้อน">ลาพักร้อน</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ลา</label>
                <input
                  type="date"
                  name="leaveDays"
                  value={currentLeave.leaveDays}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เวลาเริ่มต้น</label>
                <input
                  type="time"
                  name="leaveTime.startTime"
                  value={currentLeave.leaveTime.startTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เวลาสิ้นสุด</label>
                <input
                  type="time"
                  name="leaveTime.endTime"
                  value={currentLeave.leaveTime.endTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">เหตุผล</label>
                <textarea
                  name="reason"
                  value={currentLeave.reason}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                <select
                  name="status"
                  value={currentLeave.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="waiting for head approval">รออนุมัติ</option>
                  <option value="approved">อนุมัติแล้ว</option>
                  <option value="rejected">ไม่อนุมัติ</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
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

        {isDeleteModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
      <h2 className="text-lg font-semibold mb-4">ยืนยันการลบข้อมูล</h2>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleDeleteConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ยืนยัน
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
)}
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
