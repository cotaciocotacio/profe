import React, { useState, useEffect } from 'react';
import { plansService } from '../../services/plansService';
import type { PlanResults, StudentResult, PlanModalData } from '../../types/plans';
import LoadingSpinner from '../common/LoadingSpinner';
import PlanModal from './PlanModal';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface PlanResultsPageProps {
  planId: string;
  onBack: () => void;
}

const PlanResultsPage: React.FC<PlanResultsPageProps> = ({ planId, onBack }) => {
  const [results, setResults] = useState<PlanResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanModalData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadResults();
  }, [planId]);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await plansService.getPlanResults(planId);
      setResults(data);
    } catch (error) {
      setError('Error al cargar los resultados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      setIsDownloading(true);
      await plansService.downloadAllPlans(planId);
      // Simular descarga exitosa
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      setError('Error al descargar los planes');
      setIsDownloading(false);
    }
  };

  const handleViewPlan = (student: StudentResult) => {
    const planData: PlanModalData = {
      studentName: student.studentName,
      planContent: student.planContent,
      recommendations: student.recommendations,
      exercises: student.exercises,
    };
    setSelectedPlan(planData);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', text: 'Completado' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', text: 'En Progreso' },
      not_started: { color: 'bg-gray-100 text-gray-800', text: 'No Iniciado' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getScoreColor = (score: number | undefined) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron resultados
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={onBack}
              className="text-indigo-600 hover:text-indigo-900 mb-2 flex items-center"
            >
              ← Volver a Resultados
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {results.planName}
            </h1>
            <p className="text-gray-600">
              {results.subjectName} - {results.courseName}
            </p>
          </div>
          <button
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                Descargando...
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Descargar Todos (ZIP)
              </>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{results.totalStudents}</div>
            <div className="text-sm text-blue-600">Total Estudiantes</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{results.completedStudents}</div>
            <div className="text-sm text-green-600">Completados</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {results.averageScore ? `${results.averageScore}%` : 'N/A'}
            </div>
            <div className="text-sm text-yellow-600">Promedio</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {results.totalStudents > 0 ? Math.round((results.completedStudents / results.totalStudents) * 100) : 0}%
            </div>
            <div className="text-sm text-purple-600">Tasa de Completado</div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Resultados por Estudiante
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntuación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Completado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.students.map((student, index) => (
                <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                    <div className="text-sm text-gray-500">{student.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getScoreColor(student.score)}`}>
                      {student.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.completedAt ? new Date(student.completedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewPlan(student)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Ver Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.students.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay estudiantes registrados
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedPlan && (
        <PlanModal
          data={selectedPlan}
          onClose={() => {
            setShowModal(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
};

export default PlanResultsPage; 
 