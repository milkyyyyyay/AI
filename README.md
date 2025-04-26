# AI Coding Assistant

An interactive coding assistant that provides real-time programming help, code suggestions, and debugging assistance through an integrated code editor.

## Features

- Real-time AI-powered coding assistance
- Monaco Editor integration for VS Code-like experience
- Syntax highlighting and auto-complete
- Secure code execution environment
- Real-time chat interface
- User authentication and session management
- Code snippet saving and history
- Responsive and minimalist UI

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- Monaco Editor
- WebSocket for real-time communication

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- WebSocket server
- Docker for code execution

### AI Integration
- OpenAI API / Hugging Face
- Real-time response streaming

## Project Structure

```
.
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
└── docker/           # Docker configuration for code execution
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Docker
- OpenAI API key or Hugging Face API key

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Set up environment variables (see .env.example files in both frontend and backend)
5. Start the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev
   
   # Backend
   cd backend
   npm run dev
   ```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Backend (.env)
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/coding_assistant
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

## License

MIT 