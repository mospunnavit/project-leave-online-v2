'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import getWorkDuration  from "@/lib/calworkduration";
import { Leavetypes } from "@/app/types/leavetypes";
type LeaveQuota = {
  hours: number;
  minutes: number;
  total: number;
};

const UserformleaveDashboard = () => {
  const { data: session } = useSession();
  const [getLeaveType, setGetLeaveType] = useState<Leavetypes[]>([]);

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [leave_type, setLeave_type,] = useState<string>('');
  const [continue_leave, setContinue_leave] = useState(false);
  const [leaveShift, setLeaveShift] = useState('');
  const [leaveDuration, setLeaveDuration] = useState('');
  const [useLeaveQuota, setUseLeaveQuota] = useState<LeaveQuota | null>(null);
  const [leave_date, setLeave_date] = useState<string>("");
  const [end_leave_date, setEnd_leave_date] = useState<string>("");
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
  const fetchLeaveType = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v2/shared/getleavetypes");
      const data = await res.json();
      setGetLeaveType(data.dataleavetypes);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  }
   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [shift, duration] = e.target.value.split('|');
    setLeaveShift(shift);
    setLeaveDuration(duration);
  };
  useEffect(() => {
    fetchLeaveType();
    console.log("leave_type: ", getLeaveType);
  }, [])
  useEffect(() => {
    console.log("leave_type: ", getLeaveType);
  }, [getLeaveType])

  useEffect(() => {
  if (!leaveShift || !leaveDuration) return;

  if (leaveShift === "กะเช้า") {
    if (leaveDuration === "20003") {
      setStart_time("08:00");
      setEnd_time("17:00");
    } else if (leaveDuration === "20004") {
      setStart_time("08:00");
      setEnd_time("12:00");
    } else if (leaveDuration === "20007") {
      setStart_time("13:00");
      setEnd_time("17:00");
    }
  } else if (leaveShift === "กะดึก") {
    if (leaveDuration === "20003") {
      setStart_time("20:00");
      setEnd_time("04:30");
    } else if (leaveDuration === "20004") {
      setStart_time("20:00");
      setEnd_time("00:00");
    } else if (leaveDuration === "20007") {
      setStart_time("01:00");
      setEnd_time("04:30");
    }
  }
}, [leaveShift, leaveDuration]);

// หลัง start_time / end_time ถูกอัปเดตแล้ว ค่อยคำนวณ leave quota
useEffect(() => {
  if (!leaveShift || !leaveDuration || !start_time || !end_time) return;

  if (leaveShift === "กะเช้า") {
    setUseLeaveQuota(getWorkDuration(start_time, end_time, "12:00", "13:00"));
  } else if (leaveShift === "กะดึก") {
    setUseLeaveQuota(getWorkDuration(start_time, end_time, "00:00", "01:00"));
  }
}, [start_time, end_time, leaveShift, leaveDuration]);


