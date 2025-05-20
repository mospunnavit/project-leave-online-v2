// components/ModalLayout.tsx
import React from 'react';

type ModalLayoutProps = {
  children: React.ReactNode;
  onClose?: () => void; // optional สำหรับกดปิดนอก modal ถ้าต้องการ
};

const ModalLayout: React.FC<ModalLayoutProps> = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* ป้องกันไม่ให้คลิกภายใน modal แล้ว trigger onClose */}
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;
