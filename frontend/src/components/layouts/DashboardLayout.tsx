import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { ToastContainer } from '../common/Toast';
import { useToast } from '../../hooks/useToast';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  isActive?: boolean;
  children?: SidebarItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  title?: string;
  subtitle?: string;
  showSidebar?: boolean;
  showUserMenu?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarItems,
  title,
  subtitle,
  showSidebar = true,
  showUserMenu = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Sidebar: solo una vez, con clases responsivas */}
      {showSidebar && (
        <Sidebar
          items={sidebarItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          showUserInfo={false}
        />
      )}

      {/* Header fuera del padding */}
      <Header
        title={title}
        subtitle={subtitle}
        showUserMenu={showUserMenu}
        showSidebarToggle={showSidebar}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content con padding izquierdo solo en desktop */}
      <div className={showSidebar ? 'lg:pl-64' : ''}>
        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 
 