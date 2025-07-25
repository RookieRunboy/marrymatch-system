import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  isNativeShareSupported,
  isClipboardSupported,
  generateShareText,
  generateSimpleShareText,
  copyToClipboard,
  shareEvaluationResult
} from '../shareService'

// Mock navigator
const mockNavigator = {
  share: vi.fn(),
  clipboard: {
    writeText: vi.fn()
  }
}

Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true
})

// Mock ElMessage
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('shareService', () => {
  const mockEvaluationResult = {
    detailedScores: {
      total: 85,
      workIncome: 80,
      education: 90,
      physical: 75,
      assets: 70,
      family: 85
    },
    marketAnalysis: {
      marketPercentile: 78
    }
  }

  const mockPersonData = {
    gender: 'male',
    age: 28
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isNativeShareSupported', () => {
    it('should return true when navigator.share is available', () => {
      mockNavigator.share = vi.fn()
      expect(isNativeShareSupported()).toBe(true)
    })

    it('should return false when navigator.share is not available', () => {
      mockNavigator.share = undefined
      expect(isNativeShareSupported()).toBe(false)
    })
  })

  describe('isClipboardSupported', () => {
    it('should return true when clipboard API is available', () => {
      mockNavigator.clipboard = { writeText: vi.fn() }
      expect(isClipboardSupported()).toBe(true)
    })

    it('should return false when clipboard API is not available', () => {
      mockNavigator.clipboard = undefined
      expect(isClipboardSupported()).toBe(false)
    })
  })

  describe('generateShareText', () => {
    it('should generate correct share text for male', () => {
      const result = generateShareText(mockEvaluationResult, mockPersonData)
      
      expect(result).toContain('28岁男生')
      expect(result).toContain('85分')
      expect(result).toContain('超越78%')
      expect(result).toContain('工作收入：80分')
      expect(result).toContain('教育背景：90分')
    })

    it('should generate correct share text for female', () => {
      const femalePersonData = { ...mockPersonData, gender: 'female' }
      const result = generateShareText(mockEvaluationResult, femalePersonData)
      
      expect(result).toContain('28岁女生')
      expect(result).toContain('85分')
    })

    it('should handle missing age', () => {
      const personDataWithoutAge = { gender: 'male' }
      const result = generateShareText(mockEvaluationResult, personDataWithoutAge)
      
      expect(result).toContain('未知岁男生')
    })

    it('should throw error for invalid evaluation result', () => {
      expect(() => {
        generateShareText({}, mockPersonData)
      }).toThrow('评估结果数据不完整')
    })
  })

  describe('generateSimpleShareText', () => {
    it('should generate simple share text', () => {
      const result = generateSimpleShareText(mockEvaluationResult, mockPersonData)
      
      expect(result).toContain('85分')
      expect(result).toContain('超越78%')
      expect(result).toContain('男生')
      expect(result.length).toBeLessThan(100) // 简化版应该更短
    })
  })

  describe('copyToClipboard', () => {
    it('should copy text using clipboard API', async () => {
      mockNavigator.clipboard = { writeText: vi.fn().mockResolvedValue() }
      
      const result = await copyToClipboard('test text')
      
      expect(mockNavigator.clipboard.writeText).toHaveBeenCalledWith('test text')
      expect(result).toBe(true)
    })

    it('should handle clipboard API failure', async () => {
      mockNavigator.clipboard = { writeText: vi.fn().mockRejectedValue(new Error('Failed')) }
      
      // Mock document.execCommand for fallback
      document.execCommand = vi.fn().mockReturnValue(true)
      document.createElement = vi.fn().mockReturnValue({
        value: '',
        style: {},
        focus: vi.fn(),
        select: vi.fn()
      })
      document.body.appendChild = vi.fn()
      document.body.removeChild = vi.fn()
      
      const result = await copyToClipboard('test text')
      
      expect(result).toBe(true)
    })
  })

  describe('shareEvaluationResult', () => {
    it('should use native share when supported', async () => {
      mockNavigator.share = vi.fn().mockResolvedValue()
      
      const result = await shareEvaluationResult(mockEvaluationResult, mockPersonData)
      
      expect(mockNavigator.share).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should fallback to clipboard when native share not supported', async () => {
      mockNavigator.share = undefined
      mockNavigator.clipboard = { writeText: vi.fn().mockResolvedValue() }
      
      const result = await shareEvaluationResult(mockEvaluationResult, mockPersonData)
      
      expect(mockNavigator.clipboard.writeText).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should handle share cancellation', async () => {
      const abortError = new Error('User cancelled')
      abortError.name = 'AbortError'
      mockNavigator.share = vi.fn().mockRejectedValue(abortError)
      mockNavigator.clipboard = { writeText: vi.fn().mockResolvedValue() }
      
      const result = await shareEvaluationResult(mockEvaluationResult, mockPersonData)
      
      // 当原生分享被取消时，会降级到剪贴板复制，所以应该返回true
      expect(result).toBe(true)
      expect(mockNavigator.clipboard.writeText).toHaveBeenCalled()
    })
  })
})