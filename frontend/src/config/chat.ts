// Chat Configuration for ADK Backend Integration
export const CHAT_CONFIG = {
  // ADK Backend Settings
  ADK_BASE_URL: 'http://localhost:8000',
  ADK_APP_NAME: 'speaker',
  
  // Fallback Settings (when ADK is not available)
  USE_FALLBACK: false, // Set to true to use simulated responses
  FALLBACK_DELAY: 1000, // Simulated response delay in ms
  
  // UI Settings
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_INDICATOR_DELAY: 500,
  
  // Audio Settings
  AUDIO_SUPPORT: true,
  AUDIO_FORMATS: ['mp3', 'wav', 'ogg'],
  
  // Session Settings
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_SESSIONS_PER_USER: 5,
  
  // Error Messages
  ERROR_MESSAGES: {
    SESSION_CREATION_FAILED: 'Error al crear la sesión de chat. Verificando conexión con el servidor...',
    MESSAGE_SEND_FAILED: 'Error al enviar el mensaje. Intentando reconectar...',
    AUDIO_PLAYBACK_FAILED: 'Error al reproducir el audio. El archivo puede no estar disponible.',
    NETWORK_ERROR: 'Error de conexión. Verificando conectividad...',
    BACKEND_UNAVAILABLE: 'El servidor de chat no está disponible. Usando modo de respuestas simuladas.'
  }
};

// Helper function to check if ADK backend is available
export const checkADKAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${CHAT_CONFIG.ADK_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Short timeout to avoid long waits
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.warn('ADK backend not available:', error);
    return false;
  }
};

// Helper function to get appropriate error message
export const getErrorMessage = (errorType: keyof typeof CHAT_CONFIG.ERROR_MESSAGES): string => {
  return CHAT_CONFIG.ERROR_MESSAGES[errorType];
}; 