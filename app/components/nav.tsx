'use client'
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Leave 
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/Details" className="block text-gray-700 hover:text-blue-600">Details</Link>
            <Link href="/login" className="block text-gray-700 hover:text-blue-600">Login</Link>
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <Link href="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/Details" className="block text-gray-700 hover:text-blue-600">Details</Link>
            <Link href="/login" className="block text-gray-700 hover:text-blue-600">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
