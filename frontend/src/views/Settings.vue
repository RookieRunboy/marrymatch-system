<template>
  <div class="settings-container">
    <div class="header">
      <h1>系统设置</h1>
    </div>

    <div class="content">
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 评分配置 -->
        <el-tab-pane label="评分配置" name="score">
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>评分权重配置</span>
                <el-button @click="resetScoreConfig" size="small">
                  <el-icon><RefreshLeft /></el-icon>
                  重置默认
                </el-button>
              </div>
            </template>
            
            <el-form :model="scoreConfigForm" label-width="120px">
              <el-form-item label="年龄权重">
                <el-slider 
                  v-model="scoreConfigForm.weights.age" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  show-input
                  :format-tooltip="formatPercent"
                />
              </el-form-item>
              
              <el-form-item label="薪资权重">
                <el-slider 
                  v-model="scoreConfigForm.weights.salary" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  show-input
                  :format-tooltip="formatPercent"
                />
              </el-form-item>
              
              <el-form-item label="学历权重">
                <el-slider 
                  v-model="scoreConfigForm.weights.education" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  show-input
                  :format-tooltip="formatPercent"
                />
              </el-form-item>
              
              <el-form-item label="工作单位权重">
                <el-slider 
                  v-model="scoreConfigForm.weights.workUnit" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  show-input
                  :format-tooltip="formatPercent"
                />
              </el-form-item>
              
              <el-form-item label="北京户口权重">
                <el-slider 
                  v-model="scoreConfigForm.weights.beijingHukou" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  show-input
                  :format-tooltip="formatPercent"
                />
              </el-form-item>
              
              <el-form-item label="北京住房权重">
                <el-slider 
                  v-model="scoreConfigForm.weights.beijingHouse" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  show-input
                  :format-tooltip="formatPercent"
                />
              </el-form-item>
              
              <el-form-item label="存款权重">
                <el-slider 
                  v-model="scoreConfigForm.weights.savings" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  show-input
                  :format-tooltip="formatPercent"
                />
              </el-form-item>
              
              <el-form-item>
                <div class="weight-summary">
                  <span>权重总和: {{ totalWeight.toFixed(2) }}</span>
                  <el-tag :type="totalWeight === 1 ? 'success' : 'warning'">
                    {{ totalWeight === 1 ? '正常' : '需要调整' }}
                  </el-tag>
                </div>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveScoreConfig" :loading="saving">
                  保存配置
                </el-button>
                <el-button @click="normalizeWeights">
                  自动归一化
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 学历评分 -->
        <el-tab-pane label="学历评分" name="education">
          <el-card class="config-card">
            <template #header>
              <span>学历评分配置</span>
            </template>
            
            <el-form :model="scoreConfigForm" label-width="120px">
              <el-form-item 
                v-for="(score, education) in scoreConfigForm.educationScores" 
                :key="education"
                :label="education"
              >
                <el-input-number 
                  v-model="scoreConfigForm.educationScores[education]" 
                  :min="0" 
                  :max="100"
                  controls-position="right"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveScoreConfig" :loading="saving">
                  保存配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 工作单位评分 -->
        <el-tab-pane label="工作单位评分" name="workUnit">
          <el-card class="config-card">
            <template #header>
              <span>工作单位评分配置</span>
            </template>
            
            <el-form :model="scoreConfigForm" label-width="120px">
              <el-form-item 
                v-for="(score, unit) in scoreConfigForm.workUnitScores" 
                :key="unit"
                :label="unit"
              >
                <el-input-number 
                  v-model="scoreConfigForm.workUnitScores[unit]" 
                  :min="0" 
                  :max="100"
                  controls-position="right"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveScoreConfig" :loading="saving">
                  保存配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 系统设置 -->
        <el-tab-pane label="系统设置" name="system">
          <el-card class="config-card">
            <template #header>
              <span>系统配置</span>
            </template>
            
            <el-form :model="systemConfigForm" label-width="120px">
              <el-form-item label="主题">
                <el-radio-group v-model="systemConfigForm.theme" @change="changeTheme">
                  <el-radio label="light">浅色主题</el-radio>
                  <el-radio label="dark">深色主题</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="语言">
                <el-select v-model="systemConfigForm.language" @change="changeLanguage">
                  <el-option label="简体中文" value="zh-CN" />
                  <el-option label="English" value="en-US" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="最大历史记录">
                <el-input-number 
                  v-model="systemConfigForm.maxHistoryRecords" 
                  :min="10" 
                  :max="1000"
                  controls-position="right"
                />
              </el-form-item>
              
              <el-form-item label="自动保存">
                <el-switch v-model="systemConfigForm.autoSave" />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveSystemConfig">
                  保存设置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 关于 -->
        <el-tab-pane label="关于" name="about">
          <el-card class="config-card">
            <div class="about-content">
              <div class="app-info">
                <h2>{{ appStore.systemConfig.appName }}</h2>
                <p>版本: {{ appStore.systemConfig.version }}</p>
                <p>这是一个基于Vue 3 + Pinia + Element Plus开发的MARRYMATCH</p>
              </div>
              
              <div class="features">
                <h3>主要功能</h3>
                <ul>
                  <li>✅ 组件化架构设计</li>
                  <li>✅ Pinia状态管理</li>
                  <li>✅ Vue Router路由管理</li>
                  <li>✅ Axios API集成</li>
                  <li>✅ 响应式设计</li>
                  <li>✅ 主题切换</li>
                  <li>✅ 配置管理</li>
                </ul>
              </div>
              
              <div class="tech-stack">
                <h3>技术栈</h3>
                <el-tag v-for="tech in techStack" :key="tech" class="tech-tag">
                  {{ tech }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshLeft } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/appStore'

