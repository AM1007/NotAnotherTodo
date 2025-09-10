import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const notFound = (req: Request, res: Response) => {
  res.status(404).send({
    ok: false,
    error: 'Not found',
    path: req.originalUrl
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof AppError ? err.status : 500;
  const message =
    err instanceof AppError ? err.message : (err.message || 'Server error');

  if (process.env.NODE_ENV === 'dev') {
    console.error('❌', status, message);
    if (err.stack) console.error(err.stack);
  }

  if (err.name?.includes('Sequelize')) {
    return res.status(400).json({
      ok: false,
      error: 'DB validation error'
    });
  }

  res.status(status).json({
    ok: false,
    error: message,
    ...(process.env.NODE_ENV === 'dev' ? { stack: err.stack } : {})
  });
};
