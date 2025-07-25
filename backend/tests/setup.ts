// Jest测试环境设置文件
import dotenv from 'dotenv';

// 加载测试环境变量
dotenv.config({ path: '.env.test' });

// 设置测试超时时间
jest.setTimeout(10000);

// 全局测试前置处理
beforeAll(() => {
  console.log('🧪 开始运行测试套件');
});

// 全局测试后置处理
afterAll(() => {
  console.log('✅ 测试套件运行完成');
});