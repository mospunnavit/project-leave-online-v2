'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
type LeaveTime = {
  startTime: string;
  endTime: string;
};
const UserformleaveDashboard = () => {
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [leave_type, setLeave_type,] = useState<string>('');
  const [leave_date, setLeave_date] = useState<string>("");
  const [start_time, setStart_time] = useState<string>("");
  const [end_time, setEnd_time] = useState<string>("");
 
  
  const [leavefile, setleavefile] = useState<File>();
  const [leavefileName, setleavefileName] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    const date = new Date().toLocaleDateString(); // หรือ 'th-TH'
    setToday(date);
  }, []);
  useEffect(() => {
    if (leave_type === 'มีใบรับรองแพทย์'){
      console.log("true")
    }
  }, [setLeave_type]);
  
  const insertComponent = () => {
    return (
      <div className="flex flex-col mt-4">
        <label htmlFor="fileUpload" className="block mb-2 text-xl font-medium text-gray-700">
          ใบรับรองแพทย์ (ถ้ามี)
        </label>
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          onChange={(e) => setleavefile(e.target.files![0])}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>
    );
  };
 
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    if (leave_date === undefined || leave_date === '') {
      return;
    }
    const leaveDate = new Date(leave_date);  // leave_date คือ string จาก input
    const today = new Date();
   
    // เคลียร์เวลาให้เป็นเที่ยงคืนทั้งสอง
    leaveDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // คำนวณต่างแบบวัน
    const diffInDays = Math.ceil((leaveDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if(!leave_type){
      setError('กรุณาระบุประเภทการลา');
      return;
    }
    if(!start_time){
      setError('กรุณาระบุเวลาเริ่มต้น');
      return;
    }
    if(!end_time){
      setError('กรุณาระบุเวลาสิ้นสุด');
      return;
    }
    if(!reason){
      setError('กรุณาระบุเหตุผล');
      return;
    }
    if(diffInDays < 3 && (leave_type == "ลากิจ" || leave_type == "ลากิจพิเศษ" || leave_type == "พักร้อน")){
      setError('ไม่สามารถลากิจก่อนวันลาน้อยกว่า 3 วันได้');
      return;
    }

    if(leave_type == "มีใบรับรองแพทย์" && leavefile == undefined){
      setError('กรุณาอัพโหลดใบรับรองแพทย์');
      return;
    }

    //handle if upload file 
    let image_filename	 = '';
    console.log("leave_type"+leave_type, leavefile);
    if(leave_type == "มีใบรับรองแพทย์" && leavefile != undefined){
      console.log("in");
      if (leavefile.size > 0) {
       if (
          leavefile.type !== 'application/pdf' &&
          leavefile.type !== 'image/jpeg' &&
          leavefile.type !== 'image/png'
        ) {
          setError('กรุณาอัพโหลดไฟล์ PDF, JPEG หรือ PNG เท่านั้น');
          return;
        } 
        setLoading(true);
        const formData = new FormData();
        formData.append('file', leavefile);
     
        try {
           const response = await fetch(process.env.NEXT_PUBLIC_API_URL +'/api/v2/user/uploads', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
          
        if (response.ok) {
          image_filename	  = result.path;
          console.log("path"+result.path);
          setleavefileName(result.path)
          await setleavefile(result.path);
    
          
        } else {
          setError(`เกิดข้อผิดพลาด: ${result.error || 'ไม่สามารถอัปโหลดไฟล์ได้'}`);
          return;
        } 
        }catch{
          setError('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');

        }
      
      }
      }
    //api form
    try{
      setLoading(true);
      console.log("env api url"+process.env.NEXT_PUBLIC_API_URL);
      console.log("ส้งไหม" + image_filename	);
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v2/user/leaveform", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              leave_type,
              start_time,
              end_time,
              reason,
              leave_date,
              leavefile,
              image_filename
                       
          })
      })
      console.log(res);
      const result = await res.json();
      if(res.ok){
        setError('');
        setShowSuccess(true);
      
      // รอ 2.5 วินาทีแล้วเปลี่ยนหน้า
      setTimeout(() => {
        router.push("/pages/dashboard/user"); // เปลี่ยนเป็น path ที่ต้องการ redirect ไป
      }, 3000);
      }
      else{
        setError(result.error || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      }
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="ฟอร์มการลา">
      <div className="bg-white p-4 rounded shadow">

       <div className="flex  text-xl font-bold mb-4 mr-65">  วัน ณ ปัจจุบัน {today} </div>
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
        {showSuccess && (
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
        )}
         <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-4">
        {/* ส่วนเลือกประเภทการลา */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <label className="block font-medium mb-2 text-sm sm:text-base" htmlFor="leave">
            เลือกประเภทการลา
          </label>
          <select 
            className="w-full h-10 border rounded px-2 text-sm"
            name="leave" 
            id="leave" 
            required 
            defaultValue=""
            onChange={(e) => setLeave_type(e.target.value)}>
            <option value="" disabled hidden>-- กรุณาเลือกประเภทการลา --</option>
            <optgroup label="ลากิจ">
              <option value="ลากิจ">ลากิจ</option>
              <option value="ลากิจพิเศษ">ลากิจพิเศษ</option>
            </optgroup>
            <optgroup label="ลาป่วย">
              <option value="มีใบรับรองแพทย์">มีใบรับรองแพทย์</option>
              <option value="ไม่มีใบรับรองแพทย์">ไม่มีใบรับรองแพทย์</option>
            </optgroup>
            <optgroup label="พักร้อน">
              <option value="พักร้อน">พักร้อน</option>
            </optgroup>
          </select>
        </div>
        
        {/* ส่วนเลือกวันและเวลา */}
        <div className="flex flex-col sm:flex-row shadow rounded-lg overflow-hidden">
          {/* วันที่ลา */}
          <div className="w-full sm:w-1/3 p-3 sm:p-4 bg-gray-50">
            <label className="block font-medium mb-2 text-sm sm:text-base">วันที่ลา</label>
            <input 
              type="date"
              className="w-full bg-white border border-gray-300 py-2 px-3 rounded text-sm sm:text-base"
              value={leave_date}
              onChange={(e) => setLeave_date(e.target.value)}
            />
          </div>
          
          {/* เวลาเริ่มและสิ้นสุด */}
          <div className="w-full sm:w-2/3 p-3 sm:p-4 bg-white">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {/* เวลาเริ่ม */}
              <div className="flex-1">
                <label htmlFor="startTime" className="block font-medium mb-1 text-sm sm:text-base">
                  เวลาเริ่ม
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={start_time}
                  onChange={(e) => setStart_time(e.target.value)}
                  className="w-full border p-2 rounded text-sm sm:text-base"
                  required
                  lang="th"
                  step="60"
                />
              </div>
              
              {/* ถึง */}
              <div className="hidden sm:flex items-center justify-center mt-6">
                <span className="text-gray-500">ถึง</span>
              </div>
              <div className="flex sm:hidden items-center justify-center my-1">
                <span className="text-gray-500">ถึง</span>
              </div>
              
              {/* เวลาสิ้นสุด */}
              <div className="flex-1">
                <label htmlFor="endTime" className="block font-medium mb-1 text-sm sm:text-base">
                  เวลาสิ้นสุด
                </label>
                <input 
                  type="time"
                  id="endTime"
                  name="endTime"
                  required
                  lang="th"
                  step="60"
                  value={end_time}
                  onChange={(e) => setEnd_time(e.target.value)}
                  className="w-full border p-2 rounded text-sm sm:text-base"
                />
              </div>
            </div>
            
            {/* แสดงเวลาที่เลือก */}
            <div className="mt-3 p-2 sm:p-3 bg-gray-100 rounded text-sm">
              <div className="font-medium mb-1">เวลาที่เลือก</div>
              <p>{start_time|| '--:--'} - {end_time || '--:--'}</p>
            </div>
          </div>
        </div>
        
        {/* ส่วนอัพโหลดใบรับรองแพทย์ (ถ้าเลือกมีใบรับรองแพทย์) */}
        {leave_type === 'มีใบรับรองแพทย์' && insertComponent()}
        
        {/* ส่วนเหตุผล */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <label className="block font-medium mb-2 text-sm sm:text-base">เหตุผล</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-24 bg-white border border-gray-300 py-2 px-3 rounded text-sm sm:text-base"
            placeholder="กรุณาระบุเหตุผล"
          />
        </div>
        
        {/* ปุ่มส่งคำขอ */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            ส่งคำขอ
          </button>
        </div>
      </div>
      
      {loading && (
          <>
            <Loading/>
            <p className="text-xs sm:text-sm text-blue-500 animate-pulse mt-1">กำลังอัพเดทสถานะ...</p>
          </>
        )}
    </form>
      </div>
    </DashboardLayout>
  );
};

export default UserformleaveDashboard;
