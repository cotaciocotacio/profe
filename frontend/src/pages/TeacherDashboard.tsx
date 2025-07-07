import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { plansService } from '../services/plansService';
import type { PlanGenerationJob } from '../types/plans';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PlanGenerationWizard from '../components/teacher/PlanGenerationWizard';

type TeacherSection = 'overview' | 'create-plan' | 'history';

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<TeacherSection>('overview');
  const [jobs, setJobs] = useState<PlanGenerationJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const data = await plansService.getTeacherJobs('teacher-1');
      setJobs(data);
    } catch (error) {
      setError('Error al cargar los planes generados');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      processing: { color: 'bg-blue-100 text-blue-800', text: 'Procesando' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completado' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Fallido' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '⏸️';
    }
  };

  const sections = [
    { id: 'overview' as const, name: 'Vista General', icon: '📊' },
    { id: 'create-plan' as const, name: 'Crear Plan', icon: '➕' },
    { id: 'history' as const, name: 'Historial', icon: '📋' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total de Planes
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {jobs.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Completados
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {jobs.filter(job => job.status === 'completed').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">⏳</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          En Proceso
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {jobs.filter(job => job.status === 'processing').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">❌</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Fallidos
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {jobs.filter(job => job.status === 'failed').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Planes Recientes
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-3">{getStatusIcon(job.status)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Plan #{job.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Creado el {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(job.status)}
                        <button
                          onClick={() => setActiveSection('history')}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No hay planes generados aún
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'create-plan':
        return (
          <PlanGenerationWizard
            onComplete={(jobId) => {
              setActiveSection('overview');
              loadJobs(); // Recargar jobs para mostrar el nuevo
            }}
            onCancel={() => setActiveSection('overview')}
          />
        );
      case 'history':
        return (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Historial de Planes
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <div key={job.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-3">{getStatusIcon(job.status)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Plan #{job.id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Creado el {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                        {job.completedAt && (
                          <p className="text-sm text-gray-500">
                            Completado el {new Date(job.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(job.status)}
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No hay planes en el historial
                </div>
              )}
            </div>
          </div>
        );
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
                Dashboard Docente
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
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            renderSection()
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard; 