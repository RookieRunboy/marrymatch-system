import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HousingStatusSelector from '../HousingStatusSelector.vue'
import { HOUSING_STATUS_OPTIONS } from '@/constants/formDefaults.js'

describe('HousingStatusSelector', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(HousingStatusSelector, {
      props: {
        modelValue: { status: '', location: '', score: 0 }
      }
    })
    expect(wrapper.find('.housing-status-selector').exists()).toBe(true)
    expect(wrapper.find('.housing-radio-group').exists()).toBe(true)
  })

  it('displays all housing status options', () => {
    const wrapper = mount(HousingStatusSelector, {
      props: {
        modelValue: { status: '', location: '', score: 0 }
      }
    })
    const options = wrapper.findAll('.housing-radio')
    expect(options.length).toBe(HOUSING_STATUS_OPTIONS.length)
  })

  it('emits update:modelValue event when selection changes', async () => {
    const wrapper = mount(HousingStatusSelector, {
      props: {
        modelValue: { status: '', location: '', score: 0 }
      }
    })
    
    await wrapper.vm.handleChange('beijing_house_inner')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0].status).toBe('beijing_house_inner')
  })

  it('shows location selector for Beijing housing options', async () => {
    const wrapper = mount(HousingStatusSelector, {
      props: {
        modelValue: { status: 'beijing_house_inner', location: '', score: 0 }
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    // 检查是否显示了位置选择器
    expect(wrapper.find('.location-selector').exists()).toBe(true)
  })

  it('does not show location selector for non-Beijing housing options', async () => {
    const wrapper = mount(HousingStatusSelector, {
      props: {
        modelValue: { status: 'rent', location: '', score: 0 }
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    // 检查是否不显示位置选择器
    expect(wrapper.find('.location-selector').exists()).toBe(false)
  })

  it('calculates final housing score correctly', async () => {
    const wrapper = mount(HousingStatusSelector, {
      props: {
        modelValue: { status: 'beijing_house_inner', location: 'dongcheng', score: 0 }
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    // 北京环内房产基础分100，东城区位置修饰符+15%，最终分数应为115
    expect(wrapper.vm.finalHousingScore).toBe(115)
  })
})