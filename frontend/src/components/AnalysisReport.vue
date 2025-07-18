<template>
  <div class="analysis-report">
    <!-- 报告标题 -->
    <el-card class="report-header">
      <div class="header-content">
        <div class="header-left">
          <el-icon class="header-icon"><TrendCharts /></el-icon>
          <div class="header-text">
            <h2 class="report-title">相亲市场竞争力分析报告</h2>
            <p class="report-subtitle">基于第一阶段物质条件评估算法</p>
          </div>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="exportReport" size="small">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 标签页内容 -->
    <el-tabs v-model="activeTab" class="report-tabs">
      
      <!-- 综合分析标签页 -->
      <el-tab-pane label="综合分析" name="overview">
        <div class="tab-content">
          
          <!-- 市场定位图表 -->
          <el-card class="positioning-card">
            <template #header>
              <div class="section-header">
                <el-icon><PieChart /></el-icon>
                <span>市场竞争力定位</span>
              </div>
            </template>
            
            <div class="positioning-content">
              <div class="positioning-chart">
                <!-- 竞争力雷达图 -->
                <div class="radar-chart-container">
                  <canvas ref="radarChart" width="300" height="300"></canvas>
                </div>
              </div>
              
              <div class="positioning-summary">
                <div class="market-level">
                  <div class="level-badge" :class="marketLevelClass">
                    {{ marketLevel }}
                  </div>
                  <p class="level-description">{{ marketLevelDescription }}</p>
                </div>
                
                <div class="percentile-ranking">
                  <el-progress 
                    type="circle" 
                    :percentage="percentileRank" 
                    :color="percentileColor"
                    :width="120"
                  >
                    <template #default="{ percentage }">
                      <span class="percentile-text">
                        <strong>{{ percentage }}%</strong>
                        <br>
                        <small>市场排名</small>
                      </span>
                    </template>
                  </el-progress>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 维度分析 -->
          <el-card class="dimensions-analysis">
            <template #header>
              <div class="section-header">
                <el-icon><DataAnalysis /></el-icon>
                <span>各维度详细分析</span>
              </div>
            </template>
            
            <div class="dimensions-grid">
              <div 
                v-for="dimension in dimensionsAnalysis" 
                :key="dimension.key"
                class="dimension-analysis-item"
                :class="dimension.status"
              >
                <div class="dimension-header">
                  <div class="dimension-info">
                    <h4 class="dimension-title">{{ dimension.name }}</h4>
                    <span class="dimension-weight">权重 {{ dimension.weight }}%</span>
                  </div>
                  <div class="dimension-score">
                    <span class="score-value">{{ dimension.score }}</span>
                    <span class="score-unit">分</span>
                  </div>
                </div>
                
                <div class="dimension-details">
                  <el-progress 
                    :percentage="dimension.score" 
                    :color="getDimensionColor(dimension.score)"
                    :stroke-width="6"
                  />
                  
                  <div class="dimension-breakdown">
                    <div 
                      v-for="detail in dimension.breakdown" 
                      :key="detail.label"
                      class="breakdown-item"
                    >
                      <span class="breakdown-label">{{ detail.label }}</span>
                      <span class="breakdown-value">{{ detail.value }}</span>
                    </div>
                  </div>
                  
                  <div class="dimension-analysis-text">
                    <p class="analysis-text">{{ dimension.analysis }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

        </div>
      </el-tab-pane>

      <!-- 改进建议标签页 -->
      <el-tab-pane label="改进建议" name="improvements">
        <div class="tab-content">
          
          <!-- 优先级改进建议 -->
          <el-card class="improvements-card">
            <template #header>
              <div class="section-header">
                <el-icon><Promotion /></el-icon>
                <span>优先级改进建议</span>
              </div>
            </template>
            
            <div class="improvements-list">
              <div 
                v-for="(improvement, index) in prioritizedImprovements" 
                :key="index"
                class="improvement-item"
                :class="improvement.priority"
              >
                <div class="improvement-header">
                  <div class="improvement-priority">
                    <el-tag 
                      :type="getPriorityTagType(improvement.priority)" 
                      size="small"
                    >
                      {{ getPriorityText(improvement.priority) }}
                    </el-tag>
                  </div>
                  <div class="improvement-impact">
                    <span class="impact-text">预期提升: +{{ improvement.expectedGain }}分</span>
                  </div>
                </div>
                
                <div class="improvement-content">
                  <h4 class="improvement-title">{{ improvement.title }}</h4>
                  <p class="improvement-description">{{ improvement.description }}</p>
                  
                  <div class="improvement-actions">
                    <div class="action-steps">
                      <h5>具体行动步骤:</h5>
                      <ol class="steps-list">
                        <li v-for="step in improvement.steps" :key="step">{{ step }}</li>
                      </ol>
                    </div>
                    
                    <div class="improvement-timeline">
                      <span class="timeline-label">预计时间:</span>
                      <span class="timeline-value">{{ improvement.timeline }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 长期发展规划 -->
          <el-card class="development-plan">
            <template #header>
              <div class="section-header">
                <el-icon><Calendar /></el-icon>
                <span>长期发展规划</span>
              </div>
            </template>
            
            <div class="timeline-container">
              <el-timeline>
                <el-timeline-item
                  v-for="(milestone, index) in developmentMilestones"
                  :key="index"
                  :timestamp="milestone.timeframe"
                  :type="milestone.type"
                  :color="milestone.color"
                  placement="top"
                >
                  <el-card class="milestone-card">
                    <h4 class="milestone-title">{{ milestone.title }}</h4>
                    <p class="milestone-description">{{ milestone.description }}</p>
                    <div class="milestone-targets">
                      <el-tag 
                        v-for="target in milestone.targets" 
                        :key="target"
                        size="small"
                        class="target-tag"
                      >
                        {{ target }}
                      </el-tag>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card>

        </div>
      </el-tab-pane>

      <!-- 竞争对比标签页 -->
      <el-tab-pane label="竞争对比" name="comparison">
        <div class="tab-content">
          
          <!-- 同龄人对比 -->
          <el-card class="peer-comparison">
            <template #header>
              <div class="section-header">
                <el-icon><UserFilled /></el-icon>
                <span>同龄人竞争力对比</span>
              </div>
            </template>
            
            <div class="comparison-content">
              <div class="comparison-chart">
                <canvas ref="comparisonChart" width="400" height="200"></canvas>
              </div>
              
              <div class="comparison-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ peerComparison.betterThan }}%</div>
                  <div class="stat-label">超越同龄人</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ peerComparison.rank }}</div>
                  <div class="stat-label">同龄人排名</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ peerComparison.averageGap }}</div>
                  <div class="stat-label">与平均分差距</div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 理想匹配对象画像 -->
          <el-card class="ideal-match">
            <template #header>
              <div class="section-header">
                <el-icon><Connection /></el-icon>
                <span>理想匹配对象画像</span>
              </div>
            </template>
            
            <div class="match-profile">
              <div class="profile-section">
                <h4>基于您的条件，推荐匹配对象特征:</h4>
                <div class="profile-grid">
                  <div 
                    v-for="characteristic in idealMatchProfile" 
                    :key="characteristic.category"
                    class="profile-item"
                  >
                    <div class="profile-category">{{ characteristic.category }}</div>
                    <div class="profile-recommendations">
                      <el-tag 
                        v-for="rec in characteristic.recommendations" 
                        :key="rec"
                        type="info"
                        size="small"
                        class="profile-tag"
                      >
                        {{ rec }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="compatibility-tips">
                <h4>匹配兼容性建议:</h4>
                <ul class="tips-list">
                  <li v-for="tip in compatibilityTips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
            </div>
          </el-card>

        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import { 
  TrendCharts, 
  Download, 
  PieChart, 
  DataAnalysis, 
  Promotion, 
  Calendar,
  UserFilled,
  Connection
} from '@element-plus/icons-vue'

export default {
  name: 'AnalysisReport',
  components: {
    TrendCharts,
    Download,
    PieChart,
    DataAnalysis,
    Promotion,
    Calendar,
    UserFilled,
    Connection
  },
  props: {
    // 个人评分数据
    personalScore: {
      type: Number,
      required: true
    },
    // 详细评分数据
    detailedScores: {
      type: Object,
      required: true
    },
    // 个人信息
    personalData: {
      type: Object,
      required: true
    },
    // 是否为匹配模式
    isMatchMode: {
      type: Boolean,
      default: false
    },
    // 匹配对象数据（匹配模式下使用）
    matchData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      activeTab: 'overview'
    }
  },
  computed: {
    // 市场等级
    marketLevel() {
      const score = this.personalScore
      if (score >= 90) return '顶级'
      if (score >= 80) return '优秀'
      if (score >= 70) return '良好'
      if (score >= 60) return '中等'
      return '待提升'
    },
    
    marketLevelClass() {
      const score = this.personalScore
      if (score >= 90) return 'level-top'
      if (score >= 80) return 'level-excellent'
      if (score >= 70) return 'level-good'
      if (score >= 60) return 'level-average'
      return 'level-poor'
    },
    
    marketLevelDescription() {
      const score = this.personalScore
      if (score >= 90) return '您在相亲市场中属于顶级竞争力，条件非常优秀'
      if (score >= 80) return '您在相亲市场中具有很强的竞争力，条件优秀'
      if (score >= 70) return '您在相亲市场中具有良好的竞争力，条件不错'
      if (score >= 60) return '您在相亲市场中具有中等竞争力，还有提升空间'
      return '您在相亲市场中竞争力有待提升，建议重点改进'
    },
    
    // 百分位排名
    percentileRank() {
      // 基于评分计算百分位排名的简化算法
      const score = this.personalScore
      if (score >= 90) return 95
      if (score >= 80) return 85
      if (score >= 70) return 70
      if (score >= 60) return 50
      return Math.max(20, Math.floor(score * 0.6))
    },
    
    percentileColor() {
      const rank = this.percentileRank
      if (rank >= 90) return '#67c23a'
      if (rank >= 70) return '#e6a23c'
      if (rank >= 50) return '#409eff'
      return '#f56c6c'
    },
    
    // 维度分析
    dimensionsAnalysis() {
      const scores = this.detailedScores
      const data = this.personalData
      
      return [
        {
          key: 'workIncome',
          name: '工作收入',
          weight: 40,
          score: scores.workIncome || 0,
          status: this.getDimensionStatus(scores.workIncome || 0),
          breakdown: [
            { label: '月薪资', value: `${data.salary || 0}万元` },
            { label: '工作单位', value: this.getWorkUnitLabel(data.workUnit) },
            { label: '调整后收入', value: `${scores.adjustedIncome || 0}万元` }
          ],
          analysis: this.getWorkIncomeAnalysis(scores.workIncome || 0, data)
        },
        {
          key: 'education',
          name: '教育背景',
          weight: 25,
          score: scores.education || 0,
          status: this.getDimensionStatus(scores.education || 0),
          breakdown: [
            { label: '学历', value: this.getEducationLabel(data.education) },
            { label: '院校等级', value: this.getUniversityTierLabel(data.universityTier) },
            { label: '专业', value: data.major || '未填写' }
          ],
          analysis: this.getEducationAnalysis(scores.education || 0, data)
        },
        {
          key: 'assets',
          name: '资产住房',
          weight: 15,
          score: scores.assets || 0,
          status: this.getDimensionStatus(scores.assets || 0),
          breakdown: [
            { label: '住房状况', value: this.getHousingStatusLabel(data.housingStatus) },
            { label: '存款', value: `${data.savings || 0}万元` },
            { label: '净资产', value: `${(data.savings || 0) - (data.debt || 0)}万元` }
          ],
          analysis: this.getAssetsAnalysis(scores.assets || 0, data)
        },
        {
          key: 'physical',
          name: '外在条件',
          weight: 15,
          score: scores.physical || 0,
          status: this.getDimensionStatus(scores.physical || 0),
          breakdown: [
            { label: '年龄', value: `${data.age || 0}岁` },
            { label: '身高', value: `${data.height || 0}cm` },
            { label: 'BMI', value: data.bmi ? data.bmi.toFixed(1) : '未计算' },
            { label: '外貌', value: this.getAppearanceLabel(data.appearance) }
          ],
          analysis: this.getPhysicalAnalysis(scores.physical || 0, data)
        },
        {
          key: 'family',
          name: '家庭背景',
          weight: 5,
          score: scores.family || 0,
          status: this.getDimensionStatus(scores.family || 0),
          breakdown: [
            { label: '父母收入', value: `${data.parentsIncome || 0}万元` },
            { label: '独生子女', value: data.onlyChild ? '是' : '否' },
            { label: '父母职业', value: data.parentsOccupation || '未填写' }
          ],
          analysis: this.getFamilyAnalysis(scores.family || 0, data)
        }
      ]
    },
    
    // 优先级改进建议
    prioritizedImprovements() {
      const improvements = []
      const scores = this.detailedScores
      const data = this.personalData
      
      // 工作收入改进建议
      if ((scores.workIncome || 0) < 80) {
        improvements.push({
          priority: 'high',
          title: '提升工作收入',
          description: '工作收入是评分权重最高的维度，提升收入能显著改善整体竞争力',
          expectedGain: Math.min(15, 80 - (scores.workIncome || 0)),
          timeline: '6-12个月',
          steps: [
            '寻找更高薪资的工作机会',
            '提升专业技能和资质认证',
            '考虑转入更稳定的工作单位',
            '发展副业增加收入来源'
          ]
        })
      }
      
      // 教育背景改进建议
      if ((scores.education || 0) < 75 && !['master', 'phd'].includes(data.education)) {
        improvements.push({
          priority: 'medium',
          title: '提升学历背景',
          description: '考虑继续深造，提升学历层次和院校等级',
          expectedGain: Math.min(12, 85 - (scores.education || 0)),
          timeline: '2-3年',
          steps: [
            '准备研究生入学考试',
            '选择知名院校和热门专业',
            '考虑在职研究生项目',
            '获得相关专业认证'
          ]
        })
      }
      
      // 资产住房改进建议
      if ((scores.assets || 0) < 70) {
        improvements.push({
          priority: 'high',
          title: '改善资产状况',
          description: '住房和资产状况直接影响生活质量和安全感',
          expectedGain: Math.min(10, 80 - (scores.assets || 0)),
          timeline: '1-2年',
          steps: [
            '制定储蓄计划，增加存款',
            '考虑购房或改善住房条件',
            '合理投资理财，增加资产',
            '减少不必要的负债'
          ]
        })
      }
      
      // 外在条件改进建议
      if ((scores.physical || 0) < 70) {
        improvements.push({
          priority: 'medium',
          title: '改善外在形象',
          description: '外在条件的改善能提升第一印象和吸引力',
          expectedGain: Math.min(8, 80 - (scores.physical || 0)),
          timeline: '3-6个月',
          steps: [
            '保持健康的体重和BMI',
            '改善穿着打扮和个人形象',
            '定期运动保持良好体型',
            '注意个人卫生和仪表'
          ]
        })
      }
      
      return improvements.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    },
    
    // 发展里程碑
    developmentMilestones() {
      return [
        {
          timeframe: '3个月内',
          type: 'primary',
          color: '#409eff',
          title: '短期目标',
          description: '快速提升外在形象和基础条件',
          targets: ['改善个人形象', '增加存款', '提升专业技能']
        },
        {
          timeframe: '6-12个月',
          type: 'success',
          color: '#67c23a',
          title: '中期目标',
          description: '实现收入和职业发展的突破',
          targets: ['收入提升20%', '获得职业认证', '改善住房条件']
        },
        {
          timeframe: '1-2年',
          type: 'warning',
          color: '#e6a23c',
          title: '长期目标',
          description: '实现全面的条件提升和市场竞争力',
          targets: ['达到目标收入', '完成学历提升', '实现资产目标']
        }
      ]
    },
    
    // 同龄人对比数据
    peerComparison() {
      const score = this.personalScore
      const age = this.personalData.age || 25
      
      // 简化的同龄人对比算法
      const betterThan = Math.min(95, Math.max(10, Math.floor(score * 0.8 + Math.random() * 10)))
      const rank = Math.ceil((100 - betterThan) / 100 * 1000)
      const averageGap = score - 65 // 假设平均分为65
      
      return {
        betterThan,
        rank: `${rank}/1000`,
        averageGap: averageGap > 0 ? `+${averageGap.toFixed(1)}` : averageGap.toFixed(1)
      }
    },
    
    // 理想匹配对象画像
    idealMatchProfile() {
      const myScore = this.personalScore
      const myData = this.personalData
      
      return [
        {
          category: '工作收入',
          recommendations: this.getIncomeRecommendations(myData)
        },
        {
          category: '教育背景',
          recommendations: this.getEducationRecommendations(myData)
        },
        {
          category: '年龄范围',
          recommendations: this.getAgeRecommendations(myData)
        },
        {
          category: '住房条件',
          recommendations: this.getHousingRecommendations(myData)
        }
      ]
    },
    
    // 兼容性建议
    compatibilityTips() {
      return [
        '寻找在关键维度上互补的对象，而非完全相同',
        '重视对方的发展潜力，而非仅看当前条件',
        '考虑双方家庭背景的匹配度',
        '注重价值观和生活方式的契合度',
        '保持开放心态，给彼此成长的空间'
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  methods: {
    // 导出报告
    exportReport() {
      // 实现报告导出功能
      this.$message.success('报告导出功能开发中...')
    },
    
    // 初始化图表
    initCharts() {
      this.initRadarChart()
      this.initComparisonChart()
    },
    
    // 初始化雷达图
    initRadarChart() {
      // 简化的雷达图实现
      const canvas = this.$refs.radarChart
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      // 这里可以集成Chart.js或其他图表库
      // 暂时显示占位文本
      ctx.fillStyle = '#666'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('雷达图', canvas.width / 2, canvas.height / 2)
    },
    
    // 初始化对比图表
    initComparisonChart() {
      const canvas = this.$refs.comparisonChart
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#666'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('对比图表', canvas.width / 2, canvas.height / 2)
    },
    
    // 获取维度状态
    getDimensionStatus(score) {
      if (score >= 85) return 'excellent'
      if (score >= 70) return 'good'
      if (score >= 60) return 'average'
      return 'poor'
    },
    
    // 获取维度颜色
    getDimensionColor(score) {
      if (score >= 85) return '#67c23a'
      if (score >= 70) return '#e6a23c'
      if (score >= 60) return '#409eff'
      return '#f56c6c'
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
    
    // 各种标签获取方法
    getWorkUnitLabel(workUnit) {
      const labels = {
        'central_gov': '中央部委',
        'city_gov': '市级政府',
        'district_gov': '区县政府',
        'central_soe_hq': '央企总部',
        'top_university': '知名高校',
        'private_company': '私营企业'
      }
      return labels[workUnit] || '其他'
    },
    
    getEducationLabel(education) {
      const labels = {
        'high_school': '高中',
        'college': '大专',
        'bachelor': '本科',
        'master': '硕士',
        'phd': '博士'
      }
      return labels[education] || '未知'
    },
    
    getUniversityTierLabel(tier) {
      const labels = {
        'qingbei': '清华北大',
        'c985': '985院校',
        'c211': '211院校',
        'tier1': '一类本科',
        'tier2': '二类本科'
      }
      return labels[tier] || '普通院校'
    },
    
    getHousingStatusLabel(status) {
      const labels = {
        'beijing_house_inner': '北京环内房产',
        'beijing_house_outer': '北京环外房产',
        'beijing_house_loan': '北京贷款房产',
        'other_city_house': '外地房产',
        'rent': '租房',
        'live_with_parents': '与父母同住'
      }
      return labels[status] || '未知'
    },
    
    getAppearanceLabel(appearance) {
      const labels = {
        'excellent': '优秀',
        'very_good': '很好',
        'above_average': '中上',
        'below_average': '中下',
        'poor': '较差'
      }
      return labels[appearance] || '未评价'
    },
    
    // 各维度分析文本
    getWorkIncomeAnalysis(score, data) {
      if (score >= 85) return '工作收入条件优秀，在相亲市场中具有很强的竞争优势'
      if (score >= 70) return '工作收入条件良好，建议继续提升以增强竞争力'
      if (score >= 60) return '工作收入条件中等，有较大提升空间'
      return '工作收入条件需要重点改善，建议优先提升'
    },
    
    getEducationAnalysis(score, data) {
      if (score >= 85) return '教育背景优秀，学历和院校等级都很有竞争力'
      if (score >= 70) return '教育背景良好，可考虑进一步提升学历层次'
      return '教育背景有提升空间，建议考虑继续深造'
    },
    
    getAssetsAnalysis(score, data) {
      if (score >= 80) return '资产住房条件优秀，经济基础稳固'
      if (score >= 60) return '资产住房条件中等，建议增加储蓄和改善住房'
      return '资产住房条件需要改善，建议制定理财和购房计划'
    },
    
    getPhysicalAnalysis(score, data) {
      if (score >= 80) return '外在条件优秀，形象和身体条件都很好'
      if (score >= 60) return '外在条件良好，可适当改善形象管理'
      return '外在条件有改善空间，建议注重形象管理和健康维护'
    },
    
    getFamilyAnalysis(score, data) {
      if (score >= 80) return '家庭背景条件优秀，家庭经济状况良好'
      return '家庭背景条件一般，但这不是主要影响因素'
    },
    
    // 匹配建议方法
    getIncomeRecommendations(myData) {
      const mySalary = myData.salary || 0
      if (mySalary >= 3) return ['2-5万/月', '稳定工作单位', '有发展前景']
      if (mySalary >= 1.5) return ['1.5-3万/月', '工作稳定', '有上进心']
      return ['1-2万/月', '有稳定收入', '共同奋斗型']
    },
    
    getEducationRecommendations(myData) {
      const myEdu = myData.education
      if (['master', 'phd'].includes(myEdu)) return ['本科以上', '知名院校', '专业匹配']
      if (myEdu === 'bachelor') return ['本科', '院校层次相当', '学历匹配']
      return ['大专以上', '注重能力', '共同进步']
    },
    
    getAgeRecommendations(myData) {
      const myAge = myData.age || 25
      const gender = myData.gender
      if (gender === 'male') {
        return [`${Math.max(18, myAge - 5)}-${myAge + 2}岁`, '年龄相近', '成熟稳重']
      } else {
        return [`${myAge - 2}-${myAge + 8}岁`, '略大几岁', '成熟可靠']
      }
    },
    
    getHousingRecommendations(myData) {
      const myHousing = myData.housingStatus
      if (myHousing?.includes('beijing_house')) return ['有房产', '北京本地', '经济稳定']
      return ['有住房计划', '经济能力匹配', '共同努力']
    }
  }
}
</script>

<style scoped>
.analysis-report {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 报告头部样式 */
.report-header {
  margin-bottom: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.report-header :deep(.el-card__body) {
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

.report-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
}

.report-subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
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

/* 标签页样式 */
.report-tabs {
  margin-top: 20px;
}

.report-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.report-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 600;
  padding: 0 24px;
}

.tab-content {
  min-height: 600px;
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

/* 市场定位卡片 */
.positioning-card {
  margin-bottom: 24px;
}

.positioning-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.radar-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #f8f9fa;
  border-radius: 8px;
}

.positioning-summary {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.market-level {
  text-align: center;
}

.level-badge {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.level-top {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
}

.level-excellent {
  background: linear-gradient(135deg, #67c23a, #85ce61);
  color: white;
}

.level-good {
  background: linear-gradient(135deg, #e6a23c, #f7ba2a);
  color: white;
}

.level-average {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: white;
}

.level-poor {
  background: linear-gradient(135deg, #f56c6c, #f78989);
  color: white;
}

.level-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.percentile-text {
  font-size: 14px;
  line-height: 1.4;
}

/* 维度分析样式 */
.dimensions-analysis {
  margin-bottom: 24px;
}

.dimensions-grid {
  display: grid;
  gap: 20px;
}

.dimension-analysis-item {
  padding: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.dimension-analysis-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.dimension-analysis-item.excellent {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9ff, #ecf5ff);
}

.dimension-analysis-item.good {
  border-color: #e6a23c;
  background: linear-gradient(135deg, #fdf6ec, #fef7e6);
}

.dimension-analysis-item.average {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff, #e6f7ff);
}

.dimension-analysis-item.poor {
  border-color: #f56c6c;
  background: linear-gradient(135deg, #fef0f0, #fde2e2);
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.dimension-info {
  flex: 1;
}

.dimension-title {
  margin: 0 0 4px 0;
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

.dimension-score {
  text-align: right;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.score-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 2px;
}

.dimension-details {
  margin-top: 16px;
}

.dimension-breakdown {
  margin: 12px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.breakdown-item:last-child {
  margin-bottom: 0;
}

.breakdown-label {
  color: #909399;
}

.breakdown-value {
  font-weight: 600;
  color: #303133;
}

.dimension-analysis-text {
  margin-top: 12px;
}

.analysis-text {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
}

/* 改进建议样式 */
.improvements-card {
  margin-bottom: 24px;
}

.improvements-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.improvement-item {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.improvement-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.improvement-item.high {
  border-left: 4px solid #f56c6c;
  background: linear-gradient(135deg, #fef0f0, #fde2e2);
}

.improvement-item.medium {
  border-left: 4px solid #e6a23c;
  background: linear-gradient(135deg, #fdf6ec, #fef7e6);
}

.improvement-item.low {
  border-left: 4px solid #409eff;
  background: linear-gradient(135deg, #ecf5ff, #e6f7ff);
}

.improvement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.improvement-impact {
  font-size: 12px;
  color: #67c23a;
  font-weight: 600;
}

.improvement-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.improvement-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.improvement-actions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: flex-start;
}

.action-steps h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.steps-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.steps-list li {
  margin-bottom: 4px;
}

.improvement-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  min-width: 120px;
}

.timeline-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.timeline-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

/* 发展规划样式 */
.development-plan {
  margin-bottom: 24px;
}

.timeline-container {
  padding: 20px 0;
}

.milestone-card {
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.milestone-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.milestone-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.milestone-targets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.target-tag {
  font-size: 12px;
}

/* 对比分析样式 */
.peer-comparison {
  margin-bottom: 24px;
}

.comparison-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.comparison-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
}

.comparison-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

/* 理想匹配样式 */
.ideal-match {
  margin-bottom: 24px;
}

.match-profile h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.profile-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.profile-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.profile-category {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.profile-recommendations {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.profile-tag {
  font-size: 12px;
}

.compatibility-tips h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
}

.tips-list li {
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .positioning-content,
  .comparison-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .improvement-actions {
    grid-template-columns: 1fr;
  }
  
  .comparison-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analysis-report {
    padding: 12px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .header-left {
    flex-direction: column;
    gap: 12px;
  }
  
  .report-title {
    font-size: 20px;
  }
  
  .report-tabs :deep(.el-tabs__item) {
    font-size: 14px;
    padding: 0 12px;
  }
  
  .dimension-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .dimension-score {
    text-align: left;
  }
}

/* 动画效果 */
.improvement-item,
.dimension-analysis-item {
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

/* 进度条自定义样式 */
:deep(.el-progress-bar__outer) {
  border-radius: 4px;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}

/* 时间轴自定义样式 */
:deep(.el-timeline-item__timestamp) {
  font-weight: 600;
  color: #303133;
}
</style>