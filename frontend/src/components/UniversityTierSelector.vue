<template>
  <div class="university-tier-selector">
    <el-select 
      v-model="selectedValue" 
      placeholder="请选择院校等级" 
      @change="handleChange"
      class="university-tier-select"
      filterable
      :disabled="!isEnabled"
    >
      <el-option
        v-for="option in universityTierOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
    
    <!-- 提示信息 -->
    <div v-if="!isEnabled" class="disabled-info">
      <el-alert
        title="请选择本科及以上学历以启用院校等级选择"
        type="info"
        :closable="false"
        show-icon
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { UNIVERSITY_TIER_OPTIONS } from '@/constants/formDefaults.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const universityTierOptions = ref(UNIVERSITY_TIER_OPTIONS)

// 是否启用院校等级选择（本科及以上学历才启用）
const isEnabled = computed(() => {
  return ['bachelor', 'master', 'phd'].includes(props.education)
})

// 监听学历变化，如果不是本科及以上，清空院校等级
watch(() => props.education, (newValue) => {
  if (!['bachelor', 'master', 'phd'].includes(newValue) && props.modelValue) {
    emit('update:modelValue', '')
  }
})

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

// 当前选中的选项详情
const selectedOption = computed(() => {
  return universityTierOptions.value.find(option => option.value === selectedValue.value)
})

const handleChange = (value) => {
  emit('update:modelValue', value)
}

// 移除不再使用的评分相关函数
</script>

<style scoped>
.university-tier-selector {
  width: 100%;
}

.university-tier-select {
  width: 100%;
}

.university-tier-confirmation {
  margin-top: 8px;
}

.disabled-info {
  margin-top: 8px;
}

:deep(.el-option) {
  padding: 0 12px;
}

:deep(.el-option.hover) {
  background-color: #f5f7fa;
}

:deep(.el-option.selected) {
  background-color: #ecf5ff;
  color: #409eff;
}

:deep(.el-progress-bar__outer) {
  border-radius: 4px;
}

:deep(.el-alert) {
  padding: 8px 12px;
}

:deep(.el-alert__icon) {
  font-size: 14px;
}

:deep(.el-alert__title) {
  font-size: 12px;
}
</style>