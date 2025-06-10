import Nav from "./nav"; // แก้ path ตามจริง
import type { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Top Nav */}
      <Nav />
      
      {/* Main Content */}
      <main className="flex flex-1 justify-center items-center sm:p-12 bg-gray-50 ">
        {children}
      </main>
    </div>
  );
}
