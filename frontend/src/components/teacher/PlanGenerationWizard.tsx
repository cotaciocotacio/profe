import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { plansService } from '../../services/plansService';
import type { PlanGenerationFormData, PlanGenerationStep, Subject, Course } from '../../types/plans';
import { LoadingSpinner, FileUpload } from '../common';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface PlanGenerationWizardProps {
  onComplete: (jobId: string) => void;
  onCancel: () => void;
}

const PlanGenerationWizard: React.FC<PlanGenerationWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<PlanGenerationFormData>({
    subjectId: '',
    courseId: '',
    files: [],
  });

  const steps: PlanGenerationStep[] = [
    {
      id: 1,
      title: 'Selección',
      description: 'Elige la materia y curso',
      isCompleted: false,
      isActive: currentStep === 1,
    },
    {
      id: 2,
      title: 'Archivos',
      description: 'Carga los resultados de exámenes',
      isCompleted: false,
      isActive: currentStep === 2,
    },
    {
      id: 3,
      title: 'Confirmación',
      description: 'Revisa y genera el plan',
      isCompleted: false,
      isActive: currentStep === 3,
    },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [subjectsData, coursesData] = await Promise.all([
        plansService.getSubjects(),
        plansService.getCourses(),
      ]);
      setSubjects(subjectsData);
      setCourses(coursesData);
    } catch (error) {
      setError('Error al cargar los datos iniciales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      updateSteps();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      updateSteps();
    }
  };

  const updateSteps = () => {
    steps.forEach((step, index) => {
      step.isCompleted = index + 1 < currentStep;
      step.isActive = index + 1 === currentStep;
    });
  };

  const handleFileUpload = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      files: files,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.subjectId || !formData.courseId || formData.files.length === 0) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const job = await plansService.generatePlan(formData);
      setSuccess('Plan generado exitosamente');
      
      // Simular delay para mostrar el mensaje de éxito
      setTimeout(() => {
        onComplete(job.id);
      }, 2000);
    } catch (error) {
      setError('Error al generar el plan');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Materia *
              </label>
              <select
                id="subject"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Selecciona una materia</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Curso *
              </label>
              <select
                id="course"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Selecciona un curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.grade})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivos de Resultados *
              </label>
              <FileUpload
                onFilesSelected={handleFileUpload}
                multiple={true}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                maxSize={10 * 1024 * 1024} // 10MB
                maxFiles={10}
                placeholder="Arrastra archivos aquí o haz clic para seleccionar"
                showPreview={true}
              />
            </div>
          </div>
        );

      case 3:
        const selectedSubject = subjects.find(s => s.id === formData.subjectId);
        const selectedCourse = courses.find(c => c.id === formData.courseId);
        
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen de la configuración:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Materia:</span> {selectedSubject?.name || 'No seleccionada'}
                </div>
                <div>
                  <span className="font-medium">Curso:</span> {selectedCourse?.name || 'No seleccionado'}
                </div>
                <div>
                  <span className="font-medium">Archivos:</span> {formData.files.length} archivo(s)
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                Información importante:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• El proceso puede tomar varios minutos</li>
                <li>• Los archivos se procesarán de forma segura</li>
                <li>• Recibirás una notificación cuando esté listo</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading && currentStep === 1) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow rounded-lg p-6"
      >
        <motion.div variants={itemVariants} className="flex justify-center items-center h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Cargando datos iniciales...</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow rounded-lg p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Crear Plan de Reforzamiento
        </h2>
        <p className="text-gray-600">
          Genera un plan personalizado basado en los resultados de exámenes
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step.isCompleted
                  ? 'bg-green-500 text-white'
                  : step.isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.isCompleted ? '✓' : step.id}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`ml-4 w-16 h-0.5 ${
                  step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Error/Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md"
        >
          {success}
        </motion.div>
      )}

      {/* Step Content */}
      <motion.div variants={itemVariants} className="mb-6">
        {renderStepContent()}
      </motion.div>

      {/* Navigation */}
      <motion.div variants={itemVariants} className="flex justify-between">
        <button
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {currentStep === 1 ? 'Cancelar' : 'Anterior'}
        </button>

        <div className="flex space-x-3">
          {currentStep < 3 && (
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Siguiente
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Generando Plan...
                </>
              ) : (
                'Generar Plan'
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanGenerationWizard; 
