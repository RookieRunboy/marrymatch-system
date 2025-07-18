<template>
  <div class="housing-status-selector">
    <el-radio-group v-model="selectedValue" @change="handleChange" class="housing-radio-group">
      <el-radio 
        v-for="option in housingOptions" 
        :key="option.value" 
        :label="option.value"
        class="housing-radio"
      >
        <div class="housing-option-content">
          <span class="housing-option-label">{{ option.label }}</span>
        </div>
      </el-radio>
    </el-radio-group>
    
    <!-- 住房位置选择（仅当选择北京房产时显示） -->
    <div v-if="showLocationSelector" class="location-selector">
      <el-divider content-position="left">房产位置</el-divider>
      <el-form-item label="所在区域">
        <el-select v-model="location" placeholder="请选择区域" @change="handleLocationChange">
          <el-option-group
            v-for="group in locationGroups"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { HOUSING_STATUS_OPTIONS } from '@/constants/formDefaults.js'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      status: '',
      location: '',
      score: 0
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const housingOptions = ref(HOUSING_STATUS_OPTIONS)
const location = ref(props.modelValue.location || '')

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue.location !== location.value) {
    location.value = newValue.location || ''
  }
}, { deep: true })

const selectedValue = computed({
  get: () => props.modelValue.status,
  set: (value) => {
    const option = housingOptions.value.find(opt => opt.value === value)
    const newValue = {
      status: value,
      location: isBeiJingHousing(value) ? location.value : '',
      score: option ? option.score : 0
    }
    emit('update:modelValue', newValue)
  }
})

// 当前选中的选项详情
const selectedOption = computed(() => {
  return housingOptions.value.find(option => option.value === selectedValue.value)
})

// 是否显示位置选择器
const showLocationSelector = computed(() => {
  return isBeiJingHousing(selectedValue.value)
})

// 位置调整系数
const locationModifier = computed(() => {
  if (!showLocationSelector.value || !location.value) {
    return 0
  }
  
  const locationOption = locationGroups.value
    .flatMap(group => group.options)
    .find(opt => opt.value === location.value)
  
  return locationOption ? locationOption.modifier : 0
})

// 移除评分计算，仅在匹配计算后显示

// 位置分组
const locationGroups = ref([
  {
    label: '核心城区',
    options: [
      { label: '东城区', value: 'dongcheng', modifier: 15 },
      { label: '西城区', value: 'xicheng', modifier: 15 },
      { label: '朝阳区', value: 'chaoyang', modifier: 10 },
      { label: '海淀区', value: 'haidian', modifier: 10 },
      { label: '丰台区', value: 'fengtai', modifier: 5 }
    ]
  },
  {
    label: '城市副中心',
    options: [
      { label: '通州区', value: 'tongzhou', modifier: 0 }
    ]
  },
  {
    label: '远郊区县',
    options: [
      { label: '昌平区', value: 'changping', modifier: -5 },
      { label: '大兴区', value: 'daxing', modifier: -5 },
      { label: '顺义区', value: 'shunyi', modifier: -10 },
      { label: '房山区', value: 'fangshan', modifier: -10 },
      { label: '门头沟区', value: 'mentougou', modifier: -15 },
      { label: '平谷区', value: 'pinggu', modifier: -15 },
      { label: '怀柔区', value: 'huairou', modifier: -15 },
      { label: '密云区', value: 'miyun', modifier: -20 },
      { label: '延庆区', value: 'yanqing', modifier: -20 }
    ]
  }
])

// 判断是否为北京房产
function isBeiJingHousing(status) {
  return ['beijing_house_inner', 'beijing_house_outer', 'beijing_house_loan'].includes(status)
}

const handleChange = (value) => {
  // 如果切换到非北京房产，清空位置
  if (!isBeiJingHousing(value)) {
    location.value = ''
  }
  
  const option = housingOptions.value.find(opt => opt.value === value)
  const newValue = {
    status: value,
    location: isBeiJingHousing(value) ? location.value : '',
    score: option ? option.score : 0
  }
  emit('update:modelValue', newValue)
}

const handleLocationChange = (value) => {
  location.value = value
  
  const option = housingOptions.value.find(opt => opt.value === selectedValue.value)
  const newValue = {
    status: selectedValue.value,
    location: value,
    score: option ? option.score : 0 // 移除评分计算，仅传递基础分数
  }
  emit('update:modelValue', newValue)
}

// 移除不再使用的评分相关函数
</script>

<style scoped>
.housing-status-selector {
  width: 100%;
}

.housing-radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.housing-radio {
  margin-right: 0 !important;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.housing-radio.is-checked {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.housing-option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.housing-option-label {
  flex: 1;
}

.location-selector {
  margin-top: 16px;
}

:deep(.el-radio__input) {
  align-self: flex-start;
  margin-top: 2px;
}

:deep(.el-radio__label) {
  padding-left: 8px;
  width: 100%;
}
</style>