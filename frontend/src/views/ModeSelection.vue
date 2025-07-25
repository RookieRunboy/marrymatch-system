<template>
  <div class="mode-selection">
    <div class="container">
      <!-- 头部标题 -->
      <div class="header">
        <h1 class="title">MARRY MATCH</h1>
        <p class="subtitle">选择您的评估模式</p>
      </div>

      <!-- 模式选择按钮 -->
      <div class="mode-buttons">
        <div class="mode-card" @click="goToSingleEvaluation">
          <div class="mode-icon">
            <el-icon size="48"><User /></el-icon>
          </div>
          <h3 class="mode-title">个人评估</h3>
          <p class="mode-description">
            全面评估个人在相亲市场中的竞争力<br>
            获得专业的改进建议和市场定位
          </p>
          <div class="mode-features">
            <span class="feature-tag">个人分析</span>
            <span class="feature-tag">市场定位</span>
            <span class="feature-tag">改进建议</span>
          </div>
        </div>

        <div class="mode-card" @click="goToMatchAnalysis">
          <div class="mode-icon">
            <el-icon size="48"><Connection /></el-icon>
          </div>
          <h3 class="mode-title">匹配分析</h3>
          <p class="mode-description">
            分析两人的匹配度和兼容性<br>
            支持异性和同性关系评估
          </p>
          <div class="mode-features">
            <span class="feature-tag">匹配度分析</span>
            <span class="feature-tag">兼容性评估</span>
            <span class="feature-tag">关系建议</span>
          </div>
        </div>
      </div>

      <!-- 功能介绍 -->
      <div class="feature-intro">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="intro-item">
              <el-icon size="32" color="#667eea"><Star /></el-icon>
              <h4>科学评估</h4>
              <p>基于多维度数据分析，提供客观准确的评估结果</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="intro-item">
              <el-icon size="32" color="#667eea"><TrendCharts /></el-icon>
              <h4>市场分析</h4>
              <p>了解在相亲市场中的竞争力和优势定位</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="intro-item">
              <el-icon size="32" color="#667eea"><InfoFilled /></el-icon>
              <h4>专业建议</h4>
              <p>获得个性化的改进建议和发展方向</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { User, Connection, Star, TrendCharts, InfoFilled } from '@element-plus/icons-vue'

export default {
  name: 'ModeSelection',
  components: {
    User,
    Connection,
    Star,
    TrendCharts,
    InfoFilled
  },
  setup() {
    const router = useRouter()

    const goToSingleEvaluation = () => {
      router.push('/single')
    }

    const goToMatchAnalysis = () => {
      router.push('/match')
    }

    return {
      goToSingleEvaluation,
      goToMatchAnalysis
    }
  }
}
</script>

<style scoped>
.mode-selection {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 60px;
  color: white;
}

.title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin: 0;
}

.mode-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
  justify-items: center;
}

.mode-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
}

.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s ease;
}

.mode-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.mode-card:hover::before {
  left: 100%;
}

.mode-icon {
  margin-bottom: 24px;
  color: #667eea;
}

.mode-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.mode-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.mode-features {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.feature-tag {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.feature-intro {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.intro-item {
  text-align: center;
  padding: 20px;
}

.intro-item h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 16px 0 8px;
  color: #2c3e50;
}

.intro-item p {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mode-selection {
    padding: 20px 15px;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .mode-buttons {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-bottom: 60px;
  }
  
  .mode-card {
    padding: 30px 20px;
  }
  
  .feature-intro {
    padding: 30px 20px;
  }
  
  .intro-item {
    margin-bottom: 30px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
  
  .mode-title {
    font-size: 1.5rem;
  }
  
  .mode-description {
    font-size: 0.9rem;
  }
}
</style>