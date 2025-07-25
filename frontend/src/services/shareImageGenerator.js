/**
 * 分享图片生成服务
 * 使用Canvas生成美观的分享图片
 */

/**
 * 获取等级信息
 * @param {number} score - 评分
 * @returns {Object} 等级信息
 */
const getScoreLevel = (score) => {
  if (score >= 90) return { level: '顶级', color: '#FFD700', bgColor: '#FFF8DC' }
  if (score >= 80) return { level: '优秀', color: '#FF6B6B', bgColor: '#FFE4E1' }
  if (score >= 70) return { level: '良好', color: '#4ECDC4', bgColor: '#E0FFFF' }
  if (score >= 60) return { level: '一般', color: '#45B7D1', bgColor: '#E6F3FF' }
  return { level: '待提升', color: '#96CEB4', bgColor: '#F0FFF0' }
}

/**
 * 创建Canvas元素
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @returns {Object} Canvas和Context
 */
const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  // 启用抗锯齿
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  
  return { canvas, ctx }
}

/**
 * 绘制渐变背景
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {string} color1 - 起始颜色
 * @param {string} color2 - 结束颜色
 */
const drawGradientBackground = (ctx, width, height, color1 = '#667eea', color2 = '#764ba2') => {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

/**
 * 绘制圆角矩形
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} radius - 圆角半径
 */
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * 绘制文本（支持自动换行）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {string} text - 文本内容
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} maxWidth - 最大宽度
 * @param {number} lineHeight - 行高
 * @returns {number} 实际使用的高度
 */
const drawMultilineText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split('')
  let line = ''
  let currentY = y
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i]
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    
    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY)
      line = words[i]
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  
  ctx.fillText(line, x, currentY)
  return currentY - y + lineHeight
}

/**
 * 绘制评分圆环
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} centerX - 中心X坐标
 * @param {number} centerY - 中心Y坐标
 * @param {number} radius - 半径
 * @param {number} score - 评分
 * @param {string} color - 颜色
 */
const drawScoreCircle = (ctx, centerX, centerY, radius, score, color) => {
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + (score / 100) * 2 * Math.PI
  
  // 绘制背景圆环
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = '#E5E5E5'
  ctx.lineWidth = 8
  ctx.stroke()
  
  // 绘制评分圆环
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, startAngle, endAngle)
  ctx.strokeStyle = color
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.stroke()
  
  // 绘制评分文字
  ctx.fillStyle = color
  ctx.font = 'bold 36px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(score.toString(), centerX, centerY - 5)
  
  ctx.font = '16px Arial, sans-serif'
  ctx.fillText('分', centerX, centerY + 20)
}

/**
 * 绘制维度评分条
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {string} label - 标签
 * @param {number} score - 评分
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {string} color - 颜色
 */
const drawScoreBar = (ctx, label, score, x, y, width, color) => {
  const barHeight = 20
  const progress = score / 100
  
  // 绘制标签
  ctx.fillStyle = '#333'
  ctx.font = '14px Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x, y - 15)
  
  // 绘制背景条
  drawRoundedRect(ctx, x, y, width, barHeight, 10)
  ctx.fillStyle = '#E5E5E5'
  ctx.fill()
  
  // 绘制进度条
  if (progress > 0) {
    drawRoundedRect(ctx, x, y, width * progress, barHeight, 10)
    ctx.fillStyle = color
    ctx.fill()
  }
  
  // 绘制分数
  ctx.fillStyle = '#333'
  ctx.font = 'bold 12px Arial, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`${score}分`, x + width, y + barHeight + 15)
}

/**
 * 生成基础分享图片
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @param {Object} options - 选项
 * @returns {Promise<string>} 图片的Data URL
 */
export const generateBasicShareImage = async (evaluationResult, personData, options = {}) => {
  const {
    width = 600,
    height = 800,
    backgroundColor = '#667eea',
    backgroundColor2 = '#764ba2'
  } = options

  const { canvas, ctx } = createCanvas(width, height)
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const gender = personData.gender === 'female' ? '女生' : '男生'
  const percentile = marketAnalysis?.marketPercentile || 0

  // 绘制渐变背景
  drawGradientBackground(ctx, width, height, backgroundColor, backgroundColor2)

  // 绘制白色卡片背景
  const cardPadding = 40
  const cardX = cardPadding
  const cardY = cardPadding
  const cardWidth = width - cardPadding * 2
  const cardHeight = height - cardPadding * 2

  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 20)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.fill()

  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = 'bold 28px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('相亲市场评估结果', width / 2, cardY + 30)

  // 绘制评分圆环
  const circleY = cardY + 120
  drawScoreCircle(ctx, width / 2, circleY, 80, detailedScores.total, levelInfo.color)

  // 绘制等级标签
  ctx.fillStyle = levelInfo.color
  ctx.font = 'bold 24px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(levelInfo.level, width / 2, circleY + 120)

  // 绘制市场排名
  ctx.fillStyle = '#666'
  ctx.font = '18px Arial, sans-serif'
  ctx.fillText(`超越${percentile}%的${gender}`, width / 2, circleY + 150)

  // 绘制维度评分
  const dimensionsY = circleY + 200
  const dimensions = [
    { key: 'workIncome', label: '💼 工作收入' },
    { key: 'education', label: '🎓 教育背景' },
    { key: 'physical', label: '💪 外在条件' },
    { key: 'assets', label: '🏠 资产住房' },
    { key: 'family', label: '👨‍👩‍👧‍👦 家庭背景' }
  ]

  dimensions.forEach((dim, index) => {
    const score = detailedScores[dim.key] || 0
    const y = dimensionsY + index * 50
    drawScoreBar(ctx, dim.label, score, cardX + 40, y, cardWidth - 120, levelInfo.color)
  })

  // 绘制品牌信息
  ctx.fillStyle = '#999'
  ctx.font = '14px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('MarryMatch - 相亲市场评估系统', width / 2, height - 60)

  return canvas.toDataURL('image/png', 0.9)
}

