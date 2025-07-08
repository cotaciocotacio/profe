import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

interface SidebarProps {
  items: SidebarItem[];
  isOpen?: boolean;
  onClose?: () => void;
  showUserInfo?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  isOpen = true,
  onClose,
  showUserInfo = true,
}) => {
  const { user } = useAuth();

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <span className="text-xl font-bold text-indigo-600">Profe</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* User info */}
      {showUserInfo && user && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {items.map(item => (
          <div key={item.id}>
            {item.href ? (
              <a
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.isActive
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ) : (
              <button
                onClick={item.onClick}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.isActive
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            )}
            {item.children && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map(child => (
                  <div key={child.id}>{/* Recursive render */}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Profe Platform
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar (overlay) */}
      <div className={`lg:hidden ${isOpen ? '' : 'hidden'}`}>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30"
          onClick={onClose}
        />
        {/* Sidebar */}
        <div
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
          style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          {renderSidebarContent()}
        </div>
      </div>

      {/* Desktop sidebar (static) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block w-64 bg-white shadow-lg z-30 h-full">
        {renderSidebarContent()}
      </div>
    </>
  );
};

export default Sidebar; 
 