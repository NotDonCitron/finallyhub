# AI Features with OpenRouter Integration

This document describes the AI-powered features implemented in Bluebirdhub using OpenRouter API.

## Overview

Bluebirdhub integrates with OpenRouter to provide AI-powered writing assistance, document analysis, and content generation capabilities. The implementation uses Claude 3 Haiku for fast and cost-effective AI responses.

## Features

### 1. Document Summarization
- **Endpoint**: `POST /api/ai/summarize`
- **Purpose**: Generate concise summaries of document content
- **Use Case**: Quick overview of long documents

### 2. Writing Suggestions
- **Endpoint**: `POST /api/ai/suggest`
- **Purpose**: Get AI suggestions for improving document quality
- **Focus Areas**: Clarity, structure, grammar, style

### 3. Q&A System
- **Endpoint**: `POST /api/ai/question`
- **Purpose**: Answer questions about document content
- **Use Case**: Document comprehension and analysis

### 4. Outline Generation
- **Endpoint**: `POST /api/ai/outline`
- **Purpose**: Create structured outlines for topics
- **Use Case**: Content planning and organization

### 5. Writing Improvement
- **Endpoint**: `POST /api/ai/improve`
- **Purpose**: Enhance writing quality and style
- **Focus**: Grammar, clarity, professional tone

### 6. Content Generation
- **Endpoint**: `POST /api/ai/generate`
- **Purpose**: Generate new content about specific topics
- **Options**: Short, medium, or long form content

## Backend Implementation

### Service Architecture
```
backend/
├── services/
│   └── aiService.js          # OpenRouter integration
├── routes/
│   └── ai.js                 # AI API endpoints
├── config/
│   └── openrouter.js         # AI service configuration
└── tests/
    └── ai.test.js            # AI endpoint tests
```

### OpenRouter Service
```javascript
class OpenRouterService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

  async summarizeDocument(content, title) {
    // AI summarization logic
  }

  async suggestImprovements(content) {
    // AI improvement suggestions
  }

  // ... other methods
}
```

### API Endpoints

#### Summarize Document
```http
POST /api/ai/summarize
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Document content to summarize",
  "title": "Document title (optional)"
}
```

