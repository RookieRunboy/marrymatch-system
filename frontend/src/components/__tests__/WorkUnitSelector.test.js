import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import WorkUnitSelector from '../WorkUnitSelector.vue'
import { WORK_UNIT_OPTIONS } from '@/constants/formDefaults.js'

describe('WorkUnitSelector', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(WorkUnitSelector)
    expect(wrapper.find('.work-unit-selector').exists()).toBe(true)
    expect(wrapper.find('.el-select').exists()).toBe(true)
  })

  it('emits update:modelValue event when selection changes', async () => {
    const wrapper = mount(WorkUnitSelector)
    await wrapper.vm.handleChange('central_gov')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['central_gov'])
  })

  it('displays the correct option for selected value', async () => {
    const wrapper = mount(WorkUnitSelector, {
      props: {
        modelValue: 'central_gov'
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    // 检查选中的选项
    const selectedOption = wrapper.vm.selectedOption
    expect(selectedOption).toBeTruthy()
    expect(selectedOption.value).toBe('central_gov')
  })

  it('groups options by category', () => {
    const wrapper = mount(WorkUnitSelector)
    const groupedOptions = wrapper.vm.groupedOptions
    
    // 检查是否按类别分组
    expect(groupedOptions.length).toBeGreaterThan(0)
    expect(groupedOptions[0].category).toBe('政府机关')
    
    // 检查每个组内的选项是否按系数排序
    const govOptions = groupedOptions[0].options
    for (let i = 0; i < govOptions.length - 1; i++) {
      expect(govOptions[i].multiplier).toBeGreaterThanOrEqual(govOptions[i + 1].multiplier)
    }
  })
})