const insertComponentFileupload = () => {
    return (
      <div className="flex flex-col mt-4">
        <label htmlFor="fileUpload" className="block mb-2 text-xl font-medium text-gray-700">
          ใบรับรองแพทย์ 
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
  const insertComponentEndLeaveDate = () => {
    return (
       <div className="flex-1">
                <label className="block font-medium mb-2 text-sm sm:text-base">ถึงวันที่</label>
                <input 
                  type="date"
                  className="w-full bg-white border border-gray-300 py-2 px-3 rounded text-sm sm:text-base"
                  value={end_leave_date}
                  onChange={(e) => setEnd_leave_date(e.target.value)}
                />
              </div>
    );
  };

 
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(leave_type,leave_date, leaveShift, leaveDuration, start_time, end_time, reason, leavefile);
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

    if(leave_type == "020004" && leavefile == undefined){
      setError('กรุณาอัพโหลดใบรับรองแพทย์');
      return;
    }

    //handle if upload file 
    let image_filename	 = '';
    console.log("leave_type"+leave_type, leavefile);
    if(leave_type == "020004" && leavefile != undefined){
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
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v2/user/leaveform-v3", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              leave_date,
              end_leave_date,
              start_time,
              end_time,
              reason,
              leave_type,
              leaveDuration,
              leaveShift,
              useLeaveQuota: useLeaveQuota?.total,
              image_filename 
                       
          })
      })
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
  useEffect(() => {
    if(leave_type == "020007"){
      setContinue_leave(true);
    }else{
      setContinue_leave(false);
      setEnd_leave_date('');
    }

  }, [leave_type]);
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
                onChange={(e) => setLeave_type(e.target.value)}
              >
                <option value="" disabled hidden>-- กรุณาเลือกประเภทการลา --</option>
                {getLeaveType.map((type) => (
                  <option key={type.lt_name} value={type.lt_code}>
                    {type.lt_name}
                  </option>
                ))}
              </select>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <label className="block font-medium mb-2 text-sm sm:text-base">ลาวันเดียวหรือหลายวัน</label>
              <div className="flex flex-colsm:flex-row gap-4">
                
                  <div className="flex-1">
                     <label className="flex items-center gap-2 text-sm sm:text-base">
                        <input
                          type="radio"
                          name="continue_leave"
                          value="false"
                          checked={continue_leave === false}
                          onChange={() => setContinue_leave(false)}
                        />
                        ลาวันเดียว
                    </label>
                  </div>
                  <div className="flex-1">
                        <label className="flex items-center gap-2 text-sm sm:text-base">
                          <input
                            type="radio"
                            name="continue_leave"
                            value="true"
                            checked={continue_leave === true}
                            onChange={() => setContinue_leave(true)}
                          />
                          ลาหลายวัน
                         </label>
                  </div>
              </div>
        </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* กลุ่มที่ 1 */}
              <div className="flex-1">
                <label className="block font-medium mb-2 text-sm sm:text-base">วันที่ลา</label>
                <input 
                  type="date"
                  className="w-full bg-white border border-gray-300 py-2 px-3 rounded text-sm sm:text-base"
                  value={leave_date}
                  onChange={(e) => setLeave_date(e.target.value)}
                />
              </div>

              {/* กลุ่มที่ 2 */}
              {continue_leave && insertComponentEndLeaveDate()}

            </div>
          
        </div>
         {/* ส่วนเลือกกะและช่วงเวลาการลา */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <label className="block font-medium mb-2 text-sm sm:text-base" htmlFor="leave">
            เลือกกะและช่วงเวลาการลา
          </label>
          <select
        className="w-full h-10 border rounded px-2 text-sm"
        name="leave"
        id="leave"
        required
        defaultValue=""
        onChange={handleChange}
      >
        <option value="" disabled hidden>
          -- กรุณาเลือกกะและช่วงเวลาการลา --
        </option>

        <optgroup label="กะเช้า">
          <option value="กะเช้า|20003">เต็มวัน (08:00 - 17:00)</option>
          {!continue_leave && (
            <> <option value="กะเช้า|20004">ครึ่งวันเช้า (08:00 - 12:00)</option>
              <option value="กะเช้า|20007">ครึ่งวันบ่าย (13:00 - 17:00)</option>
            </>
          )}
         
        </optgroup>

        <optgroup label="กะดึก">
          <option value="กะดึก|20003">เต็มวัน (20:00 - 04:30)</option>
          {!continue_leave && (
            <>
            <option value="กะดึก|20004">ครึ่งวันก่อนเที่ยงคืน (20:00 - 00:00)</option>
          <option value="กะดึก|20007">ครึ่งวันหลังตีหนึ่ง (01:00 - 4:30)</option>  
            </>
          )}
          
        </optgroup>
      </select>
        </div>
          

        {/* ส่วนเลือกกะและช่วงเวลาการลา */}
        <div className="flex flex-col sm:flex-row shadow rounded-lg overflow-hidden">

          {/* ช่วงเวาที่ลา */}
          <div className="flex flex-col">


         
          
                    <div className="w-full sm:w-1/3 p-3 sm:p-4 bg-gray-50">
                   
             </div>
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
            
           
          </div>
        </div>
        
        {/* ส่วนอัพโหลดใบรับรองแพทย์ (ถ้าเลือกมีใบรับรองแพทย์) */}
        {leave_type === '020004'  && insertComponentFileupload()}
        
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
