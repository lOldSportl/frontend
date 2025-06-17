// components/ui/Drawer.tsx — выезжающая боковая панель

import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, className }) => {
  return (
    <div className={`drawer ${isOpen ? 'open' : ''} ${className || ''}`.trim()}>
      <div className="drawer-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Drawer;
