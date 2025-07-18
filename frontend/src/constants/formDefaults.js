// 默认表单数据 - 第一阶段模型
export const DEFAULT_MALE_FORM = {
  // 基本信息
  age: 28,
  gender: 'male',
  location: '北京',
  height: 175,
  weight: 70,
  
  // 工作收入（40%权重）
  salary: 1.5,
  workUnit: 'private_company',
  jobTitle: '软件工程师',
  workYears: 5,
  
  // 教育背景（25%权重）
  education: 'bachelor',
  universityTier: 'tier1',
  major: '计算机科学',
  graduationYear: 2020,
  
  // 外在条件（15%权重）
  appearance: 'above_average',
  
  // 资产住房（15%权重）
  housingStatus: 'rent',
  savings: 50,
  otherAssets: [],
  debt: 0,
  
  // 家庭背景（5%权重）
  parentsIncome: 0.8,
  familyAssets: 'average',
  onlyChild: true,
  parentsOccupation: '普通职员'
}

export const DEFAULT_FEMALE_FORM = {
  // 基本信息
  age: 26,
  gender: 'female',
  location: '北京',
  height: 162,
  weight: 52,
  
  // 工作收入（40%权重）
  salary: 1.2,
  workUnit: 'private_company',
  jobTitle: '产品经理',
  workYears: 3,
  
  // 教育背景（25%权重）
  education: 'bachelor',
  universityTier: 'tier1',
  major: '市场营销',
  graduationYear: 2021,
  
  // 外在条件（15%权重）
  appearance: 'very_good',
  
  // 资产住房（15%权重）
  housingStatus: 'live_with_parents',
  savings: 30,
  otherAssets: [],
  debt: 0,
  
  // 家庭背景（5%权重）
  parentsIncome: 0.6,
  familyAssets: 'average',
  onlyChild: false,
  parentsOccupation: '教师'
}

// 表单选项配置
export const EDUCATION_OPTIONS = [
  { label: '高中及以下', value: 'high_school' },
  { label: '大专', value: 'college' },
  { label: '本科', value: 'bachelor' },
  { label: '硕士', value: 'master' },
  { label: '博士', value: 'phd' }
]

// 工作单位选项（按系数分组）
export const WORK_UNIT_OPTIONS = [
  // 政府机关（最高系数）
  { label: '中央部委', value: 'central_gov', multiplier: 3.0, category: '政府机关' },
  { label: '市级政府', value: 'city_gov', multiplier: 2.5, category: '政府机关' },
  { label: '区县政府', value: 'district_gov', multiplier: 2.0, category: '政府机关' },
  { label: '镇/街道', value: 'township_gov', multiplier: 1.5, category: '政府机关' },
  
  // 国有企业
  { label: '央企总部', value: 'central_soe_hq', multiplier: 2.0, category: '国有企业' },
  { label: '央企分公司', value: 'central_soe_branch', multiplier: 1.5, category: '国有企业' },
  { label: '地方国企', value: 'local_soe', multiplier: 1.5, category: '国有企业' },
  
  // 教育机构
  { label: '985/211高校', value: 'top_university', multiplier: 2.2, category: '教育机构' },
  { label: '普通高校', value: 'university', multiplier: 1.8, category: '教育机构' },
  { label: '中小学', value: 'middle_school', multiplier: 1.5, category: '教育机构' },
  { label: '科研院所', value: 'research_institute', multiplier: 1.8, category: '教育机构' },
  
  // 医疗机构
  { label: '三甲医院', value: 'top_hospital', multiplier: 2.0, category: '医疗机构' },
  { label: '普通医院', value: 'hospital', multiplier: 1.6, category: '医疗机构' },
  
  // 私营企业
  { label: '知名外企', value: 'famous_foreign', multiplier: 1.2, category: '私营企业' },
  { label: '互联网大厂', value: 'tech_giant', multiplier: 0.9, category: '私营企业' },
  { label: '金融机构', value: 'finance', multiplier: 0.8, category: '私营企业' },
  { label: '普通私企', value: 'private_company', multiplier: 0.8, category: '私营企业' },
  { label: '创业公司', value: 'startup', multiplier: 0.7, category: '私营企业' },
  { label: '自由职业', value: 'freelance', multiplier: 0.6, category: '私营企业' },
  { label: '无业', value: 'unemployed', multiplier: 0.1, category: '其他' }
]

