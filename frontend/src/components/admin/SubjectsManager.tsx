import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Subject, SubjectFormData } from '../../types/organization';
import { organizationService } from '../../services/organizationService';
import LoadingSpinner from '../common/LoadingSpinner';

const SubjectsManager: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Matemáticas',
      organizationId: 'org-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Ciencias',
      organizationId: 'org-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Historia',
      organizationId: 'org-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<SubjectFormData>({ name: '' });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      const data = await organizationService.getSubjects();
      setSubjects(data);
    } catch (error) {
      setError('Error al cargar las materias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Simular operación exitosa para desarrollo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingSubject) {
        setSubjects(prev => prev.map(subject => 
          subject.id === editingSubject.id 
            ? { ...subject, name: formData.name, updatedAt: new Date() }
            : subject
        ));
        setSuccess('Materia actualizada correctamente');
      } else {
        const newSubject: Subject = {
          id: Date.now().toString(),
          name: formData.name,
          organizationId: 'org-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setSubjects(prev => [...prev, newSubject]);
        setSuccess('Materia creada correctamente');
      }
      
      setShowForm(false);
      setEditingSubject(null);
      setFormData({ name: '' });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
      return;
    }

    try {
      // Simular eliminación exitosa para desarrollo
      await new Promise(resolve => setTimeout(resolve, 500));
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      setSuccess('Materia eliminada correctamente');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubject(null);
    setFormData({ name: '' });
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

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    }),
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow rounded-lg p-6"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gestión de Materias
          </h2>
          <p className="text-gray-600">
            Administra las materias disponibles en tu institución.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Agregar Materia
        </button>
      </motion.div>

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

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingSubject ? 'Editar Materia' : 'Nueva Materia'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Materia *
              </label>
              <input
                type="text"
                id="subjectName"
                required
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: Matemáticas"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    Guardando...
                  </>
                ) : (
                  editingSubject ? 'Actualizar' : 'Crear'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Creación
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjects.map((subject, index) => (
              <motion.tr
                key={subject.id}
                custom={index}
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subject.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(subject.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {subjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            No hay materias registradas
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubjectsManager; 