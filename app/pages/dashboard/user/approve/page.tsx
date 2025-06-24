'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import {DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { Leave } from '@/app/types/formleave';
import { Loading } from "@/app/components/loading";
import ModalLayout from "@/app/components/modallayout";



const approveDashboard = () => {
    const { data: session, status } = useSession();    
    const [docs, setDocs] = useState<Leave[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<String>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [today, setToday] = useState('');
    const [selectStatus, setSelectStatus] = useState<String>('');
    const [showImg, setShowImg] = useState(false);
    const [currentLeave, setCurrentLeave] = useState<Leave | null>(null);
    const [selectedImg, setSelectedImg] = useState("");
    const [searchUsername, setSearchUsername] = useState('');
    const [rejectedModal, setRejectedModal] = useState(false);
    const [confrimModal, setConfrimModal] = useState(false);
    const [getdepartmentsManagement, setdepartmentsManagement] = useState<[]>([]);


 const handleReject = (leave: Leave) => {
     setCurrentLeave({...leave});
     setRejectedModal(true);
     
   };
   const handleConfrim = (leave: Leave) => {
     setCurrentLeave({...leave});
     setConfrimModal(true);
     
   };

 const getRoleSpecificData = () => {
        if (!session?.user?.role) return { title: "อนุมัติการลา", statuses: [] };

        if (session.user.department === 'hr') {
             return {
                    title: "HR อนุมัติ",
                    apiPath: "/api/user/getleavesforhr",
                    pendingStatus: "waiting for hr approval",
                    approvedStatus: "approved",
                    rejectedStatus: "rejected by hr",
                 
                };
        }
        switch (session.user.role) {
            case 'head':
                return {
                    title: "หัวหน้าแผนกอนุมัติ",
                    pendingStatus: "waiting for head approval",
                    approvedStatus: "waiting for manager approval",
                    rejectedStatus: "rejected by head",
                  
                    
                };
            case 'manager':
                return {
                    title: "ผู้จัดการอนุมัติ",
                    pendingStatus: "waiting for manager approval",
                    approvedStatus: "waiting for hr approval",
                    rejectedStatus: "rejected by manager",
                  
                    
                };
            case 'hr':
                return {
                    title: "HR อนุมัติ",
                    pendingStatus: "waiting for hr approval",
                    approvedStatus: "approved",
                    rejectedStatus: "rejected by hr",
                    
                };
            default:
                return {
                    title: "อนุมัติการลา",
                    pendingStatus: "pending",
                    approvedStatus: "approved",
                    rejectedStatus: "rejected"
                };
        }
    };
    const roleData = getRoleSpecificData();
    console.log(roleData.pendingStatus, roleData.approvedStatus, roleData.rejectedStatus);
  const fetchLeaveData = async () => {
      setLoading(true);
      try {

        const res = await fetch(process.env.NEXT_PUBLIC_API_URL +`/api/v2/user/getleaveformbyuser?page=${currentPage}&status=${selectStatus}`);
        const data = await res.json();

        //data {data: Leave[], length: number}
        if (res.ok){ 
          setDocs(Array.isArray(data.data) ? data.data : []);
          setHasMore(data.data.length < 5);
          console.log("data" ,data);
        }else{
          setError('API error: ' + (data.error || 'Unknown error'));
        }
        
        
      } catch (err) {
        console.error('Error fetching leave data', err);
      } finally {
        setLoading(false);
      }
    };
    const fecthDepartmentsManagement = async () => {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v2/user/getdepartmentmanagement');
          const data = await res.json();
          if (res.ok) {
            setdepartmentsManagement(data.departmentsManagement || []);
            console.log("sss", data.departmentsManagement);
          } else {
            setError('API error: ' + (data.error || 'Unknown error'));
          }
        } catch (err) {
          setError('API error: ' + (err || 'Unknown error'));
        }
    }
 useEffect(() => {

    fetchLeaveData();
    fecthDepartmentsManagement();
    console.log(docs);
    console.log(getdepartmentsManagement);
  }, [currentPage, selectStatus]);

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
const translateStatus = (status: string): string => {
  return statusTranslations[status] || status; // ถ้าไม่มีคำแปล ให้คืนค่าเดิม
};
    const renderStatus = (status: string) => {
      console.log("Test"+ status, roleData.pendingStatus);
      if (status === roleData.pendingStatus) {
        return <span className={`px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800`}>
                        {translateStatus(status)}
                      </span>
      }else if(status === roleData.approvedStatus || status === "approved"){
           return <span className={`px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800`}>
                         {translateStatus(status)}
                      </span>
      }else if(status.includes("rejected")){
            return  <span className={`px-2 py-1 rounded text-xs font-medium bg-red-200 text-red-800`}>
                         {translateStatus(status)}
                      </span>
      }else{
        return    <span className={`px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800`}>
                         {translateStatus(status)}
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

const handleChangeStatus = async (id: number, newStatus: string) => {
  try {
    const response = await fetch('/api/v2/user/editstatusbyuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status: newStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error:', data.error);
      setError(data.error);
      return;
    }
    
    if(response.ok){
      console.log('Status updated successfully');
      fetchLeaveData();
    }
    // คุณอาจเรียก fetch ใหม่ หรือรีเฟรชข้อมูลที่แสดง
  } catch (err) {
    console.error(err);
   
  }
};


const dateTimeFormatter = new Intl.DateTimeFormat('th-TH', {
  timeZone: 'Asia/Bangkok',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric', 
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

const formatDateWithOffset = (dateString : string, hoursOffset = 0) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const adjustedDate = new Date(date.getTime() + (hoursOffset * 60 * 60 * 1000));
  return dateTimeFormatter.format(adjustedDate);
};

      if (loading && docs.length === 0) return <Loading />;
  return (
    <DashboardLayout title={`หัวหน้าอนุมัติ ${session?.user?.role} ${session?.user?.department}`}>
      <div className="bg-white p-4 rounded shadow">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex">
            <div className="flex w-full text-xl font-bold mb-4 mr-65">  
            {getdepartmentsManagement.map((item, index) => (
                <div className = "flex"key={index}>
                  <p>จัดการแผนก: </p>
                 <p>{(item.departments || '').split(',').map(dep => dep.trim()).join(' ')}</p>
                </div>
              ))}
                            
            </div>
            <div className="flex justify-end w-full gap-2 items-center">
              <span>ชื่อผู้ใช้</span>
            <input type="text" placeholder="" className=" border-gray-300 px-2 py-1 rounded "/>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">ค้นหา</button>
            </div>
        </div>
       <div className="flex flex-row flex-wrap gap-4 ">
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
                <button onClick={() => {setSelectStatus(''); setCurrentPage(1)}}>ทั้งหมด</button>
            </div>
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
     
                <button onClick={() => {setSelectStatus(roleData?.pendingStatus ?? ''); setCurrentPage(1)}}>รอการอนุมัติ</button>
            </div>
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
            <button onClick={() => {setSelectStatus(roleData?.approvedStatus ?? ''); setCurrentPage(1)}}>อนุมัติแล้ว</button>
            </div>
            <div className="flex flex-col w-full sm:w-[calc(25%-0.75rem)] bg-white p-4 rounded shadow">
            <button onClick={() => {setSelectStatus(roleData?.rejectedStatus ?? ''); setCurrentPage(1)}}>ยกเลิก</button>
            </div>
       </div>
       <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-collapse border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ผู้ใช่</th>
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
                    <td className="border px-4 py-2">{doc.username}</td>
                    <td className="border px-4 py-2">{doc.firstname}  {doc.lastname}</td>
                    <td className="border px-4 py-2">{doc.department_name}</td>
                    <td className="border px-4 py-2">{doc.lt_name}
                      {doc.lt_name === "ป่วยมีใบแพทย์(วัน)" && <img src= {`/uploads/${doc.image_filename}`} 
                      onClick={() => openImageModal(doc.image_filename)
                      }
                      alt="Uploaded File" className="w-10 h-10" />}
                    </td>
                    <td className="border px-4 py-2">{formatDateWithOffset(doc.leave_date, 7).split(' ')[0]}</td>
                    <td className="border px-4 py-2">{doc.start_time} - {doc.end_time}</td>
                    <td className="border px-4 py-2">{doc.reason}</td>
                     <td className="border px-4 py-2">
                        {formatDateWithOffset(doc.submitted_at, 7)}
                      
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col flex-wrap gap-3">
                      <div className="">
                        {renderStatus(doc.status)}
                      </div>
                      <div >
                         {doc.status === roleData?.pendingStatus && (
                        <>
                            <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleConfrim(doc)}
                            >
                            อนุมัติ
                            </button>
                            <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                            onClick={() => handleReject(doc)}
                            >
                            ไม่อนุมัติ
                            </button>
                        </>
                        )}
                      </div>
                     </div>
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
              onClick={handlePrev}
              disabled={currentPage <= 0 || loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                currentPage == 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              ก่อนหน้า
            </button>
            
            <span className="self-center text-sm">หน้า {currentPage}</span>
            
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
          {rejectedModal && currentLeave && (
  <ModalLayout onClose={() => setRejectedModal(false)}>
    <h2 className="text-lg font-semibold mb-4">ไม่อนุมัติการลาของ {currentLeave.username}  {currentLeave.firstname} {currentLeave.lastname}</h2>
    <div className="flex justify-end gap-2">
      <button
        onClick={() => {
          handleChangeStatus(currentLeave.id, roleData?.rejectedStatus ?? '');
          setRejectedModal(false);
        }}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        ยืนยัน
      </button>
      <button
        onClick={() => setRejectedModal(false)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ยกเลิก
      </button>
    </div>
  </ModalLayout>
)}
{confrimModal && currentLeave && (
<ModalLayout onClose={() => setConfrimModal(false)}>
    <h2 className="text-lg font-semibold mb-4">ยืนยันการลาของ {currentLeave.username} {currentLeave.firstname} {currentLeave.lastname}</h2>
    <div className="flex justify-end gap-2">
      <button
        onClick={() => {
          handleChangeStatus(currentLeave.id, roleData?.approvedStatus ?? '');
          setConfrimModal(false);
        }}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        ยืนยัน
      </button>
      <button
        onClick={() => setConfrimModal(false)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ยกเลิก
      </button>
    </div>
  </ModalLayout>
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