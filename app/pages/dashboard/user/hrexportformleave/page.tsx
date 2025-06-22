'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import {DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { Leave } from '@/app/types/formleave';
import { Loading } from "@/app/components/loading";
import ModalLayout from "@/app/components/modallayout";
import { Download, Loader2 } from 'lucide-react';
import { X } from "lucide-react";

const approveDashboard = () => {
    const { data: session, status } = useSession();    
    const [docs, setDocs] = useState<Leave[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<String>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectStatus, setSelectStatus] = useState<string>('approved');
    const [showImg, setShowImg] = useState(false);
    const [currentLeave, setCurrentLeave] = useState<Leave | null>(null);
    const [selectedImg, setSelectedImg] = useState("");
    const [searchUsername, setSearchUsername] = useState('');
    const [rejectedModal, setRejectedModal] = useState(false);
    const [confrimModal, setConfrimModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [from_date, setFrom_date] = useState('');
    const [to_date, setTo_date] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const [detailsModal, setDetailsModal] = useState(false);


  const validateDateRange = () => {
  
     if((from_date === '' && to_date !== '') || (from_date !== '' && to_date === '')){
      console.log("in1" , from_date, to_date);
      setError('กรุณาวันที่เลือกช่วงวันที่ให้ครบถ้วน');  
      return false;
    }else if(to_date < from_date){
      setError('กรุณาวันที่เลือกช่วงวันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น');
       console.log("in3" , from_date, to_date);
      return false;
    }else if(to_date && from_date){
       console.log("in2" , from_date, to_date);
      setError('');
      return true;
    } 
  }
  const handleSearch = () => {
    if(validateDateRange()){
      fetchLeaveData();
    }
  }

  const handleshowDetails = (leave: Leave) => {
    console.log(leave);
    setCurrentLeave(leave);
    setDetailsModal(true);
  }
  
  const handlecloseDetails = () => {
    setCurrentLeave(null);
    setDetailsModal(false);
  }




   const fetchLeaveData = async () => {
      
      setLoading(true);
      try {

        const res = await fetch(process.env.NEXT_PUBLIC_API_URL +`/api/v2/user/getleavebyhr?page=${currentPage}&status=${selectStatus}&from_date=${from_date}&to_date=${to_date}`);
        const data = await res.json();

        //data {data: Leave[], length: number}
        setDocs(Array.isArray(data.data) ? data.data : []);
        setHasMore(data.data.length < 5);
        
      } catch (err) {
        console.error('Error fetching leave data', err);
      } finally {
        setLoading(false);
      }
    };
 useEffect(() => {

    fetchLeaveData();
  }, [currentPage, selectStatus, selectedMonth]);
   useEffect(() => {

    console.log(docs);
  }, [docs]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => prev + 1);

    const openImageModal = (imagePath : string) => {
    setSelectedImg(imagePath);
    setShowImg(true);
};

// ฟังก์ชันสำหรับการปิด modal
const closeImageModal = () => {
  setShowImg(false);
};


const handleExport = async () => {
    if(validateDateRange()){
         setIsExporting(true);
       
        try {
            // สร้าง query parameters
            // เรียก API
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL +`/api/v2/user/exportexcelbyhrv2?status=${selectStatus}&from_date=${from_date}&to_date=${to_date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to export data');
            }

            // สร้าง blob จาก response
            const blob = await response.blob();
            
            // สร้าง URL สำหรับ download
            const url = window.URL.createObjectURL(blob);
            
            // สร้าง link element และ trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = `leave_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            
            // ทำความสะอาด
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            
        } catch (error) {
          setError('something went wrong');
        } finally {
            setIsExporting(false);
        } 
    }else{
      return;
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

function formatThaiDateYYYYMMDD(isoDateString : string) {
  const date = new Date(isoDateString);

  // ปรับให้เป็นเวลาไทย
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));

  const year = tzDate.getFullYear();
  const month = String(tzDate.getMonth() + 1).padStart(2, '0');
  const day = String(tzDate.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

      if (loading && docs.length === 0) return <Loading />;
  return (
    <DashboardLayout title={`Export to excel by ${session?.user?.role} ${session?.user?.department}`}>
      <div className="bg-white p-4 rounded shadow">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
            <div className="flex w-full text-xl font-bold mb-4 mr-65">เลือกช่วงวันที่ต้องการ</div>
            <div className="flex w-full text-xl font-bold mb-4 gap-4" > 
              <input type="date" value={from_date} onChange={e => setFrom_date(e.target.value)} />
              <div className="py-2">-</div>
              <input type="date" value={to_date} onChange={e => setTo_date(e.target.value)} />
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleSearch}>ค้นหา</button>
        <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
            {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exporting...' : 'Export Excel'}
        </button>            </div>
        </div>
       <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-collapse border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">รหัสพนักงาน</th>
                  <th className="border px-4 py-2">วันที่ลา</th>
                  <th className="border px-4 py-2">รหัสกะ</th>
                  <th className="border px-4 py-2">รหัสผลข้อตกลงเงินหัก</th>
                  <th className="border px-4 py-2">รหัสลักษณะการรูดบัตร</th>
                  <th className="border px-4 py-2">วิธีลา</th>
                  <th className="border px-4 py-2">จำนวนที่ลา</th>
                  <th className="border px-4 py-2">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{doc.username}</td>
                    <td className="border px-4 py-2">{formatThaiDateYYYYMMDD(doc.leave_date)} 
                     {doc.end_leave_date && ` - ${formatThaiDateYYYYMMDD(doc.end_leave_date)}`}</td>
                    <td className="border px-4 py-2">00</td>
                    <td className="border px-4 py-2">{doc.lt_code}</td>
                    <td className="border px-4 py-2">{doc.lc_code}</td>
                    <td className="border px-4 py-2">ตามที่บันทึก</td>
                    <td className="border px-4 py-2">{doc.usequotaleave}</td>    
                        <td className="border px-4 py-2 flex gap-2">
                          {/* ปุ่มรายละเอียด */}
                          <div>
                          <button
                            onClick={() => handleshowDetails(doc)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded shadow"
                          >
                            รายละเอียด
                          </button>

                          {/* ปุ่ม Export มีเงื่อนไขสีตามค่า exported */}
                          <button
                           
                            className={`text-sm font-medium px-3 py-1 rounded shadow 
                              ${doc.exported === 1
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}
                            `}
                          >
                            {doc.exported === 1 ? 'Exported' : 'Export'}
                          </button>
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
     {detailsModal && currentLeave && (
         <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  รายละเอียดการลาของ <span className="text-blue-600">{currentLeave.username}</span>
                </h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <X size={24} onClick={() => setDetailsModal(false)}/>
                </button>
              </div>

              {/* Content */}
            <div className="grid grid-cols-2 gap-4 p-4 text-sm text-gray-700">
        <div><strong>ชื่อจริง-นามสกุล:</strong> {currentLeave.firstname} {currentLeave.lastname}</div>
        <div><strong>แผนก:</strong> {currentLeave.department_name}</div>
        <div><strong>วันที่ลา:</strong> {formatThaiDateYYYYMMDD(currentLeave.leave_date)}</div>
        <div><strong>เวลา:</strong> {currentLeave.start_time} - {currentLeave.end_time}</div>
        <div><strong>ประเภทการลา:</strong> {currentLeave.lt_name}</div>
        <div><strong>จำนวนวัน:</strong> {currentLeave.usequotaleave}</div>
        <div ><strong>เหตุผล:</strong> {currentLeave.reason || '-'}</div>
        <div ><strong>สถานะการนำออก:</strong> 
        {currentLeave.exported ? 'นำออกแล้ว' : 'ยังไม่นำออก'}</div>

        <div>
          <strong>สถานะ: </strong>
          <span>
            {currentLeave.status}
          </span>
        </div>

        {/* รูปภาพแนบใบรับรองแพทย์ */}
        <div>
          <strong>แนบไฟล์:</strong><br />
          {currentLeave.image_filename ? (
            <div className="mt-1">
              <p className="text-sm text-gray-600 mb-2">
                ไฟล์: {currentLeave.image_filename}
              </p>
              <img
                src={`/uploads/${currentLeave.image_filename}`}
                alt="ใบรับรองแพทย์"
                onClick={() => openImageModal(currentLeave.image_filename)}
                className="w-32 h-32 object-cover border rounded cursor-pointer hover:opacity-80"
              />
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-1">ยังไม่มีไฟล์แนบ</p>
          )}
        </div>
      </div>

        </div>
      </div>
    
      )}    
    
    </DashboardLayout>
  );
};

export default approveDashboard;
