import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Not authorized to access this route', 401));
  }
}; 