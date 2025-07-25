<template>
  <div class="market-value-analysis">
    <div class="analysis-header">
      <h3 class="section-title">市场价值分析</h3>
      <p class="section-subtitle">了解你在相亲市场中的竞争力定位</p>
    </div>

    <div class="analysis-content">
      <!-- 市场百分位展示 -->
      <div class="percentile-section">
        <el-card class="percentile-card">
          <div class="percentile-display">
            <div class="percentile-circle">
              <div class="circle-progress" :style="circleStyle">
                <div class="circle-inner">
                  <span class="percentile-value">{{ analysis.marketPercentile }}%</span>
                  <span class="percentile-label">市场百分位</span>
                </div>
              </div>
            </div>
            <div class="percentile-info">
              <h4>你的市场定位</h4>
              <p class="percentile-description">
                你的综合评分超过了 <strong>{{ analysis.marketPercentile }}%</strong> 的用户，
                在相亲市场中处于 <strong>{{ getMarketLevel(analysis.marketPercentile) }}</strong> 水平。
              </p>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 雷达图分析 -->
      <div class="radar-section">
        <el-card class="radar-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon" color="#409EFF"><TrendCharts /></el-icon>
              <span>能力雷达图</span>
            </div>
          </template>
          <div class="radar-container">
            <Radar 
              :data="radarChartData" 
              :options="radarChartOptions"
              :height="300"
            />
          </div>
        </el-card>
      </div>

      <!-- 竞争优势 -->
      <div class="advantages-section">
        <el-card class="advantages-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon" color="#67C23A"><Trophy /></el-icon>
              <span>竞争优势</span>
            </div>
          </template>
          <div class="advantages-list">
            <div 
              v-for="(advantage, index) in analysis.competitiveAdvantages" 
              :key="index"
              class="advantage-item"
            >
              <el-icon class="advantage-icon" color="#67C23A"><Check /></el-icon>
              <span class="advantage-text">{{ advantage }}</span>
            </div>
            <div v-if="analysis.competitiveAdvantages.length === 0" class="no-advantages">
              <el-icon class="info-icon" color="#909399"><InfoFilled /></el-icon>
              <span>继续努力，提升各项指标以获得更多竞争优势</span>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 改进建议 -->
      <div class="improvements-section">
        <el-card class="improvements-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon" color="#E6A23C"><TrendCharts /></el-icon>
              <span>改进建议</span>
            </div>
          </template>
          <div class="improvements-content">
            <div v-if="analysis.detailedImprovements && analysis.detailedImprovements.length > 0">
              <div 
                v-for="(improvement, index) in analysis.detailedImprovements" 
                :key="index"
                class="detailed-improvement-item"
              >
                <div class="improvement-header">
                  <el-tag 
                    :type="getPriorityType(improvement.priority)"
                    size="small"
                    class="priority-tag"
                  >
                    {{ getPriorityText(improvement.priority) }}
                  </el-tag>
                  <span class="improvement-category">{{ improvement.category }}</span>
                </div>
                <div class="improvement-suggestion">
                  <el-icon class="improvement-icon" color="#E6A23C"><ArrowUp /></el-icon>
                  <span class="improvement-text">{{ improvement.suggestion }}</span>
                </div>
                <div class="action-items">
                  <div class="action-items-title">具体行动建议：</div>
                  <ul class="action-list">
                    <li 
                      v-for="(action, actionIndex) in improvement.actionItems" 
                      :key="actionIndex"
                      class="action-item"
                    >
                      {{ action }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else class="no-improvements">
              <el-icon class="success-icon" color="#67C23A"><SuccessFilled /></el-icon>
              <span>恭喜！你的各项指标都表现优秀</span>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 详细评分分解 -->
      <div class="breakdown-section">
        <el-card class="breakdown-card">
          <template #header>
            <span>评分详细分解</span>
          </template>
          <div class="breakdown-list">
            <div class="breakdown-item">
              <div class="breakdown-label">工作收入</div>
              <div class="breakdown-score">
                <el-progress 
                  :percentage="analysis.detailedBreakdown.workIncome" 
                  :color="getScoreColor(analysis.detailedBreakdown.workIncome)"
                  :show-text="false"
                />
                <span class="score-value">{{ analysis.detailedBreakdown.workIncome }}分</span>
              </div>
            </div>
            
            <div class="breakdown-item">
              <div class="breakdown-label">教育背景</div>
              <div class="breakdown-score">
                <el-progress 
                  :percentage="analysis.detailedBreakdown.education" 
                  :color="getScoreColor(analysis.detailedBreakdown.education)"
                  :show-text="false"
                />
                <span class="score-value">{{ analysis.detailedBreakdown.education }}分</span>
              </div>
            </div>
            
            <div class="breakdown-item">
              <div class="breakdown-label">外在条件</div>
              <div class="breakdown-score">
                <el-progress 
                  :percentage="analysis.detailedBreakdown.physical" 
                  :color="getScoreColor(analysis.detailedBreakdown.physical)"
                  :show-text="false"
                />
                <span class="score-value">{{ analysis.detailedBreakdown.physical }}分</span>
              </div>
            </div>
            
            <div class="breakdown-item">
              <div class="breakdown-label">资产住房</div>
              <div class="breakdown-score">
                <el-progress 
                  :percentage="analysis.detailedBreakdown.assets" 
                  :color="getScoreColor(analysis.detailedBreakdown.assets)"
                  :show-text="false"
                />
                <span class="score-value">{{ analysis.detailedBreakdown.assets }}分</span>
              </div>
            </div>
            
            <div class="breakdown-item">
              <div class="breakdown-label">家庭背景</div>
              <div class="breakdown-score">
                <el-progress 
                  :percentage="analysis.detailedBreakdown.family" 
                  :color="getScoreColor(analysis.detailedBreakdown.family)"
                  :show-text="false"
                />
                <span class="score-value">{{ analysis.detailedBreakdown.family }}分</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { 
  Trophy, 
  Check, 
  ArrowUp, 
  TrendCharts, 
  InfoFilled, 
  SuccessFilled 
} from '@element-plus/icons-vue'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'vue-chartjs'

// 注册 Chart.js 组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

export default {
  name: 'MarketValueAnalysis',
  components: {
    Trophy,
    Check,
    ArrowUp,
    TrendCharts,
    InfoFilled,
    SuccessFilled,
    Radar
  },
  props: {
    person: {
      type: Object,
      required: true
    },
    analysis: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // 计算百分位圆形进度条样式
    const circleStyle = computed(() => {
      const percentage = props.analysis.marketPercentile
      const angle = (percentage / 100) * 360
      return {
        background: `conic-gradient(#409EFF 0deg ${angle}deg, #e4e7ed ${angle}deg 360deg)`
      }
    })

    // 获取市场水平描述
    const getMarketLevel = (percentile) => {
      if (percentile >= 90) return '顶尖'
      if (percentile >= 80) return '优秀'
      if (percentile >= 70) return '良好'
      if (percentile >= 60) return '中等偏上'
      if (percentile >= 40) return '中等'
      return '有待提升'
    }

    // 获取评分颜色
    const getScoreColor = (score) => {
      if (score >= 90) return '#67C23A'
      if (score >= 80) return '#95D475'
      if (score >= 70) return '#E6A23C'
      if (score >= 60) return '#F56C6C'
      return '#F56C6C'
    }

    // 雷达图数据配置
    const radarChartData = computed(() => {
      const breakdown = props.analysis.detailedBreakdown
      return {
        labels: ['工作收入', '教育背景', '外在条件', '资产住房', '家庭背景'],
        datasets: [
          {
            label: '个人评分',
            data: [
              breakdown.workIncome,
              breakdown.education,
              breakdown.physical,
              breakdown.assets,
              breakdown.family
            ],
            backgroundColor: 'rgba(64, 158, 255, 0.2)',
            borderColor: '#409EFF',
            borderWidth: 2,
            pointBackgroundColor: '#409EFF',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#409EFF',
            pointHoverBorderColor: '#ffffff'
          }
        ]
      }
    })

    // 雷达图配置选项
    const radarChartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#409EFF',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.r}分`
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            color: '#909399',
            font: {
              size: 12
            },
            callback: function(value) {
              return value + '分'
            }
          },
          grid: {
            color: '#e4e7ed',
            lineWidth: 1
          },
          angleLines: {
            color: '#e4e7ed',
            lineWidth: 1
          },
          pointLabels: {
            color: '#303133',
            font: {
              size: 13,
              weight: '500'
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'point'
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }))



    // 获取优先级类型
    const getPriorityType = (priority) => {
      switch (priority) {
        case 'high': return 'danger'
        case 'medium': return 'warning'
        case 'low': return 'info'
        default: return 'info'
      }
    }

    // 获取优先级文本
    const getPriorityText = (priority) => {
      switch (priority) {
        case 'high': return '高优先级'
        case 'medium': return '中优先级'
        case 'low': return '低优先级'
        default: return '一般'
      }
    }

    return {
      circleStyle,
      getMarketLevel,
      getScoreColor,
      radarChartData,
      radarChartOptions,
      getPriorityType,
      getPriorityText
    }
  }
}
</script>

