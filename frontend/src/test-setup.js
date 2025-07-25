// 全局测试设置文件
import { config } from '@vue/test-utils'

// Mock Canvas API
global.HTMLCanvasElement.prototype.getContext = () => {
  return {
    fillStyle: '',
    font: '',
    textAlign: '',
    fillText: () => {},
    clearRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    moveTo: () => {},
    lineTo: () => {},
    measureText: () => ({ width: 0 })
  }
}

// Mock Chart.js
global.Chart = class Chart {
  constructor() {
    this.data = {}
    this.options = {}
  }
  
  update() {}
  destroy() {}
  
  static register() {}
}

// Mock Element Plus components
config.global.stubs = {
  'el-card': {
    template: '<div class="el-card"><slot /></div>'
  },
  'el-select': {
    template: '<div class="el-select" :disabled="disabled"><slot /></div>',
    props: ['modelValue', 'placeholder', 'disabled', 'filterable'],
    emits: ['update:modelValue', 'change'],
    computed: {
      isDisabled() {
        return this.disabled
      }
    }
  },
  'el-option': {
    template: '<div class="el-option"><slot /></div>',
    props: ['label', 'value']
  },
  'el-option-group': {
    template: '<div class="el-option-group"><slot /></div>',
    props: ['label']
  },
  'el-button': {
    template: '<button class="el-button" @click="$emit(\'click\')"><slot /></button>',
    props: ['type', 'size', 'disabled', 'loading'],
    emits: ['click']
  },
  'el-alert': {
    template: '<div class="el-alert"><div class="el-alert__title">{{ title }}</div><slot /></div>',
    props: ['title', 'type', 'closable', 'showIcon', 'size']
  },
  'el-radio-group': {
    template: '<div class="el-radio-group"><slot /></div>',
    props: ['modelValue'],
    emits: ['update:modelValue', 'change']
  },
  'el-radio-button': {
    template: '<div class="el-radio-button"><slot /></div>',
    props: ['label', 'value']
  },
  'el-divider': {
    template: '<div class="el-divider"></div>',
    props: ['direction']
  },
  'el-empty': {
    template: '<div class="el-empty"><slot /></div>',
    props: ['description']
  },
  'el-progress': {
    template: '<div class="el-progress"></div>',
    props: ['percentage', 'type', 'strokeWidth', 'showText']
  },
  'el-tag': {
    template: '<span class="el-tag"><slot /></span>',
    props: ['type', 'size', 'effect']
  }
}

// Mock console methods to reduce noise in tests
if (typeof global !== 'undefined') {
  global.console = {
    ...console,
    warn: () => {},
    error: () => {}
  }
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})