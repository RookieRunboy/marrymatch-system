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
    
    expect(wrapper.find('.el-select').attributes('disabled')).toBe('false')
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

  it('has correct selected option when modelValue is set', async () => {
    const wrapper = mount(UniversityTierSelector, {
      props: {
        education: 'bachelor',
        modelValue: 'qingbei'
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    // 检查选中的值是否正确
    expect(wrapper.vm.selectedValue).toBe('qingbei')
    expect(wrapper.vm.selectedOption).toBeDefined()
    expect(wrapper.vm.selectedOption.value).toBe('qingbei')
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