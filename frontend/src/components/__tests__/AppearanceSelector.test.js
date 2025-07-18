import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppearanceSelector from '../AppearanceSelector.vue'
import { APPEARANCE_OPTIONS } from '@/constants/formDefaults.js'

describe('AppearanceSelector', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(AppearanceSelector)
    expect(wrapper.find('.appearance-selector').exists()).toBe(true)
    expect(wrapper.find('.appearance-radio-group').exists()).toBe(true)
  })

  it('displays all appearance options', () => {
    const wrapper = mount(AppearanceSelector)
    const options = wrapper.findAll('.appearance-radio-button')
    expect(options.length).toBe(APPEARANCE_OPTIONS.length)
  })

  it('emits update:modelValue event when selection changes', async () => {
    const wrapper = mount(AppearanceSelector)
    await wrapper.vm.handleChange('excellent')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['excellent'])
  })

  it('displays the correct score for selected option', async () => {
    const wrapper = mount(AppearanceSelector, {
      props: {
        modelValue: 'excellent'
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    // 检查是否显示了正确的标签
    const selectedInfo = wrapper.find('.selected-info')
    expect(selectedInfo.exists()).toBe(true)
    expect(selectedInfo.find('.el-tag').text()).toBe('优秀')
    
    // 检查进度条
    expect(wrapper.find('.score-progress').exists()).toBe(true)
  })

  it('highlights the selected option in the guide scale', async () => {
    const wrapper = mount(AppearanceSelector, {
      props: {
        modelValue: 'excellent'
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    // 检查是否高亮显示了选中的选项
    const activeItem = wrapper.find('.guide-item-active')
    expect(activeItem.exists()).toBe(true)
    expect(activeItem.find('.guide-label').text()).toBe('优秀')
  })
})