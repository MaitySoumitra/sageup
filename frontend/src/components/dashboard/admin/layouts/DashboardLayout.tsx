// src/components/dashboard/admin/DashboardLayout.tsx
import React from 'react';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  // 👈 ADDED: Prop for the Sidebar component
  Sidebar: React.ComponentType<{ currentPath: string }>;
}

// 👈 ADDED: A hook/context to get the current path is typically used here,
// but for simplicity, we'll assume a prop will pass it down or we use window.location.
// Since AdminSidebar needs it, we'll use window.location.pathname for a quick fix.
const getCurrentPath = () => window.location.pathname;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, Sidebar }) => {
  // Get the current path to pass to the Sidebar
  const currentPath = getCurrentPath();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* 👈 RENDER THE SIDEBAR HERE */}
      <Sidebar currentPath={currentPath} />
      {/* 👈 WRAP THE CHILDREN IN A MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;