// 院校等级选项
export const UNIVERSITY_TIER_OPTIONS = [
  { label: '清华北大', value: 'qingbei', score: 100 },
  { label: '985院校', value: 'c985', score: 95 },
  { label: '211院校', value: 'c211', score: 90 },
  { label: '一类本科', value: 'tier1', score: 80 },
  { label: '二类本科', value: 'tier2', score: 70 },
  { label: '民办本科', value: 'private', score: 60 }
]

// 外貌评价选项
export const APPEARANCE_OPTIONS = [
  { label: '优秀', value: 'excellent', score: 100 },
  { label: '很好', value: 'very_good', score: 85 },
  { label: '中上', value: 'above_average', score: 70 },
  { label: '中下', value: 'below_average', score: 50 },
  { label: '较差', value: 'poor', score: 30 }
]

// 住房状况选项
export const HOUSING_STATUS_OPTIONS = [
  { label: '北京环内房产', value: 'beijing_house_inner', score: 100 },
  { label: '北京环外房产', value: 'beijing_house_outer', score: 90 },
  { label: '北京贷款房产', value: 'beijing_house_loan', score: 75 },
  { label: '外地房产', value: 'other_city_house', score: 50 },
  { label: '租房', value: 'rent', score: 30 },
  { label: '与父母同住', value: 'live_with_parents', score: 20 }
]

// 家庭资产状况选项
export const FAMILY_ASSETS_OPTIONS = [
  { label: '富裕', value: 'wealthy' },
  { label: '中上', value: 'above_average' },
  { label: '一般', value: 'average' },
  { label: '中下', value: 'below_average' },
  { label: '困难', value: 'poor' }
]

// 表单验证规则
export const FORM_RULES = {
  // 基本信息验证
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 18, max: 60, message: '年龄必须在18-60岁之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入所在城市', trigger: 'blur' }
  ],
  height: [
    { required: true, message: '请输入身高', trigger: 'blur' },
    { type: 'number', min: 140, max: 220, message: '身高必须在140-220cm之间', trigger: 'blur' }
  ],
  weight: [
    { required: true, message: '请输入体重', trigger: 'blur' },
    { type: 'number', min: 35, max: 150, message: '体重必须在35-150kg之间', trigger: 'blur' }
  ],
  
  // 工作收入验证
  salary: [
    { required: true, message: '请输入月薪资', trigger: 'blur' },
    { type: 'number', min: 0, message: '薪资不能为负数', trigger: 'blur' }
  ],
  workUnit: [
    { required: true, message: '请选择工作单位类型', trigger: 'change' }
  ],
  jobTitle: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ],
  workYears: [
    { required: true, message: '请输入工作年限', trigger: 'blur' },
    { type: 'number', min: 0, max: 50, message: '工作年限必须在0-50年之间', trigger: 'blur' }
  ],
  
  // 教育背景验证
  education: [
    { required: true, message: '请选择学历', trigger: 'change' }
  ],
  universityTier: [
    { required: true, message: '请选择院校等级', trigger: 'change' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ],
  graduationYear: [
    { required: true, message: '请输入毕业年份', trigger: 'blur' },
    { type: 'number', min: 1980, max: 2030, message: '毕业年份必须在1980-2030年之间', trigger: 'blur' }
  ],
  
  // 外在条件验证
  appearance: [
    { required: true, message: '请选择外貌评价', trigger: 'change' }
  ],
  
  // 资产住房验证
  housingStatus: [
    { required: true, message: '请选择住房状况', trigger: 'change' }
  ],
  savings: [
    { required: true, message: '请输入存款', trigger: 'blur' },
    { type: 'number', min: 0, message: '存款不能为负数', trigger: 'blur' }
  ],
  debt: [
    { required: true, message: '请输入负债', trigger: 'blur' },
    { type: 'number', min: 0, message: '负债不能为负数', trigger: 'blur' }
  ],
  
  // 家庭背景验证
  parentsIncome: [
    { required: true, message: '请输入父母月收入', trigger: 'blur' },
    { type: 'number', min: 0, message: '父母收入不能为负数', trigger: 'blur' }
  ],
  familyAssets: [
    { required: true, message: '请选择家庭资产状况', trigger: 'change' }
  ],
  parentsOccupation: [
    { required: true, message: '请输入父母职业', trigger: 'blur' }
  ]
}