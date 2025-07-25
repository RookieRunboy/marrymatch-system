import { Request, Response, NextFunction } from 'express';

/**
 * 请求日志中间件
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // 记录请求开始
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - 开始处理`);
  
  // 监听响应完成
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // 红色表示错误，绿色表示成功
    const resetColor = '\x1b[0m';
    
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ` +
      `${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
    );
  });
  
  next();
};