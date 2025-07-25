// 第一阶段评分权重配置 - 物质条件导向
export const PHASE1_SCORE_WEIGHTS = {
  workIncome: 0.40,        // 工作收入 40%
  education: 0.25,         // 教育背景 25%
  physicalAttributes: 0.15, // 外在条件 15%
  assets: 0.15,            // 资产住房 15%
  familyBackground: 0.05   // 家庭背景 5%
}

// 权重验证规则
export const WEIGHT_VALIDATION_RULES = {
  minWeight: 0.01,         // 最小权重值 1%
  maxWeight: 0.60,         // 最大权重值 60%
  totalWeight: 1.00,       // 总权重必须为 100%
  tolerance: 0.001         // 浮点数比较容差
}

// 默认权重配置（用于重置）
export const DEFAULT_WEIGHTS = { ...PHASE1_SCORE_WEIGHTS }

// 工作单位系数系统 - 体现稳定性和资源优势
export const WORK_UNIT_MULTIPLIERS = {
  // 政府机关（最高稳定性，资源最多）
  'central_gov': 3.0,        // 中央部委
  'city_gov': 2.5,           // 市级政府
  'district_gov': 2.0,       // 区县政府
  'township_gov': 1.5,       // 镇/街道
  
  // 国有企业
  'central_soe_hq': 2.0,     // 央企总部
  'central_soe_branch': 1.5, // 央企分公司
  'local_soe': 1.5,          // 地方国企
  
  // 教育机构
  'top_university': 2.2,     // 985/211高校
  'university': 1.8,         // 普通高校
  'middle_school': 1.5,      // 中小学
  'research_institute': 1.8, // 科研院所
  
  // 医疗机构
  'top_hospital': 2.0,       // 三甲医院
  'hospital': 1.6,           // 普通医院
  
  // 私营企业
  'famous_foreign': 1.2,     // 知名外企
  'tech_giant': 0.9,         // 互联网大厂
  'finance': 0.8,            // 金融机构
  'private_company': 0.8,    // 普通私企
  'startup': 0.7,            // 创业公司
  'freelance': 0.6,          // 自由职业
  'unemployed': 0.1          // 无业
}

// 学历评分映射
export const EDUCATION_SCORES = {
  'high_school': 30,
  'college': 50,
  'bachelor': 70,
  'master': 85,
  'phd': 90
}

// 院校等级评分映射
export const UNIVERSITY_TIER_SCORES = {
  'qingbei': 100,      // 清华北大
  'c985': 95,          // 985院校
  'c211': 90,          // 211院校
  'tier1': 80,         // 一类本科
  'tier2': 70,         // 二类本科
  'private': 60        // 民办本科
}

// 外貌评分映射
export const APPEARANCE_SCORES = {
  'excellent': 100,     // 9-10分 明星级别
  'very_good': 85,      // 7-8分 很好看
  'above_average': 70,  // 5-6分 普通偏上
  'below_average': 50,  // 3-4分 普通偏下
  'poor': 30           // 1-2分 需要改善
}

// 住房状况评分映射
export const HOUSING_SCORES = {
  'beijing_house_inner': 100,    // 北京环内房产
  'beijing_house_outer': 90,     // 北京环外房产
  'beijing_house_loan': 75,      // 北京贷款房产
  'other_city_house': 50,        // 外地房产
  'rent': 30,                    // 租房
  'live_with_parents': 20        // 与父母同住
}

/**
 * 计算工作收入得分（40%权重）
 * @param {number} salary - 月薪资(万元)
 * @param {string} workUnit - 工作单位类型
 * @returns {number} 工作收入得分
 */
export const calculateWorkIncomeScore = (salary, workUnit) => {
  const multiplier = WORK_UNIT_MULTIPLIERS[workUnit] || 0.8
  const adjustedIncome = salary * multiplier
  
  if (adjustedIncome >= 30) return 100      // 调整后月收入30万+
  if (adjustedIncome >= 20) return 95       // 20-30万
  if (adjustedIncome >= 15) return 90       // 15-20万
  if (adjustedIncome >= 10) return 85       // 10-15万
  if (adjustedIncome >= 8) return 80        // 8-10万
  if (adjustedIncome >= 6) return 75        // 6-8万
  if (adjustedIncome >= 4) return 70        // 4-6万
  if (adjustedIncome >= 3) return 65        // 3-4万
  if (adjustedIncome >= 2) return 60        // 2-3万
  if (adjustedIncome >= 1.5) return 50      // 1.5-2万
  if (adjustedIncome >= 1) return 40        // 1-1.5万
  return 30                                 // 1万以下
}

