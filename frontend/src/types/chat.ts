// ADK Backend aligned types
export interface ADKSession {
  app_name: string;
  user_id: string;
  session_id: string;
}

export interface ADKMessage {
  role: 'user' | 'model';
  parts: Array<{
    text?: string;
    functionResponse?: {
      name: string;
      response: {
        result: {
          content: Array<{
            text: string;
          }>;
        };
      };
    };
  }>;
}

export interface ADKEvent {
  content: {
    role: 'model';
    parts: Array<{
      text?: string;
      functionResponse?: {
        name: string;
        response: {
          result: {
            content: Array<{
              text: string;
            }>;
          };
        };
      };
    }>;
  };
}

export interface ADKRunRequest {
  app_name: string;
  user_id: string;
  session_id: string;
  new_message: ADKMessage;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'audio';
  status: 'sending' | 'sent' | 'error';
  audioPath?: string; // For audio responses from TTS
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  isActive: boolean;
  adkSession?: ADKSession; // Backend session info
}

export interface ChatContext {
  sessionId: string;
  userId: string;
  userRole: 'teacher' | 'admin' | 'student';
  appName: string; // ADK app name (e.g., "speaker")
  context: {
    currentPlan?: string;
    currentSubject?: string;
    currentCourse?: string;
  };
}

export interface ChatResponse {
  message: string;
  audioPath?: string; // Audio file path if TTS was used
  suggestions?: string[];
  actions?: {
    type: 'create_plan' | 'view_results' | 'help' | 'navigate';
    payload: any;
  }[];
}

export interface ChatInputState {
  message: string;
  isTyping: boolean;
  attachments: File[];
}

export interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  maxHeight?: string;
} 