import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CoupleComparison from '../CoupleComparison.vue'
import { getScoreLevel, getMatchLevel } from '@/services/scoreCalculator'

// Mock Chart.js
vi.mock('chart.js/auto', () => {
  return {
    default: class Chart {
      constructor() {
        this.destroyed = false
      }
      destroy() {
        this.destroyed = true
      }
    }
  }
})

describe('CoupleComparison', () => {
  // 测试数据
  const mockProps = {
    maleScore: 85,
    femaleScore: 75,
    matchScore: 80,
    maleDetailedScores: {
      workIncome: 90,
      education: 85,
      physical: 70,
      assets: 80,
      family: 75
    },
    femaleDetailedScores: {
      workIncome: 70,
      education: 90,
      physical: 85,
      assets: 65,
      family: 70
    },
    maleData: {
      age: 30,
      gender: 'male',
      salary: 3,
      workUnit: 'central_gov',
      education: 'master',
      universityTier: 'c985'
    },
    femaleData: {
      age: 28,
      gender: 'female',
      salary: 2,
      workUnit: 'top_university',
      education: 'phd',
      universityTier: 'c211'
    }
  }

  beforeEach(() => {
    // 清除所有模拟
    vi.clearAllMocks()
  })

  it('渲染正确的组件结构', () => {
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': true,
          'el-button': true,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    expect(wrapper.find('.couple-comparison').exists()).toBe(true)
    expect(wrapper.find('.comparison-header').exists()).toBe(true)
    expect(wrapper.find('.overall-comparison').exists()).toBe(true)
    expect(wrapper.find('.dimensions-comparison').exists()).toBe(true)
  })

  it('正确显示男女双方的评分', () => {
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': false,
          'el-button': true,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    const maleScoreElement = wrapper.find('.person-score:first-child .score-value')
    const femaleScoreElement = wrapper.find('.person-score:last-child .score-value')
    
    expect(maleScoreElement.text()).toBe(mockProps.maleScore.toString())
    expect(femaleScoreElement.text()).toBe(mockProps.femaleScore.toString())
  })

  it('正确显示匹配度评分', () => {
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': false,
          'el-button': true,
          'el-icon': true,
          'el-progress': false,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    const matchText = wrapper.find('.match-text strong')
    expect(matchText.text()).toBe(mockProps.matchScore.toString() + '%')
  })

  it('正确计算维度对比数据', () => {
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': true,
          'el-button': true,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    const dimensionsComparison = wrapper.vm.dimensionsComparison
    
    // 检查工作收入维度
    const workIncomeDimension = dimensionsComparison.find(d => d.key === 'workIncome')
    expect(workIncomeDimension.maleScore).toBe(mockProps.maleDetailedScores.workIncome)
    expect(workIncomeDimension.femaleScore).toBe(mockProps.femaleDetailedScores.workIncome)
    expect(workIncomeDimension.winner).toBe('male')
    expect(workIncomeDimension.difference).toBe(20)
    
    // 检查教育背景维度
    const educationDimension = dimensionsComparison.find(d => d.key === 'education')
    expect(educationDimension.winner).toBe('female')
  })

  it('正确生成兼容性建议', () => {
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': true,
          'el-button': true,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    const suggestions = wrapper.vm.compatibilitySuggestions
    expect(suggestions.length).toBeGreaterThan(0)
    
    // 检查是否有基于总分差距的建议
    const scoreDiffSuggestion = suggestions.find(s => 
      s.title.includes('差距') || s.content.includes('差距'))
    expect(scoreDiffSuggestion).toBeDefined()
  })

  it('正确生成男女双方的改进建议', () => {
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': true,
          'el-button': true,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    const maleImprovements = wrapper.vm.maleImprovements
    const femaleImprovements = wrapper.vm.femaleImprovements
    
    expect(maleImprovements.length).toBeGreaterThan(0)
    expect(femaleImprovements.length).toBeGreaterThan(0)
  })

  it('导出对比报告功能正常工作', async () => {
    const mockMessage = {
      success: vi.fn()
    }
    
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': false,
          'el-button': false,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        },
        mocks: {
          $message: mockMessage
        }
      }
    })
    
    const exportButton = wrapper.find('.header-right .el-button:first-child')
    await exportButton.trigger('click')
    
    expect(mockMessage.success).toHaveBeenCalledWith('对比报告导出功能开发中...')
  })

  it('分享对比结果功能正常工作', async () => {
    const mockMessage = {
      success: vi.fn()
    }
    
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': false,
          'el-button': false,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        },
        mocks: {
          $message: mockMessage
        }
      }
    })
    
    const shareButton = wrapper.find('.header-right .el-button:last-child')
    await shareButton.trigger('click')
    
    expect(mockMessage.success).toHaveBeenCalledWith('分享功能开发中...')
  })

  it('正确初始化兼容性雷达图', async () => {
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': true,
          'el-button': true,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    // 模拟canvas元素
    const canvas = document.createElement('canvas')
    vi.spyOn(wrapper.vm.$refs, 'compatibilityRadar', 'get').mockReturnValue(canvas)
    
    // 调用初始化方法
    wrapper.vm.initCompatibilityRadar()
    
    // 等待异步操作完成
    await flushPromises()
    
    // 验证Chart.js是否被正确初始化
    expect(wrapper.vm.radarChart).toBeDefined()
  })

  it('在组件卸载时销毁图表', async () => {
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': true,
          'el-button': true,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    // 创建模拟图表
    wrapper.vm.radarChart = {
      destroy: vi.fn()
    }
    
    // 触发组件卸载
    wrapper.unmount()
    
    // 验证图表是否被销毁
    expect(wrapper.vm.radarChart.destroy).toHaveBeenCalled()
  })

  it('正确处理Chart.js加载失败的情况', async () => {
    // 模拟Chart.js导入失败
    vi.mock('chart.js/auto', () => {
      return {
        default: vi.fn().mockImplementation(() => {
          throw new Error('Chart.js加载失败')
        })
      }
    })
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const wrapper = mount(CoupleComparison, {
      props: mockProps,
      global: {
        stubs: {
          'el-card': true,
          'el-button': true,
          'el-icon': true,
          'el-progress': true,
          'el-tag': true,
          'el-row': true,
          'el-col': true
        }
      }
    })
    
    // 模拟canvas元素和上下文
    const canvas = document.createElement('canvas')
    const ctx = {
      fillStyle: '',
      font: '',
      textAlign: '',
      fillText: vi.fn()
    }
    canvas.getContext = vi.fn().mockReturnValue(ctx)
    
    vi.spyOn(wrapper.vm.$refs, 'compatibilityRadar', 'get').mockReturnValue(canvas)
    
    // 调用初始化方法
    wrapper.vm.initCompatibilityRadar()
    
    // 等待异步操作完成
    await flushPromises()
    
    // 验证是否正确处理了错误
    expect(consoleSpy).toHaveBeenCalled()
    expect(ctx.fillText).toHaveBeenCalledWith('兼容性雷达图加载失败', expect.any(Number), expect.any(Number))
    
    consoleSpy.mockRestore()
  })
})