/**
 * 计算教育背景得分（25%权重）
 * @param {string} degree - 学历层次
 * @param {string} universityTier - 院校等级（本科及以上需要）
 * @returns {number} 教育背景得分
 */
export const calculateEducationScore = (degree, universityTier) => {
  const baseScore = EDUCATION_SCORES[degree] || 30
  
  // 本科及以上学历需要考虑院校等级
  if (['bachelor', 'master', 'phd'].includes(degree) && universityTier) {
    const tierScore = UNIVERSITY_TIER_SCORES[universityTier] || 60
    // 院校等级对最终分数的影响权重为0.5
    return Math.min(100, baseScore + (tierScore - 60) * 0.5)
  }
  
  return baseScore
}

/**
 * 计算外在条件得分（15%权重）
 * @param {string} gender - 性别
 * @param {number} height - 身高(cm)
 * @param {number} weight - 体重(kg)
 * @param {string} appearance - 外貌评价
 * @returns {number} 外在条件得分
 */
export const calculatePhysicalScore = (gender, height, weight, appearance) => {
  const bmi = weight / ((height / 100) ** 2)
  let score = APPEARANCE_SCORES[appearance] || 50
  
  // 身高调整
  if (gender === 'male') {
    if (height >= 180) score += 10
    else if (height >= 175) score += 5
    else if (height < 170) score -= 10
  } else {
    if (height >= 165) score += 5
    else if (height < 155) score -= 10
  }
  
  // BMI调整
  if (bmi >= 18.5 && bmi <= 24) score += 5
  else if (bmi > 28 || bmi < 18) score -= 15
  
  return Math.max(0, Math.min(100, score))
}

/**
 * 计算资产住房得分（15%权重）
 * @param {string} housingStatus - 住房状况
 * @param {number} savings - 存款(万元)
 * @returns {number} 资产住房得分
 */
export const calculateAssetsScore = (housingStatus, savings) => {
  const housingScore = HOUSING_SCORES[housingStatus] || 30
  
  // 存款评分
  let savingsScore = 30
  if (savings >= 1000) savingsScore = 100
  else if (savings >= 500) savingsScore = 90
  else if (savings >= 200) savingsScore = 80
  else if (savings >= 100) savingsScore = 70
  else if (savings >= 50) savingsScore = 60
  else if (savings >= 20) savingsScore = 50
  else if (savings >= 10) savingsScore = 40
  
  // 住房占70%，存款占30%
  return Math.round(housingScore * 0.7 + savingsScore * 0.3)
}

/**
 * 计算家庭背景得分（5%权重）
 * @param {number} parentsIncome - 父母月收入(万元)
 * @param {boolean} onlyChild - 是否独生子女
 * @returns {number} 家庭背景得分
 */
export const calculateFamilyScore = (parentsIncome, onlyChild) => {
  let score = 60 // 基础分
  
  if (parentsIncome >= 5) score = 100
  else if (parentsIncome >= 3) score = 90
  else if (parentsIncome >= 2) score = 80
  else if (parentsIncome >= 1) score = 70
  else if (parentsIncome >= 0.5) score = 60
  else score = 50
  
  // 独生子女调整（独生子女压力大）
  if (onlyChild) score -= 10
  
  return Math.max(0, Math.min(100, score))
}

/**
 * 计算个人综合得分
 * @param {Object} person - 个人信息对象
 * @returns {number} 综合得分
 */
