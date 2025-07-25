import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

export const healthRouter = Router();

/**
 * 健康检查端点
 * GET /api/v1/health
 */
healthRouter.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const healthInfo = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid
  };

  res.json({
    success: true,
    data: healthInfo
  });
}));