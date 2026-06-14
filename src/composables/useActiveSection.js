import { ref, onMounted, onUnmounted } from 'vue'

const SECTION_IDS = ['about', 'experience', 'projects', 'skills', 'writing', 'contact']

export function useActiveSection() {
  const activeId = ref(null)

  function update() {
    const offset = 80
    let current = null
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= offset) {
        current = id
      }
    }
    activeId.value = current
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
  })

  onUnmounted(() => window.removeEventListener('scroll', update))

  return { activeId }
}
