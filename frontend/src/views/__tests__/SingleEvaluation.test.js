import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import SingleEvaluation from '../SingleEvaluation.vue'
import { calculateDetailedScores, generateMarketValueAnalysis } from '@/services/scoreCalculator'

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn()
  }
}))

// Mock services
vi.mock('@/services/scoreCalculator', () => ({
  calculateDetailedScores: vi.fn(),
  generateMarketValueAnalysis: vi.fn(),
  getScoreLevel: vi.fn()
}))

// Mock components
vi.mock('@/components/PersonForm.vue', () => ({
  default: {
    name: 'PersonForm',
    template: '<div>PersonForm Mock</div>',
    props: ['modelValue', 'title', 'gender', 'isSingleMode'],
    emits: ['update:modelValue']
  }
}))

vi.mock('@/components/ScoreCard.vue', () => ({
  default: {
    name: 'ScoreCard',
    template: '<div>ScoreCard Mock</div>',
    props: ['title', 'score', 'icon', 'detailedScores', 'percentile', 'improvementSuggestions', 'competitiveAdvantages']
  }
}))

vi.mock('@/components/AnalysisReport.vue', () => ({
  default: {
    name: 'AnalysisReport',
    template: '<div>AnalysisReport Mock</div>',
    props: ['personalScore', 'detailedScores', 'personalData', 'isMatchMode']
  }
}))

vi.mock('@/components/MarketValueAnalysis.vue', () => ({
  default: {
    name: 'MarketValueAnalysis',
    template: '<div>MarketValueAnalysis Mock</div>',
    props: ['person', 'analysis']
  }
}))

