'use client'; // Only if you're using the app directory
import Link from 'next/link';
import { Home, Info, Briefcase, Phone, X, Menu } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="flex items-center justify-between p-6 font-bold border-b border-gray-700">
          <div className="text-2xl">MyApp</div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col space-y-2 px-4">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link href="/about" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Info size={20} />
            <span>About</span>
          </Link>
          <Link href="/services" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Briefcase size={20} />
            <span>Services</span>
          </Link>
          <Link href="/contact" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700">
            <Phone size={20} />
            <span>Contact</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;