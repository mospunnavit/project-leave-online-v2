'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import { Timestamp } from "firebase-admin/firestore";
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from "react";

type LeaveTime = {
  startTime: string;
  endTime: string;
};
const UserformleaveDashboard = () => {
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const [selectedLeavetype, setSelectedLeavetype] = useState<string>('');
  const [leaveTime, setLeaveTime] = useState<LeaveTime>({ startTime: '', endTime: '' });
  const [periodTime, setPeriodTime] = useState<string>('');
  const [leaveDays, setLeaveDays] = useState<string>("");
  const [today, setToday] = useState('');

  useEffect(() => {
    const date = new Date().toLocaleDateString(); // หรือ 'th-TH'
    setToday(date);
  }, []);
  useEffect(() => {
    if (selectedLeavetype === 'มีใบรับรองแพทย์'){
      console.log("true")
    }
  }, [selectedLeavetype]);
  useEffect(() => {
    setPeriodTime(`${leaveTime.startTime} - ${leaveTime.endTime}`);
  }, [leaveTime]);
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
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>
    );
  };
 
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    console.log(selectedLeavetype, leaveTime, reason, leaveDays);
    if (leaveDays === undefined || leaveDays === '') {
      return;
    }
    const leaveDate = new Date(leaveDays);  // leaveDays คือ string จาก input
    const today = new Date();
    
    // เคลียร์เวลาให้เป็นเที่ยงคืนทั้งสอง
    leaveDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // คำนวณต่างแบบวัน
    const diffInDays = Math.ceil((leaveDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    console.log(`เหลืออีก ${diffInDays} วัน`);

    if(!selectedLeavetype){
      setError('กรุณาระบุประเภทการลา');
      return;
    }
    if(!leaveTime.startTime){
      setError('กรุณาระบุเวลาเริ่มต้น');
      return;
    }
    if(!leaveTime.endTime){
      setError('กรุณาระบุเวลาสิ้นสุด');
      return;
    }
    if(!reason){
      setError('กรุณาระบุเหตุผล');
      return;
    }
    if(diffInDays < 3 && (selectedLeavetype == "ลากิจ" || selectedLeavetype == "ลากิจพิเศษ" || selectedLeavetype == "พักร้อน")){
      setError('ไม่สามารถลากิจก่อนวันลาน้อยกว่า 3 วันได้');
      return;
    }
    try{
      console.log("env api url"+process.env.NEXT_PUBLIC_API_URL);

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/formleave", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              selectedLeavetype,
              leaveTime,
              reason,
              leaveDays,
              periodTime

            
          })
      })
      const result = await res.json();
      console.log(result);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <DashboardLayout title="ฟอร์มการลา">
      <div className="bg-white p-4 rounded shadow">

       <div className="flex  text-xl font-bold mb-4 mr-65">  วัน ณ ปัจจุบัน {today} </div>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="max-w-4xl mx-auto p-4 space-y-4">
                <div>

                <label className="font-medium mb-1 p-4 h-12" htmlFor="leave" >เลือกประเภทการลา</label>
                    <select className ="h-10 border rounded"name="leave" id="leave" required defaultValue=""
                    onChange={(e) => setSelectedLeavetype(e.target.value)}>
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
                <br></br>
            </div>
            <div className="flex flex-row shadow p-4">
                <div className="flex flex-col basis-1/3 grow-0 min-w-64 p-4 mt-2">
                    <label className="font-medium">วันที่ลา</label>
                        <input type="date"
                            className="bg-gray-100 border border-gray-300 py-2 px-3 rounded text-lg"
                            value={leaveDays}
                            onChange={(e) => setLeaveDays(e.target.value)}/>
                    </div>
                    <div className="flex flex-col basis-2/3 grow-0 min-w-64 p-4 ">
                    <div className="flex flex-row gap-4 p-2">
                        <div className="flex-1">
                            <div>
                                <label htmlFor="startTime" className="font-medium ">เวลาเริ่ม</label>
                            </div>
                            
                            <input
                              type="time"
                              id="startTime"
                              name="startTime"
                              value={leaveTime.startTime}
                              onChange={(e) => setLeaveTime({ ...leaveTime, startTime: e.target.value })}
                              
                              className="w-full border p-2 rounded"
                              required
                              lang="th"
                              step="60" // optional: step เป็นวินาที (60 = 1 นาที)
                              />
                        </div>

                        <span className="mt-8">ถึง</span>

                        <div className="flex-1">
                            <label htmlFor="endTime" className="font-medium ">เวลาสิ้นสุด</label>
                            <input type="time" 
                            id="endTime"
                            name="endTime"
                            required
                            lang="th"
                            step="60" // optional: step เป็นวินาที (60 = 1 นาที)
                            value= {leaveTime.endTime} 
                            onChange={(e) => setLeaveTime({ ...leaveTime, endTime: e.target.value })} 
                            
                            className="w-full border p-2 rounded" 
                            />
                        </div>
                        <div className="flex-1 mt-4 p-3 bg-gray-100 rounded">
                            <div>
                               เวลาที่เลือก 
                            </div>
                                                       <p >{leaveTime.startTime} - {leaveTime.endTime}</p>
                        </div>
                        </div>
                    </div>
                </div>
                {selectedLeavetype === 'มีใบรับรองแพทย์' && insertComponent()}
            

           
            <div className="flex flex-col p-4">
            <label className="font-medium mb-1">เหตุผล</label>
            <input
                    type="textarea"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="bg-gray-100 border border-gray-300 py-2 px-3 rounded text-lg"
                    placeholder="กรุณาระบุเหตุผล"
                  />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                ส่งคำขอ
              </button>
            </div>
          </div>
        
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UserformleaveDashboard;
