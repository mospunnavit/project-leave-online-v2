'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import { useSession } from "next-auth/react";
import { useState } from "react";
type LeaveField = {
  date: string;
  days: string;
};
const UserformleaveDashboard = () => {
  const [leaveFields, setLeaveFields] = useState<LeaveField[]>([]);
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  

  const handleChange = (index: number,field: keyof LeaveField , value: string) => {
    const updated = [...leaveFields];
    updated[index][field] = value;
    setLeaveFields(updated);
  };

  const addField = () => {
    setLeaveFields([...leaveFields, { date: '', days: '' }]);
  };

  const removeField = () => {
    setLeaveFields(leaveFields.slice(0, -1));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const hasEmpty = leaveFields.some(field => !field.date || !field.days);
    const dates = leaveFields.map(field => field.date);
    const hasDuplicateDate = new Set(dates).size !== dates.length;
    if (hasEmpty || leaveFields.length === 0) {
      setError('กรุณาระบุวันที่ลาและจำนวนวันที่ลา');
      return;
    }
    if(hasDuplicateDate){
      setError('กรุณาระบุวันที่ลาไม่ซ้ํากัน');
      return;
    }
    if (!reason) {
      setError('กรุณาระบุเหตุผล');
      return;
      
    }
    e.preventDefault();
    console.log(leaveFields);
    console.log(reason);
    try{
        const email = session?.user?.email;
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/formleave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                leaveFields,
                reason
            })
        });
        if (res.ok) {
          const data = await res.json(); // <-- ดึง message จาก response
          console.log(data.message);
        } else {
          const errorData = await res.json();
          setError(errorData.error || "Something went wrong.");
        }
    }catch(err){
        
        console.log(err);
    }
  };

  return (
    <DashboardLayout title="UserFormLeave">
      <div className="bg-white p-4 rounded shadow">
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {leaveFields.map((field, index) => (
              <div key={index} className="flex flex-row flex-wrap gap-4 shadow p-4">
                <div className="flex flex-col basis-0 flex-1 min-w-64">
                  <label className="font-medium mb-1">วันที่ลา</label>
                  <input
                    type="date"
                    value={field.date}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="bg-gray-100 border border-gray-300 py-2 px-3 rounded text-lg"
                  />
                </div>
                <div className="flex flex-col basis-0 flex-1 min-w-64">
                  <label className="font-medium mb-1">จำนวนวันที่ลา</label>
                  <input
                    type="number"
                    value={field.days}
                    min="0"
                    step="0.5"
                    max="1"
                    onChange={(e) => handleChange(index, 'days', e.target.value)}
                    className="bg-gray-100 border border-gray-300 py-2 px-3 rounded text-lg"
                    placeholder="กรุณาระบุจำนวนวัน"
                  />
                </div>
              </div>
            ))}

            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={addField}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                + เพิ่มวันลา
              </button>
              <button
                type="button"
                onClick={removeField}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                - ลบวันลา
              </button>
            </div>
            <div className="flex flex-col">
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
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
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