export const calculatePersonScore = (person) => {
  let score = 0
  
  // 工作收入评分 (40%)
  const workIncomeScore = calculateWorkIncomeScore(person.salary, person.workUnit)
  score += workIncomeScore * PHASE1_SCORE_WEIGHTS.workIncome
  
  // 教育背景评分 (25%)
  const educationScore = calculateEducationScore(person.education, person.universityTier)
  score += educationScore * PHASE1_SCORE_WEIGHTS.education
  
  // 外在条件评分 (15%)
  const physicalScore = calculatePhysicalScore(
    person.gender, 
    person.height, 
    person.weight, 
    person.appearance
  )
  score += physicalScore * PHASE1_SCORE_WEIGHTS.physicalAttributes
  
  // 资产住房评分 (15%)
  const assetsScore = calculateAssetsScore(person.housingStatus, person.savings)
  score += assetsScore * PHASE1_SCORE_WEIGHTS.assets
  
  // 家庭背景评分 (5%)
  const familyScore = calculateFamilyScore(person.parentsIncome, person.onlyChild)
  score += familyScore * PHASE1_SCORE_WEIGHTS.familyBackground
  
  return Math.round(score)
}

/**
 * 计算详细评分分解
 * @param {Object} person - 个人信息对象
 * @returns {Object} 详细评分对象
 */
export const calculateDetailedScores = (person) => {
  const workIncomeScore = calculateWorkIncomeScore(person.salary, person.workUnit)
  const educationScore = calculateEducationScore(person.education, person.universityTier)
  const physicalScore = calculatePhysicalScore(
    person.gender, 
    person.height, 
    person.weight, 
    person.appearance
  )
  const assetsScore = calculateAssetsScore(person.housingStatus, person.savings)
  const familyScore = calculateFamilyScore(person.parentsIncome, person.onlyChild)
  
  const totalScore = Math.round(
    workIncomeScore * PHASE1_SCORE_WEIGHTS.workIncome +
    educationScore * PHASE1_SCORE_WEIGHTS.education +
    physicalScore * PHASE1_SCORE_WEIGHTS.physicalAttributes +
    assetsScore * PHASE1_SCORE_WEIGHTS.assets +
    familyScore * PHASE1_SCORE_WEIGHTS.familyBackground
  )
  
  return {
    total: totalScore,
    workIncome: workIncomeScore,
    education: educationScore,
    physical: physicalScore,
    assets: assetsScore,
    family: familyScore,
    adjustedIncome: person.salary * (WORK_UNIT_MULTIPLIERS[person.workUnit] || 0.8)
  }
}

/**
 * 计算匹配度
 * @param {number} maleScore - 男方得分
 * @param {number} femaleScore - 女方得分
 * @returns {number} 匹配度得分
 */
export const calculateMatchScore = (maleScore, femaleScore) => {
  const avgScore = (maleScore + femaleScore) / 2
  const scoreDiff = Math.abs(maleScore - femaleScore)
  const matchPenalty = scoreDiff > 20 ? (scoreDiff - 20) * 0.5 : 0
  return Math.max(0, Math.round(avgScore - matchPenalty))
}

/**
 * 计算所有评分
 * @param {Object} maleForm - 男方信息
 * @param {Object} femaleForm - 女方信息
 * @returns {Object} 包含所有评分的对象
 */
export const calculateAllScores = (maleForm, femaleForm) => {
  const maleDetailedScores = calculateDetailedScores(maleForm)
  const femaleDetailedScores = calculateDetailedScores(femaleForm)
  const matchScore = calculateMatchScore(maleDetailedScores.total, femaleDetailedScores.total)
  
  return {
    maleScore: maleDetailedScores.total,
    femaleScore: femaleDetailedScores.total,
    matchScore,
    maleDetailed: maleDetailedScores,
    femaleDetailed: femaleDetailedScores
  }
}

/**
 * 生成详细的改进建议
 * @param {Object} person - 个人信息对象
 * @param {Object} detailedScores - 详细评分对象
 * @returns {Array} 改进建议数组
 */
