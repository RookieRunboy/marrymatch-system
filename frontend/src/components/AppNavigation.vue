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
          v-for="route in allRoutes" 
          :key="route.name"
          :index="route.path || route.command"
          class="nav-item"
          @click="route.command ? handleCommand(route.command) : null"
        >
          <el-icon><component :is="route.meta.icon" /></el-icon>
          <span>{{ route.meta.title }}</span>
        </el-menu-item>
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
  Connection,
  User, 
  Moon, 
  SwitchButton,
  Link
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/appStore'

export default {
  name: 'AppNavigation',
  components: {
    HomeFilled,
    House,
    Clock,
    Connection,
    User,
    Moon,
    SwitchButton,
    Link
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
          title: '模式选择',
          icon: 'House'
        }
      },
      {
        path: '/match',
        name: 'MatchAnalysis',
        meta: {
          title: '匹配分析',
          icon: 'Connection'
        }
      },
      {
        path: '/single',
        name: 'SingleEvaluation',
        meta: {
          title: '个人评估',
          icon: 'User'
        }
      },
      {
        path: '/history',
        name: 'History',
        meta: {
          title: '历史记录',
          icon: 'Clock'
        }
      }
    ]
    
    const actionItems = [
      {
        command: 'profile',
        name: 'Profile',
        meta: {
          title: '个人资料',
          icon: 'User'
        }
      },
      {
        command: 'theme',
        name: 'Theme',
        meta: {
          title: '切换主题',
          icon: 'Moon'
        }
      },
      {
        command: 'github',
        name: 'GitHub',
        meta: {
          title: 'GitHub',
          icon: 'Link'
        }
      },
      {
        command: 'logout',
        name: 'Logout',
        meta: {
          title: '退出登录',
          icon: 'SwitchButton'
        }
      }
    ]
    
    const allRoutes = computed(() => {
      return [...routes, ...actionItems]
    })
    
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
        case 'github':
          openGitHub()
          break
        case 'logout':
          ElMessage.info('退出登录功能待实现')
          break
      }
    }
    
    const openGitHub = () => {
      window.open('https://github.com/RookieRunboy', '_blank')
    }
    
    return {
      routes,
      allRoutes,
      currentRoute,
      handleSelect,
      handleCommand,
      openGitHub
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
  
  .nav-actions {
    gap: 5px;
  }
}
</style>