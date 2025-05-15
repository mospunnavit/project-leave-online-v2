'use client';
import DashboardLayout from "@/app/components/dashboardLayout";
import { useEffect, useState } from 'react';
import {  Users, Calendar, ArrowRight, FileText, Settings } from "lucide-react";
import Link from "next/link";
const AdminDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String>('');
  

    useEffect(() => {
     
    },  );

  

  
  return (
    <DashboardLayout title="admin dashboard">
      <div className="bg-white flex p-4 rounded shadow">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Card 1 */}
        <Link href="/admin/users">
          <div className="h-full bg-white hover:bg-blue-50 p-6 rounded-lg shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-blue-100 mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Users size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">จัดการ Users</h3>
              <p className="text-sm text-gray-500 mb-4">จัดการข้อมูลผู้ใช้งานระบบทั้งหมด</p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                <span>เข้าสู่หน้าจัดการ</span>
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Link>
        
        {/* Card 2 */}
        <Link href="/admin/leave-forms">
          <div className="h-full bg-white hover:bg-green-50 p-6 rounded-lg shadow-md transition-all duration-300 border border-gray-100 hover:border-green-200 group">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-green-100 mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <Calendar size={28} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">จัดการ ฟอร์มการลา</h3>
              <p className="text-sm text-gray-500 mb-4">จัดการแบบฟอร์มการลาและคำขอทั้งหมด</p>
              <div className="flex items-center text-green-600 font-medium text-sm">
                <span>เข้าสู่หน้าจัดการ</span>
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Link>
        
        {/* Card 3 */}
        <Link href="/admin/reports">
          <div className="h-full bg-white hover:bg-purple-50 p-6 rounded-lg shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-200 group">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-purple-100 mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <FileText size={28} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">รายงาน</h3>
              <p className="text-sm text-gray-500 mb-4">ดูรายงานและสถิติการลาทั้งหมด</p>
              <div className="flex items-center text-purple-600 font-medium text-sm">
                <span>เข้าสู่หน้าจัดการ</span>
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Link>
        
        {/* Card 4 */}
        <Link href="/admin/settings">
          <div className="h-full bg-white hover:bg-amber-50 p-6 rounded-lg shadow-md transition-all duration-300 border border-gray-100 hover:border-amber-200 group">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-amber-100 mb-4 group-hover:bg-amber-200 transition-colors duration-300">
                <Settings size={28} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">ตั้งค่าระบบ</h3>
              <p className="text-sm text-gray-500 mb-4">จัดการการตั้งค่าระบบทั้งหมด</p>
              <div className="flex items-center text-amber-600 font-medium text-sm">
                <span>เข้าสู่หน้าจัดการ</span>
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Link>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;