export const generateDetailedImprovementSuggestions = (person, detailedScores) => {
  const suggestions = []
  
  // 工作收入改进建议
  if (detailedScores.workIncome < 70) {
    const currentMultiplier = WORK_UNIT_MULTIPLIERS[person.workUnit] || 0.8
    const adjustedIncome = person.salary * currentMultiplier
    
    if (currentMultiplier < 2.0) {
      suggestions.push({
        category: '工作收入',
        priority: 'high',
        suggestion: '考虑转向更稳定的工作单位，如政府机关或国有企业',
        actionItems: [
          '关注公务员考试信息',
          '了解国企招聘机会',
          '提升专业技能以增加竞争力'
        ]
      })
    }
    
    if (person.salary < 5) {
      suggestions.push({
        category: '工作收入',
        priority: 'high',
        suggestion: '提升基础薪资水平',
        actionItems: [
          '寻求内部晋升机会',
          '考虑跳槽到薪资更高的公司',
          '发展副业增加收入来源',
          '提升专业技能获得加薪'
        ]
      })
    }
  }
  
  // 教育背景改进建议
  if (detailedScores.education < 75) {
    if (person.education === 'bachelor' || person.education === 'college') {
      suggestions.push({
        category: '教育背景',
        priority: 'medium',
        suggestion: '考虑继续深造提升学历',
        actionItems: [
          '报考研究生考试',
          '申请在职MBA项目',
          '考虑海外留学机会',
          '参加专业认证考试'
        ]
      })
    }
    
    if (person.universityTier && ['tier2', 'private'].includes(person.universityTier)) {
      suggestions.push({
        category: '教育背景',
        priority: 'medium',
        suggestion: '通过继续教育弥补院校背景不足',
        actionItems: [
          '申请知名院校的研究生项目',
          '参加名校的培训课程',
          '获得行业权威认证',
          '发表学术论文或专业文章'
        ]
      })
    }
  }
  
  // 外在条件改进建议
  if (detailedScores.physical < 70) {
    const bmi = person.weight / ((person.height / 100) ** 2)
    
    if (bmi > 25 || bmi < 18.5) {
      suggestions.push({
        category: '外在条件',
        priority: 'medium',
        suggestion: '改善身材管理',
        actionItems: [
          '制定科学的饮食计划',
          '建立规律的运动习惯',
          '寻求专业健身指导',
          '定期体检监控健康状况'
        ]
      })
    }
    
    if (person.appearance && ['below_average', 'poor'].includes(person.appearance)) {
      suggestions.push({
        category: '外在条件',
        priority: 'medium',
        suggestion: '提升个人形象',
        actionItems: [
          '改善穿衣搭配风格',
          '注意个人卫生和仪表',
          '考虑适当的美容护理',
          '培养良好的气质和谈吐'
        ]
      })
    }
    
    if (person.gender === 'male' && person.height < 170) {
      suggestions.push({
        category: '外在条件',
        priority: 'low',
        suggestion: '通过其他方式弥补身高不足',
        actionItems: [
          '选择合适的服装增加视觉身高',
          '培养自信的气质',
          '发展其他优势特质',
          '保持良好的身材比例'
        ]
      })
    }
  }
  
  // 资产住房改进建议
  if (detailedScores.assets < 70) {
    if (['rent', 'live_with_parents'].includes(person.housingStatus)) {
      suggestions.push({
        category: '资产住房',
        priority: 'high',
        suggestion: '改善住房状况',
        actionItems: [
          '制定购房储蓄计划',
          '了解房贷政策和优惠',
          '考虑先购买小户型房产',
          '关注房价相对较低的区域'
        ]
      })
    }
    
    if (person.savings < 50) {
      suggestions.push({
        category: '资产住房',
        priority: 'high',
        suggestion: '增加储蓄和投资',
        actionItems: [
          '制定月度储蓄计划',
          '学习基础的投资理财知识',
          '开设定期存款账户',
          '考虑稳健的投资产品'
        ]
      })
    }
  }
  
  // 家庭背景改进建议（相对较少，因为权重较低）
  if (detailedScores.family < 60) {
    suggestions.push({
      category: '家庭背景',
      priority: 'low',
      suggestion: '发挥家庭支持作用',
      actionItems: [
        '与家人沟通获得更多支持',
        '合理规划家庭资源',
        '考虑家庭投资机会',
        '维护良好的家庭关系'
      ]
    })
  }
  
  return suggestions
}

