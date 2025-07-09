import React from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../../types/chat';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ClockIcon,
  DocumentIcon,
  PhotoIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

interface ChatMessageItemProps {
  message: ChatMessage;
  isLast: boolean;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isLast }) => {
  const isUser = message.sender === 'user';
  const isFile = message.metadata && (message.type === 'text' && message.metadata.fileName);
  const isImage = message.metadata && message.metadata.fileType?.startsWith('image/');
  const isAudio = message.type === 'audio';

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <CheckCircleIcon className="h-3 w-3 text-green-500" />;
      case 'sending':
        return <ClockIcon className="h-3 w-3 text-yellow-500 animate-spin" />;
      case 'error':
        return <ExclamationCircleIcon className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getFileIcon = () => {
    if (isImage) return <PhotoIcon className="h-4 w-4" />;
    if (isAudio) return <SpeakerWaveIcon className="h-4 w-4" />;
    return <DocumentIcon className="h-4 w-4" />;
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderContent = () => {
    if (isFile && message.metadata) {
      return (
        <div className="flex items-center space-x-2">
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {message.metadata.fileName}
            </p>
            {message.metadata.fileSize && (
              <p className="text-xs opacity-75">
                {formatFileSize(message.metadata.fileSize)}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (isAudio && message.audioPath) {
      return (
        <div className="space-y-2">
          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
          <div className="flex items-center space-x-2">
            <SpeakerWaveIcon className="h-4 w-4 text-indigo-600" />
            <audio 
              controls 
              className="flex-1 h-8"
              src={message.audioPath}
              onError={(e) => console.error('Audio playback error:', e)}
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </div>
      );
    }

    return <div className="whitespace-pre-wrap text-sm">{message.content}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`} // Reduced margin bottom
    >
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg px-3 py-2 ${  // Reduced padding
            isUser
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {renderContent()}
        </div>
        
        <div className={`flex items-center mt-1 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          {isUser && (
            <span className="ml-1">
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
      
      {!isUser && (
        <div className="order-1 mr-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"> {/* Reduced size */}
            <span className="text-white text-xs font-medium">AI</span> {/* Smaller text */}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem; 