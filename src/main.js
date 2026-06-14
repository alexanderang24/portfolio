import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.directive('appear', {
  mounted(el) {
    const hide = () => {
      el.style.transition = 'none'
      el.style.opacity = '0'
      el.style.transform = 'translateY(44px) scale(0.97)'
    }

    const show = () => {
      el.style.transition = 'opacity 750ms ease, transform 750ms ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0) scale(1)'
    }

    hide()

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        show()
      } else {
        hide()
      }
    }, { threshold: 0.06 })

    const timer = setTimeout(() => observer.observe(el), 150)
    el._appearObserver = observer
    el._appearTimer = timer
  },
  beforeUnmount(el) {
    clearTimeout(el._appearTimer)
    el._appearObserver?.disconnect()
  },
})

app.use(router).mount('#app')