/**
 * 生成竞争优势分析
 * @param {Object} person - 个人信息对象
 * @param {Object} detailedScores - 详细评分对象
 * @returns {Array} 竞争优势数组
 */
export const generateCompetitiveAdvantages = (person, detailedScores) => {
  const advantages = []
  
  // 工作收入优势
  if (detailedScores.workIncome >= 85) {
    const multiplier = WORK_UNIT_MULTIPLIERS[person.workUnit] || 0.8
    if (multiplier >= 2.0) {
      advantages.push('工作单位稳定性强，社会资源丰富')
    }
    if (person.salary >= 10) {
      advantages.push('收入水平位于市场前列')
    }
  }
  
  // 教育背景优势
  if (detailedScores.education >= 85) {
    if (person.universityTier === 'qingbei') {
      advantages.push('顶尖院校背景，教育资源优质')
    } else if (person.universityTier === 'c985') {
      advantages.push('985院校背景，学术能力突出')
    }
    if (person.education === 'phd') {
      advantages.push('博士学历，专业能力强')
    } else if (person.education === 'master') {
      advantages.push('硕士学历，知识结构完善')
    }
  }
  
  // 外在条件优势
  if (detailedScores.physical >= 80) {
    if (person.appearance === 'excellent') {
      advantages.push('外貌条件优秀，第一印象佳')
    }
    const bmi = person.weight / ((person.height / 100) ** 2)
    if (bmi >= 18.5 && bmi <= 24) {
      advantages.push('身材比例良好，健康状况佳')
    }
    if (person.gender === 'male' && person.height >= 180) {
      advantages.push('身高优势明显')
    } else if (person.gender === 'female' && person.height >= 165) {
      advantages.push('身高条件良好')
    }
  }
  
  // 资产住房优势
  if (detailedScores.assets >= 80) {
    if (person.housingStatus === 'beijing_house_inner') {
      advantages.push('拥有北京核心区域房产，资产价值高')
    } else if (person.housingStatus === 'beijing_house_outer') {
      advantages.push('拥有北京房产，居住条件稳定')
    }
    if (person.savings >= 200) {
      advantages.push('储蓄充足，财务状况良好')
    }
  }
  
  // 家庭背景优势
  if (detailedScores.family >= 80) {
    if (person.parentsIncome >= 3) {
      advantages.push('家庭经济条件优越')
    }
    if (!person.onlyChild) {
      advantages.push('非独生子女，家庭压力相对较小')
    }
  }
  
  return advantages
}

/**
 * 生成市场价值分析
 * @param {Object} person - 个人信息对象
 * @returns {Object} 市场价值分析对象
 */
export const generateMarketValueAnalysis = (person) => {
  const detailedScores = calculateDetailedScores(person)
  const score = detailedScores.total
  
  // 基于评分计算市场百分位
  let percentile = 50
  if (score >= 90) percentile = 95
  else if (score >= 85) percentile = 90
  else if (score >= 80) percentile = 85
  else if (score >= 75) percentile = 75
  else if (score >= 70) percentile = 65
  else if (score >= 65) percentile = 55
  else if (score >= 60) percentile = 45
  else if (score >= 55) percentile = 35
  else if (score >= 50) percentile = 25
  else percentile = 15
  
  // 生成竞争优势和改进建议
  const competitiveAdvantages = generateCompetitiveAdvantages(person, detailedScores)
  const improvementSuggestions = generateDetailedImprovementSuggestions(person, detailedScores)
  
  // 将改进建议转换为简单的文本数组（保持向后兼容）
  const improvementAreas = improvementSuggestions.map(item => item.suggestion)
  
  return {
    overallScore: score,
    marketPercentile: percentile,
    competitiveAdvantages,
    improvementAreas,
    detailedBreakdown: detailedScores,
    detailedImprovements: improvementSuggestions
  }
}

/**
 * 生成对比分析
 * @param {Object} person1 - 第一个人的信息
 * @param {Object} person2 - 第二个人的信息
 * @returns {Object} 对比分析对象
 */
