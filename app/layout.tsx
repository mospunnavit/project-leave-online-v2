import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
// โหลดฟอนต์จาก Google ด้วย next/font
const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Bai Jamjuree App",
  description: "Font with no tailwind.config.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${baiJamjuree.variable} antialiased`} >
        <div className="font-main">
        <Nav/>
        
        {children}
        </div>
      </body>
    </html>
  );
}