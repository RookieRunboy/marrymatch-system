<template>
  <el-dialog
    v-model="visible"
    title="分享评估结果"
    width="600px"
    :before-close="handleClose"
    class="share-modal"
  >
    <div class="share-content">
      <!-- 分享方式选择 -->
      <div class="share-methods">
        <h4>选择分享方式</h4>
        <div class="method-buttons">
          <el-button
            type="primary"
            :icon="Share"
            @click="handleNativeShare"
            :disabled="!isNativeShareSupported"
          >
            {{ isNativeShareSupported ? '系统分享' : '不支持系统分享' }}
          </el-button>
          <el-button
            type="success"
            :icon="CopyDocument"
            @click="handleCopyText"
          >
            复制文本
          </el-button>
          <el-button
            type="info"
            :icon="Picture"
            @click="handleGenerateImage"
            :loading="isGeneratingImage"
          >
            生成图片
          </el-button>
        </div>
      </div>

      <!-- 分享模板选择 -->
      <div class="template-selection">
        <h4>选择分享模板</h4>
        <el-radio-group v-model="selectedTemplate" @change="updatePreview">
          <el-radio-button
            v-for="template in availableTemplates"
            :key="template.key"
            :label="template.key"
          >
            {{ template.name }}
          </el-radio-button>
        </el-radio-group>
        <p class="template-description">
          {{ getCurrentTemplateDescription() }}
        </p>
      </div>

      <!-- 分享内容预览 -->
      <div class="content-preview">
        <h4>分享内容预览</h4>
        <div class="preview-box">
          <pre>{{ shareContent }}</pre>
        </div>
        <div class="content-info">
          <span class="char-count">字符数: {{ shareContent.length }}</span>
          <el-button
            type="text"
            size="small"
            @click="editContent = !editContent"
          >
            {{ editContent ? '完成编辑' : '编辑内容' }}
          </el-button>
        </div>
      </div>

      <!-- 内容编辑 -->
      <div v-if="editContent" class="content-editor">
        <el-input
          v-model="customContent"
          type="textarea"
          :rows="6"
          placeholder="编辑分享内容..."
          @input="updateCustomContent"
        />
      </div>

      <!-- 图片预览 -->
      <div v-if="generatedImage" class="image-preview">
        <h4>分享图片预览</h4>
        <div class="image-container">
          <img :src="generatedImage" alt="分享图片" class="preview-image" />
        </div>
        <div class="image-actions">
          <el-button
            type="primary"
            :icon="Download"
            @click="downloadImage"
          >
            下载图片
          </el-button>
          <el-select
            v-model="selectedImageStyle"
            placeholder="选择图片风格"
            @change="handleGenerateImage"
            style="margin-left: 10px;"
          >
            <el-option
              v-for="style in availableImageStyles"
              :key="style.key"
              :label="style.name"
              :value="style.key"
            />
          </el-select>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="privacy-settings">
        <h4>隐私设置</h4>
        <el-checkbox v-model="hidePersonalInfo" @change="updatePreview">
          隐藏个人敏感信息（如年龄等）
        </el-checkbox>
        <el-checkbox v-model="addBrandLink" @change="updatePreview">
          添加品牌链接
        </el-checkbox>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          @click="handleQuickShare"
          :loading="isSharing"
        >
          {{ isSharing ? '分享中...' : '快速分享' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Share, CopyDocument, Picture, Download } from '@element-plus/icons-vue'
import { 
  isNativeShareSupported,
  shareEvaluationResult 
} from '@/services/shareService'
import { 
  getAvailableTemplates,
  generateShareContent,
  addBrandInfo 
} from '@/services/shareTemplates'
import { 
  generateShareImage,
  downloadImage as downloadImageFile,
  getAvailableImageStyles 
} from '@/services/shareImageGenerator'

export default {
  name: 'ShareModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    evaluationResult: {
      type: Object,
      required: true
    },
    personData: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'shared'],
  setup(props, { emit }) {
    const visible = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const selectedTemplate = ref('basic')
    const selectedImageStyle = ref('basic')
    const editContent = ref(false)
    const customContent = ref('')
    const hidePersonalInfo = ref(false)
    const addBrandLink = ref(true)
    const isGeneratingImage = ref(false)
    const isSharing = ref(false)
    const generatedImage = ref('')

    const availableTemplates = getAvailableTemplates()
    const availableImageStyles = getAvailableImageStyles()

    // 计算分享内容
    const shareContent = computed(() => {
      if (customContent.value) {
        return customContent.value
      }

      const templateType = hidePersonalInfo.value ? 'privacy' : selectedTemplate.value
      let content = generateShareContent(templateType, props.evaluationResult, props.personData)
      
      if (addBrandLink.value) {
        content = addBrandInfo(content)
      }
      
      return content
    })

    // 获取当前模板描述
    const getCurrentTemplateDescription = () => {
      const template = availableTemplates.find(t => t.key === selectedTemplate.value)
      return template ? template.description : ''
    }

    // 更新预览
    const updatePreview = () => {
      if (!editContent.value) {
        customContent.value = ''
      }
    }

    // 更新自定义内容
    const updateCustomContent = () => {
      // 实时更新自定义内容
    }

    // 处理原生分享
    const handleNativeShare = async () => {
      try {
        isSharing.value = true
        const success = await shareEvaluationResult(
          props.evaluationResult,
          props.personData,
          {
            useSimpleText: selectedTemplate.value === 'concise',
            customTitle: '我的相亲市场评估结果'
          }
        )
        
        if (success) {
          emit('shared', { method: 'native', template: selectedTemplate.value })
          handleClose()
        }
      } catch (error) {
        console.error('分享失败:', error)
      } finally {
        isSharing.value = false
      }
    }

    // 处理复制文本
    const handleCopyText = async () => {
      try {
        await navigator.clipboard.writeText(shareContent.value)
        ElMessage.success('内容已复制到剪贴板！')
        emit('shared', { method: 'copy', template: selectedTemplate.value })
      } catch (error) {
        ElMessage.error('复制失败，请手动复制')
      }
    }

    // 处理生成图片
    const handleGenerateImage = async () => {
      try {
        isGeneratingImage.value = true
        const imageUrl = await generateShareImage(
          props.evaluationResult,
          props.personData,
          selectedImageStyle.value
        )
        generatedImage.value = imageUrl
        ElMessage.success('图片生成成功！')
      } catch (error) {
        console.error('图片生成失败:', error)
        ElMessage.error('图片生成失败，请重试')
      } finally {
        isGeneratingImage.value = false
      }
    }

    // 下载图片
    const downloadImage = () => {
      if (generatedImage.value) {
        const filename = `相亲评估结果_${new Date().getTime()}.png`
        downloadImageFile(generatedImage.value, filename)
        emit('shared', { method: 'download', template: selectedImageStyle.value })
      }
    }

    // 快速分享
    const handleQuickShare = async () => {
      if (generatedImage.value) {
        // 如果有生成的图片，优先分享图片
        downloadImage()
      } else {
        // 否则分享文本
        await handleNativeShare()
      }
    }

    // 关闭对话框
    const handleClose = () => {
      visible.value = false
      // 重置状态
      nextTick(() => {
        selectedTemplate.value = 'basic'
        selectedImageStyle.value = 'basic'
        editContent.value = false
        customContent.value = ''
        hidePersonalInfo.value = false
        addBrandLink.value = true
        generatedImage.value = ''
      })
    }

    // 监听模板变化
    watch(selectedTemplate, () => {
      if (!editContent.value) {
        updatePreview()
      }
    })

    return {
      visible,
      selectedTemplate,
      selectedImageStyle,
      editContent,
      customContent,
      hidePersonalInfo,
      addBrandLink,
      isGeneratingImage,
      isSharing,
      generatedImage,
      availableTemplates,
      availableImageStyles,
      shareContent,
      isNativeShareSupported: isNativeShareSupported(),
      getCurrentTemplateDescription,
      updatePreview,
      updateCustomContent,
      handleNativeShare,
      handleCopyText,
      handleGenerateImage,
      downloadImage,
      handleQuickShare,
      handleClose,
      // Icons
      Share,
      CopyDocument,
      Picture,
      Download
    }
  }
}
</script>