export const generateComparisonAnalysis = (person1, person2) => {
  const scores1 = calculateDetailedScores(person1)
  const scores2 = calculateDetailedScores(person2)
  
  const dimensionComparison = {
    workIncome: {
      person1: scores1.workIncome,
      person2: scores2.workIncome,
      winner: scores1.workIncome > scores2.workIncome ? 'person1' : 'person2',
      difference: Math.abs(scores1.workIncome - scores2.workIncome)
    },
    education: {
      person1: scores1.education,
      person2: scores2.education,
      winner: scores1.education > scores2.education ? 'person1' : 'person2',
      difference: Math.abs(scores1.education - scores2.education)
    },
    physical: {
      person1: scores1.physical,
      person2: scores2.physical,
      winner: scores1.physical > scores2.physical ? 'person1' : 'person2',
      difference: Math.abs(scores1.physical - scores2.physical)
    },
    assets: {
      person1: scores1.assets,
      person2: scores2.assets,
      winner: scores1.assets > scores2.assets ? 'person1' : 'person2',
      difference: Math.abs(scores1.assets - scores2.assets)
    },
    family: {
      person1: scores1.family,
      person2: scores2.family,
      winner: scores1.family > scores2.family ? 'person1' : 'person2',
      difference: Math.abs(scores1.family - scores2.family)
    }
  }
  
  return {
    winner: scores1.total > scores2.total ? 'person1' : 'person2',
    scoreDifference: Math.abs(scores1.total - scores2.total),
    dimensionComparison,
    matchCompatibility: calculateMatchScore(scores1.total, scores2.total)
  }
}

/**
 * 获取评分等级
 * @param {number} score - 评分
 * @returns {string} 评分等级
 */
export const getScoreLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '中等'
  if (score >= 60) return '一般'
  return '较差'
}

/**
 * 获取匹配等级
 * @param {number} score - 匹配度评分
 * @returns {string} 匹配等级
 */
export const getMatchLevel = (score) => {
  if (score >= 90) return '非常匹配'
  if (score >= 80) return '比较匹配'
  if (score >= 70) return '基本匹配'
  if (score >= 60) return '勉强匹配'
  return '不太匹配'
}

/**
 * 验证权重配置是否有效
 * @param {Object} weights - 权重配置对象
 * @returns {Object} 验证结果 { isValid: boolean, errors: string[] }
 */
