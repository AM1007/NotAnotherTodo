import { Request, Response, NextFunction } from 'express';
import HttpError from '../helpers/httpError';
import { HTTP_STATUS } from '../constants/httpStatus';
import jwtHelpers from '../helpers/jwt';
import models from '../db/associations';

const { User } = models;

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw HttpError(HTTP_STATUS.UNAUTHORIZED, 'Authorization header missing');
    }

    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      throw HttpError(HTTP_STATUS.UNAUTHORIZED, 'Invalid authorization format');
    }

    const { payload, error } = jwtHelpers.verifyToken(token);
    
    if (error || !payload) {
      throw HttpError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token');
    }

    const user = await User.findOne({ 
      where: { 
        id: (payload as any).id,
        token: token 
      } 
    });

    if (!user) {
      throw HttpError(HTTP_STATUS.UNAUTHORIZED, 'User not found or token invalid');
    }

    req.user = {
      id: (user as any).id,
      email: (user as any).email,
      name: (user as any).name,
    };

    next();
  } catch (error) {
    next(error);
  }
};