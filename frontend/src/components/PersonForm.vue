<template>
  <el-card class="person-card">
    <template #header>
      <div class="card-header">
        <el-icon><component :is="genderIcon" /></el-icon>
        <span>{{ title }}</span>
        <div class="header-subtitle">请如实填写个人信息</div>
      </div>
    </template>
    
    <el-form :model="formData" label-width="120px" label-position="left" class="material-focused-form">
      <!-- 重新排序，强调物质条件 -->
      <el-collapse v-model="activeCollapse" class="form-collapse">
        
        <!-- 基本信息 - 在单人模式下显示 -->
        <el-collapse-item v-if="isSingleMode" name="basic" class="priority-section">
          <template #title>
            <div class="section-title">
              <el-icon class="section-icon"><User /></el-icon>
              <span class="section-text">基本信息</span>
              <el-tag size="small" type="primary" class="weight-tag">必填</el-tag>
            </div>
          </template>
          
          <div class="section-content">
            <el-form-item label="性别" required>
              <el-radio-group v-model="formData.gender" @change="handleChange">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="年龄" required>
              <el-input-number 
                v-model="formData.age" 
                :min="18" 
                :max="60" 
                placeholder="请输入年龄"
                @change="handleChange" 
                class="full-width-input"
              />
            </el-form-item>
          </div>
        </el-collapse-item>
        
        <!-- 工作收入 - 最重要，排在第一位 -->
        <el-collapse-item name="work" class="priority-section">
          <template #title>
            <div class="section-title">
              <el-icon class="section-icon"><Money /></el-icon>
              <span class="section-text">工作收入</span>
              <el-tag size="small" type="danger" class="weight-tag">权重40%</el-tag>
            </div>
          </template>
          
          <div class="section-content">
            <el-form-item label="月薪资(万元)" required>
              <el-input-number 
                v-model="formData.salary" 
                :min="0.1" 
                :max="100"
                :precision="1" 
                :step="0.5" 
                placeholder="请输入税前月薪"
                @change="handleChange" 
                class="full-width-input"
              />
              <div class="input-hint">请填写税前月薪，包括基本工资、奖金等</div>
            </el-form-item>
            
            <el-form-item label="工作单位" required>
              <WorkUnitSelector v-model="formData.workUnit" @update:modelValue="handleChange" />
            </el-form-item>
            
            <el-form-item label="工作年限">
              <el-input-number 
                v-model="formData.workYears" 
                :min="0" 
                :max="50"
                :step="1" 
                placeholder="工作年限"
                @change="handleChange" 
                class="full-width-input"
              />
            </el-form-item>
          </div>
        </el-collapse-item>
        
        <!-- 教育背景 - 第二重要 -->
        <el-collapse-item name="education" class="priority-section">
          <template #title>
            <div class="section-title">
              <el-icon class="section-icon"><School /></el-icon>
              <span class="section-text">教育背景</span>
              <el-tag size="small" type="warning" class="weight-tag">权重25%</el-tag>
            </div>
          </template>
          
          <div class="section-content">
            <el-form-item label="学历" required>
              <el-select v-model="formData.education" placeholder="请选择最高学历" @change="handleChange" class="full-width-input">
                <el-option 
                  v-for="option in educationOptions" 
                  :key="option.value" 
                  :label="option.label" 
                  :value="option.value" 
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="院校等级" v-if="showUniversityTier" required>
              <UniversityTierSelector 
                v-model="formData.universityTier" 
                :education="formData.education"
                @update:modelValue="handleChange" 
              />
            </el-form-item>
            
            <el-form-item label="专业">
              <el-input 
                v-model="formData.major" 
                placeholder="请输入专业名称"
                @change="handleChange" 
                class="full-width-input"
              />
            </el-form-item>
          </div>
        </el-collapse-item>
        
        <!-- 资产住房 - 第三重要 -->
        <el-collapse-item name="assets" class="priority-section">
          <template #title>
            <div class="section-title">
              <el-icon class="section-icon"><House /></el-icon>
              <span class="section-text">资产住房</span>
              <el-tag size="small" type="success" class="weight-tag">权重15%</el-tag>
            </div>
          </template>
          
          <div class="section-content">
            <el-form-item label="住房状况" required>
              <HousingStatusSelector 
                v-model="housingData" 
                @update:modelValue="handleHousingChange" 
              />
            </el-form-item>
            
            <el-form-item label="资产与负债">
              <AssetsTracker 
                v-model="assetsData" 
                @update:modelValue="handleAssetsChange" 
              />
            </el-form-item>
          </div>
        </el-collapse-item>
        
        <!-- 外在条件 -->
        <el-collapse-item name="physical" class="priority-section">
          <template #title>
            <div class="section-title">
              <el-icon class="section-icon"><User /></el-icon>
              <span class="section-text">外在条件</span>
              <el-tag size="small" type="info" class="weight-tag">权重15%</el-tag>
            </div>
          </template>
          
          <div class="section-content">
            <el-form-item v-if="isSingleMode" label="性别" required>
              <el-radio-group v-model="formData.gender" @change="handleChange">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="年龄" required>
              <el-input-number 
                v-model="formData.age" 
                :min="18" 
                :max="60" 
                placeholder="请输入年龄"
                @change="handleChange" 
                class="full-width-input"
              />
            </el-form-item>
            
            <el-form-item label="身体条件" required>
              <PhysicalAttributesInput 
                v-model="physicalAttributes" 
                :gender="gender"
                @update:modelValue="handlePhysicalAttributesChange" 
              />
            </el-form-item>
            
            <el-form-item label="外貌评价" required>
              <AppearanceSelector 
                v-model="formData.appearance" 
                @update:modelValue="handleChange" 
              />
            </el-form-item>
          </div>
        </el-collapse-item>
        
        <!-- 家庭背景 - 权重最低，放在最后 -->
        <el-collapse-item name="family" class="secondary-section">
          <template #title>
            <div class="section-title">
              <el-icon class="section-icon"><Avatar /></el-icon>
              <span class="section-text">家庭背景</span>
              <el-tag size="small" class="weight-tag">权重5%</el-tag>
            </div>
          </template>
          
          <div class="section-content">
            <el-form-item label="是否独生子女">
              <el-switch 
                v-model="formData.onlyChild" 
                active-text="是" 
                inactive-text="否"
                @change="handleChange" 
              />
            </el-form-item>
            
            <el-form-item label="父母月收入(万元)">
              <el-input-number 
                v-model="formData.parentsIncome" 
                :min="0" 
                :precision="1" 
                :step="0.5" 
                placeholder="父母合计月收入"
                @change="handleChange" 
                class="full-width-input"
              />
            </el-form-item>
            
            <el-form-item label="父母职业">
              <el-input 
                v-model="formData.parentsOccupation" 
                placeholder="请简要描述父母职业"
                @change="handleChange" 
                class="full-width-input"
              />
            </el-form-item>
          </div>
        </el-collapse-item>
        
      </el-collapse>
    </el-form>
  </el-card>