<style scoped>
.share-modal {
  --el-dialog-border-radius: 16px;
}

.share-content {
  padding: 0 4px;
}

.share-content h4 {
  margin: 20px 0 10px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.share-methods {
  margin-bottom: 24px;
}

.method-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.method-buttons .el-button {
  flex: 1;
  min-width: 120px;
}

.template-selection {
  margin-bottom: 24px;
}

.template-description {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 14px;
}

.content-preview {
  margin-bottom: 24px;
}

.preview-box {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  max-height: 200px;
  overflow-y: auto;
}

.preview-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.content-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.char-count {
  font-size: 12px;
  color: #999;
}

.content-editor {
  margin-bottom: 24px;
}

.image-preview {
  margin-bottom: 24px;
}

.image-container {
  text-align: center;
  margin: 12px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.privacy-settings {
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.privacy-settings .el-checkbox {
  display: block;
  margin-bottom: 8px;
}

.privacy-settings .el-checkbox:last-child {
  margin-bottom: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .method-buttons {
    flex-direction: column;
  }
  
  .method-buttons .el-button {
    min-width: auto;
  }
  
  .image-actions {
    flex-direction: column;
  }
  
  .content-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 深色主题支持 */
[data-theme="dark"] .preview-box {
  background: #2d2d2d;
  border-color: #404040;
}

[data-theme="dark"] .preview-box pre {
  color: #ffffff;
}

[data-theme="dark"] .privacy-settings {
  background: #2d2d2d;
}

[data-theme="dark"] .image-container {
  background: #2d2d2d;
}
</style>