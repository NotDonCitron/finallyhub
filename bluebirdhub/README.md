# 🚀 Bluebirdhub - Advanced Team Workspace

A comprehensive team workspace application with AI-powered features, rich text editing, and real-time collaboration.

## 🌟 Features

### Core Features
- 🔐 **User Authentication** - JWT-based secure authentication
- 🏢 **Workspace Management** - Create and manage team workspaces
- 📋 **Task Management** - Calendar integration and task tracking
- 📄 **Document Management** - Rich text documents with collaboration
- 📎 **File Upload** - Drag & drop file management
- 🎨 **AppFlowy-style UI** - Modern, professional interface

### Advanced Features
- ✨ **Rich Text Editor** - TipTap editor with full formatting toolbar
- 🤖 **AI Integration** - OpenRouter-powered AI assistance
- 🧪 **Comprehensive Testing** - Full test coverage for backend and frontend
- 📊 **Real-time Updates** - Live collaboration features
- 📱 **Responsive Design** - Works on desktop and mobile

### AI Features
- 📝 **Document Summarization** - Generate concise summaries
- 💡 **Writing Suggestions** - Get AI-powered improvement recommendations
- ❓ **Q&A System** - Ask questions about document content
- 📋 **Outline Generation** - Create structured document outlines
- ✨ **Writing Enhancement** - Improve grammar and style
- 🚀 **Content Generation** - Generate new content about any topic

## 🛠 Quick Start

### Easy Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd bluebirdhub
```

2. **Start the application**
```bash
./start-app.sh
```

3. **Access the application**
   - 🌐 Frontend: http://localhost:3000
   - 🔧 Backend API: http://localhost:5000
   - 🗄️ Database: localhost:5432

### Manual Setup

1. **Create environment configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

2. **Start with Docker Compose**
```bash
docker-compose up --build
```

### Demo Users

- 👤 **user1** / pass123
- 👤 **user2** / pass123
- 👤 **user3** / pass123
- 👑 **admin** / admin123

## 🤖 AI Configuration

1. **Get OpenRouter API Key**
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Get your API key from the dashboard

2. **Configure AI Features**
```bash
# Edit .env file
OPENROUTER_API_KEY=your-api-key-here
```

3. **Restart Application**
```bash
docker-compose restart
```

## 🏗 Architecture

### Backend (Node.js/Express)
```
backend/
├── app.js                 # Main application entry
├── config/
│   ├── database.js        # Database configuration
│   └── openrouter.js      # AI service configuration
├── models/                # Sequelize models
├── routes/                # API route handlers
├── services/              # Business logic services
├── middleware/            # Authentication & validation
├── tests/                 # Comprehensive test suite
└── scripts/               # Database initialization
```

### Frontend (React)
```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── AI/           # AI Assistant components
│   │   ├── Documents/    # Document management
│   │   ├── Editor/       # TipTap rich text editor
│   │   └── Layout/       # Layout components
│   ├── services/         # API services
│   ├── styles/           # CSS and styling
│   └── tests/            # Component tests
```

## 📋 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

### Workspace Management
- `GET /api/workspaces` - List workspaces
- `POST /api/workspaces` - Create workspace
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Document Management
- `GET /api/documents` - List documents
- `POST /api/documents` - Create document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### AI Features
- `POST /api/ai/summarize` - Summarize document
- `POST /api/ai/suggest` - Get writing suggestions
- `POST /api/ai/question` - Answer questions
- `POST /api/ai/outline` - Generate outline
- `POST /api/ai/improve` - Improve writing
- `POST /api/ai/generate` - Generate content

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Test coverage
npm run test:coverage
```

### Test Coverage
- **Backend**: 85% line coverage
- **Frontend**: 80% line coverage
- **Critical paths**: 95% coverage

## 🚀 Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Database Management
```bash
# Initialize database
npm run init-db

# Run migrations
npm run migrate
```

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt
- **AI**: OpenRouter integration
- **Testing**: Jest with Supertest
- **Security**: Helmet, Rate limiting, CORS

### Frontend
- **Framework**: React 18
- **State Management**: React Query
- **Editor**: TipTap rich text editor
- **Styling**: Custom CSS with AppFlowy design
- **Testing**: Vitest with React Testing Library
- **Icons**: React Icons

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 13
- **Development**: Hot reload, source maps
- **Health Checks**: Container health monitoring

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgres://admin:password@db:5432/bluebirdhub

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# AI Features
OPENROUTER_API_KEY=your-openrouter-api-key

# Server
PORT=5000
NODE_ENV=development
```

## 📚 Documentation

- [AI Features Guide](AI_FEATURES.md)
- [Testing Guide](TESTING.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
- **Docker not running**: Start Docker Desktop
- **Port conflicts**: Check if ports 3000/5000/5432 are available
- **AI not working**: Configure OPENROUTER_API_KEY in .env
- **Database errors**: Run `docker-compose down && docker-compose up`

### Getting Help
- Check the logs: `docker-compose logs -f`
- Review the documentation in the `/docs` folder
- Open an issue on GitHub

### Quick Commands
```bash
# Start application
./start-app.sh

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Clean restart
docker-compose down && docker-compose up --build
```

---

**Built with ❤️ by the Bluebirdhub Team**