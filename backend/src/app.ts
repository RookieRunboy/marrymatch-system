import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { healthRouter } from './routes/health';
import { scoreRouter } from './routes/score';

// 加载环境变量
dotenv.config();

const app = express();

// 基础中间件配置
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(compression());

// CORS配置
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 请求解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use(requestLogger);

// 路由配置
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/score', scoreRouter);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: '请求的资源不存在',
      path: req.originalUrl
    }
  });
});

// 全局错误处理中间件
app.use(errorHandler);

export default app;