/**
 * 生成简洁分享图片
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @param {Object} options - 选项
 * @returns {Promise<string>} 图片的Data URL
 */
export const generateSimpleShareImage = async (evaluationResult, personData, options = {}) => {
  const {
    width = 500,
    height = 500
  } = options

  const { canvas, ctx } = createCanvas(width, height)
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const percentile = marketAnalysis?.marketPercentile || 0

  // 绘制背景
  ctx.fillStyle = levelInfo.bgColor
  ctx.fillRect(0, 0, width, height)

  // 绘制主要内容区域
  const centerX = width / 2
  const centerY = height / 2

  // 绘制评分圆环
  drawScoreCircle(ctx, centerX, centerY - 50, 100, detailedScores.total, levelInfo.color)

  // 绘制等级
  ctx.fillStyle = levelInfo.color
  ctx.font = 'bold 32px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(levelInfo.level, centerX, centerY + 80)

  // 绘制排名
  ctx.fillStyle = '#666'
  ctx.font = '20px Arial, sans-serif'
  ctx.fillText(`超越${percentile}%`, centerX, centerY + 120)

  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = 'bold 24px Arial, sans-serif'
  ctx.fillText('相亲市场评估', centerX, 50)

  // 绘制品牌
  ctx.fillStyle = '#999'
  ctx.font = '16px Arial, sans-serif'
  ctx.fillText('MarryMatch', centerX, height - 30)

  return canvas.toDataURL('image/png', 0.9)
}

/**
 * 生成朋友圈风格分享图片
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @param {Object} options - 选项
 * @returns {Promise<string>} 图片的Data URL
 */
export const generateWechatStyleImage = async (evaluationResult, personData, options = {}) => {
  const {
    width = 400,
    height = 400
  } = options

  const { canvas, ctx } = createCanvas(width, height)
  const { detailedScores, marketAnalysis } = evaluationResult
  const levelInfo = getScoreLevel(detailedScores.total)
  const percentile = marketAnalysis?.marketPercentile || 0

  // 绘制渐变背景
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2)
  gradient.addColorStop(0, levelInfo.bgColor)
  gradient.addColorStop(1, '#FFFFFF')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // 绘制装饰性圆圈
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 30 + 10,
      0,
      2 * Math.PI
    )
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
    ctx.fill()
  }

  const centerX = width / 2
  const centerY = height / 2

  // 绘制主评分
  ctx.fillStyle = levelInfo.color
  ctx.font = 'bold 72px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(detailedScores.total.toString(), centerX, centerY - 30)

  // 绘制"分"字
  ctx.font = 'bold 24px Arial, sans-serif'
  ctx.fillText('分', centerX + 60, centerY - 30)

  // 绘制等级
  ctx.font = 'bold 28px Arial, sans-serif'
  ctx.fillText(levelInfo.level, centerX, centerY + 30)

  // 绘制排名信息
  ctx.fillStyle = '#666'
  ctx.font = '18px Arial, sans-serif'
  ctx.fillText(`超越${percentile}%的同龄人`, centerX, centerY + 70)

  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = 'bold 20px Arial, sans-serif'
  ctx.fillText('我的相亲市场评估', centerX, 40)

  // 绘制底部信息
  ctx.fillStyle = '#999'
  ctx.font = '14px Arial, sans-serif'
  ctx.fillText('快来测试你的竞争力', centerX, height - 40)

  return canvas.toDataURL('image/png', 0.9)
}

/**
 * 下载图片
 * @param {string} dataUrl - 图片的Data URL
 * @param {string} filename - 文件名
 */
export const downloadImage = (dataUrl, filename = 'share-image.png') => {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 将Canvas转换为Blob
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {string} type - 图片类型
 * @param {number} quality - 图片质量
 * @returns {Promise<Blob>} Blob对象
 */
export const canvasToBlob = (canvas, type = 'image/png', quality = 0.9) => {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

/**
 * 生成分享图片的主要函数
 * @param {Object} evaluationResult - 评估结果
 * @param {Object} personData - 个人数据
 * @param {string} style - 图片风格 ('basic', 'simple', 'wechat')
 * @param {Object} options - 选项
 * @returns {Promise<string>} 图片的Data URL
 */
export const generateShareImage = async (evaluationResult, personData, style = 'basic', options = {}) => {
  try {
    switch (style) {
      case 'simple':
        return await generateSimpleShareImage(evaluationResult, personData, options)
      case 'wechat':
        return await generateWechatStyleImage(evaluationResult, personData, options)
      case 'basic':
      default:
        return await generateBasicShareImage(evaluationResult, personData, options)
    }
  } catch (error) {
    console.error('生成分享图片失败:', error)
    throw new Error('图片生成失败，请重试')
  }
}

/**
 * 获取可用的图片风格
 * @returns {Array} 风格列表
 */
export const getAvailableImageStyles = () => [
  { key: 'basic', name: '详细版', description: '包含完整评分信息的详细图片' },
  { key: 'simple', name: '简洁版', description: '突出总分的简洁图片' },
  { key: 'wechat', name: '朋友圈版', description: '适合朋友圈分享的精美图片' }
]

export default {
  generateBasicShareImage,
  generateSimpleShareImage,
  generateWechatStyleImage,
  generateShareImage,
  downloadImage,
  canvasToBlob,
  getAvailableImageStyles
}