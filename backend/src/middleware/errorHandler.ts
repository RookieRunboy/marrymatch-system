import { Request, Response, NextFunction } from 'express';

/**
 * 应用错误类
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = '服务器内部错误';
  let isOperational = false;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }

  // 记录错误日志
  console.error(`[${new Date().toISOString()}] Error ${statusCode}:`, {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // 返回错误响应
  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? message : '服务器内部错误',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        details: error.message 
      })
    }
  });
};

/**
 * 异步错误捕获包装器
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};