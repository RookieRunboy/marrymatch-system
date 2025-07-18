import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PhysicalAttributesInput from '../PhysicalAttributesInput.vue'

describe('PhysicalAttributesInput', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(PhysicalAttributesInput, {
      props: {
        modelValue: { height: 170, weight: 60 },
        gender: 'male'
      }
    })
    expect(wrapper.find('.physical-attributes-input').exists()).toBe(true)
    expect(wrapper.find('.height-input').exists()).toBe(true)
    expect(wrapper.find('.weight-input').exists()).toBe(true)
  })

  it('calculates BMI correctly', async () => {
    const wrapper = mount(PhysicalAttributesInput, {
      props: {
        modelValue: { height: 180, weight: 75 },
        gender: 'male'
      }
    })
    
    // BMI = 75 / (1.8 * 1.8) = 23.15
    expect(wrapper.vm.bmi).toBeCloseTo(23.15, 1)
  })

  it('emits update:modelValue event when height changes', async () => {
    const wrapper = mount(PhysicalAttributesInput, {
      props: {
        modelValue: { height: 170, weight: 60 },
        gender: 'male'
      }
    })
    
    await wrapper.vm.handleHeightChange(180)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0].height).toBe(180)
  })

  it('emits update:modelValue event when weight changes', async () => {
    const wrapper = mount(PhysicalAttributesInput, {
      props: {
        modelValue: { height: 170, weight: 60 },
        gender: 'male'
      }
    })
    
    await wrapper.vm.handleWeightChange(70)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0].weight).toBe(70)
  })

  it('calculates height score adjustment correctly for male', () => {
    const wrapper = mount(PhysicalAttributesInput, {
      props: {
        modelValue: { height: 180, weight: 75 },
        gender: 'male'
      }
    })
    
    expect(wrapper.vm.heightScoreAdjustment).toBe(10) // 男性身高≥180cm加10分
  })

  it('calculates height score adjustment correctly for female', () => {
    const wrapper = mount(PhysicalAttributesInput, {
      props: {
        modelValue: { height: 165, weight: 55 },
        gender: 'female'
      }
    })
    
    expect(wrapper.vm.heightScoreAdjustment).toBe(5) // 女性身高≥165cm加5分
  })

  it('calculates BMI score adjustment correctly', () => {
    const wrapper = mount(PhysicalAttributesInput, {
      props: {
        modelValue: { height: 180, weight: 75 },
        gender: 'male'
      }
    })
    
    // BMI = 23.15，在正常范围内，加5分
    expect(wrapper.vm.bmiScoreAdjustment).toBe(5)
  })

  it('shows correct BMI category', () => {
    const wrapper = mount(PhysicalAttributesInput, {
      props: {
        modelValue: { height: 180, weight: 75 },
        gender: 'male'
      }
    })
    
    expect(wrapper.vm.getBmiCategory(wrapper.vm.bmi)).toBe('正常')
  })
})