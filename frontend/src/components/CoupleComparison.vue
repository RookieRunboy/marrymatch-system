<template>
  <div class="couple-comparison">
    <!-- 对比标题 -->
    <el-card class="comparison-header">
      <div class="header-content">
        <div class="header-left">
          <el-icon class="header-icon"><Connection /></el-icon>
          <div class="header-text">
            <h2 class="comparison-title">情侣对比分析</h2>
            <p class="comparison-subtitle">全面对比双方条件，分析匹配兼容性</p>
          </div>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="exportComparison" size="small">
            <el-icon><Download /></el-icon>
            导出对比
          </el-button>
          <el-button @click="shareComparison" size="small">
            <el-icon><Share /></el-icon>
            分享对比
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 总体对比卡片 -->
    <el-card class="overall-comparison">
      <template #header>
        <div class="section-header">
          <el-icon><TrendCharts /></el-icon>
          <span>总体竞争力对比</span>
        </div>
      </template>
      
      <div class="overall-content">
        <!-- 双方评分对比 -->
        <div class="scores-comparison">
          <div class="person-score" :class="{ winner: maleScore > femaleScore }">
            <div class="person-info">
              <el-icon class="gender-icon male-icon"><Male /></el-icon>
              <span class="person-label">男方</span>
            </div>
            <div class="score-display">
              <span class="score-value">{{ maleScore }}</span>
              <span class="score-unit">分</span>
            </div>
            <div class="score-level">{{ getScoreLevel(maleScore) }}</div>
          </div>
          
          <div class="vs-divider">
            <div class="vs-text">VS</div>
            <div class="score-gap">
              差距: {{ Math.abs(maleScore - femaleScore) }}分
            </div>
          </div>
          
          <div class="person-score" :class="{ winner: femaleScore > maleScore }">
            <div class="person-info">
              <el-icon class="gender-icon female-icon"><Female /></el-icon>
              <span class="person-label">女方</span>
            </div>
            <div class="score-display">
              <span class="score-value">{{ femaleScore }}</span>
              <span class="score-unit">分</span>
            </div>
            <div class="score-level">{{ getScoreLevel(femaleScore) }}</div>
          </div>
        </div>
        
        <!-- 匹配度显示 -->
        <div class="match-compatibility">
          <div class="compatibility-score">
            <el-progress 
              type="circle" 
              :percentage="matchScore" 
              :color="getMatchColor(matchScore)"
              :width="120"
            >
              <template #default="{ percentage }">
                <span class="match-text">
                  <strong>{{ percentage }}%</strong>
                  <br>
                  <small>匹配度</small>
                </span>
              </template>
            </el-progress>
          </div>
          <div class="compatibility-analysis">
            <div class="match-level">
              <el-tag :type="getMatchTagType(matchScore)" size="large">
                {{ getMatchLevel(matchScore) }}
              </el-tag>
            </div>
            <p class="match-description">{{ getMatchDescription(matchScore) }}</p>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 维度详细对比 -->
    <el-card class="dimensions-comparison">
      <template #header>
        <div class="section-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>各维度详细对比</span>
        </div>
      </template>
      
      <div class="dimensions-grid">
        <div 
          v-for="dimension in dimensionsComparison" 
          :key="dimension.key"
          class="dimension-comparison-item"
        >
          <div class="dimension-header">
            <h4 class="dimension-title">{{ dimension.name }}</h4>
            <span class="dimension-weight">权重 {{ dimension.weight }}%</span>
          </div>
          
          <div class="dimension-comparison-content">
            <!-- 双方得分对比条 -->
            <div class="score-bars">
              <div class="score-bar male-bar">
                <div class="bar-info">
                  <span class="bar-label">男方</span>
                  <span class="bar-score">{{ dimension.maleScore }}分</span>
                </div>
                <div class="bar-container">
                  <div 
                    class="bar-fill male-fill" 
                    :style="{ width: dimension.maleScore + '%' }"
                    :class="{ winner: dimension.winner === 'male' }"
                  ></div>
                </div>
              </div>
              
              <div class="score-bar female-bar">
                <div class="bar-info">
                  <span class="bar-label">女方</span>
                  <span class="bar-score">{{ dimension.femaleScore }}分</span>
                </div>
                <div class="bar-container">
                  <div 
                    class="bar-fill female-fill" 
                    :style="{ width: dimension.femaleScore + '%' }"
                    :class="{ winner: dimension.winner === 'female' }"
                  ></div>
                </div>
              </div>
            </div>
            
            <!-- 竞争优势分析 -->
            <div class="advantage-analysis">
              <div class="advantage-winner" :class="dimension.winner">
                <el-icon v-if="dimension.winner === 'male'" class="winner-icon male-winner"><Male /></el-icon>
                <el-icon v-else-if="dimension.winner === 'female'" class="winner-icon female-winner"><Female /></el-icon>
                <el-icon v-else class="tie-icon"><Minus /></el-icon>
                <span class="advantage-text">{{ getAdvantageText(dimension) }}</span>
                <div class="advantage-badge" v-if="dimension.winner !== 'tie'">
                  <el-tag 
                    :type="dimension.winner === 'male' ? 'primary' : 'danger'" 
                    size="small"
                    effect="dark"
                  >
                    优势 +{{ dimension.difference.toFixed(0) }}分
                  </el-tag>
                </div>
              </div>
              <div class="advantage-details">
                <p class="advantage-description">{{ dimension.analysis }}</p>
                <!-- 竞争力指标 -->
                <div class="competitive-indicators" v-if="dimension.difference > 5">
                  <div class="indicator-item">
                    <span class="indicator-label">竞争优势:</span>
                    <span class="indicator-value" :class="getCompetitiveLevel(dimension.difference)">
                      {{ getCompetitiveLevelText(dimension.difference) }}
                    </span>
                  </div>
                  <!-- 优势程度可视化 -->
                  <div class="advantage-meter">
                    <div class="meter-bar">
                      <div 
                        class="meter-fill" 
                        :class="getCompetitiveLevel(dimension.difference)"
                        :style="{ width: Math.min(100, (dimension.difference / 30) * 100) + '%' }"
                      ></div>
                    </div>
                    <span class="meter-label">{{ getMeterLabel(dimension.difference) }}</span>
                  </div>
                </div>
                <!-- 具体优势分析 -->
                <div class="specific-advantages" v-if="dimension.winner !== 'tie'">
                  <div class="advantage-points">
                    <h6 class="points-title">具体优势分析:</h6>
                    <ul class="points-list">
                      <li v-for="point in getSpecificAdvantages(dimension)" :key="point">
                        {{ point }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 匹配兼容性分析 -->
    <el-card class="compatibility-analysis-card">
      <template #header>
        <div class="section-header">
          <el-icon><Connection /></el-icon>
          <span>匹配兼容性分析</span>
        </div>
      </template>
      
      <div class="compatibility-content">
        <!-- 兼容性雷达图 -->
        <div class="compatibility-radar">
          <div class="radar-container">
            <canvas ref="compatibilityRadar" width="300" height="300"></canvas>
          </div>
          <div class="radar-legend">
            <div class="legend-item">
              <div class="legend-color male-color"></div>
              <span>男方</span>
            </div>
            <div class="legend-item">
              <div class="legend-color female-color"></div>
              <span>女方</span>
            </div>
          </div>
        </div>
        
        <!-- 兼容性建议 -->
        <div class="compatibility-suggestions">
          <h4>匹配兼容性建议</h4>
          
          <!-- 兼容性概览 -->
          <div class="compatibility-overview">
            <div class="overview-item">
              <span class="overview-label">整体匹配度:</span>
              <el-tag :type="getMatchTagType(matchScore)" size="large">
                {{ getMatchLevel(matchScore) }}
              </el-tag>
            </div>
            <div class="overview-item">
              <span class="overview-label">分数差距:</span>
              <span class="score-difference" :class="getScoreDifferenceClass(Math.abs(maleScore - femaleScore))">
                {{ Math.abs(maleScore - femaleScore) }}分
              </span>
            </div>
            <div class="overview-item">
              <span class="overview-label">关系前景:</span>
              <span class="relationship-prospect" :class="getProspectClass(matchScore)">
                {{ getRelationshipProspect(matchScore) }}
              </span>
            </div>
          </div>
          
          <!-- 详细建议列表 -->
          <div class="suggestions-list">
            <div 
              v-for="(suggestion, index) in compatibilitySuggestions" 
              :key="index"
              class="suggestion-item"
              :class="suggestion.type"
            >
              <div class="suggestion-header">
                <el-icon class="suggestion-icon">
                  <component :is="getSuggestionIcon(suggestion.type)" />
                </el-icon>
                <span class="suggestion-title">{{ suggestion.title }}</span>
                <div class="suggestion-priority" v-if="suggestion.priority">
                  <el-tag :type="getPriorityTagType(suggestion.priority)" size="small">
                    {{ getPriorityText(suggestion.priority) }}
                  </el-tag>
                </div>
              </div>
              <p class="suggestion-content">{{ suggestion.content }}</p>
              <!-- 具体行动建议 -->
              <div class="action-suggestions" v-if="suggestion.actions">
                <h6 class="actions-title">建议行动:</h6>
                <ul class="actions-list">
                  <li v-for="action in suggestion.actions" :key="action">{{ action }}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- 兼容性风险提示 -->
          <div class="compatibility-risks" v-if="getCompatibilityRisks().length > 0">
            <h5 class="risks-title">
              <el-icon><WarningFilled /></el-icon>
              需要注意的风险点
            </h5>
            <div class="risks-list">
              <div 
                v-for="(risk, index) in getCompatibilityRisks()" 
                :key="index"
                class="risk-item"
              >
                <div class="risk-header">
                  <el-icon class="risk-icon"><WarningFilled /></el-icon>
                  <span class="risk-title">{{ risk.title }}</span>
                </div>
                <p class="risk-description">{{ risk.description }}</p>
                <div class="risk-mitigation" v-if="risk.mitigation">
                  <span class="mitigation-label">缓解建议:</span>
                  <span class="mitigation-text">{{ risk.mitigation }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 改进建议对比 -->
    <el-card class="improvement-comparison">
      <template #header>
        <div class="section-header">
          <el-icon><Promotion /></el-icon>
          <span>双方改进建议对比</span>
        </div>
      </template>
      
      <div class="improvement-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="person-improvements">
              <h4 class="improvements-title">
                <el-icon><Male /></el-icon>
                男方改进建议
              </h4>
              <div class="improvements-list">
                <div 
                  v-for="(improvement, index) in maleImprovements" 
                  :key="index"
                  class="improvement-item"
                >
                  <div class="improvement-priority">
                    <el-tag 
                      :type="getPriorityTagType(improvement.priority)" 
                      size="small"
                    >
                      {{ getPriorityText(improvement.priority) }}
                    </el-tag>
                  </div>
                  <div class="improvement-details">
                    <h5 class="improvement-title">{{ improvement.title }}</h5>
                    <p class="improvement-description">{{ improvement.description }}</p>
                    <div class="improvement-actions" v-if="improvement.actionItems">
                      <div class="action-items">
                        <span class="action-label">具体行动:</span>
                        <ul class="action-list">
                          <li v-for="(action, idx) in improvement.actionItems" :key="idx">
                            {{ action }}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="improvement-impact">
                      预期提升: +{{ improvement.expectedGain }}分
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="12">
            <div class="person-improvements">
              <h4 class="improvements-title">
                <el-icon><Female /></el-icon>
                女方改进建议
              </h4>
              <div class="improvements-list">
                <div 
                  v-for="(improvement, index) in femaleImprovements" 
                  :key="index"
                  class="improvement-item"
                >
                  <div class="improvement-priority">
                    <el-tag 
                      :type="getPriorityTagType(improvement.priority)" 
                      size="small"
                    >
                      {{ getPriorityText(improvement.priority) }}
                    </el-tag>
                  </div>
                  <div class="improvement-details">
                    <h5 class="improvement-title">{{ improvement.title }}</h5>
                    <p class="improvement-description">{{ improvement.description }}</p>
                    <div class="improvement-actions" v-if="improvement.actionItems">
                      <div class="action-items">
                        <span class="action-label">具体行动:</span>
                        <ul class="action-list">
                          <li v-for="(action, idx) in improvement.actionItems" :key="idx">
                            {{ action }}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="improvement-impact">
                      预期提升: +{{ improvement.expectedGain }}分
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { 
  Connection, 
  Download, 
  Share, 
  TrendCharts, 
  Male, 
  Female, 
  DataAnalysis,
  Minus,
  Promotion,
  SuccessFilled,
  WarningFilled,
  InfoFilled
} from '@element-plus/icons-vue'
import { 
  getScoreLevel, 
  getMatchLevel,
  generateComparisonAnalysis,
  generateMarketValueAnalysis
} from '@/services/scoreCalculator'

export default {
  name: 'CoupleComparison',
  data() {
    return {
      radarChart: null
    }
  },
  components: {
    Connection,
    Download,
    Share,
    TrendCharts,
    Male,
    Female,
    DataAnalysis,
    Minus,
    Promotion,
    SuccessFilled,
    WarningFilled,
    InfoFilled
  },
  props: {
    // 男方评分数据
    maleScore: {
      type: Number,
      required: true
    },
    // 女方评分数据
    femaleScore: {
      type: Number,
      required: true
    },
    // 匹配度评分
    matchScore: {
      type: Number,
      required: true
    },
    // 男方详细评分
    maleDetailedScores: {
      type: Object,
      required: true
    },
    // 女方详细评分
    femaleDetailedScores: {
      type: Object,
      required: true
    },
    // 男方个人信息
    maleData: {
      type: Object,
      required: true
    },
    // 女方个人信息
    femaleData: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 维度对比数据
    dimensionsComparison() {
      const dimensions = [
        {
          key: 'workIncome',
          name: '工作收入',
          weight: 40,
          maleScore: this.maleDetailedScores.workIncome || 0,
          femaleScore: this.femaleDetailedScores.workIncome || 0
        },
        {
          key: 'education',
          name: '教育背景',
          weight: 25,
          maleScore: this.maleDetailedScores.education || 0,
          femaleScore: this.femaleDetailedScores.education || 0
        },
        {
          key: 'assets',
          name: '资产住房',
          weight: 15,
          maleScore: this.maleDetailedScores.assets || 0,
          femaleScore: this.femaleDetailedScores.assets || 0
        },
        {
          key: 'physical',
          name: '外在条件',
          weight: 15,
          maleScore: this.maleDetailedScores.physical || 0,
          femaleScore: this.femaleDetailedScores.physical || 0
        },
        {
          key: 'family',
          name: '家庭背景',
          weight: 5,
          maleScore: this.maleDetailedScores.family || 0,
          femaleScore: this.femaleDetailedScores.family || 0
        }
      ]
      
      return dimensions.map(dim => ({
        ...dim,
        winner: this.getDimensionWinner(dim.maleScore, dim.femaleScore),
        difference: Math.abs(dim.maleScore - dim.femaleScore),
        analysis: this.getDimensionAnalysis(dim.key, dim.maleScore, dim.femaleScore)
      }))
    },
    
    // 兼容性建议
    compatibilitySuggestions() {
      const suggestions = []
      const scoreDiff = Math.abs(this.maleScore - this.femaleScore)
      
      // 基于总分差距的建议
      if (scoreDiff <= 10) {
        suggestions.push({
          type: 'success',
          title: '整体匹配度很高',
          content: '双方条件相当，是很好的匹配组合，建议珍惜这段关系。',
          priority: 'high',
          actions: [
            '积极发展关系，增进相互了解',
            '保持开放的沟通，分享彼此的想法',
            '制定共同的未来规划和目标'
          ]
        })
      } else if (scoreDiff <= 20) {
        suggestions.push({
          type: 'warning',
          title: '存在一定差距',
          content: '双方条件有一定差距，但仍在可接受范围内，建议通过沟通增进了解。',
          priority: 'medium',
          actions: [
            '深入了解彼此的价值观和生活目标',
            '寻找共同兴趣和话题',
            '给关系更多时间发展和磨合'
          ]
        })
      } else {
        suggestions.push({
          type: 'info',
          title: '条件差距较大',
          content: '双方条件差距较大，需要更多的理解和包容，重视精神层面的契合。',
          priority: 'high',
          actions: [
            '重点关注性格契合度和精神层面的连接',
            '坦诚面对条件差异，寻求理解和接纳',
            '考虑是否愿意为对方做出适当的调整'
          ]
        })
      }
      
      // 基于维度分析的建议
      const workIncomeDiff = Math.abs(this.maleDetailedScores.workIncome - this.femaleDetailedScores.workIncome)
      if (workIncomeDiff > 20) {
        suggestions.push({
          type: 'info',
          title: '收入差距需要关注',
          content: '双方收入差距较大，建议就经济责任分担进行充分沟通。',
          priority: 'high',
          actions: [
            '讨论家庭经济责任的分担方式',
            '制定共同的财务目标和储蓄计划',
            '考虑收入较低一方的职业发展支持'
          ]
        })
      }
      
      const educationDiff = Math.abs(this.maleDetailedScores.education - this.femaleDetailedScores.education)
      if (educationDiff > 15) {
        suggestions.push({
          type: 'info',
          title: '教育背景差异',
          content: '双方教育背景存在差异，建议重视共同成长和学习。',
          priority: 'medium',
          actions: [
            '分享各自的学习经历和知识背景',
            '一起参加学习活动或文化活动',
            '尊重不同的思维方式和表达习惯'
          ]
        })
      }
      
      // 外在条件差异分析
      const physicalDiff = Math.abs(this.maleDetailedScores.physical - this.femaleDetailedScores.physical)
      if (physicalDiff > 15) {
        suggestions.push({
          type: 'info',
          title: '外在条件差异',
          content: '双方外在条件存在差异，但内在品质和性格契合更为重要。',
          priority: 'low',
          actions: [
            '重视内在品质和性格的了解',
            '一起参加运动或健康活动',
            '培养共同的审美观和生活方式'
          ]
        })
      }
      
      // 资产差异分析
      const assetsDiff = Math.abs(this.maleDetailedScores.assets - this.femaleDetailedScores.assets)
      if (assetsDiff > 20) {
        suggestions.push({
          type: 'warning',
          title: '资产状况差异较大',
          content: '双方资产状况差异较大，建议就未来财务规划进行深入讨论。',
          priority: 'high',
          actions: [
            '坦诚分享各自的财务状况',
            '讨论购房、投资等重大财务决策',
            '制定共同的财富积累计划'
          ]
        })
      }
      
      // 匹配度特殊建议
      if (this.matchScore >= 85) {
        suggestions.push({
          type: 'success',
          title: '高度匹配组合',
          content: '你们是非常匹配的组合，各方面条件都很协调，建议积极发展关系。',
          priority: 'high',
          actions: [
            '把握机会，积极推进关系发展',
            '开始考虑长期规划和承诺',
            '向双方家庭介绍彼此'
          ]
        })
      } else if (this.matchScore < 60) {
        suggestions.push({
          type: 'warning',
          title: '需要慎重考虑',
          content: '双方条件差异较大，建议更多关注精神层面的契合度和共同价值观。',
          priority: 'high',
          actions: [
            '深入了解彼此的内在品质和价值观',
            '评估是否愿意接受和适应差异',
            '考虑寻求专业的情感咨询建议'
          ]
        })
      }
      
      return suggestions
    },
    
    // 男方改进建议
    maleImprovements() {
      return this.generatePersonImprovements(this.maleDetailedScores, this.maleData)
    },
    
    // 女方改进建议
    femaleImprovements() {
      return this.generatePersonImprovements(this.femaleDetailedScores, this.femaleData)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCompatibilityRadar()
    })
  },
  
  beforeUnmount() {
    // 清理图表资源
    if (this.radarChart) {
      this.radarChart.destroy()
      this.radarChart = null
    }
  },
  methods: {
    // 导出对比报告
    exportComparison() {
      this.$message.success('对比报告导出功能开发中...')
    },
    
    // 分享对比结果
    shareComparison() {
      this.$message.success('分享功能开发中...')
    },
    
    // 获取评分等级
    getScoreLevel,
    
    // 获取匹配等级
    getMatchLevel,
    
    // 获取匹配颜色
    getMatchColor(score) {
      if (score >= 90) return '#67c23a'
      if (score >= 80) return '#e6a23c'
      if (score >= 70) return '#409eff'
      return '#f56c6c'
    },
    
    // 获取匹配标签类型
    getMatchTagType(score) {
      if (score >= 90) return 'success'
      if (score >= 80) return 'warning'
      if (score >= 70) return 'primary'
      return 'danger'
    },
    
    // 获取匹配描述
    getMatchDescription(score) {
      if (score >= 90) return '双方条件非常匹配，是理想的组合'
      if (score >= 80) return '双方条件比较匹配，具有良好的发展前景'
      if (score >= 70) return '双方条件基本匹配，需要更多的理解和包容'
      if (score >= 60) return '双方条件勉强匹配，需要双方共同努力'
      return '双方条件差距较大，需要慎重考虑'
    },
    
    // 获取维度获胜者
    getDimensionWinner(maleScore, femaleScore) {
      const diff = Math.abs(maleScore - femaleScore)
      if (diff < 5) return 'tie' // 差距小于5分视为平局
      return maleScore > femaleScore ? 'male' : 'female'
    },
    
    // 获取优势文本
    getAdvantageText(dimension) {
      if (dimension.winner === 'male') {
        return `男方在${dimension.name}方面具有优势`
      } else if (dimension.winner === 'female') {
        return `女方在${dimension.name}方面具有优势`
      } else {
        return `双方在${dimension.name}方面相当`
      }
    },
    
    // 获取维度分析
    getDimensionAnalysis(key, maleScore, femaleScore) {
      const diff = Math.abs(maleScore - femaleScore)
      const winner = maleScore > femaleScore ? '男方' : '女方'
      const loser = maleScore > femaleScore ? '女方' : '男方'
      
      // 如果差距很小，视为平局
      if (diff < 5) {
        const analyses = {
          workIncome: '双方工作收入水平相当，有利于建立平等的经济关系，共同承担家庭责任',
          education: '双方教育背景匹配，有共同的知识基础和价值观，便于沟通交流',
          assets: '双方资产状况相当，有利于共同建设未来，制定一致的财务目标',
          physical: '双方外在条件匹配，有良好的第一印象基础，外表吸引力相当',
          family: '双方家庭背景相当，有利于家庭融合，减少因家庭差异带来的矛盾'
        }
        return analyses[key] || '双方条件相当，匹配度良好'
      }
      
      const analyses = {
        workIncome: diff > 15 ? 
          `${winner}在工作收入方面明显优于${loser}，差距${diff.toFixed(0)}分。建议${loser}努力提升收入水平，或${winner}承担更多经济责任` :
          `${winner}在工作收入方面略有优势，差距${diff.toFixed(0)}分，属于可接受范围`,
        education: diff > 10 ? 
          `${winner}在教育背景方面优于${loser}，差距${diff.toFixed(0)}分。教育差异可以互补，${winner}可以在学习成长方面给予更多指导` :
          `${winner}在教育背景方面略有优势，差距${diff.toFixed(0)}分，不会影响日常交流`,
        assets: diff > 15 ? 
          `${winner}在资产住房方面条件更好，差距${diff.toFixed(0)}分。建议共同规划财务目标，${winner}可在资产管理方面发挥更大作用` :
          `${winner}在资产状况方面略有优势，差距${diff.toFixed(0)}分，可以共同努力改善`,
        physical: diff > 10 ? 
          `${winner}在外在条件方面更有优势，差距${diff.toFixed(0)}分。但外在条件不是最重要因素，内在品质和性格契合更关键` :
          `${winner}在外在条件方面略有优势，差距${diff.toFixed(0)}分，整体外表匹配度良好`,
        family: diff > 10 ? 
          `${winner}的家庭背景更好，差距${diff.toFixed(0)}分。虽然家庭背景影响相对较小，但需要注意处理双方家庭关系` :
          `${winner}的家庭背景略好，差距${diff.toFixed(0)}分，不会对关系产生重大影响`
      }
      
      return analyses[key] || '双方条件相当'
    },
    
    // 生成个人改进建议
    generatePersonImprovements(detailedScores, personalData) {
      const improvements = []
      
      // 工作收入改进建议
      if ((detailedScores.workIncome || 0) < 80) {
        const currentScore = detailedScores.workIncome || 0
        let suggestion = '工作收入是评分权重最高的维度，提升收入能显著改善整体竞争力'
        
        if (currentScore < 50) {
          suggestion = '当前收入水平较低，建议考虑转换到更稳定的工作单位或提升职业技能'
        } else if (currentScore < 70) {
          suggestion = '收入水平中等，可以通过跳槽到更好的单位或争取升职加薪来提升'
        }
        
        improvements.push({
          priority: 'high',
          title: '提升工作收入',
          description: suggestion,
          expectedGain: Math.min(15, 80 - currentScore),
          actionItems: ['寻找更好的工作机会', '提升专业技能', '争取升职加薪']
        })
      }
      
      // 教育背景改进建议
      if ((detailedScores.education || 0) < 75 && personalData.education && !['master', 'phd'].includes(personalData.education)) {
        improvements.push({
          priority: 'medium',
          title: '提升学历背景',
          description: '考虑继续深造，提升学历层次和院校等级，增强知识储备和社会认知',
          expectedGain: Math.min(12, 85 - (detailedScores.education || 0)),
          actionItems: ['考虑读研深造', '参加职业培训', '获得专业认证']
        })
      }
      
      // 资产住房改进建议
      if ((detailedScores.assets || 0) < 70) {
        const currentScore = detailedScores.assets || 0
        let suggestion = '住房和资产状况直接影响生活质量和安全感'
        
        if (currentScore < 40) {
          suggestion = '当前资产状况较差，建议优先积累存款，考虑购房计划'
        } else if (currentScore < 60) {
          suggestion = '资产状况一般，可以通过理财投资和购房来改善'
        }
        
        improvements.push({
          priority: 'high',
          title: '改善资产状况',
          description: suggestion,
          expectedGain: Math.min(10, 80 - currentScore),
          actionItems: ['增加储蓄', '制定购房计划', '学习理财投资']
        })
      }
      
      // 外在条件改进建议
      if ((detailedScores.physical || 0) < 70) {
        improvements.push({
          priority: 'medium',
          title: '改善外在形象',
          description: '外在条件的改善能提升第一印象和吸引力，增强自信心',
          expectedGain: Math.min(8, 80 - (detailedScores.physical || 0)),
          actionItems: ['保持健康体重', '提升穿衣品味', '注意个人形象管理']
        })
      }
      
      // 家庭背景改进建议（虽然权重较低，但仍可提及）
      if ((detailedScores.family || 0) < 60) {
        improvements.push({
          priority: 'low',
          title: '改善家庭关系',
          description: '虽然家庭背景权重较低，但良好的家庭关系有助于个人发展和情感稳定',
          expectedGain: Math.min(5, 70 - (detailedScores.family || 0)),
          actionItems: ['改善与父母关系', '承担家庭责任', '提升家庭和谐度']
        })
      }
      
      return improvements.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }).slice(0, 4) // 显示前4个建议
    },
    
    // 获取优先级标签类型
    getPriorityTagType(priority) {
      const types = { high: 'danger', medium: 'warning', low: 'info' }
      return types[priority] || 'info'
    },
    
    // 获取优先级文本
    getPriorityText(priority) {
      const texts = { high: '高优先级', medium: '中优先级', low: '低优先级' }
      return texts[priority] || '普通'
    },
    
    // 获取建议图标
    getSuggestionIcon(type) {
      const icons = { 
        success: 'SuccessFilled', 
        warning: 'WarningFilled', 
        info: 'InfoFilled' 
      }
      return icons[type] || 'InfoFilled'
    },
    
    // 获取竞争力等级
    getCompetitiveLevel(difference) {
      if (difference >= 25) return 'dominant'
      if (difference >= 15) return 'strong'
      if (difference >= 10) return 'moderate'
      if (difference >= 5) return 'slight'
      return 'minimal'
    },
    
    // 获取竞争力等级文本
    getCompetitiveLevelText(difference) {
      if (difference >= 25) return '压倒性优势'
      if (difference >= 15) return '显著优势'
      if (difference >= 10) return '明显优势'
      if (difference >= 5) return '轻微优势'
      return '微弱优势'
    },
    
    // 获取优势程度标签
    getMeterLabel(difference) {
      if (difference >= 25) return '绝对领先'
      if (difference >= 15) return '大幅领先'
      if (difference >= 10) return '明显领先'
      if (difference >= 5) return '略有领先'
      return '接近平局'
    },
    
    // 获取具体优势分析
    getSpecificAdvantages(dimension) {
      // 如果差距小于5分，视为平局，不显示具体优势
      if (dimension.winner === 'tie' || dimension.difference < 5) {
        return ['双方在此维度条件相当，不存在明显优势']
      }
      
      const winner = dimension.winner === 'male' ? '男方' : '女方'
      const loser = dimension.winner === 'male' ? '女方' : '男方'
      const diff = dimension.difference
      
      const advantages = {
        workIncome: [
          `${winner}的工作收入比${loser}高${diff.toFixed(0)}分`,
          diff >= 20 ? `收入差距显著，${winner}具有更强的经济实力` : `收入略有优势，有利于承担更多经济责任`,
          diff >= 15 ? `在相亲市场中，${winner}的经济条件更具吸引力` : null,
          diff >= 25 ? `${winner}可能在物质生活水平和消费能力上有压倒性优势` : null,
          diff >= 30 ? `这种收入差距可能导致生活方式和消费观念的显著不同` : null
        ].filter(Boolean),
        
        education: [
          `${winner}的教育背景比${loser}优秀${diff.toFixed(0)}分`,
          diff >= 15 ? `学历差距明显，${winner}在知识层面具有优势` : `教育背景略好，有利于职业发展`,
          `${winner}可能在学习能力和知识储备方面更有优势`,
          diff >= 20 ? `教育背景差距可能影响双方的共同话题和价值观` : null,
          diff >= 25 ? `${winner}在社会资源和人脉网络方面可能具有更多优势` : null
        ].filter(Boolean),
        
        physical: [
          `${winner}的外在条件比${loser}好${diff.toFixed(0)}分`,
          diff >= 15 ? `外表吸引力差距较大，${winner}在第一印象方面更有优势` : `外在形象略有优势`,
          `在社交场合中，${winner}可能获得更多关注`,
          diff >= 20 ? `${winner}的外表条件在相亲市场中更具竞争力` : null,
          diff >= 25 ? `这种外表差距可能影响双方的自信心和互动模式` : null
        ].filter(Boolean),
        
        assets: [
          `${winner}的资产状况比${loser}好${diff.toFixed(0)}分`,
          diff >= 20 ? `财富积累差距显著，${winner}具有更强的财务安全感` : `资产略有优势，生活保障更好`,
          `${winner}在购房、投资等方面可能有更多选择`,
          diff >= 25 ? `资产差距可能影响未来生活方式和家庭规划` : null,
          diff >= 30 ? `${winner}在家庭经济决策中可能具有更多话语权` : null
        ].filter(Boolean),
        
        family: [
          `${winner}的家庭背景比${loser}好${diff.toFixed(0)}分`,
          diff >= 10 ? `家庭条件差距明显，${winner}可能获得更多家庭支持` : `家庭背景略好`,
          `${winner}的家庭可能在资源支持方面更有优势`,
          diff >= 15 ? `家庭背景差异可能影响双方家庭的融合和相处` : null,
          diff >= 20 ? `${winner}在家庭资源和社会关系网络方面具有明显优势` : null
        ].filter(Boolean)
      }
      
      return advantages[dimension.key] || [`${winner}在此维度具有${diff >= 20 ? '显著' : '一定'}优势`]
    },
    
    // 获取分数差距等级样式
    getScoreDifferenceClass(difference) {
      if (difference >= 30) return 'huge-gap'
      if (difference >= 20) return 'large-gap'
      if (difference >= 10) return 'medium-gap'
      return 'small-gap'
    },
    
    // 获取关系前景
    getRelationshipProspect(matchScore) {
      if (matchScore >= 90) return '非常乐观 - 高度匹配'
      if (matchScore >= 80) return '比较乐观 - 良好匹配'
      if (matchScore >= 70) return '谨慎乐观 - 基本匹配'
      if (matchScore >= 60) return '需要努力 - 勉强匹配'
      if (matchScore >= 50) return '面临挑战 - 匹配度低'
      return '前景堪忧 - 严重不匹配'
    },
    
    // 获取前景样式类
    getProspectClass(matchScore) {
      if (matchScore >= 90) return 'excellent-prospect'
      if (matchScore >= 80) return 'positive-prospect'
      if (matchScore >= 70) return 'good-prospect'
      if (matchScore >= 60) return 'neutral-prospect'
      if (matchScore >= 50) return 'concerning-prospect'
      return 'challenging-prospect'
    },
    
    // 获取兼容性风险
    getCompatibilityRisks() {
      const risks = []
      const scoreDiff = Math.abs(this.maleScore - this.femaleScore)
      const maleHigher = this.maleScore > this.femaleScore
      const higherParty = maleHigher ? '男方' : '女方'
      const lowerParty = maleHigher ? '女方' : '男方'
      
      // 总分差距风险
      if (scoreDiff >= 30) {
        risks.push({
          title: '整体条件差距过大',
          description: `双方总分相差${scoreDiff}分，${higherParty}条件明显优于${lowerParty}，可能导致心理不平衡和关系不稳定`,
          mitigation: '重视精神层面的契合，建立共同的价值观和目标，避免以条件评分作为关系基础'
        })
      } else if (scoreDiff >= 20) {
        risks.push({
          title: '整体条件差距明显',
          description: `双方总分相差${scoreDiff}分，${higherParty}在物质条件上具有一定优势，需要注意平衡`,
          mitigation: '关注双方的情感契合度和共同兴趣，建立互相尊重的关系基础'
        })
      }
      
      // 收入差距风险
      const incomeDiff = Math.abs(this.maleDetailedScores.workIncome - this.femaleDetailedScores.workIncome)
      const incomeHigher = this.maleDetailedScores.workIncome > this.femaleDetailedScores.workIncome ? '男方' : '女方'
      
      if (incomeDiff >= 30) {
        risks.push({
          title: '收入差距极大',
          description: `工作收入相差${incomeDiff.toFixed(0)}分，${incomeHigher}收入远高于对方，可能导致经济依赖和决策权不平等`,
          mitigation: '建立透明的财务沟通机制，尊重双方的经济自主权，制定公平的家庭经济决策流程'
        })
      } else if (incomeDiff >= 20) {
        risks.push({
          title: '收入差距显著',
          description: `工作收入相差${incomeDiff.toFixed(0)}分，可能在经济决策和生活方式上产生分歧`,
          mitigation: '提前沟通经济责任分担方式，制定共同的财务规划和消费标准'
        })
      }
      
      // 教育背景差异风险
      const educationDiff = Math.abs(this.maleDetailedScores.education - this.femaleDetailedScores.education)
      const eduHigher = this.maleDetailedScores.education > this.femaleDetailedScores.education ? '男方' : '女方'
      
      if (educationDiff >= 25) {
        risks.push({
          title: '教育背景差异极大',
          description: `教育背景相差${educationDiff.toFixed(0)}分，${eduHigher}学历明显高于对方，可能导致知识层次和社交圈的显著差异`,
          mitigation: '尊重彼此的知识背景和成长经历，寻找共同的兴趣和话题，避免知识优越感'
        })
      } else if (educationDiff >= 15) {
        risks.push({
          title: '教育背景差异较大',
          description: `教育背景相差${educationDiff.toFixed(0)}分，可能在价值观和沟通方式上存在差异`,
          mitigation: '增进相互理解，尊重不同的思维方式和表达习惯，共同学习成长'
        })
      }
      
      // 资产差异风险
      const assetsDiff = Math.abs(this.maleDetailedScores.assets - this.femaleDetailedScores.assets)
      const assetsHigher = this.maleDetailedScores.assets > this.femaleDetailedScores.assets ? '男方' : '女方'
      
      if (assetsDiff >= 30) {
        risks.push({
          title: '资产状况差异极大',
          description: `资产状况相差${assetsDiff.toFixed(0)}分，${assetsHigher}资产远高于对方，可能导致生活期望和安全感的巨大差异`,
          mitigation: '坦诚讨论未来的财务规划和生活方式，建立共同的家庭资产目标，避免攀比心理'
        })
      } else if (assetsDiff >= 20) {
        risks.push({
          title: '资产状况差异明显',
          description: `资产状况相差${assetsDiff.toFixed(0)}分，可能在生活品质期望和消费习惯上存在差异`,
          mitigation: '坦诚沟通各自的财务状况和消费观念，制定现实的生活目标和储蓄计划'
        })
      }
      
      // 外在条件差异风险
      const physicalDiff = Math.abs(this.maleDetailedScores.physical - this.femaleDetailedScores.physical)
      const physicalHigher = this.maleDetailedScores.physical > this.femaleDetailedScores.physical ? '男方' : '女方'
      
      if (physicalDiff >= 25) {
        risks.push({
          title: '外在条件差异显著',
          description: `外在条件相差${physicalDiff.toFixed(0)}分，${physicalHigher}外表条件明显优于对方，可能导致自信心不平衡`,
          mitigation: '重视内在品质和情感连接，避免过度关注外表，建立健康的自我形象认知'
        })
      }
      
      // 低匹配度风险
      if (this.matchScore < 50) {
        risks.push({
          title: '整体匹配度严重偏低',
          description: `匹配度仅为${this.matchScore}%，双方条件差异过大，关系发展可能面临严峻挑战`,
          mitigation: '慎重考虑关系发展，如果决定继续，需要投入更多努力建立深层次的情感连接和共同价值观'
        })
      } else if (this.matchScore < 65) {
        risks.push({
          title: '整体匹配度偏低',
          description: `匹配度为${this.matchScore}%，需要更多的理解和包容才能维持稳定关系`,
          mitigation: '重点关注性格契合度和共同兴趣，培养深层次的情感连接，弥补条件差距'
        })
      }
      
      return risks
    },
    
    // 初始化兼容性雷达图
    initCompatibilityRadar() {
      const canvas = this.$refs.compatibilityRadar
      if (!canvas) return
      
      import('chart.js/auto').then((ChartModule) => {
        const Chart = ChartModule.default
        
        // 清除可能存在的旧图表
        if (this.radarChart) {
          this.radarChart.destroy()
        }
        
        // 准备雷达图数据
        const dimensions = [
          '工作收入',
          '教育背景',
          '外在条件',
          '资产住房',
          '家庭背景'
        ]
        
        const maleData = [
          this.maleDetailedScores.workIncome || 0,
          this.maleDetailedScores.education || 0,
          this.maleDetailedScores.physical || 0,
          this.maleDetailedScores.assets || 0,
          this.maleDetailedScores.family || 0
        ]
        
        const femaleData = [
          this.femaleDetailedScores.workIncome || 0,
          this.femaleDetailedScores.education || 0,
          this.femaleDetailedScores.physical || 0,
          this.femaleDetailedScores.assets || 0,
          this.femaleDetailedScores.family || 0
        ]
        
        // 创建雷达图
        this.radarChart = new Chart(canvas, {
          type: 'radar',
          data: {
            labels: dimensions,
            datasets: [
              {
                label: '男方',
                data: maleData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
              },
              {
                label: '女方',
                data: femaleData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: {
                  display: true
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                  stepSize: 20
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: '双方维度对比雷达图',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.raw + '分';
                  }
                }
              }
            }
          }
        })
      }).catch(error => {
        console.error('加载Chart.js失败:', error)
        
        // 如果Chart.js加载失败，显示备用文本
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#666'
        ctx.font = '14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('兼容性雷达图加载失败', canvas.width / 2, canvas.height / 2)
      })
    }
  }
}
</script>

