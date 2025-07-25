<template>
  <div class="single-evaluation">
    <div class="container">
      <div class="header">
        <h1 class="title">个人评估</h1>
        <p class="subtitle">全面评估个人在相亲市场中的竞争力</p>
      </div>

      <div class="evaluation-content">
        <!-- 表单区域 -->
        <div class="form-section">
          <el-card class="form-card">
            <template #header>
              <div class="card-header">
                <span>个人信息</span>
                <el-button 
                  v-if="hasFormData" 
                  type="text" 
                  @click="clearForm"
                >
                  清空表单
                </el-button>
              </div>
            </template>
            
            <div class="form-content">
              <PersonForm 
                ref="personFormRef"
                v-model="personData"
                :title="getPersonTitle()"
                :gender="personData.gender || 'male'"
                :is-single-mode="true"
              />
              
              <div class="form-actions">
                <el-button 
                  type="primary" 
                  size="large"
                  :loading="isEvaluating"
                  @click="handleEvaluate"
                  :disabled="!canEvaluate"
                >
                  {{ isEvaluating ? '评估中...' : '开始评估' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 结果区域 -->
        <div v-if="evaluationResult" class="result-section">
          <el-card class="result-card">
            <template #header>
              <div class="card-header">
                <span>评估结果</span>
                <div class="result-actions">
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="saveResult"
                  >
                    保存结果
                  </el-button>
                  <el-button 
                    type="success" 
                    size="small"
                    @click="showShareModal = true"
                  >
                    分享结果
                  </el-button>
                </div>
              </div>
            </template>

            <!-- 总体评分卡 -->
            <div class="score-overview">
              <ScoreCard 
                :title="getPersonTitle() + '综合评分'"
                :score="evaluationResult.detailedScores.total"
                :icon="'Star'"
                :detailed-scores="evaluationResult.detailedScores"
                :percentile="evaluationResult.marketAnalysis?.marketPercentile"
                :improvement-suggestions="getImprovementSuggestions()"
                :competitive-advantages="evaluationResult.marketAnalysis?.competitiveAdvantages"
              />
            </div>

            <!-- 详细分析报告 -->
            <div class="analysis-section">
              <AnalysisReport 
                :personal-score="evaluationResult.detailedScores.total"
                :detailed-scores="evaluationResult.detailedScores"
                :personal-data="personData"
                :is-match-mode="false"
              />
            </div>

            <!-- 市场价值分析 -->
            <div class="market-analysis">
              <MarketValueAnalysis 
                :person="personData"
                :analysis="evaluationResult.marketAnalysis"
              />
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 分享模态框 -->
    <ShareModal
      v-model="showShareModal"
      :evaluation-result="evaluationResult"
      :person-data="personData"
      @shared="handleShared"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PersonForm from '@/components/PersonForm.vue'
import ScoreCard from '@/components/ScoreCard.vue'
import AnalysisReport from '@/components/AnalysisReport.vue'
import MarketValueAnalysis from '@/components/MarketValueAnalysis.vue'
import ShareModal from '@/components/ShareModal.vue'
import { 
  calculateDetailedScores, 
  generateMarketValueAnalysis,
  getScoreLevel
} from '@/services/scoreCalculator'

export default {
  name: 'SingleEvaluation',
  components: {
    PersonForm,
    ScoreCard,
    AnalysisReport,
    MarketValueAnalysis,
    ShareModal
  },
  setup() {
    const personFormRef = ref(null)
    const personData = ref({
      gender: 'male',
      age: 25,
      height: 170,
      weight: 65,
      salary: 1.0,
      workUnit: 'private_company',
      education: 'bachelor',
      universityTier: 'tier1',
      appearance: 'above_average',
      housingStatus: 'rent',
      savings: 10,
      parentsIncome: 1.0,
      onlyChild: false
    })
    const evaluationResult = ref(null)
    const isEvaluating = ref(false)
    const showShareModal = ref(false)

    // 检查是否有表单数据
    const hasFormData = computed(() => {
      return Object.keys(personData.value).length > 0 && 
             (personData.value.age || personData.value.salary)
    })

    // 检查是否可以进行评估
    const canEvaluate = computed(() => {
      const data = personData.value
      return !!(data.age && data.gender && data.height && data.weight && 
               data.salary && data.workUnit && data.education)
    })

    // 获取个人标题
    const getPersonTitle = () => {
      const gender = personData.value.gender || 'male'
      return gender === 'female' ? '女性个人评估' : '男性个人评估'
    }

    // 获取改进建议
    const getImprovementSuggestions = () => {
      if (!evaluationResult.value) return []
      
      const suggestions = []
      const breakdown = evaluationResult.value.detailedScores
      
      if (breakdown.workIncome < 70) {
        suggestions.push({
          title: '提升工作收入',
          description: '考虑跳槽到更稳定的工作单位，或通过技能提升获得加薪机会',
          type: 'warning'
        })
      }
      
      if (breakdown.education < 80) {
        suggestions.push({
          title: '提升教育背景',
          description: '考虑继续深造或获得更高学历，提升个人竞争力',
          type: 'info'
        })
      }
      
      if (breakdown.physical < 70) {
        suggestions.push({
          title: '改善外在形象',
          description: '通过健身、护肤、穿搭等方式提升个人形象',
          type: 'warning'
        })
      }
      
      if (breakdown.assets < 60) {
        suggestions.push({
          title: '积累财富资产',
          description: '制定理财计划，积极储蓄，考虑投资和购房',
          type: 'info'
        })
      }
      
      return suggestions
    }

    // 处理评估
    const handleEvaluate = async () => {
      try {
        isEvaluating.value = true
        
        // 验证表单数据
        if (!canEvaluate.value) {
          ElMessage.error('请完善必填信息')
          return
        }

        // 计算详细评分
        const detailedScores = calculateDetailedScores(personData.value)
        
        // 生成市场价值分析
        const marketAnalysis = generateMarketValueAnalysis(personData.value)
        
        // 设置评估结果
        evaluationResult.value = {
          detailedScores,
          marketAnalysis,
          timestamp: new Date().toISOString()
        }

        // 显示成功消息
        ElMessage.success('评估完成！')
        
        // 滚动到结果区域
        setTimeout(() => {
          const resultSection = document.querySelector('.result-section')
          if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)

      } catch (error) {
        console.error('评估过程中出现错误:', error)
        ElMessage.error('评估失败，请重试')
      } finally {
        isEvaluating.value = false
      }
    }

    // 清空表单
    const clearForm = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要清空表单吗？这将删除所有已填写的信息。',
          '确认清空',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        personData.value = {}
        evaluationResult.value = null
        localStorage.removeItem('singleEvaluationForm')
        ElMessage.success('表单已清空')
      } catch {
        // 用户取消操作
      }
    }

    // 保存结果
    const saveResult = () => {
      if (!evaluationResult.value) return

      try {
        // 获取现有的历史记录
        const existingHistory = JSON.parse(localStorage.getItem('singleEvaluationHistory') || '[]')
        
        // 创建新的记录
        const newRecord = {
          id: Date.now(),
          person: { ...personData.value },
          result: { ...evaluationResult.value },
          type: 'single',
          createdAt: new Date().toISOString()
        }
        
        // 添加到历史记录
        existingHistory.unshift(newRecord)
        
        // 限制历史记录数量（最多保存50条）
        if (existingHistory.length > 50) {
          existingHistory.splice(50)
        }
        
        // 保存到本地存储
        localStorage.setItem('singleEvaluationHistory', JSON.stringify(existingHistory))
        
        ElMessage.success('结果已保存到历史记录')
      } catch (error) {
        console.error('保存结果失败:', error)
        ElMessage.error('保存失败，请重试')
      }
    }

    // 处理分享完成事件
    const handleShared = (shareInfo) => {
      console.log('分享完成:', shareInfo)
      ElMessage.success('分享成功！')
    }

    // 从本地存储加载数据
    const loadFromStorage = () => {
      try {
        const savedData = localStorage.getItem('singleEvaluationForm')
        if (savedData) {
          personData.value = JSON.parse(savedData)
        }
      } catch (error) {
        console.error('加载保存的数据失败:', error)
      }
    }

    // 保存到本地存储
    const saveToStorage = () => {
      try {
        if (hasFormData.value) {
          localStorage.setItem('singleEvaluationForm', JSON.stringify(personData.value))
        }
      } catch (error) {
        console.error('保存数据失败:', error)
      }
    }

    // 监听数据变化并自动保存
    watchEffect(() => {
      saveToStorage()
    })

    onMounted(() => {
      loadFromStorage()
    })

    return {
      personFormRef,
      personData,
      evaluationResult,
      isEvaluating,
      hasFormData,
      canEvaluate,
      getPersonTitle,
      getImprovementSuggestions,
      handleEvaluate,
      clearForm,
      saveResult,
      showShareModal,
      handleShared
    }
  }
}
</script>

<style scoped>
.single-evaluation {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.evaluation-content {
  display: grid;
  gap: 30px;
}

.form-section {
  width: 100%;
}

.form-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: none;
}

.form-content {
  padding: 20px 0;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.form-actions .el-button {
  min-width: 200px;
  height: 50px;
  font-size: 16px;
  font-weight: bold;
}

.result-section {
  width: 100%;
}

.result-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.score-overview {
  margin-bottom: 30px;
}

.analysis-section {
  margin-bottom: 30px;
}

.market-analysis {
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .evaluation-content {
    gap: 20px;
  }
  
  .result-actions {
    flex-direction: column;
    gap: 5px;
  }
  
  .result-actions .el-button {
    width: 100%;
  }
  
  .form-actions .el-button {
    min-width: 150px;
    height: 45px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .single-evaluation {
    padding: 10px 0;
  }
  
  .title {
    font-size: 1.8rem;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .form-content {
    padding: 10px 0;
  }
}

/* 深色主题支持 */
[data-theme="dark"] .single-evaluation {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

[data-theme="dark"] .form-card,
[data-theme="dark"] .result-card {
  background-color: #2d2d2d;
  color: #ffffff;
}

[data-theme="dark"] .header {
  color: #ffffff;
}

[data-theme="dark"] .form-actions {
  border-top-color: #404040;
}
</style>