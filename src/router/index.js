import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WritingView from '../views/WritingView.vue'
import PostView from '../views/PostView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/writing', component: WritingView },
  { path: '/writing/:slug', component: PostView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'instant' }
  },
})