<style scoped>
.market-value-analysis {
  padding: 20px 0;
}

.analysis-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.section-subtitle {
  color: #606266;
  margin: 0;
}

.analysis-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* 百分位展示 */
.percentile-card {
  grid-column: span 2;
}

.percentile-display {
  display: flex;
  align-items: center;
  gap: 30px;
}

.percentile-circle {
  flex-shrink: 0;
}

.circle-progress {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.circle-inner {
  width: 90px;
  height: 90px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.percentile-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #409EFF;
}

.percentile-label {
  font-size: 0.8rem;
  color: #909399;
}

.percentile-info h4 {
  font-size: 1.2rem;
  color: #303133;
  margin-bottom: 10px;
}

.percentile-description {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

/* 雷达图 */
.radar-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 1.2rem;
}

/* 优势列表 */
.advantages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.advantage-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.advantage-icon {
  flex-shrink: 0;
}

.advantage-text {
  color: #606266;
  line-height: 1.4;
}

.no-advantages,
.no-improvements {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  color: #909399;
}

/* 改进建议 */
.improvements-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detailed-improvement-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.improvement-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.priority-tag {
  font-size: 12px;
}

.improvement-category {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.improvement-suggestion {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.improvement-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.improvement-text {
  color: #606266;
  line-height: 1.5;
  font-size: 14px;
}

.action-items {
  margin-top: 12px;
}

.action-items-title {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
}

.action-list {
  margin: 0;
  padding-left: 20px;
}

.action-item {
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 4px;
}

/* 评分分解 */
.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breakdown-label {
  font-weight: 500;
  color: #303133;
  min-width: 80px;
}

.breakdown-score {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 200px;
}

.score-value {
  font-weight: bold;
  color: #303133;
  min-width: 40px;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analysis-content {
    grid-template-columns: 1fr;
  }
  
  .percentile-card {
    grid-column: span 1;
  }
  
  .percentile-display {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .breakdown-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .breakdown-score {
    width: 100%;
    max-width: none;
  }
}

/* 深色主题支持 */
[data-theme="dark"] .section-title {
  color: #ffffff;
}

[data-theme="dark"] .section-subtitle {
  color: #cccccc;
}

[data-theme="dark"] .circle-inner {
  background: #2d2d2d;
}

[data-theme="dark"] .percentile-info h4 {
  color: #ffffff;
}

[data-theme="dark"] .percentile-description {
  color: #cccccc;
}

[data-theme="dark"] .advantage-text,
[data-theme="dark"] .improvement-text {
  color: #cccccc;
}

[data-theme="dark"] .breakdown-label,
[data-theme="dark"] .score-value {
  color: #ffffff;
}

[data-theme="dark"] .no-advantages,
[data-theme="dark"] .no-improvements {
  background: #404040;
  color: #cccccc;
}

[data-theme="dark"] .detailed-improvement-item {
  background: #404040;
  border-color: #606060;
}

[data-theme="dark"] .improvement-category {
  color: #ffffff;
}

[data-theme="dark"] .improvement-text {
  color: #cccccc;
}

[data-theme="dark"] .action-items-title {
  color: #cccccc;
}

[data-theme="dark"] .action-item {
  color: #cccccc;
}
</style>