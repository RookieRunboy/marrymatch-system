<template>
  <div class="navigation">
    <el-menu
      :default-active="currentRoute"
      mode="horizontal"
      @select="handleSelect"
      class="nav-menu"
    >
      <div class="nav-brand">
        <el-icon class="brand-icon"><HomeFilled /></el-icon>
        <span class="brand-text">MARRY MATCH</span>
      </div>
      
      <div class="nav-items">
        <el-menu-item 
          v-for="route in routes" 
          :key="route.name"
          :index="route.path"
          class="nav-item"
        >
          <el-icon><component :is="route.meta.icon" /></el-icon>
          <span>{{ route.meta.title }}</span>
        </el-menu-item>
      </div>
      
      <div class="nav-actions">
        <el-dropdown @command="handleCommand">
          <el-button circle>
            <el-icon><User /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="theme">
                <el-icon><Moon /></el-icon>
                切换主题
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  HomeFilled, 
  House, 
  Clock, 
  Setting, 
  User, 
  Moon, 
  SwitchButton 
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/appStore'

export default {
  name: 'AppNavigation',
  components: {
    HomeFilled,
    House,
    Clock,
    Setting,
    User,
    Moon,
    SwitchButton
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const appStore = useAppStore()
    
    const routes = [
      {
        path: '/',
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'House'
        }
      },
      {
        path: '/history',
        name: 'History',
        meta: {
          title: '历史记录',
          icon: 'Clock'
        }
      },
      {
        path: '/settings',
        name: 'Settings',
        meta: {
          title: '设置',
          icon: 'Setting'
        }
      }
    ]
    
    const currentRoute = computed(() => {
      return route.path
    })
    
    const handleSelect = (path) => {
      if (path !== route.path) {
        router.push(path)
      }
    }
    
    const handleCommand = (command) => {
      switch (command) {
        case 'profile':
          ElMessage.info('个人资料功能待实现')
          break
        case 'theme':
          const newTheme = appStore.theme === 'light' ? 'dark' : 'light'
          appStore.setTheme(newTheme)
          ElMessage.success(`已切换到${newTheme === 'light' ? '浅色' : '深色'}主题`)
          break
        case 'logout':
          ElMessage.info('退出登录功能待实现')
          break
      }
    }
    
    return {
      routes,
      currentRoute,
      handleSelect,
      handleCommand
    }
  }
}
</script>

<style scoped>
.navigation {
  border-bottom: 1px solid #e6e6e6;
  background: white;
}

.nav-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: none;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
  margin-right: 40px;
}

.brand-icon {
  font-size: 24px;
}

.nav-items {
  display: flex;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-actions {
  margin-left: auto;
}

:deep(.el-menu--horizontal .el-menu-item) {
  border-bottom: none;
}

:deep(.el-menu--horizontal .el-menu-item:hover) {
  background-color: #f5f7fa;
}

:deep(.el-menu--horizontal .el-menu-item.is-active) {
  border-bottom: 2px solid #409EFF;
  color: #409EFF;
}

@media (max-width: 768px) {
  .nav-menu {
    padding: 0 10px;
  }
  
  .brand-text {
    display: none;
  }
  
  .nav-item span {
    display: none;
  }
}
</style>