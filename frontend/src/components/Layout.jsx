import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, role }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className="flex pt-14 md:pt-16">
        <Sidebar role={role} mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
