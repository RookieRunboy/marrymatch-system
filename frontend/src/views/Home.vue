<template>
  <div class="home">
    <el-container>
      <el-header class="header">
        <h1>MARRY MATCH</h1>
        <p>匹配分析 - 支持异性和同性关系评估</p>
      </el-header>
      
      <el-main>
        <!-- 性别选择区域 -->
        <div class="gender-selection">
          <el-card class="gender-card">
            <template #header>
              <div class="card-header">
                <el-icon><User /></el-icon>
                <span>选择双方性别</span>
              </div>
            </template>
            
            <el-row :gutter="40">
              <el-col :span="12">
                <div class="person-gender-selector">
                  <h4>第一人</h4>
                  <el-radio-group v-model="person1Gender" @change="updatePersonTitles">
                    <el-radio label="male">男性</el-radio>
                    <el-radio label="female">女性</el-radio>
                  </el-radio-group>
                </div>
              </el-col>
              
              <el-col :span="12">
                <div class="person-gender-selector">
                  <h4>第二人</h4>
                  <el-radio-group v-model="person2Gender" @change="updatePersonTitles">
                    <el-radio label="male">男性</el-radio>
                    <el-radio label="female">女性</el-radio>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
            
            <div class="relationship-type">
              <el-tag :type="relationshipType === 'heterosexual' ? 'primary' : 'success'" size="large">
                {{ relationshipTypeText }}
              </el-tag>
            </div>
          </el-card>
        </div>
        
        <el-row :gutter="20" class="form-section">
          <!-- 第一人信息 -->
          <el-col :span="12">
            <PersonForm
              v-model="person1Form"
              :title="person1Title"
              :gender="person1Gender"
            />
          </el-col>
          
          <!-- 第二人信息 -->
          <el-col :span="12">
            <PersonForm
              v-model="person2Form"
              :title="person2Title"
              :gender="person2Gender"
            />
          </el-col>
        </el-row>
        
        <!-- 计算按钮 -->
        <div class="calculate-section">
          <el-button type="primary" size="large" @click="calculateScore" :loading="calculating">
            <el-icon><Operation /></el-icon>
            {{ relationshipType === 'heterosexual' ? '计算匹配度' : '计算相似度' }}
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
                :title="person1Title + '评分'"
                :score="person1Score"
                icon="Star"
              />
            </el-col>
            
            <el-col :span="8">
              <ScoreCard
                :title="person2Title + '评分'"
                :score="person2Score"
                icon="Star"
              />
            </el-col>
            
            <el-col :span="8">
              <ScoreCard
                :title="relationshipType === 'heterosexual' ? '匹配度' : '相似度'"
                :score="matchScore"
                icon="Promotion"
                :is-match-card="true"
              />
            </el-col>
          </el-row>
          
          <!-- 详细分析 -->
          <AnalysisReport
            :personal-score="maleScore"
            :detailed-scores="userStore.scores.maleDetailed"
            :personal-data="maleForm"
            :is-match-mode="true"
            :match-data="{
              maleScore: maleScore,
              femaleScore: femaleScore,
              matchScore: matchScore,
              maleDetailed: userStore.scores.maleDetailed,
              femaleDetailed: userStore.scores.femaleDetailed,
              maleData: maleForm,
              femaleData: femaleForm
            }"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Operation, RefreshLeft, User } from '@element-plus/icons-vue'
import PersonForm from '@/components/PersonForm.vue'
import ScoreCard from '@/components/ScoreCard.vue'
import AnalysisReport from '@/components/AnalysisReport.vue'
import { useUserStore } from '@/stores/userStore'
import { useAppStore } from '@/stores/appStore'
import { userAPI } from '@/services/apiService'

