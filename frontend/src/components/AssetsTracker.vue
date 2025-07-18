<template>
  <div class="assets-tracker">
    <!-- 存款输入 -->
    <div class="savings-input">
      <el-divider content-position="left">存款</el-divider>
      <el-form-item label="存款金额">
        <el-slider
          v-model="savings"
          :min="0"
          :max="1000"
          :step="10"
          :marks="savingsMarks"
          :format-tooltip="formatSavings"
          @change="handleSavingsChange"
        />
        <div class="savings-display">
          <span class="savings-amount">{{ formatSavings(savings) }}</span>
        </div>
      </el-form-item>
    </div>
    
    <!-- 其他资产 -->
    <div class="other-assets">
      <el-divider content-position="left">其他资产</el-divider>
      <el-form-item v-for="(asset, index) in otherAssets" :key="index" :label="asset.type">
        <div class="asset-input-group">
          <el-input-number 
            v-model="asset.value" 
            :min="0" 
            :step="10" 
            @change="handleAssetChange"
            class="asset-value-input"
          />
          <el-button 
            type="danger" 
            icon="Delete" 
            circle 
            @click="removeAsset(index)"
            class="remove-asset-btn"
          />
        </div>
      </el-form-item>
      
      <div class="add-asset">
        <el-select v-model="newAssetType" placeholder="选择资产类型" class="asset-type-select">
          <el-option
            v-for="option in assetTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-button type="primary" @click="addAsset" :disabled="!newAssetType">添加资产</el-button>
      </div>
    </div>
    
    <!-- 负债 -->
    <div class="debt-input">
      <el-divider content-position="left">负债</el-divider>
      <el-form-item label="总负债金额">
        <el-input-number 
          v-model="debt" 
          :min="0" 
          :step="10" 
          @change="handleDebtChange"
          class="debt-input"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      savings: 50,
      otherAssets: [],
      debt: 0,
      score: 0
    })
  }
})

const emit = defineEmits(['update:modelValue'])

// 从props中提取数据
const savings = ref(props.modelValue.savings || 50)
const otherAssets = ref(props.modelValue.otherAssets || [])
const debt = ref(props.modelValue.debt || 0)
const newAssetType = ref('')

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue.savings !== savings.value) {
    savings.value = newValue.savings || 50
  }
  if (JSON.stringify(newValue.otherAssets) !== JSON.stringify(otherAssets.value)) {
    otherAssets.value = newValue.otherAssets || []
  }
  if (newValue.debt !== debt.value) {
    debt.value = newValue.debt || 0
  }
}, { deep: true })

// 存款标记点
const savingsMarks = {
  0: '0',
  50: '50万',
  100: '100万',
  200: '200万',
  500: '500万',
  1000: '1000万+'
}

// 资产类型选项
const assetTypeOptions = [
  { label: '股票', value: 'stocks' },
  { label: '基金', value: 'funds' },
  { label: '车辆', value: 'vehicle' },
  { label: '珠宝', value: 'jewelry' },
  { label: '艺术品', value: 'art' },
  { label: '其他投资', value: 'other_investments' }
]

// 格式化存款显示
const formatSavings = (value) => {
  return `${value}万元`
}

// 计算其他资产总值（保留用于数据传递）
const totalOtherAssets = computed(() => {
  return otherAssets.value.reduce((sum, asset) => sum + (asset.value || 0), 0)
})

// 处理存款变化
const handleSavingsChange = (value) => {
  savings.value = value
  updateModelValue()
}

// 处理资产变化
const handleAssetChange = () => {
  updateModelValue()
}

// 处理负债变化
const handleDebtChange = (value) => {
  debt.value = value
  updateModelValue()
}

// 添加资产
const addAsset = () => {
  if (!newAssetType.value) return
  
  // 检查是否已存在该类型资产
  const existingIndex = otherAssets.value.findIndex(asset => asset.type === newAssetType.value)
  if (existingIndex >= 0) return
  
  const assetTypeLabel = assetTypeOptions.find(opt => opt.value === newAssetType.value)?.label || newAssetType.value
  
  otherAssets.value.push({
    type: newAssetType.value,
    label: assetTypeLabel,
    value: 0
  })
  
  newAssetType.value = ''
  updateModelValue()
}

// 移除资产
const removeAsset = (index) => {
  otherAssets.value.splice(index, 1)
  updateModelValue()
}

// 更新模型值
const updateModelValue = () => {
  emit('update:modelValue', {
    savings: savings.value,
    otherAssets: otherAssets.value,
    debt: debt.value,
    score: 0 // 移除评分计算，仅在匹配计算后显示
  })
}

// 移除不再使用的评分相关函数
</script>

<style scoped>
.assets-tracker {
  width: 100%;
}

.savings-display {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.savings-amount {
  font-size: 16px;
  font-weight: 600;
}

.asset-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-value-input {
  flex: 1;
}

.add-asset {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.asset-type-select {
  flex: 1;
}

.debt-input {
  width: 100%;
}

:deep(.el-slider__marks-text) {
  font-size: 12px;
}
</style>