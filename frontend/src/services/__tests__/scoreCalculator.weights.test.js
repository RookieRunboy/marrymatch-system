import { describe, it, expect } from 'vitest'
import {
  PHASE1_SCORE_WEIGHTS,
  WEIGHT_VALIDATION_RULES,
  DEFAULT_WEIGHTS,
  validateWeights,
  normalizeWeights,
  getWeightsDescription,
  calculatePersonScoreWithWeights,
  calculateDetailedScoresWithWeights
} from '../scoreCalculator.js'

describe('权重系统测试', () => {
  describe('权重验证功能', () => {
    it('应该验证有效的权重配置', () => {
      const validWeights = {
        workIncome: 0.40,
        education: 0.25,
        physicalAttributes: 0.15,
        assets: 0.15,
        familyBackground: 0.05
      }
      
      const result = validateWeights(validWeights)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('应该检测缺少必需字段', () => {
      const invalidWeights = {
        workIncome: 0.40,
        education: 0.25
        // 缺少其他字段
      }
      
      const result = validateWeights(invalidWeights)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(error => error.includes('缺少必需的权重字段'))).toBe(true)
    })

    it('应该检测无效的权重值类型', () => {
      const invalidWeights = {
        workIncome: 'invalid',
        education: 0.25,
        physicalAttributes: 0.15,
        assets: 0.15,
        familyBackground: 0.05
      }
      
      const result = validateWeights(invalidWeights)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('必须是有效数字'))).toBe(true)
    })

    it('应该检测权重值超出范围', () => {
      const invalidWeights = {
        workIncome: 0.70, // 超过最大值60%
        education: 0.25,
        physicalAttributes: 0.15,
        assets: 0.15,
        familyBackground: 0.05
      }
      
      const result = validateWeights(invalidWeights)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('不能大于'))).toBe(true)
    })

    it('应该检测权重总和不为100%', () => {
      const invalidWeights = {
        workIncome: 0.30,
        education: 0.20,
        physicalAttributes: 0.15,
        assets: 0.15,
        familyBackground: 0.05
      } // 总和为85%
      
      const result = validateWeights(invalidWeights)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('权重总和必须为100%'))).toBe(true)
    })
  })

  describe('权重标准化功能', () => {
    it('应该返回有效权重配置不变', () => {
      const validWeights = { ...PHASE1_SCORE_WEIGHTS }
      const normalized = normalizeWeights(validWeights)
      
      expect(normalized).toEqual(validWeights)
    })

    it('应该标准化权重总和不为100%的配置', () => {
      const unnormalizedWeights = {
        workIncome: 0.40,
        education: 0.25,
        physicalAttributes: 0.15,
        assets: 0.15,
        familyBackground: 0.03 // 总和为98%
      }
      
      const normalized = normalizeWeights(unnormalizedWeights)
      const totalWeight = Object.values(normalized).reduce((sum, weight) => sum + weight, 0)
      
      expect(Math.abs(totalWeight - 1.0)).toBeLessThan(WEIGHT_VALIDATION_RULES.tolerance)
    })

    it('应该在验证失败时返回默认权重', () => {
      const invalidWeights = {
        workIncome: 'invalid'
      }
      
      const normalized = normalizeWeights(invalidWeights)
      expect(normalized).toEqual(DEFAULT_WEIGHTS)
    })
  })

  describe('权重描述功能', () => {
    it('应该生成正确的权重描述', () => {
      const weights = { ...PHASE1_SCORE_WEIGHTS }
      const description = getWeightsDescription(weights)
      
      expect(description.workIncome.percentage).toBe('40.0%')
      expect(description.education.percentage).toBe('25.0%')
      expect(description.physicalAttributes.percentage).toBe('15.0%')
      expect(description.assets.percentage).toBe('15.0%')
      expect(description.familyBackground.percentage).toBe('5.0%')
      
      expect(description.workIncome.description).toContain('工作收入权重')
      expect(description.education.description).toContain('教育背景权重')
    })
  })

  describe('自定义权重计算功能', () => {
    const testPerson = {
      gender: 'male',
      height: 175,
      weight: 70,
      salary: 2,
      workUnit: 'private_company',
      education: 'bachelor',
      universityTier: 'tier1',
      appearance: 'above_average',
      housingStatus: 'rent',
      savings: 20,
      parentsIncome: 1,
      onlyChild: false
    }

    it('应该使用自定义权重计算个人得分', () => {
      const customWeights = {
        workIncome: 0.50, // 增加工作收入权重
        education: 0.20,
        physicalAttributes: 0.10,
        assets: 0.10,
        familyBackground: 0.10
      }
      
      const defaultScore = calculatePersonScoreWithWeights(testPerson, PHASE1_SCORE_WEIGHTS)
      const customScore = calculatePersonScoreWithWeights(testPerson, customWeights)
      
      // 由于增加了工作收入权重，分数可能会有所不同
      expect(typeof customScore).toBe('number')
      expect(customScore).toBeGreaterThan(0)
      expect(customScore).toBeLessThanOrEqual(100)
    })

    it('应该使用自定义权重计算详细评分', () => {
      const customWeights = {
        workIncome: 0.30,
        education: 0.30, // 增加教育权重
        physicalAttributes: 0.15,
        assets: 0.15,
        familyBackground: 0.10
      }
      
      const detailedScores = calculateDetailedScoresWithWeights(testPerson, customWeights)
      
      expect(detailedScores).toHaveProperty('total')
      expect(detailedScores).toHaveProperty('workIncome')
      expect(detailedScores).toHaveProperty('education')
      expect(detailedScores).toHaveProperty('physical')
      expect(detailedScores).toHaveProperty('assets')
      expect(detailedScores).toHaveProperty('family')
      expect(detailedScores).toHaveProperty('weights')
      
      // 验证权重已被标准化
      const totalWeight = Object.values(detailedScores.weights).reduce((sum, weight) => sum + weight, 0)
      expect(Math.abs(totalWeight - 1.0)).toBeLessThan(WEIGHT_VALIDATION_RULES.tolerance)
    })
  })

  describe('默认权重配置', () => {
    it('应该确保默认权重符合第一阶段要求', () => {
      expect(DEFAULT_WEIGHTS.workIncome).toBe(0.40) // 工作收入40%
      expect(DEFAULT_WEIGHTS.education).toBe(0.25)  // 教育背景25%
      expect(DEFAULT_WEIGHTS.physicalAttributes).toBe(0.15) // 外在条件15%
      expect(DEFAULT_WEIGHTS.assets).toBe(0.15)     // 资产住房15%
      expect(DEFAULT_WEIGHTS.familyBackground).toBe(0.05)   // 家庭背景5%
      
      // 验证总权重为100%
      const totalWeight = Object.values(DEFAULT_WEIGHTS).reduce((sum, weight) => sum + weight, 0)
      expect(Math.abs(totalWeight - 1.0)).toBeLessThan(WEIGHT_VALIDATION_RULES.tolerance)
    })

    it('应该验证权重验证规则的合理性', () => {
      expect(WEIGHT_VALIDATION_RULES.minWeight).toBe(0.01) // 最小1%
      expect(WEIGHT_VALIDATION_RULES.maxWeight).toBe(0.60) // 最大60%
      expect(WEIGHT_VALIDATION_RULES.totalWeight).toBe(1.00) // 总权重100%
      expect(WEIGHT_VALIDATION_RULES.tolerance).toBe(0.001) // 容差0.1%
    })
  })
})