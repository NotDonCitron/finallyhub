# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bluebirdhub is a team workspace application with Docker containerization. It consists of a Node.js/Express backend API and a React frontend, designed for task management, calendar scheduling, and file uploads.

## Development Commands

### Starting the Application
```bash
# Start all services (backend, frontend, db)
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

### Backend Development
```bash
# Navigate to backend directory
cd bluebirdhub/backend

# Install dependencies (if not using Docker)
npm install

# Start backend server
npm start

# Start with nodemon for development
npm run dev
```

### Frontend Development
```bash
# Navigate to frontend directory
cd bluebirdhub/frontend

# Install dependencies (if not using Docker)
npm install

# Start React development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Architecture Overview

### Backend (Node.js/Express)
- **Entry Point**: `backend/app.js` - Express server with CORS, body parsing, and route mounting
- **Authentication**: JWT-based auth with bcrypt password hashing in `routes/auth.js`
- **Routes Structure**:
  - `/api/auth` - User authentication (login, token verification)
  - `/api/tasks` - Task CRUD operations with user isolation
  - `/api/files` - File upload handling with multer
- **Storage**: In-memory storage for tasks and files (demo setup)
- **File Uploads**: Stored in `backend/uploads/` directory

### Frontend (React)
- **Single Page Application**: All components in `frontend/src/App.jsx`
- **State Management**: React hooks for local state (no external state library)
- **Key Components**:
  - `Login` - Authentication form
  - `Calendar` - 7-day calendar view with task scheduling
  - `FileUpload` - Drag & drop file upload component
  - `App` - Main application with navigation and task management
- **Styling**: TailwindCSS via CDN in `public/index.html`

### Authentication Flow
1. Demo users hardcoded in both frontend and backend
2. Backend generates JWT tokens with 24-hour expiration
3. Frontend stores user state in component state (no persistence)
4. `verifyToken` middleware protects backend routes

### Data Flow
- Tasks are stored in-memory with user isolation by `userId`
- Files are uploaded to disk and metadata stored in-memory
- No database persistence (SQLite container is placeholder)

### Demo Configuration
- 3 demo users: user1, user2, user3 (all with password: pass123)
- JWT secret: 'bluebirdhub-secret-key'
- Backend port: 5000, Frontend port: 3000

## Docker Architecture

Services defined in `docker-compose.yml`:
- **backend**: Node.js API server with volume mounting for development
- **frontend**: React development server with hot reload
- **db**: Alpine Linux container (placeholder for future database)

Volume mounting allows live code changes without rebuilding containers.

## File Upload System

Files are processed through:
1. Multer middleware in `backend/routes/files.js`
2. Stored in `backend/uploads/` with timestamped filenames
3. Frontend drag & drop interface associates files with tasks
4. No actual database persistence - files exist only in memory references

## Troubleshooting

### Docker File Sharing Issues
If you encounter "mounts denied" errors, ensure Docker has access to the project directory:

1. **macOS**: Go to Docker Desktop → Settings → Resources → File Sharing
2. Add `/Applications/Archon` to the shared paths
3. Restart Docker Desktop

### Alternative Solutions
If file sharing issues persist:

```bash
# Run from the bluebirdhub directory instead of parent
cd bluebirdhub
docker-compose up

# Or use absolute paths in docker-compose.yml volumes
# Change ./backend:/app to /full/path/to/backend:/app
```

### Port Conflicts
If ports 3000 or 5000 are already in use:
- Frontend: Change port in docker-compose.yml frontend service
- Backend: Change port in docker-compose.yml backend service and update REACT_APP_API_URL