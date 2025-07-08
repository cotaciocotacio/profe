import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AcademicCapIcon, ChartBarIcon, LockClosedIcon, BoltIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: <AcademicCapIcon className="h-10 w-10 text-indigo-600" />,
    title: 'Planes de Reforzamiento Inteligentes',
    description: 'Crea planes personalizados para cada estudiante usando IA y resultados de exámenes.'
  },
  {
    icon: <ChartBarIcon className="h-10 w-10 text-indigo-600" />,
    title: 'Paneles para Docentes y Administradores',
    description: 'Gestión centralizada de materias, cursos, docentes y resultados en tiempo real.'
  },
  {
    icon: <LockClosedIcon className="h-10 w-10 text-indigo-600" />,
    title: 'Acceso Seguro y Roles',
    description: 'Autenticación, roles y protección de datos para toda la comunidad educativa.'
  },
  {
    icon: <BoltIcon className="h-10 w-10 text-indigo-600" />,
    title: 'Interfaz Rápida y Moderna',
    description: 'Experiencia de usuario ágil, responsiva y optimizada para cualquier dispositivo.'
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">Profe</span>
            <span className="hidden sm:inline text-gray-500 font-medium">Platform</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Iniciar sesión</Link>
            <Link to="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md shadow">Registrarse</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="flex-1 flex flex-col justify-center items-center text-center py-16 px-4 bg-gradient-to-b from-indigo-50 to-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Plataforma de <span className="text-indigo-600">Reforzamiento Escolar</span> con IA
        </motion.h1>
        <motion.p
          className="max-w-2xl mx-auto text-lg text-gray-600 mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Ayuda a tus estudiantes a alcanzar su máximo potencial con planes de estudio personalizados, análisis de resultados y gestión integral para docentes y administradores.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Link to="/register" className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition">Comenzar gratis</Link>
          <a href="#features" className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-md border border-indigo-600 hover:bg-indigo-50 transition">Ver características</a>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-gray-900 text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
          >
            ¿Por qué elegir Profe Platform?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-indigo-50 rounded-lg p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-4">¿Listo para transformar el aprendizaje?</h2>
        <p className="mb-8 text-lg">Regístrate gratis y comienza a crear planes de reforzamiento inteligentes hoy mismo.</p>
        <Link to="/register" className="inline-block px-8 py-3 bg-white text-indigo-700 font-semibold rounded-md shadow hover:bg-indigo-100 transition">Crear cuenta</Link>
      </motion.section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div>© {new Date().getFullYear()} Profe Platform. Todos los derechos reservados.</div>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#features" className="hover:text-indigo-600">Características</a>
            <a href="#" className="hover:text-indigo-600">Contacto</a>
            <a href="#" className="hover:text-indigo-600">Política de Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
 