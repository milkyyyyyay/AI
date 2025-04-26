import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import authRoutes from './routes/auth';
import codeRoutes from './routes/code';
import healthRoutes from './routes/health';
import { setupWebSocket } from './websocket';
import { errorHandler } from './middleware/errorHandler';
import { securityMiddleware } from './middleware/security';
import morgan from 'morgan';
import logger from './utils/logger';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Security Middleware
app.use(securityMiddleware);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/health', healthRoutes);

// WebSocket setup
setupWebSocket(io);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    await sequelize.sync();
    logger.info('Database synchronized successfully.');
    
    httpServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer(); 