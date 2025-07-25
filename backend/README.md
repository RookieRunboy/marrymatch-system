# MARRYMATCH Backend API

MARRYMATCH相亲评分系统的后端API服务，基于Node.js + TypeScript + Express构建。

## 技术栈

- **运行时**: Node.js 18+
- **语言**: TypeScript
- **框架**: Express.js
- **测试**: Jest + Supertest
- **代码质量**: ESLint + TypeScript
- **部署**: Railway

## 项目结构

```
backend/
├── src/
│   ├── controllers/     # 控制器层 (待实现)
│   ├── services/        # 业务逻辑层 (待实现)
│   ├── models/          # 数据模型 (待实现)
│   ├── routes/          # 路由定义
│   ├── middleware/      # 中间件
│   ├── utils/           # 工具函数 (待实现)
│   ├── types/           # TypeScript类型定义 (待实现)
│   └── index.ts         # 应用入口
├── tests/               # 测试文件
├── dist/                # 编译输出目录
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript配置
├── jest.config.js       # Jest测试配置
├── .eslintrc.js         # ESLint配置
├── railway.toml         # Railway部署配置
└── README.md            # 项目说明
```

## 开发环境设置

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量模板：
```bash
cp .env.example .env
```

根据需要修改 `.env` 文件中的配置。

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

## 可用脚本

- `npm run dev` - 启动开发服务器 (热重载)
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm test` - 运行测试
- `npm run test:watch` - 监视模式运行测试
- `npm run lint` - 代码检查
- `npm run lint:fix` - 自动修复代码问题

## API端点

### 健康检查
- `GET /api/v1/health` - 服务健康状态检查

### 评分服务 (待实现)
- `POST /api/v1/score/calculate` - 单人评分计算
- `POST /api/v1/score/compare` - 双人匹配度计算

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| NODE_ENV | 运行环境 | development |
| PORT | 服务端口 | 3000 |
| CORS_ORIGIN | CORS允许的源 | http://localhost:5173 |
| LOG_LEVEL | 日志级别 | info |

## 部署

### Railway部署

1. 连接GitHub仓库到Railway项目
2. 配置环境变量
3. 自动部署将在代码推送时触发

### 本地构建

```bash
npm run build
npm start
```

## 开发规范

1. **代码风格**: 遵循ESLint配置的代码规范
2. **类型安全**: 充分利用TypeScript的类型系统
3. **错误处理**: 使用统一的错误处理机制
4. **测试**: 为关键功能编写单元测试
5. **日志**: 使用结构化日志记录

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License