describe('SingleEvaluation', () => {
  let wrapper

  const mockPersonData = {
    gender: 'male',
    age: 28,
    height: 175,
    weight: 70,
    salary: 1.5,
    workUnit: 'private_company',
    education: 'bachelor',
    universityTier: 'tier1',
    appearance: 'above_average',
    housingStatus: 'rent',
    savings: 50,
    parentsIncome: 1.0,
    onlyChild: false
  }

  const mockDetailedScores = {
    total: 75,
    workIncome: 70,
    education: 80,
    physical: 75,
    assets: 60,
    family: 70,
    adjustedIncome: 1.2
  }

  const mockMarketAnalysis = {
    overallScore: 75,
    marketPercentile: 70,
    competitiveAdvantages: ['教育背景优秀'],
    improvementAreas: ['提升工作收入', '改善资产状况'],
    detailedBreakdown: mockDetailedScores
  }

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Setup mock implementations
    calculateDetailedScores.mockReturnValue(mockDetailedScores)
    generateMarketValueAnalysis.mockReturnValue(mockMarketAnalysis)
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      }
    })

    wrapper = mount(SingleEvaluation, {
      global: {
        stubs: {
          'el-card': { template: '<div><slot name="header"></slot><slot></slot></div>' },
          'el-button': { template: '<button><slot></slot></button>' },
          'el-icon': { template: '<span><slot></slot></span>' }
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('.single-evaluation').exists()).toBe(true)
    expect(wrapper.find('.title').text()).toBe('个人评估')
    expect(wrapper.find('.subtitle').text()).toBe('全面评估个人在相亲市场中的竞争力')
  })

  it('shows form section initially', () => {
    expect(wrapper.find('.form-section').exists()).toBe(true)
    expect(wrapper.find('.form-card').exists()).toBe(true)
  })

  it('does not show result section initially', () => {
    expect(wrapper.find('.result-section').exists()).toBe(false)
  })

  it('has correct initial person data', () => {
    const component = wrapper.vm
    expect(component.personData).toEqual(expect.objectContaining({
      gender: 'male',
      age: 25,
      height: 170,
      weight: 65
    }))
  })

  it('computes canEvaluate correctly', async () => {
    const component = wrapper.vm
    
    // Initially should be true with default data
    expect(component.canEvaluate).toBe(true)
    
    // Should be false if required fields are missing
    component.personData.age = null
    await wrapper.vm.$nextTick()
    expect(component.canEvaluate).toBe(false)
  })

  it('computes hasFormData correctly', async () => {
    const component = wrapper.vm
    expect(component.hasFormData).toBeTruthy()
    
    // Should be false with empty data
    component.personData = {}
    await wrapper.vm.$nextTick()
    expect(component.hasFormData).toBe(false)
  })

  it('generates correct person title', () => {
    const component = wrapper.vm
    
    component.personData.gender = 'male'
    expect(component.getPersonTitle()).toBe('男性个人评估')
    
    component.personData.gender = 'female'
    expect(component.getPersonTitle()).toBe('女性个人评估')
  })

  it('handles evaluation correctly', async () => {
    const component = wrapper.vm
    component.personData = mockPersonData
    
    await component.handleEvaluate()
    
    expect(calculateDetailedScores).toHaveBeenCalledWith(mockPersonData)
    expect(generateMarketValueAnalysis).toHaveBeenCalledWith(mockPersonData)
    expect(component.evaluationResult).toEqual({
      detailedScores: mockDetailedScores,
      marketAnalysis: mockMarketAnalysis,
      timestamp: expect.any(String)
    })
    expect(ElMessage.success).toHaveBeenCalledWith('评估完成！')
  })

  it('shows error when evaluation fails', async () => {
    const component = wrapper.vm
    component.personData = { age: null } // Invalid data
    
    await component.handleEvaluate()
    
    expect(ElMessage.error).toHaveBeenCalledWith('请完善必填信息')
  })

  it('shows result section after successful evaluation', async () => {
    const component = wrapper.vm
    component.personData = mockPersonData
    
    await component.handleEvaluate()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.result-section').exists()).toBe(true)
    expect(wrapper.find('.score-overview').exists()).toBe(true)
    expect(wrapper.find('.analysis-section').exists()).toBe(true)
    expect(wrapper.find('.market-analysis').exists()).toBe(true)
  })

  it('generates improvement suggestions correctly', () => {
    const component = wrapper.vm
    component.evaluationResult = {
      detailedScores: {
        workIncome: 60, // Below 70
        education: 85,  // Above 80
        physical: 65,   // Below 70
        assets: 55      // Below 60
      }
    }
    
    const suggestions = component.getImprovementSuggestions()
    
    expect(suggestions).toHaveLength(3)
    expect(suggestions[0].title).toBe('提升工作收入')
    expect(suggestions[1].title).toBe('改善外在形象')
    expect(suggestions[2].title).toBe('积累财富资产')
  })

  it('saves result to localStorage correctly', () => {
    const component = wrapper.vm
    component.personData = mockPersonData
    component.evaluationResult = {
      detailedScores: mockDetailedScores,
      marketAnalysis: mockMarketAnalysis,
      timestamp: '2023-01-01T00:00:00.000Z'
    }
    
    // Mock existing history
    window.localStorage.getItem.mockReturnValue('[]')
    
    component.saveResult()
    
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'singleEvaluationHistory',
      expect.stringContaining('"type":"single"')
    )
    expect(ElMessage.success).toHaveBeenCalledWith('结果已保存到历史记录')
  })

  it('handles share result correctly', async () => {
    const component = wrapper.vm
    component.evaluationResult = {
      detailedScores: { total: 75 },
      marketAnalysis: { marketPercentile: 70 }
    }
    
    // 模拟点击分享按钮
    component.showShareModal = true
    await wrapper.vm.$nextTick()
    
    expect(component.showShareModal).toBe(true)
  })

  it('loads data from localStorage on mount', () => {
    const savedData = JSON.stringify({ age: 30, gender: 'female' })
    window.localStorage.getItem.mockReturnValue(savedData)
    
    const newWrapper = mount(SingleEvaluation, {
      global: {
        stubs: {
          'el-card': { template: '<div><slot name="header"></slot><slot></slot></div>' },
          'el-button': { template: '<button><slot></slot></button>' },
          'el-icon': { template: '<span><slot></slot></span>' }
        }
      }
    })
    
    expect(window.localStorage.getItem).toHaveBeenCalledWith('singleEvaluationForm')
    expect(newWrapper.vm.personData.age).toBe(30)
    expect(newWrapper.vm.personData.gender).toBe('female')
  })
})