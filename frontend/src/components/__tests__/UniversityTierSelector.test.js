import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UniversityTierSelector from '../UniversityTierSelector.vue'
import { UNIVERSITY_TIER_OPTIONS } from '@/constants/formDefaults.js'

describe('UniversityTierSelector', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(UniversityTierSelector)
    expect(wrapper.find('.university-tier-selector').exists()).toBe(true)
    expect(wrapper.find('.el-select').exists()).toBe(true)
  })

  it('is disabled when education is not bachelor, master, or phd', async () => {
    const wrapper = mount(UniversityTierSelector, {
      props: {
        education: 'high_school',
        modelValue: ''
      }
    })
    
    expect(wrapper.find('.el-select').attributes('disabled')).toBe('true')
    expect(wrapper.find('.disabled-info').exists()).toBe(true)
  })

  it('is enabled when education is bachelor, master, or phd', async () => {
    const wrapper = mount(UniversityTierSelector, {
      props: {
        education: 'bachelor',
        modelValue: ''
      }
    })
    
    expect(wrapper.find('.el-select').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.disabled-info').exists()).toBe(false)
  })

  it('emits update:modelValue event when selection changes', async () => {
    const wrapper = mount(UniversityTierSelector, {
      props: {
        education: 'bachelor',
        modelValue: ''
      }
    })
    
    await wrapper.vm.handleChange('qingbei')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['qingbei'])
  })

  it('displays the correct score for selected option', async () => {
    const wrapper = mount(UniversityTierSelector, {
      props: {
        education: 'bachelor',
        modelValue: 'qingbei'
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    // 检查是否显示了正确的标签
    const selectedInfo = wrapper.find('.selected-info')
    expect(selectedInfo.exists()).toBe(true)
    expect(selectedInfo.find('.el-tag').text()).toBe('清华北大')
    
    // 检查进度条
    expect(wrapper.find('.score-progress').exists()).toBe(true)
  })

  it('clears selection when education changes to non-degree level', async () => {
    const wrapper = mount(UniversityTierSelector, {
      props: {
        education: 'bachelor',
        modelValue: 'qingbei'
      }
    })
    
    // 模拟学历变化
    await wrapper.setProps({ education: 'high_school' })
    
    // 检查是否触发了清空选择的事件
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([''])
  })
})