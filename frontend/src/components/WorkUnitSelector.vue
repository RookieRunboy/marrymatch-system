<template>
  <div class="work-unit-selector">
    <el-select 
      v-model="selectedValue" 
      placeholder="请选择工作单位类型" 
      @change="handleChange"
      class="work-unit-select"
      filterable
    >
      <el-option-group
        v-for="group in groupedOptions"
        :key="group.category"
        :label="group.category"
      >
        <el-option
          v-for="option in group.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-option-group>
    </el-select>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { WORK_UNIT_OPTIONS } from '@/constants/formDefaults.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const workUnitOptions = ref(WORK_UNIT_OPTIONS)
// 移除不再使用的评分相关变量

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

// 按类别分组的选项
const groupedOptions = computed(() => {
  const groups = {}
  
  workUnitOptions.value.forEach(option => {
    if (!groups[option.category]) {
      groups[option.category] = {
        category: option.category,
        options: []
      }
    }
    groups[option.category].options.push(option)
  })
  
  // 按系数排序每个组内的选项
  Object.values(groups).forEach(group => {
    group.options.sort((a, b) => b.multiplier - a.multiplier)
  })
  
  // 按组的重要性排序
  const categoryOrder = ['政府机关', '国有企业', '教育机构', '医疗机构', '私营企业', '其他']
  return categoryOrder.map(category => groups[category]).filter(Boolean)
})

// 当前选中的选项详情
const selectedOption = computed(() => {
  return workUnitOptions.value.find(option => option.value === selectedValue.value)
})

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.work-unit-selector {
  width: 100%;
}

.work-unit-select {
  width: 100%;
}

.work-unit-confirmation {
  margin-top: 8px;
}

:deep(.el-select-group__title) {
  font-weight: 600;
  color: #303133;
  padding-left: 12px;
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

:deep(.el-rate__icon) {
  margin-right: 2px;
  font-size: 14px;
}
</style>