export const validateWeights = (weights) => {
  const errors = []
  const rules = WEIGHT_VALIDATION_RULES
  
  // 检查必需的权重字段
  const requiredFields = ['workIncome', 'education', 'physicalAttributes', 'assets', 'familyBackground']
  for (const field of requiredFields) {
    if (!(field in weights)) {
      errors.push(`缺少必需的权重字段: ${field}`)
      continue
    }
    
    const weight = weights[field]
    
    // 检查权重值类型
    if (typeof weight !== 'number' || isNaN(weight)) {
      errors.push(`权重字段 ${field} 必须是有效数字`)
      continue
    }
    
    // 检查权重范围
    if (weight < rules.minWeight) {
      errors.push(`权重字段 ${field} 不能小于 ${rules.minWeight * 100}%`)
    }
    
    if (weight > rules.maxWeight) {
      errors.push(`权重字段 ${field} 不能大于 ${rules.maxWeight * 100}%`)
    }
  }
  
  // 检查总权重是否为100%
  if (errors.length === 0) {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
    if (Math.abs(totalWeight - rules.totalWeight) > rules.tolerance) {
      errors.push(`权重总和必须为100%，当前为 ${(totalWeight * 100).toFixed(1)}%`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 标准化权重配置（确保总和为100%）
 * @param {Object} weights - 权重配置对象
 * @returns {Object} 标准化后的权重配置
 */
export const normalizeWeights = (weights) => {
  const validation = validateWeights(weights)
  
  // 如果验证失败，返回默认权重
  if (!validation.isValid) {
    console.warn('权重验证失败，使用默认权重:', validation.errors)
    return { ...DEFAULT_WEIGHTS }
  }
  
  // 计算当前总权重
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
  
  // 如果总权重接近1.0，直接返回
  if (Math.abs(totalWeight - 1.0) <= WEIGHT_VALIDATION_RULES.tolerance) {
    return { ...weights }
  }
  
  // 标准化权重使总和为1.0
  const normalizedWeights = {}
  for (const [key, weight] of Object.entries(weights)) {
    normalizedWeights[key] = weight / totalWeight
  }
  
  return normalizedWeights
}

/**
 * 获取权重配置的描述信息
 * @param {Object} weights - 权重配置对象
 * @returns {Object} 权重描述信息
 */
export const getWeightsDescription = (weights) => {
  const normalizedWeights = normalizeWeights(weights)
  
  return {
    workIncome: {
      weight: normalizedWeights.workIncome,
      percentage: `${(normalizedWeights.workIncome * 100).toFixed(1)}%`,
      description: '工作收入权重 - 包括薪资和工作单位系数'
    },
    education: {
      weight: normalizedWeights.education,
      percentage: `${(normalizedWeights.education * 100).toFixed(1)}%`,
      description: '教育背景权重 - 包括学历层次和院校等级'
    },
    physicalAttributes: {
      weight: normalizedWeights.physicalAttributes,
      percentage: `${(normalizedWeights.physicalAttributes * 100).toFixed(1)}%`,
      description: '外在条件权重 - 包括外貌、身高和体重'
    },
    assets: {
      weight: normalizedWeights.assets,
      percentage: `${(normalizedWeights.assets * 100).toFixed(1)}%`,
      description: '资产住房权重 - 包括住房状况和存款水平'
    },
    familyBackground: {
      weight: normalizedWeights.familyBackground,
      percentage: `${(normalizedWeights.familyBackground * 100).toFixed(1)}%`,
      description: '家庭背景权重 - 包括父母收入和家庭状况'
    }
  }
}

/**
 * 使用自定义权重计算个人得分
 * @param {Object} person - 个人信息对象
 * @param {Object} customWeights - 自定义权重配置
 * @returns {number} 综合得分
 */
export const calculatePersonScoreWithWeights = (person, customWeights) => {
  const weights = normalizeWeights(customWeights)
  let score = 0
  
  // 工作收入评分
  const workIncomeScore = calculateWorkIncomeScore(person.salary, person.workUnit)
  score += workIncomeScore * weights.workIncome
  
  // 教育背景评分
  const educationScore = calculateEducationScore(person.education, person.universityTier)
  score += educationScore * weights.education
  
  // 外在条件评分
  const physicalScore = calculatePhysicalScore(
    person.gender, 
    person.height, 
    person.weight, 
    person.appearance
  )
  score += physicalScore * weights.physicalAttributes
  
  // 资产住房评分
  const assetsScore = calculateAssetsScore(person.housingStatus, person.savings)
  score += assetsScore * weights.assets
  
  // 家庭背景评分
  const familyScore = calculateFamilyScore(person.parentsIncome, person.onlyChild)
  score += familyScore * weights.familyBackground
  
  return Math.round(score)
}

/**
 * 使用自定义权重计算详细评分分解
 * @param {Object} person - 个人信息对象
 * @param {Object} customWeights - 自定义权重配置
 * @returns {Object} 详细评分对象
 */
export const calculateDetailedScoresWithWeights = (person, customWeights) => {
  const weights = normalizeWeights(customWeights)
  
  const workIncomeScore = calculateWorkIncomeScore(person.salary, person.workUnit)
  const educationScore = calculateEducationScore(person.education, person.universityTier)
  const physicalScore = calculatePhysicalScore(
    person.gender, 
    person.height, 
    person.weight, 
    person.appearance
  )
  const assetsScore = calculateAssetsScore(person.housingStatus, person.savings)
  const familyScore = calculateFamilyScore(person.parentsIncome, person.onlyChild)
  
  const totalScore = Math.round(
    workIncomeScore * weights.workIncome +
    educationScore * weights.education +
    physicalScore * weights.physicalAttributes +
    assetsScore * weights.assets +
    familyScore * weights.familyBackground
  )
  
  return {
    total: totalScore,
    workIncome: workIncomeScore,
    education: educationScore,
    physical: physicalScore,
    assets: assetsScore,
    family: familyScore,
    adjustedIncome: person.salary * (WORK_UNIT_MULTIPLIERS[person.workUnit] || 0.8),
    weights: weights
  }
}