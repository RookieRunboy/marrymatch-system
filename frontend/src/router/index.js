import { createRouter, createWebHistory } from 'vue-router'
import ModeSelection from '../views/ModeSelection.vue'
import Home from '../views/Home.vue'
import SingleEvaluation from '../views/SingleEvaluation.vue'
import History from '../views/History.vue'

const routes = [
  {
    path: '/',
    name: 'ModeSelection',
    component: ModeSelection,
    meta: {
      title: '模式选择',
      icon: 'House'
    }
  },
  {
    path: '/match',
    name: 'MatchAnalysis',
    component: Home,
    meta: {
      title: '匹配分析',
      icon: 'Connection'
    }
  },
  {
    path: '/single',
    name: 'SingleEvaluation',
    component: SingleEvaluation,
    meta: {
      title: '个人评估',
      icon: 'User'
    }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: {
      title: '历史记录',
      icon: 'Clock'
    }
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router