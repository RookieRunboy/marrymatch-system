<template>
  <div class="home">
    <el-container>
      <el-header class="header">
        <h1>MARRY MATCH</h1>
        <p>客观评估双方条件，科学匹配度分析</p>
      </el-header>
      
      <el-main>
        <el-row :gutter="20" class="form-section">
          <!-- 男方信息 -->
          <el-col :span="12">
            <PersonForm
              v-model="maleForm"
              title="男方信息"
              gender="male"
            />
          </el-col>
          
          <!-- 女方信息 -->
          <el-col :span="12">
            <PersonForm
              v-model="femaleForm"
              title="女方信息"
              gender="female"
            />
          </el-col>
        </el-row>
        
        <!-- 计算按钮 -->
        <div class="calculate-section">
          <el-button type="primary" size="large" @click="calculateScore" :loading="calculating">
            <el-icon><Operation /></el-icon>
            计算匹配度
          </el-button>
          <el-button size="large" @click="resetData" :disabled="calculating">
            <el-icon><RefreshLeft /></el-icon>
            重置数据
          </el-button>
        </div>
        
        <!-- 结果展示 -->
        <div v-if="showResult" class="result-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <ScoreCard
                title="男方评分"
                :score="maleScore"
                icon="Star"
              />
            </el-col>
            
            <el-col :span="8">
              <ScoreCard
                title="女方评分"
                :score="femaleScore"
                icon="Star"
              />
            </el-col>
            
            <el-col :span="8">
              <ScoreCard
                title="匹配度"
                :score="matchScore"
                icon="Promotion"
                :is-match-card="true"
              />
            </el-col>
          </el-row>
          
          <!-- 详细分析 -->
          <AnalysisReport
            :male-score="maleScore"
            :female-score="femaleScore"
            :match-score="matchScore"
            :male-form="maleForm"
            :female-form="femaleForm"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Operation, RefreshLeft } from '@element-plus/icons-vue'
import PersonForm from '@/components/PersonForm.vue'
import ScoreCard from '@/components/ScoreCard.vue'
import AnalysisReport from '@/components/AnalysisReport.vue'
import { useUserStore } from '@/stores/userStore'
import { useAppStore } from '@/stores/appStore'
import { userAPI } from '@/services/apiService'

export default {
  name: 'Home',
  components: {
    Operation,
    RefreshLeft,
    PersonForm,
    ScoreCard,
    AnalysisReport
  },
  setup() {
    const userStore = useUserStore()
    const appStore = useAppStore()
    const calculating = ref(false)
    
    // 使用store中的数据
    const maleForm = computed({
      get: () => userStore.maleForm,
      set: (value) => userStore.updateMaleForm(value)
    })
    
    const femaleForm = computed({
      get: () => userStore.femaleForm,
      set: (value) => userStore.updateFemaleForm(value)
    })
    
    const showResult = computed(() => userStore.isCalculated)
    const maleScore = computed(() => userStore.scores.maleScore)
    const femaleScore = computed(() => userStore.scores.femaleScore)
    const matchScore = computed(() => userStore.scores.matchScore)
    
    const calculateScore = async () => {
      if (!userStore.hasValidData) {
        ElMessage.warning('请填写完整的基本信息')
        return
      }
      
      try {
        calculating.value = true
        appStore.setLoading(true)
        
        // 模拟计算延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 计算分数
        const scores = userStore.calculateScores()
        
        // 如果开启自动保存，保存到后端
        if (appStore.systemConfig.autoSave) {
          try {
            await userAPI.saveMatchResult(userStore.exportData())
            appStore.addNotification('计算结果已自动保存', 'success')
          } catch (error) {
            console.error('自动保存失败:', error)
            appStore.addNotification('自动保存失败，但计算结果已生成', 'warning')
          }
        }
        
        ElMessage.success(`匹配度计算完成！匹配等级：${userStore.matchLevel}`)
      } catch (error) {
        console.error('计算失败:', error)
        ElMessage.error('计算过程中出现错误，请重试')
      } finally {
        calculating.value = false
        appStore.setLoading(false)
      }
    }
    
    const resetData = () => {
      userStore.resetData()
      ElMessage.success('数据已重置')
    }
    
    return {
      maleForm,
      femaleForm,
      calculating,
      showResult,
      maleScore,
      femaleScore,
      matchScore,
      calculateScore,
      resetData,
      userStore,
      appStore
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  color: white;
  padding: 40px 0;
}

.header h1 {
  margin: 0;
  font-size: 2.5em;
  font-weight: 300;
}

.header p {
  margin: 10px 0 0 0;
  font-size: 1.2em;
  opacity: 0.9;
}

.form-section {
  margin-top: 30px;
}

.calculate-section {
  text-align: center;
  margin: 40px 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.calculate-section .el-button {
  padding: 15px 40px;
  font-size: 16px;
  border-radius: 25px;
}

.result-section {
  margin-top: 30px;
}
</style>