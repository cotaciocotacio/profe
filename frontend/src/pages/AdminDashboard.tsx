import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import OrganizationForm from '../components/admin/OrganizationForm';
import SubjectsManager from '../components/admin/SubjectsManager';
import CoursesManager from '../components/admin/CoursesManager';
import TeachersManager from '../components/admin/TeachersManager';
import LoadingSpinner from '../components/common/LoadingSpinner';

type AdminSection = 'organization' | 'subjects' | 'courses' | 'teachers';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('organization');

  const sections = [
    { id: 'organization' as const, name: 'Organización', icon: '🏢' },
    { id: 'subjects' as const, name: 'Materias', icon: '📚' },
    { id: 'courses' as const, name: 'Cursos', icon: '👥' },
    { id: 'teachers' as const, name: 'Docentes', icon: '👨‍🏫' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'organization':
        return <OrganizationForm />;
      case 'subjects':
        return <SubjectsManager />;
      case 'courses':
        return <CoursesManager />;
      case 'teachers':
        return <TeachersManager />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg shadow p-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 