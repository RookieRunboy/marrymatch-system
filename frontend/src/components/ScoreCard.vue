<template>
  <el-card class="score-card" :class="{ 'match-card': isMatchCard, 'detailed-card': showDetails }">
    <template #header>
      <div class="card-header">
        <el-icon><component :is="icon" /></el-icon>
        <span>{{ title }}</span>
        <div class="header-actions" v-if="!isMatchCard">
          <el-button 
            type="text" 
            size="small" 
            @click="toggleDetails"
            class="toggle-btn"
          >
            {{ showDetails ? '收起详情' : '查看详情' }}
          </el-button>
        </div>
      </div>
    </template>
    
    <!-- 总体评分显示 -->
    <div class="score-display">
      <div class="score-number" :class="{ 'match-score': isMatchCard }">
        {{ displayScore }}
      </div>
      <div class="score-level" :class="levelClass">
        {{ level }}
      </div>
      <div class="percentile-info" v-if="!isMatchCard && percentile">
        <el-tag :type="percentileTagType" size="small">
          超越{{ percentile }}%的用户
        </el-tag>
      </div>
    </div>
    
    <!-- 详细评分分解 -->
    <div v-if="showDetails && !isMatchCard && detailedScores" class="score-breakdown">
      <el-divider content-position="left">评分详情</el-divider>
      
      <div class="dimensions-grid">
        <div 
          v-for="dimension in dimensionsList" 
          :key="dimension.key"
          class="dimension-item"
          :class="{ 'highlight': dimension.isStrength, 'weakness': dimension.isWeakness }"
        >
          <div class="dimension-header">
            <span class="dimension-name">{{ dimension.name }}</span>
            <span class="dimension-weight">{{ dimension.weight }}%</span>
          </div>
          
          <div class="dimension-score-bar">
            <el-progress 
              :percentage="dimension.score" 
              :color="getDimensionColor(dimension.score)"
              :stroke-width="8"
              :show-text="false"
            />
            <span class="dimension-score-text">{{ dimension.score }}分</span>
          </div>
          
          <div class="dimension-details" v-if="dimension.details">
            <div class="detail-item" v-for="detail in dimension.details" :key="detail.label">
              <span class="detail-label">{{ detail.label }}:</span>
              <span class="detail-value">{{ detail.value }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 改进建议 -->
      <div v-if="improvementSuggestions && improvementSuggestions.length > 0" class="improvement-suggestions">
        <el-divider content-position="left">改进建议</el-divider>
        <div class="suggestions-list">
          <el-alert
            v-for="(suggestion, index) in improvementSuggestions"
            :key="index"
            :title="suggestion.title"
            :description="suggestion.description"
            :type="suggestion.type || 'info'"
            :closable="false"
            show-icon
            class="suggestion-item"
          />
        </div>
      </div>
      
      <!-- 竞争优势 -->
      <div v-if="competitiveAdvantages && competitiveAdvantages.length > 0" class="competitive-advantages">
        <el-divider content-position="left">竞争优势</el-divider>
        <div class="advantages-list">
          <el-tag
            v-for="(advantage, index) in competitiveAdvantages"
            :key="index"
            type="success"
            size="large"
            class="advantage-tag"
          >
            <el-icon><Trophy /></el-icon>
            {{ advantage }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Star, Promotion, Trophy } from '@element-plus/icons-vue'

export default {
  name: 'ScoreCard',
  components: {
    Star,
    Promotion,
    Trophy
  },
  props: {
    title: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: 'Star'
    },
    isMatchCard: {
      type: Boolean,
      default: false
    },
    // 详细评分数据
    detailedScores: {
      type: Object,
      default: null
    },
    // 百分位排名
    percentile: {
      type: Number,
      default: null
    },
    // 改进建议
    improvementSuggestions: {
      type: Array,
      default: () => []
    },
    // 竞争优势
    competitiveAdvantages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showDetails: false
    }
  },
  computed: {
    displayScore() {
      return this.isMatchCard ? `${this.score}%` : this.score
    },
    level() {
      if (this.isMatchCard) {
        return this.getMatchLevel(this.score)
      } else {
        return this.getScoreLevel(this.score)
      }
    },
    levelClass() {
      if (this.isMatchCard) return ''
      
      const score = this.score
      if (score >= 90) return 'level-excellent'
      if (score >= 80) return 'level-good'
      if (score >= 70) return 'level-average'
      if (score >= 60) return 'level-fair'
      return 'level-poor'
    },
    percentileTagType() {
      if (!this.percentile) return 'info'
      if (this.percentile >= 90) return 'success'
      if (this.percentile >= 70) return 'warning'
      return 'info'
    },
    // 维度列表，用于详细评分显示
    dimensionsList() {
      if (!this.detailedScores) return []
      
      const dimensions = [
        {
          key: 'workIncome',
          name: '工作收入',
          weight: 40,
          score: this.detailedScores.workIncome || 0,
          details: this.detailedScores.workIncomeDetails || []
        },
        {
          key: 'education',
          name: '教育背景',
          weight: 25,
          score: this.detailedScores.education || 0,
          details: this.detailedScores.educationDetails || []
        },
        {
          key: 'assets',
          name: '资产住房',
          weight: 15,
          score: this.detailedScores.assets || 0,
          details: this.detailedScores.assetsDetails || []
        },
        {
          key: 'physical',
          name: '外在条件',
          weight: 15,
          score: this.detailedScores.physical || 0,
          details: this.detailedScores.physicalDetails || []
        },
        {
          key: 'family',
          name: '家庭背景',
          weight: 5,
          score: this.detailedScores.family || 0,
          details: this.detailedScores.familyDetails || []
        }
      ]
      
      // 标记优势和劣势
      const avgScore = dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length
      dimensions.forEach(dimension => {
        dimension.isStrength = dimension.score >= avgScore + 15
        dimension.isWeakness = dimension.score <= avgScore - 15
      })
      
      return dimensions
    }
  },
  methods: {
    getScoreLevel(score) {
      if (score >= 90) return '优秀'
      if (score >= 80) return '良好'
      if (score >= 70) return '中等'
      if (score >= 60) return '一般'
      return '较差'
    },
    getMatchLevel(score) {
      if (score >= 90) return '非常匹配'
      if (score >= 80) return '比较匹配'
      if (score >= 70) return '基本匹配'
      if (score >= 60) return '勉强匹配'
      return '不太匹配'
    },
    toggleDetails() {
      this.showDetails = !this.showDetails
    },
    getDimensionColor(score) {
      if (score >= 90) return '#67c23a'
      if (score >= 80) return '#e6a23c'
      if (score >= 70) return '#409eff'
      if (score >= 60) return '#f56c6c'
      return '#909399'
    }
  }
}
</script>

