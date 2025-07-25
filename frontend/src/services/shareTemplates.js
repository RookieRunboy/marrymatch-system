/**
 * 分享内容模板
 * 提供多种吸引人的分享文案模板，确保隐私保护
 */

/**
 * 获取等级描述和对应的表情符号
 * @param {number} score - 评分
 * @returns {Object} 等级信息
 */
const getScoreLevel = (score) => {
  if (score >= 90) return { level: '顶级', emoji: '👑', color: '#FFD700' }
  if (score >= 80) return { level: '优秀', emoji: '⭐', color: '#FF6B6B' }
  if (score >= 70) return { level: '良好', emoji: '👍', color: '#4ECDC4' }
  if (score >= 60) return { level: '一般', emoji: '💪', color: '#45B7D1' }
  return { level: '待提升', emoji: '🚀', color: '#96CEB4' }
}

/**
 * 获取维度名称和对应的表情符号
 */
const DIMENSION_INFO = {
  workIncome: { name: '工作收入', emoji: '💼' },
  education: { name: '教育背景', emoji: '🎓' },
  physical: { name: '外在条件', emoji: '💪' },
  assets: { name: '资产住房', emoji: '🏠' },
  family: { name: '家庭背景', emoji: '👨‍👩‍👧‍👦' }
}

/**
 * 基础分享模板
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const basicTemplate = (evaluationResult, personData) => {
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const gender = personData.gender === 'female' ? '女生' : '男生'
  const percentile = marketAnalysis?.marketPercentile || 0

  return `🎯 我的相亲市场评估结果出炉啦！

${levelInfo.emoji} 综合评分：${detailedScores.total}分 (${levelInfo.level})
📈 市场排名：超越${percentile}%的${gender}

快来测试你的相亲市场竞争力吧！
#相亲评估 #市场分析`
}

/**
 * 详细分享模板
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const detailedTemplate = (evaluationResult, personData) => {
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const gender = personData.gender === 'female' ? '女生' : '男生'
  const age = personData.age || '未知'
  const percentile = marketAnalysis?.marketPercentile || 0

  // 生成各维度得分
  const dimensionScores = Object.entries(detailedScores)
    .filter(([key]) => key !== 'total')
    .map(([key, score]) => {
      const info = DIMENSION_INFO[key]
      return info ? `${info.emoji} ${info.name}：${score}分` : ''
    })
    .filter(Boolean)
    .join('\n')

  return `🎯 我的相亲市场评估结果出炉啦！

👤 ${age}岁${gender}
${levelInfo.emoji} 综合评分：${detailedScores.total}分 (${levelInfo.level})
📈 市场排名：超越${percentile}%的同龄人

📋 各维度得分：
${dimensionScores}

✨ 快来测试你的相亲市场竞争力吧！
#相亲评估 #市场分析 #个人提升`
}

/**
 * 幽默风趣模板
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const humorousTemplate = (evaluationResult, personData) => {
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const gender = personData.gender === 'female' ? '小仙女' : '小哥哥'
  const percentile = marketAnalysis?.marketPercentile || 0

  const humorousComments = [
    '看来我还是很有市场的嘛 😏',
    '单身不是我的错，是市场还没发现我的好 🤷‍♀️',
    '这个分数，配得上我的颜值吗？🤔',
    '妈妈再也不用担心我找不到对象了 😂',
    '原来我这么优秀，怪不得单身这么久 🙃'
  ]

  const randomComment = humorousComments[Math.floor(Math.random() * humorousComments.length)]

  return `🎭 刚刚测了相亲市场评估...

${levelInfo.emoji} 我这个${gender}得了${detailedScores.total}分
📊 超越了${percentile}%的同龄人

${randomComment}

你们也来测测看，看看谁更有"市场价值" 😈
#相亲评估 #单身生活 #自黑日常`
}

/**
 * 励志正能量模板
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const inspirationalTemplate = (evaluationResult, personData) => {
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const percentile = marketAnalysis?.marketPercentile || 0

  const inspirationalMessages = [
    '每一个分数都是努力的见证 💪',
    '不断提升自己，遇见更好的人 ✨',
    '相信自己的价值，值得被珍惜 💎',
    '成长路上，每一步都算数 🌱',
    '做最好的自己，爱情自然会来 💕'
  ]

  const randomMessage = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)]

  return `🌟 完成了相亲市场评估，收获满满！

${levelInfo.emoji} 综合评分：${detailedScores.total}分
📈 超越${percentile}%的同龄人

${randomMessage}

一起来测测看，互相鼓励，共同成长！
#自我提升 #正能量 #相亲评估`
}

/**
 * 简洁版模板（适合字数限制的平台）
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const conciseTemplate = (evaluationResult, personData) => {
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const gender = personData.gender === 'female' ? '女生' : '男生'
  const percentile = marketAnalysis?.marketPercentile || 0

  return `${levelInfo.emoji} 相亲市场评估：${detailedScores.total}分，超越${percentile}%的${gender}！快来测试你的竞争力 💪 #相亲评估`
}

/**
 * 挑战式模板
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const challengeTemplate = (evaluationResult, personData) => {
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const percentile = marketAnalysis?.marketPercentile || 0

  return `🏆 挑战：相亲市场评估大比拼！

我的成绩：${levelInfo.emoji} ${detailedScores.total}分
排名：前${100 - percentile}%

敢不敢来挑战我的分数？
看看谁才是真正的"香饽饽" 😎

#相亲评估挑战 #市场竞争力 #敢不敢来战`
}

/**
 * 隐私保护版模板（不显示具体年龄等敏感信息）
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const privacyTemplate = (evaluationResult, personData) => {
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const percentile = marketAnalysis?.marketPercentile || 0

  return `🎯 刚完成了相亲市场评估测试

${levelInfo.emoji} 综合评分：${levelInfo.level}等级
📊 市场竞争力：超越${percentile}%的同龄人

这个测试还挺有意思的，推荐大家试试！
#相亲评估 #市场分析`
}

/**
 * 获取所有可用的模板
 * @returns {Array} 模板列表
 */
