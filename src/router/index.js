import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WritingView from '../views/WritingView.vue'
import PostView from '../views/PostView.vue'
import ProjectsView from '../views/ProjectsView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/writing', component: WritingView },
  { path: '/writing/:slug', component: PostView },
  { path: '/projects', component: ProjectsView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return new Promise(resolve => {
      setTimeout(() => resolve({ top: 0, behavior: 'instant' }), 120)
    })
  },
})