</template>

<script>
import { Male, Female, Money, School, House, User, Avatar } from '@element-plus/icons-vue'
import { 
  EDUCATION_OPTIONS, 
  UNIVERSITY_TIER_OPTIONS,
  APPEARANCE_OPTIONS,
  HOUSING_STATUS_OPTIONS,
  FAMILY_ASSETS_OPTIONS
} from '@/constants/formDefaults.js'
import WorkUnitSelector from './WorkUnitSelector.vue'
import UniversityTierSelector from './UniversityTierSelector.vue'
import AppearanceSelector from './AppearanceSelector.vue'
import PhysicalAttributesInput from './PhysicalAttributesInput.vue'
import HousingStatusSelector from './HousingStatusSelector.vue'
import AssetsTracker from './AssetsTracker.vue'

export default {
  name: 'PersonForm',
  components: {
    Male,
    Female,
    Money,
    School,
    House,
    User,
    Avatar,
    WorkUnitSelector,
    UniversityTierSelector,
    AppearanceSelector,
    PhysicalAttributesInput,
    HousingStatusSelector,
    AssetsTracker
  },
  props: {
    title: {
      type: String,
      default: '个人信息'
    },
    gender: {
      type: String,
      default: 'male',
      validator: (value) => ['male', 'female'].includes(value)
    },
    modelValue: {
      type: Object,
      required: true
    },
    isSingleMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      // 默认展开的折叠面板
      activeCollapse: this.isSingleMode ? ['basic', 'work', 'education'] : ['work', 'education'],
      educationOptions: EDUCATION_OPTIONS,
      universityTierOptions: UNIVERSITY_TIER_OPTIONS,
      appearanceOptions: APPEARANCE_OPTIONS,
      housingStatusOptions: HOUSING_STATUS_OPTIONS,
      familyAssetsOptions: FAMILY_ASSETS_OPTIONS
    }
  },
  computed: {
    currentGender() {
      return this.isSingleMode ? (this.formData.gender || 'male') : this.gender
    },
    genderIcon() {
      return this.currentGender === 'male' ? 'Male' : 'Female'
    },
    formData: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    // 身体属性对象，用于传递给PhysicalAttributesInput组件
    physicalAttributes() {
      return {
        height: this.formData.height,
        weight: this.formData.weight,
        bmi: this.formData.weight / ((this.formData.height / 100) ** 2)
      }
    },
    // 住房数据对象，用于传递给HousingStatusSelector组件
    housingData() {
      return {
        status: this.formData.housingStatus || '',
        location: this.formData.housingLocation || '',
        score: 0
      }
    },
    // 资产数据对象，用于传递给AssetsTracker组件
    assetsData() {
      return {
        savings: this.formData.savings || 50,
        otherAssets: this.formData.otherAssets || [],
        debt: this.formData.debt || 0,
        score: 0
      }
    },
    // 是否显示院校等级选择器（本科及以上学历才显示）
    showUniversityTier() {
      return ['bachelor', 'master', 'phd'].includes(this.formData.education)
    },
    // 移除评分相关的计算，仅在匹配后显示
  },
  methods: {
    handleChange() {
      this.$emit('update:modelValue', this.formData)
    },
    // 处理身体属性变化
    handlePhysicalAttributesChange(attributes) {
      this.formData.height = attributes.height
      this.formData.weight = attributes.weight
      this.formData.bmi = attributes.bmi
      this.handleChange()
    },
    // 处理住房状况变化
    handleHousingChange(housingData) {
      this.formData.housingStatus = housingData.status
      this.formData.housingLocation = housingData.location
      // 移除评分处理，仅在匹配计算后显示
      this.handleChange()
    },
    // 处理资产变化
    handleAssetsChange(assetsData) {
      this.formData.savings = assetsData.savings
      this.formData.otherAssets = assetsData.otherAssets
      this.formData.debt = assetsData.debt
      // 移除评分处理，仅在匹配计算后显示
      this.handleChange()
    },

    // 获取学历标签
    getEducationLabel(value) {
      const option = this.educationOptions.find(opt => opt.value === value)
      return option ? option.label : value
    },
    // 获取院校等级标签
    getUniversityTierLabel(value) {
      const option = this.universityTierOptions.find(opt => opt.value === value)
      return option ? option.label : value
    }
  }
}
</script>

