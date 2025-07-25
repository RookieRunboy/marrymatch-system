/**
 * 分享服务
 * 提供原生分享API调用和剪贴板复制的备选方案
 */

import { ElMessage } from 'element-plus'

/**
 * 检查是否支持原生分享API
 * @returns {boolean} 是否支持原生分享
 */
export const isNativeShareSupported = () => {
  return !!(navigator.share && typeof navigator.share === 'function')
}

/**
 * 检查是否支持剪贴板API
 * @returns {boolean} 是否支持剪贴板
 */
export const isClipboardSupported = () => {
  return !!(navigator.clipboard && typeof navigator.clipboard.writeText === 'function')
}

/**
 * 生成分享文本内容
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 分享文本
 */
export const generateShareText = (evaluationResult, personData) => {
  if (!evaluationResult || !evaluationResult.detailedScores) {
    throw new Error('评估结果数据不完整')
  }

  const { detailedScores, marketAnalysis } = evaluationResult
  const gender = personData.gender === 'female' ? '女生' : '男生'
  const age = personData.age || '未知'
  
  // 获取等级描述
  const getScoreLevel = (score) => {
    if (score >= 90) return '顶级'
    if (score >= 80) return '优秀'
    if (score >= 70) return '良好'
    if (score >= 60) return '一般'
    return '待提升'
  }

  const level = getScoreLevel(detailedScores.total)
  const percentile = marketAnalysis?.marketPercentile || 0

  return `🎯 我的相亲市场评估结果出炉啦！

👤 ${age}岁${gender}
📊 综合评分：${detailedScores.total}分 (${level})
📈 市场排名：超越${percentile}%的同龄人

📋 各维度得分：
💼 工作收入：${detailedScores.workIncome}分
🎓 教育背景：${detailedScores.education}分
💪 外在条件：${detailedScores.physical}分
🏠 资产住房：${detailedScores.assets}分
👨‍👩‍👧‍👦 家庭背景：${detailedScores.family}分

✨ 快来测试你的相亲市场竞争力吧！
#相亲评估 #市场分析 #个人提升`
}

/**
 * 生成简化版分享文本（用于字数限制的平台）
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @returns {string} 简化分享文本
 */
export const generateSimpleShareText = (evaluationResult, personData) => {
  if (!evaluationResult || !evaluationResult.detailedScores) {
    throw new Error('评估结果数据不完整')
  }

  const { detailedScores, marketAnalysis } = evaluationResult
  const gender = personData.gender === 'female' ? '女生' : '男生'
  const percentile = marketAnalysis?.marketPercentile || 0

  return `我的相亲市场评估：${detailedScores.total}分，超越${percentile}%的${gender}！快来测试你的竞争力 💪`
}

/**
 * 使用原生分享API分享内容
 * @param {Object} shareData - 分享数据
 * @param {string} shareData.title - 分享标题
 * @param {string} shareData.text - 分享文本
 * @param {string} shareData.url - 分享链接
 * @returns {Promise<boolean>} 分享是否成功
 */
export const shareWithNativeAPI = async (shareData) => {
  try {
    if (!isNativeShareSupported()) {
      throw new Error('不支持原生分享API')
    }

    await navigator.share(shareData)
    return true
  } catch (error) {
    if (error.name === 'AbortError') {
      // 用户取消分享，不显示错误消息
      return false
    }
    console.error('原生分享失败:', error)
    throw error
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 复制是否成功
 */
export const copyToClipboard = async (text) => {
  try {
    if (isClipboardSupported()) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案：使用传统的复制方法
      return fallbackCopyToClipboard(text)
    }
  } catch (error) {
    console.error('复制到剪贴板失败:', error)
    // 尝试降级方案
    return fallbackCopyToClipboard(text)
  }
}

/**
 * 降级复制方案（兼容旧浏览器）
 * @param {string} text - 要复制的文本
 * @returns {boolean} 复制是否成功
 */
const fallbackCopyToClipboard = (text) => {
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    return successful
  } catch (error) {
    console.error('降级复制方案失败:', error)
    return false
  }
}

/**
 * 主要分享函数
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @param {Object} options - 分享选项
 * @param {boolean} options.useSimpleText - 是否使用简化文本
 * @param {string} options.customTitle - 自定义标题
 * @param {string} options.customUrl - 自定义链接
 * @returns {Promise<boolean>} 分享是否成功
 */
export const shareEvaluationResult = async (evaluationResult, personData, options = {}) => {
  try {
    const {
      useSimpleText = false,
      customTitle = '相亲市场评估结果',
      customUrl = window.location.href
    } = options

    // 生成分享文本
    const shareText = useSimpleText 
      ? generateSimpleShareText(evaluationResult, personData)
      : generateShareText(evaluationResult, personData)

    // 准备分享数据
    const shareData = {
      title: customTitle,
      text: shareText,
      url: customUrl
    }

    // 尝试使用原生分享API
    if (isNativeShareSupported()) {
      try {
        const success = await shareWithNativeAPI(shareData)
        if (success) {
          ElMessage.success('分享成功！')
          return true
        }
      } catch (error) {
        // 如果原生分享失败，继续使用剪贴板方案
        console.warn('原生分享失败，使用剪贴板方案:', error)
      }
    }

    // 降级到剪贴板复制
    const copySuccess = await copyToClipboard(shareText)
    if (copySuccess) {
      ElMessage.success('内容已复制到剪贴板，可以粘贴到社交媒体分享！')
      return true
    } else {
      ElMessage.error('分享失败，请手动复制内容')
      return false
    }

  } catch (error) {
    console.error('分享过程中出现错误:', error)
    ElMessage.error('分享失败，请重试')
    return false
  }
}

/**
 * 获取分享平台特定的文本
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @param {string} platform - 平台名称 ('weibo', 'wechat', 'qq', 'generic')
 * @returns {string} 平台特定的分享文本
 */
export const getPlatformSpecificText = (evaluationResult, personData, platform) => {
  const baseText = generateShareText(evaluationResult, personData)
  
  switch (platform) {
    case 'weibo':
      // 微博有字数限制，使用简化版本
      return generateSimpleShareText(evaluationResult, personData)
    
    case 'wechat':
      // 微信分享，添加朋友圈适合的表情和话题
      return baseText + '\n\n💕 #单身生活 #自我提升'
    
    case 'qq':
      // QQ空间分享
      return baseText + '\n\n🌟 来QQ空间看看我的评估结果~'
    
    default:
      return baseText
  }
}

export default {
  isNativeShareSupported,
  isClipboardSupported,
  generateShareText,
  generateSimpleShareText,
  shareWithNativeAPI,
  copyToClipboard,
  shareEvaluationResult,
  getPlatformSpecificText
}