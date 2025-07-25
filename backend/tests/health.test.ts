import request from 'supertest';
import app from '../src/app';

describe('Health API', () => {
  describe('GET /api/v1/health', () => {
    it('应该返回健康状态信息', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('memory');
      expect(response.body.data).toHaveProperty('version');
    });

    it('应该返回正确的响应格式', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(typeof response.body.success).toBe('boolean');
      expect(typeof response.body.data).toBe('object');
    });
  });
});