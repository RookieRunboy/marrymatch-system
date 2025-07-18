import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AssetsTracker from '../AssetsTracker.vue'

describe('AssetsTracker', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(AssetsTracker, {
      props: {
        modelValue: { savings: 50, otherAssets: [], debt: 0, score: 0 }
      }
    })
    expect(wrapper.find('.assets-tracker').exists()).toBe(true)
    expect(wrapper.find('.savings-input').exists()).toBe(true)
    expect(wrapper.find('.other-assets').exists()).toBe(true)
    expect(wrapper.find('.debt-input').exists()).toBe(true)
  })

  it('calculates savings score correctly', async () => {
    const wrapper = mount(AssetsTracker, {
      props: {
        modelValue: { savings: 50, otherAssets: [], debt: 0, score: 0 }
      }
    })
    
    // 50万存款应得60分
    expect(wrapper.vm.savingsScore).toBe(60)
    
    // 更新存款金额
    await wrapper.vm.handleSavingsChange(100)
    
    // 100万存款应得70分
    expect(wrapper.vm.savingsScore).toBe(70)
  })

  it('calculates net worth correctly', async () => {
    const wrapper = mount(AssetsTracker, {
      props: {
        modelValue: { 
          savings: 100, 
          otherAssets: [
            { type: 'stocks', label: '股票', value: 50 }
          ], 
          debt: 30, 
          score: 0 
        }
      }
    })
    
    // 净资产 = 100 + 50 - 30 = 120万
    expect(wrapper.vm.netWorth).toBe(120)
  })

  it('adds and removes other assets correctly', async () => {
    const wrapper = mount(AssetsTracker, {
      props: {
        modelValue: { savings: 50, otherAssets: [], debt: 0, score: 0 }
      }
    })
    
    // 添加资产前
    expect(wrapper.vm.otherAssets.length).toBe(0)
    
    // 设置新资产类型
    wrapper.vm.newAssetType = 'stocks'
    
    // 添加资产
    await wrapper.vm.addAsset()
    
    // 添加资产后
    expect(wrapper.vm.otherAssets.length).toBe(1)
    expect(wrapper.vm.otherAssets[0].type).toBe('stocks')
    
    // 移除资产
    await wrapper.vm.removeAsset(0)
    
    // 移除资产后
    expect(wrapper.vm.otherAssets.length).toBe(0)
  })

  it('applies debt penalty correctly', async () => {
    const wrapper = mount(AssetsTracker, {
      props: {
        modelValue: { savings: 100, otherAssets: [], debt: 0, score: 0 }
      }
    })
    
    // 无负债时的评分
    const initialScore = wrapper.vm.assetsScore
    
    // 添加负债
    await wrapper.vm.handleDebtChange(60)
    
    // 负债率 = 60 / 100 = 0.6，应该有10分惩罚
    expect(wrapper.vm.assetsScore).toBe(initialScore - 10)
  })

  it('emits update:modelValue event when values change', async () => {
    const wrapper = mount(AssetsTracker, {
      props: {
        modelValue: { savings: 50, otherAssets: [], debt: 0, score: 0 }
      }
    })
    
    await wrapper.vm.handleSavingsChange(100)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0].savings).toBe(100)
  })
})