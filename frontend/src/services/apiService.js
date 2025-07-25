import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token')
          // router.push('/login')
          break
        case 403:
          console.error('权限不足')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error('请求失败:', error.response.data.message || '未知错误')
      }
    } else if (error.request) {
      // 静默处理网络错误，避免在控制台显示错误信息
      console.log('网络连接失败，使用默认配置')
    } else {
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  }
)

// 用户相关API
export const userAPI = {
  // 保存匹配结果
  saveMatchResult: (data) => {
    return api.post('/match/save', data)
  },
  
  // 获取历史记录
  getMatchHistory: (userId) => {
    return api.get(`/match/history/${userId}`)
  },
  
  // 删除历史记录
  deleteMatchRecord: (recordId) => {
    return api.delete(`/match/record/${recordId}`)
  },
  
  // 获取统计数据
  getStatistics: () => {
    return api.get('/match/statistics')
  }
}

// 认证相关API
export const authAPI = {
  // 用户登录
  login: (credentials) => {
    return api.post('/auth/login', credentials)
  },
  
  // 用户注册
  register: (userData) => {
    return api.post('/auth/register', userData)
  },
  
  // 刷新token
  refreshToken: (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken })
  },
  
  // 用户登出
  logout: () => {
    return api.post('/auth/logout')
  }
}

// 配置相关API
export const configAPI = {
  // 获取评分配置
  getScoreConfig: async () => {
    try {
      return await api.get('/config/score')
    } catch (error) {
      console.warn('无法从服务器获取评分配置，使用默认配置')
      // 返回默认配置
      return {
        weights: {
          age: 0.15,
          salary: 0.25,
          education: 0.20,
          workUnit: 0.15,
          beijingHukou: 0.10,
          beijingHouse: 0.10,
          savings: 0.05
        },
        educationScores: {
          '高中及以下': 60,
          '大专': 70,
          '本科': 80,
          '硕士': 90,
          '博士': 100
        },
        workUnitScores: {
          '私企': 70,
          '外企': 80,
          '国企': 85,
          '事业单位': 90,
          '公务员': 95
        }
      }
    }
  },
  
  // 更新评分配置
  updateScoreConfig: async (config) => {
    try {
      return await api.put('/config/score', config)
    } catch (error) {
      console.warn('无法更新服务器评分配置，仅在本地更新')
      // 返回传入的配置，模拟成功
      return config
    }
  },
  
  // 获取系统配置
  getSystemConfig: async () => {
    try {
      return await api.get('/config/system')
    } catch (error) {
      console.warn('无法从服务器获取系统配置，使用默认配置')
      // 返回默认配置
      return {
        appName: 'MARRYMATCH',
        version: '1.0.0',
        maxHistoryRecords: 100,
        autoSave: true
      }
    }
  }
}

// 导出默认实例
export default api