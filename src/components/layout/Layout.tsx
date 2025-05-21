import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {children}
    </div>
  );
};

export default Layout;