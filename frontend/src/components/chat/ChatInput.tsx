import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  XMarkIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendSuggestion: (suggestion: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<void>;
  suggestions: string[];
  isTyping: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendSuggestion,
  onUploadFile,
  suggestions,
  isTyping,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    const trimmedMessage = message.trim();
    setMessage('');
    await onSendMessage(trimmedMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    onUploadFile(file);
    
    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await onSendSuggestion(suggestion);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 bg-white p-3"> {/* Reduced padding */}
      {/* Indicador de escritura */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-2 text-xs text-gray-500 flex items-center" // Smaller text and margin
        >
          <div className="flex space-x-1 mr-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div> {/* Smaller dots */}
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          Profe Chat está escribiendo...
        </motion.div>
      )}

      {/* Input de mensaje */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            disabled={disabled}
            placeholder="Escribe tu mensaje..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 max-h-24 text-sm" // Smaller text and reduced max height
            rows={1}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-1">
          {/* Botón de archivo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
            title="Adjuntar archivo"
          >
            <PaperClipIcon className="h-4 w-4" /> {/* Smaller icon */}
          </button>

          {/* Botón de micrófono */}
          <button
            type="button"
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
            title="Grabar audio"
          >
            <MicrophoneIcon className="h-4 w-4" /> {/* Smaller icon */}
          </button>

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={!message.trim() || disabled || isComposing}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Enviar mensaje"
          >
            <PaperAirplaneIcon className="h-4 w-4" /> {/* Smaller icon */}
          </button>
        </div>
      </form>

      {/* Input oculto para archivos */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default ChatInput; 