<style scoped>
.person-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  font-weight: 600;
  font-size: 16px;
}

.header-subtitle {
  font-size: 12px;
  color: #909399;
  font-weight: 400;
}

.material-focused-form {
  padding: 0;
}

.form-collapse {
  border: none;
}

/* 优先级部分样式 */
.priority-section {
  margin-bottom: 16px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
}

.priority-section:deep(.el-collapse-item__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border-radius: 6px 6px 0 0;
  padding: 0 16px;
}

.priority-section:deep(.el-collapse-item__arrow) {
  color: white;
}

/* 次要部分样式 */
.secondary-section {
  margin-bottom: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.secondary-section:deep(.el-collapse-item__header) {
  background: #f5f7fa;
  color: #606266;
  font-weight: 500;
  border-radius: 6px 6px 0 0;
  padding: 0 16px;
}

/* 部分标题样式 */
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.section-icon {
  font-size: 18px;
}

.section-text {
  flex: 1;
  font-size: 16px;
}

.weight-tag {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
}

/* 部分内容样式 */
.section-content {
  padding: 20px 16px;
  background: white;
  border-radius: 0 0 6px 6px;
}

/* 输入框样式 */
.full-width-input {
  width: 100%;
}

.input-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

/* 表单项样式 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-form-item--small .el-form-item__label) {
  font-size: 13px;
}

/* 输入控件样式 */
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input) {
  width: 100%;
}

/* 折叠面板样式优化 */
:deep(.el-collapse-item__content) {
  padding: 0;
}

:deep(.el-collapse-item__wrap) {
  border: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-title {
    font-size: 14px;
  }
  
  .section-icon {
    font-size: 16px;
  }
  
  .weight-tag {
    font-size: 10px;
  }
  
  .section-content {
    padding: 16px 12px;
  }
}

/* 移除不再使用的评分相关样式 */
</style>