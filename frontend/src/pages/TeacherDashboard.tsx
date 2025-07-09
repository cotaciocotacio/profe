import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { plansService } from '../services/plansService';
import type { PlanGenerationJob } from '../types/plans';
import PlanGenerationWizard from '../components/teacher/PlanGenerationWizard';
import PlanResultsPage from '../components/teacher/PlanResultsPage';
import { PlusIcon, ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon, XCircleIcon, PauseIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ChatWidget from '../components/chat/ChatWidget';

type TeacherSection = 'create-plan' | 'results';

const TeacherDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<TeacherSection>('create-plan');
  const [jobs, setJobs] = useState<PlanGenerationJob[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [previousSection, setPreviousSection] = useState<TeacherSection>('create-plan');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Helper functions to map IDs to readable names
  const getSubjectName = (subjectId: string): string => {
    const subjects: Record<string, string> = {
      '1': 'Matemáticas',
      '2': 'Física',
      '3': 'Química',
      '4': 'Historia',
      '5': 'Geografía',
      '6': 'Lengua',
      '7': 'Literatura',
      '8': 'Biología'
    };
    return subjects[subjectId] || 'Materia';
  };

  const getCourseName = (courseId: string): string => {
    const courses: Record<string, string> = {
      '1': 'Primer Grado',
      '2': 'Segundo Grado',
      '3': 'Tercer Grado',
      '4': 'Cuarto Grado',
      '5': 'Quinto Grado',
      '6': 'Sexto Grado'
    };
    return courses[courseId] || 'Grado';
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await plansService.getTeacherJobs('teacher-1');
      setJobs(data);
      console.log('Jobs loaded:', data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleSectionChange = (section: TeacherSection) => {
    setPreviousSection(activeSection);
    setSelectedPlanId(null);
    setActiveSection(section);
    console.log('Section changed to:', section);
  };

  const handleViewDetails = (planId: string) => {
    setPreviousSection(activeSection);
    setSelectedPlanId(planId);
    setActiveSection('results');
    console.log('Viewing details for plan:', planId);
  };

  const handleBackToResults = () => {
    setSelectedPlanId(null);
    setActiveSection(previousSection);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'paused':
        return <PauseIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', text: 'Completado' },
      processing: { color: 'bg-yellow-100 text-yellow-800', text: 'En Proceso' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Fallido' },
      paused: { color: 'bg-gray-100 text-gray-800', text: 'Pausado' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const sidebarItems = [
    {
      id: 'create-plan',
      name: 'Crear Plan',
      icon: <PlusIcon className="h-5 w-5" />,
      isActive: activeSection === 'create-plan',
      onClick: () => handleSectionChange('create-plan'),
    },
    {
      id: 'results',
      name: 'Resultados',
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
      isActive: activeSection === 'results',
      onClick: () => handleSectionChange('results'),
    },
  ];

  const getDashboardTitle = () => {
    switch (activeSection) {
      case 'create-plan':
        return 'Crear Plan de Refuerzo';
      case 'results':
        return selectedPlanId ? 'Detalles del Plan' : 'Resultados';
      default:
        return 'Dashboard del Profesor';
    }
  };

  const getDashboardSubtitle = () => {
    switch (activeSection) {
      case 'create-plan':
        return 'Genera un nuevo plan personalizado';
      case 'results':
        return selectedPlanId ? 'Vista detallada del plan seleccionado' : 'Planes en proceso y finalizados';
      default:
        return 'Selecciona una opción del menú para comenzar';
    }
  };

  // Simple animation variants - avoiding complex stagger animations
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  const renderSection = () => {
    console.log('Rendering section:', activeSection);
    console.log('Jobs state:', jobs);
    
    if (selectedPlanId) {
      return (
        <motion.div
          key="plan-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PlanResultsPage
            planId={selectedPlanId}
            onBack={handleBackToResults}
          />
        </motion.div>
      );
    }

    switch (activeSection) {
      case 'create-plan':
        return (
          <motion.div
            key="create-plan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <PlanGenerationWizard
              onComplete={() => {
                setActiveSection('results');
                loadJobs();
              }}
              onCancel={() => setActiveSection('results')}
            />
          </motion.div>
        );

      case 'results':
        return (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* En Proceso */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white shadow rounded-lg"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  En Proceso
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {jobs.filter(job => job.status === 'processing').map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="px-6 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-3">{getStatusIcon(job.status)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Plan #{job.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getSubjectName(job.subjectId)} - {getCourseName(job.courseId)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Creado el {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(job.status)}
                        <span className="text-sm text-gray-500">Procesando...</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {jobs.filter(job => job.status === 'processing').length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="text-gray-400 mb-2">
                      <ClockIcon className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 font-medium">No hay planes en proceso</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Los planes que estés generando aparecerán aquí
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Finalizados */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
              className="bg-white shadow rounded-lg"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Finalizados
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Creación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Creado por
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.filter(job => job.status === 'completed').map((job, index) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Plan #{job.id.slice(-6)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getSubjectName(job.subjectId)} - {getCourseName(job.courseId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Profesor
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(job.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Ver Resultados
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {jobs.filter(job => job.status === 'completed').length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="text-gray-400 mb-2">
                      <CheckCircleIcon className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 font-medium">No hay planes finalizados</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Los planes completados aparecerán aquí con sus resultados
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout 
        sidebarItems={sidebarItems} 
        title={getDashboardTitle()}
        subtitle={getDashboardSubtitle()}
      >
        <AnimatePresence mode="wait">
          {renderSection()}
        </AnimatePresence>
      </DashboardLayout>
      
      {/* Chat Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        position="bottom-right"
        theme="light"
        maxHeight="500px"
      />
    </motion.div>
  );
};

export default TeacherDashboard; 