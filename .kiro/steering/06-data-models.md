---
title: 数据模型指南
description: MARRYMATCH的数据模型定义和使用规范
inclusion: always
---

# 数据模型指南

## 个人信息模型

```javascript
const PersonModel = {
  // 基本信息
  basicInfo: {
    age: Number,           // 年龄
    gender: String,        // 性别: 'male' | 'female'
    location: String,      // 所在城市
    height: Number,        // 身高(cm)
    weight: Number         // 体重(kg)
  },
  
  // 工作收入（40%权重）
  workIncome: {
    salary: Number,           // 月薪资(万元)
    workUnit: String,         // 工作单位类型
    workUnitMultiplier: Number, // 自动计算的系数
    adjustedIncome: Number,   // 调整后收入
    jobTitle: String,         // 职位
    workYears: Number         // 工作年限
  },
  
  // 教育背景（25%权重）
  education: {
    degree: String,           // 学历: 'high_school' | 'college' | 'bachelor' | 'master' | 'phd'
    universityTier: String,   // 院校等级: 'qingbei' | 'c985' | 'c211' | 'tier1' | 'tier2' | 'private'
    major: String,            // 专业
    graduationYear: Number    // 毕业年份
  },
  
  // 外在条件（15%权重）
  physicalAttributes: {
    appearance: String,       // 外貌评价: 'excellent' | 'very_good' | 'above_average' | 'below_average' | 'poor'
    bmi: Number,              // 自动计算的BMI
    physicalScore: Number     // 综合身体条件得分
  },
  
  // 资产住房（15%权重）
  assets: {
    housingStatus: String,    // 住房状况: 'beijing_house_inner' | 'beijing_house_outer' | 'beijing_house_loan' | 'other_city_house' | 'rent' | 'live_with_parents'
    savings: Number,          // 存款(万元)
    otherAssets: Array,       // 其他资产
    debt: Number              // 负债(万元)
  },
  
  // 家庭背景（5%权重）
  familyBackground: {
    parentsIncome: Number,    // 父母月收入(万元)
    familyAssets: String,     // 家庭资产状况
    onlyChild: Boolean,       // 是否独生子女
    parentsOccupation: String // 父母职业
  }
}
```

## 评分结果模型

```javascript
const ScoreResultModel = {
  // 总体评分
  total: Number,              // 总评分(0-100)
  
  // 各维度评分
  workIncome: Number,         // 工作收入评分
  education: Number,          // 教育背景评分
  physical: Number,           // 外在条件评分
  assets: Number,             // 资产住房评分
  family: Number,             // 家庭背景评分
  
  // 市场分析
  marketPercentile: Number,   // 市场百分位
  competitiveAdvantages: Array, // 竞争优势
  improvementAreas: Array,    // 改进空间
  
  // 其他信息
  adjustedIncome: Number,     // 调整后收入
  bmi: Number                 // BMI指数
}
```

## 匹配结果模型

```javascript
const MatchResultModel = {
  // 双方评分
  maleScore: Number,          // 男方评分
  femaleScore: Number,        // 女方评分
  
  // 匹配度
  matchScore: Number,         // 匹配度评分
  matchLevel: String,         // 匹配等级
  
  // 详细评分
  maleDetailed: Object,       // 男方详细评分
  femaleDetailed: Object,     // 女方详细评分
  
  // 维度对比
  dimensionComparison: {
    workIncome: {
      person1: Number,
      person2: Number,
      winner: String,
      difference: Number
    },
    // 其他维度...
  }
}
```

## 数据验证规则

1. **必填字段**: 年龄、性别、身高、体重、月薪、工作单位、学历
2. **数值范围**: 
   - 年龄: 18-100
   - 身高: 140-220 cm
   - 体重: 30-150 kg
   - 月薪: 0.1-100 万元
3. **枚举值**: 性别、学历、院校等级、外貌评价、住房状况必须使用预定义的枚举值

## 数据存储

1. **本地存储**: 使用 localStorage 存储用户数据
2. **数据格式**: 使用 JSON 格式存储数据
3. **数据加密**: 敏感数据应进行加密处理
4. **数据备份**: 提供数据导出和导入功能

## 数据处理最佳实践

1. **数据转换**: 在 UI 层和数据层之间进行适当的数据转换
2. **默认值**: 为可选字段提供合理的默认值
3. **错误处理**: 妥善处理数据缺失和格式错误的情况
4. **性能优化**: 避免不必要的数据复制和深层嵌套