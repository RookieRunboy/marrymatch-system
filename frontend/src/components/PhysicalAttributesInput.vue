<template>
  <div class="physical-attributes-input">
    <div class="input-row">
      <div class="input-group">
        <label>身高 (cm)</label>
        <el-input-number 
          v-model="height" 
          :min="140" 
          :max="220" 
          :step="1" 
          @change="handleHeightChange"
          class="height-input"
        />
      </div>
      <div class="input-group">
        <label>体重 (kg)</label>
        <el-input-number 
          v-model="weight" 
          :min="35" 
          :max="150" 
          :step="0.5" 
          :precision="1"
          @change="handleWeightChange"
          class="weight-input"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  gender: {
    type: String,
    required: true,
    validator: (value) => ['male', 'female'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

// 从props中提取身高和体重
const height = ref(props.modelValue.height || 170)
const weight = ref(props.modelValue.weight || 60)

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue.height !== height.value) {
    height.value = newValue.height || 170
  }
  if (newValue.weight !== weight.value) {
    weight.value = newValue.weight || 60
  }
}, { deep: true })

// 计算BMI
const bmi = computed(() => {
  if (!height.value || !weight.value || height.value <= 0 || weight.value <= 0) {
    return 0
  }
  return weight.value / ((height.value / 100) ** 2)
})

// 保留BMI计算用于数据传递，但不显示

// 处理身高变化
const handleHeightChange = (value) => {
  emit('update:modelValue', { ...props.modelValue, height: value, bmi: bmi.value })
}

// 处理体重变化
const handleWeightChange = (value) => {
  emit('update:modelValue', { ...props.modelValue, weight: value, bmi: bmi.value })
}


</script>

<style scoped>
.physical-attributes-input {
  width: 100%;
}

.input-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  color: #606266;
}

.height-input,
.weight-input {
  width: 100%;
}

/* 保持简洁的样式，移除不再使用的评分相关样式 */
</style>