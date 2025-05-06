import React from 'react';
import Sidebar from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="mt-16 md:mt-0">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
