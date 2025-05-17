'use client';

import { useState } from 'react';

export default function SimpleUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; path?: string } | null>(null);

  // จัดการเมื่อเลือกไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  // จัดการเมื่อกดปุ่มอัปโหลด
  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL +'/api/user/uploads', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUploadResult({
          success: true,
          message: 'อัปโหลดไฟล์สำเร็จ',
          path: result.path
        });
      } else {
        setUploadResult({
          success: false,
          message: `เกิดข้อผิดพลาด: ${result.error || 'ไม่สามารถอัปโหลดไฟล์ได้'}`
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: `เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'ไม่สามารถอัปโหลดไฟล์ได้'}`
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">อัปโหลดไฟล์</h1>
      
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      {file && (
        <div className="mb-4 text-sm text-gray-600">
          <p>ชื่อไฟล์: {file.name}</p>
          <p>ขนาด: {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
      
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
          hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
      </button>
      
      {uploadResult && (
        <div className={`mt-4 p-3 rounded-md ${uploadResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <p>{uploadResult.message}</p>
          {uploadResult.path && (
            <p className="mt-2">
              <a 
                href={uploadResult.path} 
                target="_blank" 
                rel="noreferrer"
                className="underline"
              >
                ดูไฟล์ที่อัปโหลด
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}