<style scoped>
.couple-comparison {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 对比头部样式 */
.comparison-header {
  margin-bottom: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.comparison-header :deep(.el-card__body) {
  padding: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 32px;
}

.comparison-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
}

.comparison-subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.header-right {
  display: flex;
  gap: 12px;
}

.header-right .el-button {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.header-right .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 通用卡片样式 */
.el-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

/* 总体对比样式 */
.overall-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.scores-comparison {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
}

.person-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  min-width: 200px;
}

.person-score.winner {
  background: linear-gradient(135deg, #67c23a, #85ce61);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(103, 194, 58, 0.3);
}

.person-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gender-icon {
  font-size: 24px;
}

.male-icon {
  color: #409eff;
}

.female-icon {
  color: #f56c6c;
}

.person-score.winner .male-icon,
.person-score.winner .female-icon {
  color: white;
}

.person-label {
  font-size: 16px;
  font-weight: 600;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 36px;
  font-weight: 700;
}

.score-unit {
  font-size: 16px;
  opacity: 0.8;
}

.score-level {
  font-size: 14px;
  opacity: 0.9;
}

.vs-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0 20px;
}

.vs-text {
  font-size: 24px;
  font-weight: 700;
  color: #909399;
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #e4e7ed;
}

.score-gap {
  font-size: 12px;
  color: #606266;
  background: #f5f7fa;
  padding: 4px 12px;
  border-radius: 12px;
}

/* 匹配度样式 */
.match-compatibility {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff, #ecf5ff);
  border-radius: 12px;
}

.compatibility-score {
  flex-shrink: 0;
}

.match-text {
  font-size: 14px;
  line-height: 1.4;
}

.compatibility-analysis {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-level {
  display: flex;
  align-items: center;
}

.match-description {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

/* 维度对比样式 */
.dimensions-grid {
  display: grid;
  gap: 20px;
}

.dimension-comparison-item {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  background: #fafafa;
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dimension-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.dimension-weight {
  font-size: 12px;
  color: #909399;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 12px;
}

.dimension-comparison-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 评分条样式 */
.score-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.bar-label {
  font-weight: 600;
}

.bar-score {
  color: #606266;
}

.bar-container {
  height: 8px;
  background: #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.male-fill {
  background: linear-gradient(90deg, #409eff, #66b1ff);
}

.female-fill {
  background: linear-gradient(90deg, #f56c6c, #f78989);
}

.bar-fill.winner {
  background: linear-gradient(90deg, #67c23a, #85ce61);
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
}

/* 优势分析样式 */
.advantage-analysis {
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.advantage-winner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.winner-icon {
  font-size: 16px;
}

.male-winner {
  color: #409eff;
}

.female-winner {
  color: #f56c6c;
}

.tie-icon {
  color: #909399;
}

.advantage-text {
  font-weight: 600;
  font-size: 14px;
}

.advantage-badge {
  margin-left: auto;
}

.advantage-description {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

/* 竞争力指标样式 */
.competitive-indicators {
  margin-top: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
}

.indicator-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.indicator-label {
  font-size: 12px;
  color: #909399;
}

.indicator-value {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.indicator-value.dominant {
  background: #f56c6c;
  color: white;
}

.indicator-value.strong {
  background: #e6a23c;
  color: white;
}

.indicator-value.moderate {
  background: #409eff;
  color: white;
}

.indicator-value.slight {
  background: #67c23a;
  color: white;
}

.indicator-value.minimal {
  background: #909399;
  color: white;
}

/* 优势程度可视化 */
.advantage-meter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.meter-bar {
  flex: 1;
  height: 4px;
  background: #e4e7ed;
  border-radius: 2px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.meter-fill.dominant {
  background: linear-gradient(90deg, #f56c6c, #ff8080);
}

.meter-fill.strong {
  background: linear-gradient(90deg, #e6a23c, #f0b90b);
}

.meter-fill.moderate {
  background: linear-gradient(90deg, #409eff, #66b1ff);
}

.meter-fill.slight {
  background: linear-gradient(90deg, #67c23a, #85ce61);
}

.meter-fill.minimal {
  background: linear-gradient(90deg, #909399, #b3b3b3);
}

.meter-label {
  font-size: 11px;
  color: #606266;
  white-space: nowrap;
}

/* 具体优势分析 */
.specific-advantages {
  margin-top: 12px;
  padding: 8px;
  background: rgba(103, 194, 58, 0.05);
  border-radius: 6px;
  border-left: 3px solid #67c23a;
}

.advantage-points {
  margin: 0;
}

.points-title {
  margin: 0 0 6px 0;
  font-size: 12px;
  font-weight: 600;
  color: #67c23a;
}

.points-list {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.points-list li {
  margin-bottom: 2px;
}

/* 兼容性分析样式 */
.compatibility-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.compatibility-radar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.radar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  width: 100%;
}

.radar-legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.male-color {
  background: #409eff;
}

.female-color {
  background: #f56c6c;
}

.compatibility-suggestions h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

/* 兼容性概览样式 */
.compatibility-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff, #ecf5ff);
  border-radius: 8px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.overview-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.score-difference {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.score-difference.small-gap {
  background: #f0f9ff;
  color: #409eff;
}

.score-difference.medium-gap {
  background: #fdf6ec;
  color: #e6a23c;
}

.score-difference.large-gap {
  background: #fef0f0;
  color: #f56c6c;
}

.score-difference.huge-gap {
  background: #f5f5f5;
  color: #909399;
}

.relationship-prospect {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.relationship-prospect.excellent-prospect {
  background: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.relationship-prospect.positive-prospect {
  background: #f0f9ff;
  color: #409eff;
  border: 1px solid #d9ecff;
}

.relationship-prospect.good-prospect {
  background: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
}

.relationship-prospect.neutral-prospect {
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #faecd8;
}

.relationship-prospect.concerning-prospect {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
}

.relationship-prospect.challenging-prospect {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid;
}

.suggestion-item.success {
  background: #f0f9ff;
  border-left-color: #67c23a;
}

.suggestion-item.warning {
  background: #fdf6ec;
  border-left-color: #e6a23c;
}

.suggestion-item.info {
  background: #ecf5ff;
  border-left-color: #409eff;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.suggestion-icon {
  font-size: 16px;
}

.suggestion-title {
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}

.suggestion-priority {
  margin-left: auto;
}

.suggestion-content {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

/* 行动建议样式 */
.action-suggestions {
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
}

.actions-title {
  margin: 0 0 6px 0;
  font-size: 12px;
  font-weight: 600;
  color: #409eff;
}

.actions-list {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.actions-list li {
  margin-bottom: 2px;
}

/* 兼容性风险样式 */
.compatibility-risks {
  margin-top: 24px;
  padding: 16px;
  background: #fef0f0;
  border-radius: 8px;
  border-left: 4px solid #f56c6c;
}

.risks-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #f56c6c;
}

.risks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
}

.risk-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.risk-icon {
  font-size: 14px;
  color: #e6a23c;
}

.risk-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.risk-description {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.risk-mitigation {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.mitigation-label {
  color: #67c23a;
  font-weight: 600;
  flex-shrink: 0;
}

.mitigation-text {
  color: #606266;
  line-height: 1.4;
}

/* 改进建议对比样式 */
.person-improvements {
  height: 100%;
}

.improvements-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

.improvements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.improvement-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.improvement-priority {
  margin-bottom: 8px;
}

.improvement-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.improvement-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.improvement-description {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.improvement-impact {
  font-size: 12px;
  color: #67c23a;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scores-comparison {
    flex-direction: column;
    gap: 20px;
  }
  
  .vs-divider {
    transform: rotate(90deg);
    margin: 0;
  }
  
  .compatibility-content {
    grid-template-columns: 1fr;
  }
  
  .improvement-content .el-row {
    flex-direction: column;
  }
}
</style>