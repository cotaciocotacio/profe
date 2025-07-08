import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = 'Cargando...',
  subtitle,
  className = ''
}) => (
  <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
    <div className="flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
    <div className="mt-4 text-center">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  </div>
);

interface LoadingTableProps {
  rows?: number;
  columns?: number;
}

export const LoadingTable: React.FC<LoadingTableProps> = ({
  rows = 5,
  columns = 4
}) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="px-6 py-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: `${Math.random() * 40 + 20}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface LoadingSkeletonProps {
  type?: 'text' | 'avatar' | 'button' | 'card';
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'text',
  className = ''
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const typeClasses = {
    text: 'h-4',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-8 w-20',
    card: 'h-32 w-full'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`} />
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Cargando...'
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  className = '',
  disabled = false,
  onClick
}) => (
  <button
    onClick={onClick}
    disabled={isLoading || disabled}
    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${className}`}
  >
    {isLoading && (
      <LoadingSpinner size="sm" color="white" className="mr-2" />
    )}
    {children}
  </button>
); 
 