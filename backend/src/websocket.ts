import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from './models/User';
import { AppError } from './middleware/errorHandler';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const setupWebSocket = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user?.email);

    socket.on('message', async (message: string) => {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful programming assistant. Provide clear and concise answers to programming questions.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
        });

        const response = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';

        socket.emit('message', {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error processing message:', error);
        socket.emit('error', 'Error processing your message');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user?.email);
    });
  });
}; 