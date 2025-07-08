import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlanModalData } from '../../types/plans';
import LoadingSpinner from '../common/LoadingSpinner';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PlanModalProps {
  data: PlanModalData;
  onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ data, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Simular descarga de PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
    }
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown renderer - en producción usarías una librería como react-markdown
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold text-gray-900 mb-3">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium text-gray-900 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
      }
      if (line.startsWith('1. ')) {
        return <li key={index} className="ml-4 mb-1">{line.substring(3)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Plan de Reforzamiento - {data.studentName}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    Descargando...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Plan Content */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Contenido del Plan</h4>
              <div className="prose prose-sm max-w-none">
                {renderMarkdown(data.planContent)}
              </div>
            </div>

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Recomendaciones</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {data.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-blue-800">
                        • {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Exercises */}
            {data.exercises.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-green-900 mb-2">Ejercicios de Práctica</h4>
                <div className="space-y-4">
                  {data.exercises.map((exercise, index) => (
                    <div key={index} className="border border-green-200 rounded-lg p-3 bg-white">
                      <h5 className="font-medium text-green-800 mb-2">{exercise.title}</h5>
                      <p className="text-green-700 text-sm mb-2">{exercise.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {exercise.difficulty === 'easy' ? 'Fácil' :
                           exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {exercise.type === 'multiple_choice' ? 'Opción Múltiple' :
                           exercise.type === 'open_ended' ? 'Respuesta Abierta' : 'Problema'}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-sm">
                        <strong>Ejercicio:</strong> {exercise.content}
                      </div>
                      {exercise.solution && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm font-medium text-green-700">
                            Ver Solución
                          </summary>
                          <div className="mt-2 p-2 bg-green-100 rounded text-sm">
                            <strong>Solución:</strong> {exercise.solution}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlanModal; 
