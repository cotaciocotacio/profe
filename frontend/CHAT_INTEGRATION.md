# Chat Integration with ADK Backend

## Overview

This document describes how the frontend chat implementation aligns with the ADK (Agent Development Kit) backend structure, based on the Streamlit reference implementation.

## Backend Structure Alignment

### Session Management
- **ADK Session**: Uses `app_name`, `user_id`, and `session_id` for session management
- **Frontend**: Creates sessions via `/apps/{app_name}/users/{user_id}/sessions/{session_id}` endpoint
- **Fallback**: If ADK is unavailable, creates local sessions with simulated responses

### Message Format
- **ADK Message Structure**:
  ```typescript
  {
    role: 'user' | 'model',
    parts: [{ text: string }]
  }
  ```
- **Frontend**: Converts user messages to ADK format before sending

### Response Processing
- **ADK Events**: Backend returns array of events with complex structure
- **Text Extraction**: Extracts text from `content.parts[0].text`
- **Audio Extraction**: Extracts audio paths from `text_to_speech` function responses
- **Frontend**: Processes events to extract both text and audio responses

## Key Features

### 1. Audio Integration
- Supports audio responses from TTS (Text-to-Speech) functions
- Audio files are displayed with HTML5 `<audio>` controls
- Graceful fallback if audio files are not accessible

### 2. Session Management
- Automatic session creation on chat initialization
- Session persistence across page reloads
- Error handling for backend unavailability

### 3. Error Handling
- Network error detection and fallback responses
- User-friendly error messages
- Automatic retry logic for failed requests

### 4. Configuration
- Centralized configuration in `src/config/chat.ts`
- Easy switching between ADK and fallback modes
- Configurable timeouts and settings

## API Endpoints

### Session Creation
```
POST /apps/{app_name}/users/{user_id}/sessions/{session_id}
```

### Message Sending
```
POST /run
Body: {
  app_name: string,
  user_id: string,
  session_id: string,
  new_message: {
    role: 'user',
    parts: [{ text: string }]
  }
}
```

## File Structure

```
src/
├── components/chat/
│   ├── ChatWidget.tsx      # Main chat interface
│   ├── ChatMessage.tsx     # Individual message component
│   └── ChatInput.tsx       # Message input component
├── services/
│   └── chatService.ts      # ADK API integration
├── hooks/
│   └── useChat.ts          # Chat state management
├── types/
│   └── chat.ts            # TypeScript interfaces
└── config/
    └── chat.ts            # Configuration settings
```

## Usage

### Basic Integration
```typescript
import { useChat } from '../hooks/useChat';

const { messages, sendMessage, isLoading } = useChat({
  sessionId: 'session-123',
  userId: 'user-456',
  userRole: 'teacher',
  appName: 'speaker'
});
```

### Configuration
```typescript
// src/config/chat.ts
export const CHAT_CONFIG = {
  ADK_BASE_URL: 'http://localhost:8000',
  ADK_APP_NAME: 'speaker',
  USE_FALLBACK: false,
  // ... other settings
};
```

## Backend Requirements

### ADK Server
- Must be running on `localhost:8000` (configurable)
- Must have "speaker" app registered and available
- Must support session management endpoints
- Must support `/run` endpoint for message processing

### Response Format
The backend should return events in this format:
```json
[
  {
    "content": {
      "role": "model",
      "parts": [
        {
          "text": "Assistant response text"
        }
      ]
    }
  },
  {
    "content": {
      "role": "model",
      "parts": [
        {
          "functionResponse": {
            "name": "text_to_speech",
            "response": {
              "result": {
                "content": [
                  {
                    "text": "File saved as: /path/to/audio.mp3"
                  }
                ]
              }
            }
          }
        }
      ]
    }
  }
]
```

## Fallback Mode

When the ADK backend is unavailable, the frontend automatically switches to fallback mode:

1. **Session Creation**: Creates local sessions without backend communication
2. **Message Responses**: Uses simulated responses based on message content
3. **Error Handling**: Shows appropriate error messages to users
4. **Graceful Degradation**: Maintains full UI functionality

## Testing

### Backend Availability
```typescript
import { checkADKAvailability } from '../config/chat';

const isAvailable = await checkADKAvailability();
console.log('ADK Backend Available:', isAvailable);
```

### Manual Testing
1. Start ADK server: `adk api_server`
2. Ensure speaker app is registered
3. Start frontend: `npm run dev`
4. Open chat widget and send messages
5. Verify text and audio responses

## Troubleshooting

### Common Issues

1. **Backend Not Available**
   - Check if ADK server is running on port 8000
   - Verify speaker app is registered
   - Check network connectivity

2. **Audio Not Playing**
   - Verify audio file path is accessible
   - Check browser audio support
   - Ensure CORS is configured for audio files

3. **Session Creation Fails**
   - Check ADK server logs
   - Verify app_name and user_id format
   - Ensure proper authentication if required

### Debug Mode
Enable debug logging by setting:
```typescript
// In chatService.ts
console.log('ADK Request:', runRequest);
console.log('ADK Response:', events);
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live message updates
2. **Message History**: Backend storage and retrieval of chat history
3. **File Upload**: Direct file upload to ADK backend
4. **Multi-modal Support**: Image and document processing
5. **User Authentication**: Integration with existing auth system 