export default {
  name: 'MatchAnalysis',
  components: {
    Operation,
    RefreshLeft,
    User,
    PersonForm,
    ScoreCard,
    AnalysisReport
  },
  setup() {
    const userStore = useUserStore()
    const appStore = useAppStore()
    const calculating = ref(false)
    
    // 性别选择
    const person1Gender = ref('male')
    const person2Gender = ref('female')
    
    // 表单数据
    const person1Form = ref({
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
    
    const person2Form = ref({
      gender: 'female',
      age: 23,
      height: 165,
      weight: 55,
      salary: 0.8,
      workUnit: 'private_company',
      education: 'bachelor',
      universityTier: 'tier1',
      appearance: 'above_average',
      housingStatus: 'rent',
      savings: 8,
      parentsIncome: 0.8,
      onlyChild: false
    })
    
    // 计算结果
    const showResult = ref(false)
    const person1Score = ref(0)
    const person2Score = ref(0)
    const matchScore = ref(0)
    
    // 计算属性
    const relationshipType = computed(() => {
      return person1Gender.value !== person2Gender.value ? 'heterosexual' : 'homosexual'
    })
    
    const relationshipTypeText = computed(() => {
      return relationshipType.value === 'heterosexual' ? '异性关系' : '同性关系'
    })
    
    const person1Title = computed(() => {
      return person1Gender.value === 'male' ? '男方' : '女方'
    })
    
    const person2Title = computed(() => {
      return person2Gender.value === 'male' ? '男方' : '女方'
    })
    
    // 更新人员标题
    const updatePersonTitles = () => {
      person1Form.value.gender = person1Gender.value
      person2Form.value.gender = person2Gender.value
    }
    
    // 验证表单数据
    const validateFormData = () => {
      const person1Valid = person1Form.value.age && person1Form.value.salary && person1Form.value.education
      const person2Valid = person2Form.value.age && person2Form.value.salary && person2Form.value.education
      return person1Valid && person2Valid
    }
    
    // 计算个人评分
    const calculatePersonScore = (personData) => {
      let score = 0
      
      // 工作收入评分 (40%)
      const salaryScore = Math.min(personData.salary * 20, 100)
      score += salaryScore * 0.4
      
      // 教育背景评分 (25%)
      const educationScores = {
        'high_school': 60,
        'college': 70,
        'bachelor': 80,
        'master': 90,
        'phd': 100
      }
      const educationScore = educationScores[personData.education] || 70
      score += educationScore * 0.25
      
      // 年龄评分 (15%)
      const ageScore = personData.age >= 25 && personData.age <= 35 ? 100 : 
                      personData.age >= 22 && personData.age <= 40 ? 80 : 60
      score += ageScore * 0.15
      
      // 外貌评分 (15%)
      const appearanceScores = {
        'below_average': 60,
        'average': 75,
        'above_average': 85,
        'attractive': 95,
        'very_attractive': 100
      }
      const appearanceScore = appearanceScores[personData.appearance] || 75
      score += appearanceScore * 0.15
      
      // 其他因素 (5%)
      const otherScore = (personData.savings || 0) > 20 ? 100 : 70
      score += otherScore * 0.05
      
      return Math.round(score)
    }
    
    // 计算匹配度/相似度
    const calculateMatchScore = (person1Data, person2Data, isHeterosexual) => {
      if (isHeterosexual) {
        // 异性关系：传统匹配度计算
        const score1 = calculatePersonScore(person1Data)
        const score2 = calculatePersonScore(person2Data)
        const avgScore = (score1 + score2) / 2
        const scoreDiff = Math.abs(score1 - score2)
        
        // 分数差异越小，匹配度越高
        const matchBonus = Math.max(0, 20 - scoreDiff)
        return Math.min(100, Math.round(avgScore + matchBonus))
      } else {
        // 同性关系：相似度计算
        let similarity = 0
        
        // 年龄相似度
        const ageDiff = Math.abs(person1Data.age - person2Data.age)
        const ageSimilarity = Math.max(0, 100 - ageDiff * 5)
        similarity += ageSimilarity * 0.2
        
        // 收入相似度
        const salaryDiff = Math.abs(person1Data.salary - person2Data.salary)
        const salarySimilarity = Math.max(0, 100 - salaryDiff * 30)
        similarity += salarySimilarity * 0.3
        
        // 教育背景相似度
        const educationSimilarity = person1Data.education === person2Data.education ? 100 : 70
        similarity += educationSimilarity * 0.25
        
        // 生活方式相似度
        const lifestyleSimilarity = person1Data.housingStatus === person2Data.housingStatus ? 100 : 80
        similarity += lifestyleSimilarity * 0.15
        
        // 家庭背景相似度
        const familySimilarity = person1Data.onlyChild === person2Data.onlyChild ? 100 : 85
        similarity += familySimilarity * 0.1
        
        return Math.round(similarity)
      }
    }
    
    const calculateScore = async () => {
      if (!validateFormData()) {
        ElMessage.warning('请填写完整的基本信息')
        return
      }
      
      try {
        calculating.value = true
        
        // 模拟计算延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 计算分数
        person1Score.value = calculatePersonScore(person1Form.value)
        person2Score.value = calculatePersonScore(person2Form.value)
        matchScore.value = calculateMatchScore(
          person1Form.value, 
          person2Form.value, 
          relationshipType.value === 'heterosexual'
        )
        
        showResult.value = true
        
        const resultType = relationshipType.value === 'heterosexual' ? '匹配度' : '相似度'
        ElMessage.success(`${resultType}计算完成！${resultType}：${matchScore.value}分`)
      } catch (error) {
        console.error('计算失败:', error)
        ElMessage.error('计算过程中出现错误，请重试')
      } finally {
        calculating.value = false
      }
    }
    
    const resetData = () => {
      person1Form.value = {
        gender: person1Gender.value,
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
      }
      
      person2Form.value = {
        gender: person2Gender.value,
        age: 23,
        height: 165,
        weight: 55,
        salary: 0.8,
        workUnit: 'private_company',
        education: 'bachelor',
        universityTier: 'tier1',
        appearance: 'above_average',
        housingStatus: 'rent',
        savings: 8,
        parentsIncome: 0.8,
        onlyChild: false
      }
      
      showResult.value = false
      person1Score.value = 0
      person2Score.value = 0
      matchScore.value = 0
      
      ElMessage.success('数据已重置')
    }
    
    return {
      person1Gender,
      person2Gender,
      person1Form,
      person2Form,
      calculating,
      showResult,
      person1Score,
      person2Score,
      matchScore,
      relationshipType,
      relationshipTypeText,
      person1Title,
      person2Title,
      updatePersonTitles,
      calculateScore,
      resetData
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
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

/* 性别选择区域样式 */
.gender-selection {
  margin-bottom: 30px;
}

.gender-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.gender-card .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
}

.person-gender-selector {
  text-align: center;
  padding: 20px;
}

.person-gender-selector h4 {
  margin-bottom: 16px;
  color: #2c3e50;
  font-weight: 600;
}

.person-gender-selector .el-radio-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.relationship-type {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.relationship-type .el-tag {
  font-size: 1rem;
  padding: 8px 16px;
  font-weight: 600;
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