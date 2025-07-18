<template>
  <div class="appearance-selector">
    <div class="appearance-options">
      <el-radio-group v-model="selectedValue" @change="handleChange" class="appearance-radio-group">
        <el-radio-button 
          v-for="option in appearanceOptions" 
          :key="option.value" 
          :label="option.value"
          class="appearance-radio-button"
        >
          {{ option.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
    
    <!-- 照片上传区域（未来功能） -->
    <div class="photo-upload-placeholder">
      <el-divider content-position="left">照片上传（即将推出）</el-divider>
      <el-empty description="照片上传功能即将推出，敬请期待！">
        <el-button type="primary" disabled>上传照片</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { APPEARANCE_OPTIONS } from '@/constants/formDefaults.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const appearanceOptions = ref(APPEARANCE_OPTIONS)

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

// 当前选中的选项详情
const selectedOption = computed(() => {
  return appearanceOptions.value.find(option => option.value === selectedValue.value)
})

const handleChange = (value) => {
  emit('update:modelValue', value)
}

// 移除不再使用的评分相关函数
</script>

<style scoped>
.appearance-selector {
  width: 100%;
}

.appearance-radio-group {
  display: flex;
  width: 100%;
  margin-bottom: 16px;
}

.appearance-radio-button {
  flex: 1;
  text-align: center;
}

.appearance-confirmation {
  margin-top: 16px;
}

.photo-upload-placeholder {
  margin-top: 24px;
}

:deep(.el-radio-button__inner) {
  padding: 8px 12px;
}

:deep(.el-empty) {
  padding: 20px 0;
}
</style>