export default {
  name: 'Settings',
  components: {
    RefreshLeft
  },
  setup() {
    const appStore = useAppStore()
    
    const activeTab = ref('score')
    const saving = ref(false)
    
    const scoreConfigForm = ref({
      weights: { ...appStore.scoreConfig.weights },
      educationScores: { ...appStore.scoreConfig.educationScores },
      workUnitScores: { ...appStore.scoreConfig.workUnitScores }
    })
    
    const systemConfigForm = ref({
      theme: appStore.theme,
      language: appStore.language,
      maxHistoryRecords: appStore.systemConfig.maxHistoryRecords,
      autoSave: appStore.systemConfig.autoSave
    })
    
    const techStack = ref([
      'Vue 3', 'Pinia', 'Vue Router', 'Element Plus', 
      'Axios', 'Vite', 'JavaScript', 'CSS3'
    ])
    
    const totalWeight = computed(() => {
      return Object.values(scoreConfigForm.value.weights).reduce((sum, weight) => sum + weight, 0)
    })
    
    const formatPercent = (value) => {
      return `${(value * 100).toFixed(0)}%`
    }
    
    const normalizeWeights = () => {
      const total = totalWeight.value
      if (total > 0) {
        Object.keys(scoreConfigForm.value.weights).forEach(key => {
          scoreConfigForm.value.weights[key] = scoreConfigForm.value.weights[key] / total
        })
        ElMessage.success('权重已自动归一化')
      }
    }
    
    const resetScoreConfig = () => {
      scoreConfigForm.value = {
        weights: { ...appStore.scoreConfig.weights },
        educationScores: { ...appStore.scoreConfig.educationScores },
        workUnitScores: { ...appStore.scoreConfig.workUnitScores }
      }
      ElMessage.success('配置已重置为默认值')
    }
    
    const saveScoreConfig = async () => {
      if (Math.abs(totalWeight.value - 1) > 0.01) {
        ElMessage.warning('权重总和应该等于1，请调整后再保存')
        return
      }
      
      try {
        saving.value = true
        await appStore.updateScoreConfig(scoreConfigForm.value)
        ElMessage.success('评分配置保存成功')
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        saving.value = false
      }
    }
    
    const changeTheme = (theme) => {
      appStore.setTheme(theme)
      ElMessage.success(`已切换到${theme === 'light' ? '浅色' : '深色'}主题`)
    }
    
    const changeLanguage = (language) => {
      appStore.setLanguage(language)
      ElMessage.success('语言设置已更新')
    }
    
    const saveSystemConfig = () => {
      // 这里可以调用API保存系统配置
      ElMessage.success('系统设置保存成功')
    }
    
    // 监听appStore的配置变化
    watch(() => appStore.scoreConfig, (newConfig) => {
      scoreConfigForm.value = {
        weights: { ...newConfig.weights },
        educationScores: { ...newConfig.educationScores },
        workUnitScores: { ...newConfig.workUnitScores }
      }
    }, { deep: true })
    
    onMounted(() => {
      appStore.initializeApp()
    })
    
    return {
      activeTab,
      saving,
      scoreConfigForm,
      systemConfigForm,
      techStack,
      totalWeight,
      appStore,
      formatPercent,
      normalizeWeights,
      resetScoreConfig,
      saveScoreConfig,
      changeTheme,
      changeLanguage,
      saveSystemConfig
    }
  }
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header h1 {
  margin: 0 0 20px 0;
  color: #303133;
}

.settings-tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.config-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weight-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}

.about-content {
  text-align: center;
}

.app-info h2 {
  color: #409EFF;
  margin-bottom: 10px;
}

.features, .tech-stack {
  margin-top: 30px;
  text-align: left;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 5px 0;
  font-size: 14px;
}

.tech-tag {
  margin: 5px;
}

:deep(.el-slider__input) {
  width: 80px;
}
</style>