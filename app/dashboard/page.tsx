'use client'; // Add this if using app directory
import Link from "next/link";
import Sidebar from "../components/sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
       
      <Sidebar />
      <div className="flex-1 p-4 ">
        {/* Main content */}
        <div className="mt-16 md:mt-0">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="bg-white p-4 rounded shadow">
            Your content here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;