---
title: 组件开发指南
description: MARRYMATCH的组件开发规范和最佳实践
inclusion: fileMatch
fileMatchPattern: '*.vue'
---

# 组件开发指南

## 组件结构

Vue 组件应遵循以下结构：

```vue
<template>
  <!-- 模板内容 -->
</template>

<script>
// 导入语句

export default {
  name: 'ComponentName',
  // 组件选项
}
</script>

<script setup>
// 组合式 API 代码
</script>

<style scoped>
/* CSS 样式 */
</style>
```

## 组件命名

1. **文件名**: 使用 PascalCase (如 `PersonForm.vue`)
2. **组件名**: 使用 PascalCase (如 `export default { name: 'PersonForm' }`)
3. **自定义事件**: 使用 kebab-case (如 `emit('update:model-value')`)
4. **Props**: 使用 camelCase (如 `modelValue`)

## Props 定义

为组件 props 添加类型和验证：

```javascript
const props = defineProps({
  person: {
    type: Object,
    required: true,
    validator(value) {
      return value && value.name && value.age
    }
  },
  editable: {
    type: Boolean,
    default: false
  }
})
```

## 事件处理

使用 `defineEmits` 定义组件可以触发的事件：

```javascript
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const handleSubmit = () => {
  emit('submit', formData.value)
}
```

## 表单组件

表单组件应支持 v-model 双向绑定：

```javascript
const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
```

## 组件通信

1. **父子组件**: 使用 props 和 events
2. **跨组件**: 使用 Pinia store
3. **全局状态**: 使用 Pinia store
4. **提供/注入**: 对于深层嵌套组件，可使用 provide/inject

## 性能优化

1. **计算属性**: 使用计算属性缓存计算结果
2. **懒加载**: 使用 `defineAsyncComponent` 懒加载组件
3. **列表渲染**: 为 v-for 提供 key
4. **事件处理**: 避免在模板中使用箭头函数

## 错误处理

1. **Props 验证**: 使用 validator 函数验证 props
2. **异常捕获**: 使用 try/catch 捕获异常
3. **错误边界**: 使用 `errorCaptured` 钩子捕获子组件错误

## 无障碍性

1. **语义化标签**: 使用语义化的 HTML 标签
2. **ARIA 属性**: 添加适当的 ARIA 属性
3. **键盘导航**: 支持键盘导航
4. **颜色对比**: 确保足够的颜色对比度

## Element Plus 集成

1. **组件导入**: 按需导入 Element Plus 组件
2. **主题定制**: 使用 Element Plus 的主题定制功能
3. **表单验证**: 使用 Element Plus 的表单验证功能
4. **国际化**: 使用 Element Plus 的国际化功能