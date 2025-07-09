import type { 
  ChatMessage, 
  ChatSession, 
  ChatContext, 
  ChatResponse,
  ADKSession,
  ADKMessage,
  ADKRunRequest,
  ADKEvent
} from '../types/chat';
import { CHAT_CONFIG, checkADKAvailability, getErrorMessage } from '../config/chat';

class ChatService {
  private baseUrl = CHAT_CONFIG.ADK_BASE_URL;
  private appName = CHAT_CONFIG.ADK_APP_NAME;

  async createSession(userId: string, userRole: string): Promise<ChatSession> {
    const sessionId = `session-${Date.now()}`;
    
    try {
      // Create ADK session
      const response = await fetch(
        `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions/${sessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      const adkSession: ADKSession = {
        app_name: this.appName,
        user_id: userId,
        session_id: sessionId
      };

      return {
        id: sessionId,
        title: 'Nueva conversación',
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
        isActive: true,
        adkSession
      };
    } catch (error) {
      console.error('Error creating session:', error);
      
      // Check if ADK is available
      const isADKAvailable = await checkADKAvailability();
      if (!isADKAvailable) {
        console.warn(getErrorMessage('BACKEND_UNAVAILABLE'));
      }
      
      // Fallback to local session if backend is not available
      return {
        id: sessionId,
        title: 'Nueva conversación',
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
        isActive: true
      };
    }
  }

  async sendMessage(message: string, context: ChatContext): Promise<ChatResponse> {
    if (!context.sessionId) {
      throw new Error('No active session');
    }

    try {
      // Prepare ADK message format
      const adkMessage: ADKMessage = {
        role: 'user',
        parts: [{ text: message }]
      };

      const runRequest: ADKRunRequest = {
        app_name: this.appName,
        user_id: context.userId,
        session_id: context.sessionId,
        new_message: adkMessage
      };

      // Send message to ADK API
      const response = await fetch(`${this.baseUrl}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runRequest)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const events: ADKEvent[] = await response.json();
      
      // Process ADK response events
      return this.processADKResponse(events);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if ADK is available
      const isADKAvailable = await checkADKAvailability();
      if (!isADKAvailable) {
        console.warn(getErrorMessage('BACKEND_UNAVAILABLE'));
      }
      
      // Fallback to simulated response if backend is not available
      return this.generateFallbackResponse(message, context);
    }
  }

  private processADKResponse(events: ADKEvent[]): ChatResponse {
    let assistantMessage = '';
    let audioPath: string | undefined;

    for (const event of events) {
      const content = event.content;
      
      if (content.role === 'model') {
        for (const part of content.parts) {
          // Extract text response
          if (part.text) {
            assistantMessage = part.text;
          }
          
          // Extract audio path from text_to_speech function response
          if (part.functionResponse && part.functionResponse.name === 'text_to_speech') {
            const responseText = part.functionResponse.response.result.content[0]?.text || '';
            if (responseText.includes('File saved as:')) {
              const parts = responseText.split('File saved as:')[1]?.trim().split(' ');
              if (parts && parts.length > 0) {
                audioPath = parts[0].replace('.', '');
              }
            }
          }
        }
      }
    }

    return {
      message: assistantMessage || 'No response received',
      audioPath,
      suggestions: this.generateSuggestions(assistantMessage),
      actions: this.generateActions(assistantMessage)
    };
  }

  private generateFallbackResponse(message: string, context: ChatContext): ChatResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('plan') || lowerMessage.includes('refuerzo')) {
      return {
        message: '¡Excelente! Te ayudo a crear un plan de refuerzo. ¿Para qué materia y grado necesitas el plan? También puedes subir archivos con los resultados de tus estudiantes para personalizar mejor el plan.',
        suggestions: [
          'Crear plan para Matemáticas',
          'Crear plan para Lengua',
          'Subir resultados de exámenes',
          'Ver planes anteriores'
        ],
        actions: [
          {
            type: 'create_plan',
            payload: { action: 'open_wizard' }
          }
        ]
      };
    }
    
    if (lowerMessage.includes('resultado') || lowerMessage.includes('ver')) {
      return {
        message: 'Te muestro los resultados de tus planes. ¿Quieres ver los planes en proceso o los finalizados?',
        suggestions: [
          'Ver planes en proceso',
          'Ver planes finalizados',
          'Descargar resultados'
        ],
        actions: [
          {
            type: 'view_results',
            payload: { action: 'navigate_to_results' }
          }
        ]
      };
    }
    
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help')) {
      return {
        message: '¡Por supuesto! Puedo ayudarte con:\n\n• Crear planes de refuerzo personalizados\n• Analizar resultados de estudiantes\n• Gestionar materias y cursos\n• Navegar por la plataforma\n\n¿Qué te gustaría hacer?',
        suggestions: [
          'Crear un plan',
          'Ver tutorial',
          'Contactar soporte'
        ]
      };
    }
    
    return {
      message: 'Entiendo tu consulta. ¿Te gustaría que te ayude a crear un plan de refuerzo, ver resultados, o tienes alguna otra pregunta específica sobre la plataforma?',
      suggestions: [
        'Crear plan de refuerzo',
        'Ver resultados',
        'Ayuda general'
      ]
    };
  }

  private generateSuggestions(message: string): string[] {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('plan') || lowerMessage.includes('refuerzo')) {
      return [
        'Crear plan para Matemáticas',
        'Crear plan para Lengua',
        'Subir resultados de exámenes',
        'Ver planes anteriores'
      ];
    }
    
    if (lowerMessage.includes('resultado')) {
      return [
        'Ver planes en proceso',
        'Ver planes finalizados',
        'Descargar resultados'
      ];
    }
    
    return [
      'Crear un plan de refuerzo',
      'Ver resultados de planes',
      'Subir archivos de estudiantes',
      'Ayuda con la plataforma'
    ];
  }

  private generateActions(message: string): ChatResponse['actions'] {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('plan') || lowerMessage.includes('refuerzo')) {
      return [
        {
          type: 'create_plan',
          payload: { action: 'open_wizard' }
        }
      ];
    }
    
    if (lowerMessage.includes('resultado')) {
      return [
        {
          type: 'view_results',
          payload: { action: 'navigate_to_results' }
        }
      ];
    }
    
    return [];
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    // For now, return empty history as ADK doesn't provide history endpoint
    // In a real implementation, you might store messages locally or have a separate history endpoint
    return [];
  }

  async uploadFile(file: File): Promise<{ url: string; fileName: string }> {
    // Simulate file upload - in real implementation, this would upload to your backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      url: `https://example.com/uploads/${file.name}`,
      fileName: file.name
    };
  }

  async getSuggestions(context: ChatContext): Promise<string[]> {
    return [
      'Crear un plan de refuerzo',
      'Ver resultados de planes',
      'Subir archivos de estudiantes',
      'Ayuda con la plataforma',
      'Gestionar materias'
    ];
  }
}

export const chatService = new ChatService(); 