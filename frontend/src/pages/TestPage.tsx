import React from 'react';
import { BeakerIcon, UserIcon, AcademicCapIcon, ClipboardDocumentListIcon, TagIcon } from '@heroicons/react/24/outline';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <BeakerIcon className="h-8 w-8 mr-3 text-indigo-600" />
            Página de Prueba - Credenciales de Desarrollo
          </h1>
          
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <UserIcon className="h-6 w-6 mr-2" />
                Usuario Administrador
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> admin@escuela.edu</p>
                <p><strong>Password:</strong> cualquier contraseña</p>
                <p><strong>Rol:</strong> Administrador</p>
                <p><strong>Acceso:</strong> Panel de administración (/admin)</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                <AcademicCapIcon className="h-6 w-6 mr-2" />
                Usuario Docente
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> teacher@escuela.edu</p>
                <p><strong>Password:</strong> cualquier contraseña</p>
                <p><strong>Rol:</strong> Docente</p>
                <p><strong>Acceso:</strong> Dashboard docente (/teacher)</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
                <ClipboardDocumentListIcon className="h-6 w-6 mr-2" />
                Instrucciones de Prueba
              </h2>
              <div className="space-y-3 text-sm">
                <p>1. Ve a <a href="/login" className="text-blue-600 hover:underline">http://localhost:5173/login</a></p>
                <p>2. Usa las credenciales de arriba según el rol que quieras probar</p>
                <p>3. Serás redirigido automáticamente al dashboard correspondiente</p>
                <p>4. Para cambiar de rol, haz logout y usa las otras credenciales</p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                <TagIcon className="h-6 w-6 mr-2" />
                Funcionalidades Disponibles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">Panel Administrador:</h3>
                  <ul className="space-y-1 text-purple-700">
                    <li>• Gestión de organización</li>
                    <li>• CRUD de materias</li>
                    <li>• CRUD de cursos</li>
                    <li>• CRUD de docentes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">Dashboard Docente:</h3>
                  <ul className="space-y-1 text-purple-700">
                    <li>• Vista general de planes</li>
                    <li>• Wizard de generación de planes</li>
                    <li>• Historial de planes</li>
                    <li>• Estadísticas de generación</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 