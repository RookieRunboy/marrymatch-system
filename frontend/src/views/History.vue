<template>
  <div class="history-container">
    <div class="header">
      <h1>匹配历史记录</h1>
      <div class="actions">
        <el-button @click="refreshHistory" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button @click="clearAllHistory" type="danger" :disabled="historyList.length === 0">
          <el-icon><Delete /></el-icon>
          清空历史
        </el-button>
      </div>
    </div>

    <div class="content">
      <el-empty v-if="historyList.length === 0" description="暂无历史记录" />
      
      <div v-else class="history-list">
        <el-card 
          v-for="record in historyList" 
          :key="record.id" 
          class="history-item"
          shadow="hover"
        >
          <template #header>
            <div class="card-header">
              <span class="timestamp">{{ formatDate(record.timestamp) }}</span>
              <el-button 
                type="danger" 
                size="small" 
                @click="deleteRecord(record.id)"
                :icon="Delete"
                circle
              />
            </div>
          </template>
          
          <div class="record-content">
            <div class="scores">
              <div class="score-item">
                <span class="label">男方评分:</span>
                <span class="score male">{{ record.scores.maleScore }}</span>
              </div>
              <div class="score-item">
                <span class="label">女方评分:</span>
                <span class="score female">{{ record.scores.femaleScore }}</span>
              </div>
              <div class="score-item">
                <span class="label">匹配度:</span>
                <span class="score match">{{ record.scores.matchScore }}</span>
              </div>
            </div>
            
            <div class="actions">
              <el-button size="small" @click="loadRecord(record)">
                <el-icon><View /></el-icon>
                查看详情
              </el-button>
              <el-button size="small" @click="restoreRecord(record)">
                <el-icon><RefreshLeft /></el-icon>
                恢复数据
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Refresh, View, RefreshLeft } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'
import { useAppStore } from '@/stores/appStore'
import { userAPI } from '@/services/apiService'

export default {
  name: 'History',
  components: {
    Delete,
    Refresh,
    View,
    RefreshLeft
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const appStore = useAppStore()
    
    const loading = ref(false)
    const historyList = ref([])

    // 模拟历史数据（实际项目中应该从API获取）
    const mockHistoryData = [
      {
        id: 1,
        timestamp: new Date('2024-01-15T10:30:00'),
        scores: { maleScore: 85, femaleScore: 78, matchScore: 82 },
        maleForm: { age: 28, salary: 15000, education: '本科' },
        femaleForm: { age: 26, salary: 12000, education: '硕士' }
      },
      {
        id: 2,
        timestamp: new Date('2024-01-14T15:20:00'),
        scores: { maleScore: 92, femaleScore: 88, matchScore: 90 },
        maleForm: { age: 30, salary: 20000, education: '硕士' },
        femaleForm: { age: 28, salary: 18000, education: '本科' }
      }
    ]

    const loadHistory = async () => {
      try {
        loading.value = true
        // 实际项目中使用API
        // const data = await userAPI.getMatchHistory(userId)
        // historyList.value = data
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        historyList.value = mockHistoryData
      } catch (error) {
        console.error('加载历史记录失败:', error)
        appStore.addNotification('加载历史记录失败', 'error')
      } finally {
        loading.value = false
      }
    }

    const refreshHistory = () => {
      loadHistory()
    }

    const deleteRecord = async (recordId) => {
      try {
        await ElMessageBox.confirm(
          '确定要删除这条记录吗？',
          '确认删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 实际项目中使用API
        // await userAPI.deleteMatchRecord(recordId)
        
        // 模拟删除
        historyList.value = historyList.value.filter(item => item.id !== recordId)
        ElMessage.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除记录失败:', error)
          ElMessage.error('删除失败')
        }
      }
    }

    const clearAllHistory = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要清空所有历史记录吗？此操作不可恢复！',
          '确认清空',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        historyList.value = []
        ElMessage.success('清空成功')
      } catch (error) {
        // 用户取消操作
      }
    }

    const loadRecord = (record) => {
      // 显示记录详情的逻辑
      ElMessage.info('查看详情功能待实现')
    }

    const restoreRecord = (record) => {
      userStore.importData(record)
      ElMessage.success('数据已恢复到主页面')
      router.push('/')
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString('zh-CN')
    }

    onMounted(() => {
      loadHistory()
    })

    return {
      loading,
      historyList,
      refreshHistory,
      deleteRecord,
      clearAllHistory,
      loadRecord,
      restoreRecord,
      formatDate
    }
  }
}
</script>

<style scoped>
.history-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #303133;
}

.actions {
  display: flex;
  gap: 10px;
}

.history-list {
  display: grid;
  gap: 16px;
}

.history-item {
  transition: transform 0.2s;
}

.history-item:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  font-size: 14px;
  color: #909399;
}

.record-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scores {
  display: flex;
  gap: 20px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.score {
  font-size: 18px;
  font-weight: bold;
}

.score.male {
  color: #409EFF;
}

.score.female {
  color: #F56C6C;
}

.score.match {
  color: #67C23A;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>