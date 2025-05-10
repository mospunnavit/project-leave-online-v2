'use client'; // Only if you're using the app directory
import Link from 'next/link';
import { Home, Phone, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const handleLogout = () => {
    console.log("logout");
    signOut({ callbackUrl: '/login' }); // Redirect ไปที่หน้า login หลัง logout
  };
  return (
    <>
      {/* Button to open/close the sidebar (Hamburger / X) */}
      <div className="md:hidden fixed top-0 left-0 z-50 p-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 hover:text-gray-600 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar (transform based on isOpen state) */}
      <aside
        className={`h-screen w-64 bg-gray-900 text-white fixed top-0 left-0 z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative md:block`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 mt-6 font-bold border-b border-gray-700 ">
          <div className="text-2xl">Leave Online </div>
        </div>

        {/* Navigation Links */}
        {session?.user?.role === 'admin' && (
          <nav className="mt-6 flex flex-col space-y-2 px-4">
            <Link href="/pages/dashboard/admin" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Admin</span>
            </Link>
            <Link href="/pages/dashboard/user" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>User</span>
            </Link>
            <Link href="/pages/dashboard/user/form-leave" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Form leave</span>
            </Link>
          </nav>
          
        )}
        {session?.user?.role === 'user' && (
          <nav className="mt-6 flex flex-col space-y-2 px-4">
            <Link href="/pages/dashboard/user" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Leave</span>
          </Link>
          <Link href="/pages/dashboard/user/form-leave-v2" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Form-leave</span>
          </Link>
          </nav>
          
        )}

        {session?.user?.role === 'head' && (
          <nav className="mt-6 flex flex-col space-y-2 px-4">
            <Link href="/pages/dashboard/user" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Leave</span>
          </Link>
          <Link href="/pages/dashboard/user/form-leave-v2" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Form-leave</span>
          </Link>
          <span>การอนุมัติ</span>
          <Link href="/pages/dashboard/user/head-approve" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>head-approve</span>
          </Link>
          </nav>
        )}

        {session?.user?.role === 'manager' && (
          <nav className="mt-6 flex flex-col space-y-2 px-4">
            <Link href="/pages/dashboard/user" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Leave</span>
          </Link>
          <Link href="/pages/dashboard/user/form-leave-v2" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Form-leave</span>
          </Link>
          <span>การอนุมัติ</span>
          <Link href="/pages/dashboard/user/manager-approve" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>manager-approve</span>
          </Link>
          </nav>
          
        )}
        {session?.user?.role === 'hr' && (
          <nav className="mt-6 flex flex-col space-y-2 px-4">
            <Link href="/pages/dashboard/user" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Leave</span>
          </Link>
          <Link href="/pages/dashboard/user/form-leave-v2" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Form-leave</span>
          </Link>
          <span>การอนุมัติ</span>
          <Link href="/pages/dashboard/user/hr-approve" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>hr-approve</span>
          </Link>
          </nav>
          
        )}
        <div className='ml-4 mr-5 mt-4'>
          <button onClick={() => handleLogout()} className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700 w-full">
            <Phone size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;