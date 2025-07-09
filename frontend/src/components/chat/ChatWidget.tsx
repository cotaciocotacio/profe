import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  MinusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useChat } from '../../hooks/useChat';
import ChatMessageItem from './ChatMessageItem';
import ChatInput from './ChatInput';
import type { ChatWidgetProps } from '../../types/chat';

const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onToggle,
  position = 'bottom-right',
  theme = 'light',
  maxHeight = '600px' // Increased from 500px to 600px
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    sendSuggestion,
    clearChat,
    uploadFile,
    suggestions
  } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getThemeClasses = () => {
    return theme === 'dark' 
      ? 'bg-gray-900 text-white border-gray-700' 
      : 'bg-white text-gray-900 border-gray-200';
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Botón flotante */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </motion.button>
      )}

      {/* Widget del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`w-80 h-[600px] rounded-lg shadow-xl border ${getThemeClasses()} flex flex-col`} // Fixed height instead of h-96
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold">Profe Chat</h3>
                  <p className="text-xs text-gray-500">En línea</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={onToggle}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Minimizar chat"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-3" // Reduced space-y from 4 to 3
              style={{ maxHeight }}
            >
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cargando chat...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ¡Hola! Soy Profe Chat
                  </h3>
                  <p className="text-sm text-gray-500">
                    Puedo ayudarte a crear planes de refuerzo, analizar resultados y mucho más.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessageItem
                    key={message.id}
                    message={message}
                    isLast={index === messages.length - 1}
                  />
                ))
              )}
              
              {/* Referencia para auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
              onSendMessage={sendMessage}
              onSendSuggestion={sendSuggestion}
              onUploadFile={uploadFile}
              suggestions={[]} // Remove suggestions by passing empty array
              isTyping={isTyping}
              disabled={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget; 