import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '../services/chatService';
import type { ChatMessage, ChatSession, ChatContext, ChatResponse } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  session: ChatSession | null;
  sendMessage: (content: string) => Promise<void>;
  sendSuggestion: (suggestion: string) => Promise<void>;
  clearChat: () => void;
  uploadFile: (file: File) => Promise<void>;
  suggestions: string[];
}

export const useChat = (context?: Partial<ChatContext>): UseChatReturn => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize chat session
  useEffect(() => {
    const initializeChat = async () => {
      if (!user) return;
      
      try {
        const newSession = await chatService.createSession(user.id, user.role);
        setSession(newSession);
        
        // Load initial history (empty for ADK as it doesn't provide history)
        const history = await chatService.getChatHistory(newSession.id);
        setMessages(history);
        
        // Load suggestions
        const chatSuggestions = await chatService.getSuggestions({
          sessionId: newSession.id,
          userId: user.id,
          userRole: user.role,
          appName: 'speaker', // ADK app name
          context: context?.context || {}
        });
        setSuggestions(chatSuggestions);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, [user, context]);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateMessageStatus = useCallback((messageId: string, status: ChatMessage['status']) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!user || !session) return;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    // Add user message
    const userMessage = addMessage({
      content,
      sender: 'user',
      type: 'text',
      status: 'sending'
    });

    try {
      // Update status to sent
      updateMessageStatus(userMessage.id, 'sent');
      
      // Show typing indicator
      setIsTyping(true);
      
      // Send message to ADK server
      const response = await chatService.sendMessage(content, {
        sessionId: session.id,
        userId: user.id,
        userRole: user.role,
        appName: 'speaker', // ADK app name
        context: context?.context || {}
      });

      // Add assistant response (text and potentially audio)
      const assistantMessage = addMessage({
        content: response.message,
        sender: 'assistant',
        type: response.audioPath ? 'audio' : 'text',
        status: 'sent',
        audioPath: response.audioPath
      });

      // Update suggestions if available
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }

      // Execute actions if available
      if (response.actions) {
        response.actions.forEach(action => {
          console.log('Chat action:', action);
          // Here you can implement specific actions
          // like navigating to a page, opening a modal, etc.
        });
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request cancelled
      }
      
      console.error('Error sending message:', error);
      updateMessageStatus(userMessage.id, 'error');
      
      // Add error message
      addMessage({
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'assistant',
        type: 'text',
        status: 'sent'
      });
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [user, session, context, addMessage, updateMessageStatus]);

  const sendSuggestion = useCallback(async (suggestion: string) => {
    await sendMessage(suggestion);
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    if (!user || !session) return;

    try {
      setIsLoading(true);
      
      // Add file message from user
      const userMessage = addMessage({
        content: `Archivo: ${file.name}`,
        sender: 'user',
        type: 'text', // Changed from 'file' to 'text' to match ADK structure
        status: 'sending',
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }
      });

      // Upload file
      const uploadResult = await chatService.uploadFile(file);
      
      // Update message status
      updateMessageStatus(userMessage.id, 'sent');
      
      // Send message about the file
      await sendMessage(`He subido el archivo: ${uploadResult.fileName}`);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      addMessage({
        content: 'Error al subir el archivo. Por favor, intenta de nuevo.',
        sender: 'assistant',
        type: 'text',
        status: 'sent'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, session, addMessage, updateMessageStatus, sendMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    session,
    sendMessage,
    sendSuggestion,
    clearChat,
    uploadFile,
    suggestions
  };
}; 