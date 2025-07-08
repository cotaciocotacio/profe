import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface LoginTransitionProps {
  userName: string;
  userRole: string;
}

const LoginTransition: React.FC<LoginTransitionProps> = ({ userName, userRole }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-indigo-600 flex items-center justify-center z-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center text-white"
      >
        <motion.div variants={checkmarkVariants} className="mb-6">
          <CheckCircleIcon className="h-16 w-16 mx-auto text-green-400" />
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">
          ¡Bienvenido, {userName}!
        </motion.h2>
        
        <motion.p variants={itemVariants} className="text-xl mb-6 opacity-90">
          Iniciando sesión como {userRole === 'admin' ? 'Administrador' : 'Docente'}
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <div className="flex space-x-2">
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginTransition; 
 