**Response:**
```json
{
  "summary": "Generated summary text",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Get Suggestions
```http
POST /api/ai/suggest
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Document content to analyze"
}
```

**Response:**
```json
{
  "suggestions": "AI-generated improvement suggestions",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Answer Question
```http
POST /api/ai/question
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Document content",
  "question": "What is the main topic?"
}
```

**Response:**
```json
{
  "answer": "AI-generated answer",
  "question": "What is the main topic?",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Frontend Implementation

### Component Structure
```
frontend/src/
├── components/
│   └── AI/
│       ├── AIAssistant.jsx      # Main AI component
│       └── AIAssistant.css      # AI component styles
├── services/
│   └── aiService.js             # Frontend AI service
```

### AI Assistant Component
The AI Assistant is integrated into the Document Editor sidebar and provides:

- **Tabbed Interface**: Easy access to different AI features
- **Real-time Processing**: Shows loading states during AI requests
- **Content Integration**: Insert AI-generated content directly into documents
- **Error Handling**: User-friendly error messages

### Features Overview

#### 1. Summarize Tab
- Generates document summaries
- Uses document title and content
- One-click operation

#### 2. Suggest Tab
- Provides improvement suggestions
- Focuses on writing quality
- Actionable recommendations

#### 3. Q&A Tab
- Answer questions about document content
- Interactive question input
- Context-aware responses

#### 4. Outline Tab
- Generate structured outlines
- Topic and details input
- Markdown formatted output

#### 5. Improve Tab
- Enhance writing quality
- Grammar and style improvements
- Maintains original meaning

#### 6. Generate Tab
- Create new content
- Configurable length options
- Topic-based generation

## Configuration

### Environment Variables
```env
# OpenRouter Configuration
OPENROUTER_API_KEY=your-openrouter-api-key-here
DOMAIN_URL=http://localhost:3000
```

### OpenRouter Setup
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key
3. Add to environment variables
4. Restart the backend server

### Model Configuration
```javascript
const OpenRouterConfig = {
  models: {
    fast: 'anthropic/claude-3-haiku',      // Fast and cost-effective
    balanced: 'anthropic/claude-3-sonnet',  // Balanced performance
    premium: 'anthropic/claude-3-opus'      // High-quality responses
  },
  defaultModel: 'anthropic/claude-3-haiku'
};
```

## Usage Examples

### Document Summarization
1. Open a document in the editor
2. Click the "Summarize" tab in AI Assistant
3. Click "📝 Summarize Document"
4. Review the generated summary
5. Click "Insert into Document" to add to document

### Content Generation
1. Click the "Generate" tab in AI Assistant
2. Enter a topic (e.g., "Benefits of Remote Work")
3. Select length (short, medium, long)
4. Click "🚀 Generate Content"
5. Insert generated content into document

### Q&A System
1. Select a document with content
2. Click the "Q&A" tab
3. Enter your question
4. Click "❓ Ask Question"
5. Review the AI-generated answer

## Error Handling

### Common Errors
- **Missing API Key**: Configure OPENROUTER_API_KEY
- **Rate Limiting**: Implement proper rate limiting
- **Network Timeouts**: Handle connection issues
- **Invalid Responses**: Validate AI responses

### Error Messages
```javascript
// Service errors
"AI service timeout. Please try again."
"OpenRouter API error: [details]"
"Failed to generate summary"

// Validation errors
"Content is required and cannot be empty"
"Question is required and cannot be empty"
"Topic is required and cannot be empty"
```

## Performance Considerations

### Optimization Strategies
- **Model Selection**: Use Claude 3 Haiku for speed
- **Token Limits**: Optimize prompt sizes
- **Caching**: Consider response caching
- **Rate Limiting**: Implement user-based limits

### Response Times
- **Summarization**: 2-5 seconds
- **Suggestions**: 3-7 seconds
- **Q&A**: 2-4 seconds
- **Content Generation**: 5-10 seconds

## Security

### Authentication
- All AI endpoints require JWT authentication
- User-specific rate limiting
- Input validation and sanitization

### Data Privacy
- No data stored by OpenRouter
- Requests are processed in real-time
- User content is not retained

## Testing

### Backend Tests
```bash
cd backend
npm test -- ai.test.js
```

### Frontend Tests
```bash
cd frontend
npm test -- AIAssistant.test.jsx
```

### Integration Tests
- API endpoint validation
- Authentication requirements
- Error handling scenarios
- Response format validation

## Cost Management

### Token Usage
- **Summarization**: ~150 tokens
- **Suggestions**: ~300 tokens
- **Q&A**: ~200 tokens
- **Outline**: ~400 tokens
- **Improvement**: ~500 tokens
- **Generation**: ~800 tokens

### Cost Optimization
- Use appropriate token limits
- Implement user quotas
- Monitor usage patterns
- Choose cost-effective models

## Future Enhancements

### Planned Features
- **Document Translation**: Multi-language support
- **Style Adaptation**: Tone and style customization
- **Content Templates**: Pre-defined content structures
- **Collaboration AI**: Team-based AI assistance
- **Analytics**: AI usage analytics and insights

### Technical Improvements
- **Streaming Responses**: Real-time AI output
- **Offline Mode**: Local AI processing
- **Custom Models**: Fine-tuned models for specific use cases
- **Voice Integration**: Voice-to-text and text-to-voice

## Troubleshooting

### Common Issues
1. **No AI responses**: Check API key configuration
2. **Slow responses**: Verify network connectivity
3. **Error messages**: Check backend logs
4. **Missing UI**: Ensure components are imported correctly

### Debug Steps
1. Check environment variables
2. Verify API key validity
3. Test with simple requests
4. Review error logs
5. Validate request formats

## Support

For issues related to:
- **OpenRouter API**: Check [OpenRouter documentation](https://openrouter.ai/docs)
- **Component Integration**: Review React component structure
- **Backend Configuration**: Verify environment setup
- **Performance Issues**: Monitor response times and optimize prompts

This AI integration provides powerful writing assistance while maintaining security, performance, and user experience standards.