export const getAvailableTemplates = () => [
  { key: 'basic', name: '基础版', description: '简洁明了的分享内容' },
  { key: 'detailed', name: '详细版', description: '包含各维度详细得分' },
  { key: 'humorous', name: '幽默版', description: '轻松幽默的分享风格' },
  { key: 'inspirational', name: '励志版', description: '正能量满满的分享内容' },
  { key: 'concise', name: '简洁版', description: '适合字数限制的平台' },
  { key: 'challenge', name: '挑战版', description: '激发朋友参与的挑战式内容' },
  { key: 'privacy', name: '隐私版', description: '保护个人隐私的分享内容' }
]

/**
 * 根据模板类型生成分享内容
 * @param {string} templateType - 模板类型
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const generateShareContent = (templateType, evaluationResult, personData) => {
  // 添加空值检查
  if (!evaluationResult || !personData) {
    return '暂无评估结果'
  }

  const templates = {
    basic: basicTemplate,
    detailed: detailedTemplate,
    humorous: humorousTemplate,
    inspirational: inspirationalTemplate,
    concise: conciseTemplate,
    challenge: challengeTemplate,
    privacy: privacyTemplate
  }

  const template = templates[templateType] || templates.basic
  return template(evaluationResult, personData)
}

/**
 * 添加品牌标识和链接
 * @param {string} content - 原始内容
 * @param {Object} options - 选项
 * @returns {string} 添加品牌信息后的内容
 */
export const addBrandInfo = (content, options = {}) => {
  const {
    brandName = 'MarryMatch',
    websiteUrl = window.location.origin,
    addLink = true
  } = options

  let brandInfo = `\n\n💕 来自 ${brandName}`
  
  if (addLink) {
    brandInfo += ` - ${websiteUrl}`
  }

  return content + brandInfo
}

/**
 * 验证分享内容长度（针对不同平台的字数限制）
 * @param {string} content - 分享内容
 * @param {string} platform - 平台名称
 * @returns {Object} 验证结果
 */
export const validateContentLength = (content, platform = 'generic') => {
  const limits = {
    weibo: 140,
    twitter: 280,
    wechat: 2000,
    generic: 1000
  }

  const limit = limits[platform] || limits.generic
  const length = content.length
  const isValid = length <= limit

  return {
    isValid,
    length,
    limit,
    remaining: limit - length
  }
}

export default {
  basicTemplate,
  detailedTemplate,
  humorousTemplate,
  inspirationalTemplate,
  conciseTemplate,
  challengeTemplate,
  privacyTemplate,
  getAvailableTemplates,
  generateShareContent,
  addBrandInfo,
  validateContentLength
}