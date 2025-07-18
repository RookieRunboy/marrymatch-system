import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { calculateAllScores } from '@/services/scoreCalculator'
import { DEFAULT_MALE_FORM, DEFAULT_FEMALE_FORM } from '@/constants/formDefaults'

export const useUserStore = defineStore('user', () => {
  // 状态
  const maleForm = ref({ ...DEFAULT_MALE_FORM })
  const femaleForm = ref({ ...DEFAULT_FEMALE_FORM })
  const scores = ref({
    maleScore: 0,
    femaleScore: 0,
    matchScore: 0
  })
  const isCalculated = ref(false)

  // 计算属性
  const hasValidData = computed(() => {
    return maleForm.value.age > 0 && femaleForm.value.age > 0
  })

  const matchLevel = computed(() => {
    if (!isCalculated.value) return ''
    const score = scores.value.matchScore
    if (score >= 90) return '天作之合'
    if (score >= 80) return '非常匹配'
    if (score >= 70) return '比较匹配'
    if (score >= 60) return '一般匹配'
    return '匹配度较低'
  })

  // 动作
  const updateMaleForm = (formData) => {
    maleForm.value = { ...formData }
    isCalculated.value = false
  }

  const updateFemaleForm = (formData) => {
    femaleForm.value = { ...formData }
    isCalculated.value = false
  }

  const calculateScores = () => {
    const result = calculateAllScores(maleForm.value, femaleForm.value)
    scores.value = result
    isCalculated.value = true
    return result
  }

  const resetData = () => {
    maleForm.value = { ...DEFAULT_MALE_FORM }
    femaleForm.value = { ...DEFAULT_FEMALE_FORM }
    scores.value = {
      maleScore: 0,
      femaleScore: 0,
      matchScore: 0
    }
    isCalculated.value = false
  }

  const exportData = () => {
    return {
      maleForm: maleForm.value,
      femaleForm: femaleForm.value,
      scores: scores.value,
      timestamp: new Date().toISOString()
    }
  }

  const importData = (data) => {
    if (data.maleForm) maleForm.value = { ...data.maleForm }
    if (data.femaleForm) femaleForm.value = { ...data.femaleForm }
    if (data.scores) {
      scores.value = { ...data.scores }
      isCalculated.value = true
    }
  }

  return {
    // 状态
    maleForm,
    femaleForm,
    scores,
    isCalculated,
    // 计算属性
    hasValidData,
    matchLevel,
    // 动作
    updateMaleForm,
    updateFemaleForm,
    calculateScores,
    resetData,
    exportData,
    importData
  }
})