<style scoped>
.score-card {
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.detailed-card {
  text-align: left;
}

.match-card {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
}

.match-card :deep(.el-card__header) {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.header-actions {
  margin-left: auto;
}

.toggle-btn {
  color: #409eff;
  font-size: 12px;
}

.score-display {
  padding: 20px 0;
  text-align: center;
}

.score-number {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 10px;
}

.match-score {
  color: #fff;
}

.score-level {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 10px;
}

.match-card .score-level {
  color: rgba(255, 255, 255, 0.9);
}

/* 评分等级颜色 */
.level-excellent {
  color: #67c23a;
  font-weight: 600;
}

.level-good {
  color: #e6a23c;
  font-weight: 600;
}

.level-average {
  color: #409eff;
  font-weight: 600;
}

.level-fair {
  color: #f56c6c;
  font-weight: 600;
}

.level-poor {
  color: #909399;
  font-weight: 600;
}

.percentile-info {
  margin-top: 10px;
}

/* 评分分解样式 */
.score-breakdown {
  padding: 0 20px 20px;
  text-align: left;
}

.dimensions-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 20px;
}

.dimension-item {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.dimension-item.highlight {
  border-color: #67c23a;
  background: #f0f9ff;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.2);
}

.dimension-item.weakness {
  border-color: #f56c6c;
  background: #fef0f0;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.2);
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dimension-name {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.dimension-weight {
  font-size: 12px;
  color: #909399;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.dimension-score-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.dimension-score-bar :deep(.el-progress) {
  flex: 1;
}

.dimension-score-text {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  min-width: 40px;
}

.dimension-details {
  margin-top: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.detail-label {
  color: #909399;
}

.detail-value {
  font-weight: 500;
  color: #303133;
}

/* 改进建议样式 */
.improvement-suggestions {
  margin-top: 20px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  border-radius: 8px;
}

.suggestion-item :deep(.el-alert__title) {
  font-size: 14px;
  font-weight: 600;
}

.suggestion-item :deep(.el-alert__description) {
  font-size: 13px;
  line-height: 1.5;
}

/* 竞争优势样式 */
.competitive-advantages {
  margin-top: 20px;
}

.advantages-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.advantage-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
}

.advantage-tag .el-icon {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .score-breakdown {
    padding: 0 12px 12px;
  }
  
  .dimension-item {
    padding: 12px;
  }
  
  .dimension-name {
    font-size: 13px;
  }
  
  .dimension-weight {
    font-size: 11px;
  }
  
  .advantages-list {
    flex-direction: column;
  }
  
  .advantage-tag {
    justify-content: center;
  }
}

/* 动画效果 */
.dimension-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>