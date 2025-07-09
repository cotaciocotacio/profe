import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';
import OrganizationForm from '../components/admin/OrganizationForm';
import SubjectsManager from '../components/admin/SubjectsManager';
import CoursesManager from '../components/admin/CoursesManager';
import TeachersManager from '../components/admin/TeachersManager';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BuildingOfficeIcon, BookOpenIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

type AdminSection = 'organization' | 'subjects' | 'courses' | 'teachers';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('organization');

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const sidebarItems = [
    { 
      id: 'organization', 
      name: 'Organización', 
      icon: <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />,
      onClick: () => setActiveSection('organization'),
      isActive: activeSection === 'organization'
    },
    { 
      id: 'subjects', 
      name: 'Materias', 
      icon: <BookOpenIcon className="h-5 w-5 text-indigo-600" />,
      onClick: () => setActiveSection('subjects'),
      isActive: activeSection === 'subjects'
    },
    { 
      id: 'courses', 
      name: 'Cursos', 
      icon: <UserGroupIcon className="h-5 w-5 text-indigo-600" />,
      onClick: () => setActiveSection('courses'),
      isActive: activeSection === 'courses'
    },
    { 
      id: 'teachers', 
      name: 'Docentes', 
      icon: <AcademicCapIcon className="h-5 w-5 text-indigo-600" />,
      onClick: () => setActiveSection('teachers'),
      isActive: activeSection === 'teachers'
    },
  ];



  const renderSection = () => {
    switch (activeSection) {
      case 'organization':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <OrganizationForm />
          </motion.div>
        );

      case 'subjects':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SubjectsManager />
          </motion.div>
        );

      case 'courses':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CoursesManager />
          </motion.div>
        );

      case 'teachers':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TeachersManager />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      title="Panel de Administración"
      subtitle={`Bienvenido, ${user?.name}`}
    >
      {renderSection()}
    </DashboardLayout>
  );
};

export default AdminDashboard; 
