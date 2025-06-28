'use client';
import { useState } from 'react';
import DashboardLayout from '@/app/components/dashboardLayout';
import { useSession } from 'next-auth/react';

export default function UploadHolidayPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const { data: session } = useSession();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage('กรุณาเลือกไฟล์ .xls ก่อน');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL +`/api/v2/shared/testexcel`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ สำเร็จ: ${data.message || 'นำเข้าข้อมูลวันหยุดแล้ว'}`);
      } else {
        setMessage(`❌ ล้มเหลว: ${data.error || 'ไม่สามารถนำเข้าได้'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('เกิดข้อผิดพลาดขณะส่งไฟล์');
    }
  };

  return (
        <DashboardLayout title={`admin ${session?.user?.role} ${session?.user?.department}`}>

    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      
      <h1 className="text-xl font-semibold mb-4">อัปโหลดไฟล์วันหยุด (.xls)</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xls,application/vnd.ms-excel"
          onChange={handleChange}
          className="mb-4 block"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          อัปโหลดและนำเข้า
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>

    </DashboardLayout>

  );
}
